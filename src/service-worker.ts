const INVALIDATION_INTERVAL = 10 * 60 * 1000; // 10 min
const NS = "MAGE";
const SEPARATOR = "|";
const VERSION = Math.ceil(now() / INVALIDATION_INTERVAL);

function now() {
    const d = new Date();
    return d.getTime();
}

function buildKey(url) {
    return NS + SEPARATOR + url + SEPARATOR + VERSION;
}

function parseKey(key) {
    const parts = key.split(SEPARATOR);
    return {
        ns: parts[0],
        key: parts[1],
        ver: parseInt(parts[2], 10)
    };
}

function purgeExpiredRecords(caches) {
    console.log("Purging...");
    return caches.keys().then(function (keys) {
        return Promise.all(
            keys.map(function (key) {
                const record = parseKey(key);
                if (record.ns === NS && record.ver !== VERSION) {
                    console.log("deleting", key);
                    return caches.delete(key);
                }
            })
        );
    });
}

function proxyRequest(caches, request) {
    const key = buildKey(request.url);
    // set namespace
    return caches.open(key).then(function (cache) {
        // check cache
        return cache.match(request).then(function (cachedResponse) {
            if (cachedResponse) {
                console.info("Take it from cache", request.url);
                return cachedResponse;
            }
            return fetch(request.clone())
                .then(function (networkResponse) {
                    if (networkResponse.type !== "opaque" && networkResponse.ok === false) {
                        throw new Error("Resource not available");
                    }
                    console.info("Fetch it through Network", request.url, networkResponse.type);
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                }).catch(function () {
                    console.error("Failed to fetch", request.url);
                    // Placeholder image for the fallback
                    return fetch("./placeholder.jpg", { mode: "no-cors" });
                });
        });
    });
}


self.addEventListener("install", function (event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
    event.waitUntil(purgeExpiredRecords(caches));
});

self.addEventListener("fetch", function (event) {
    const request = event.request;

    console.log("Detected request", request.url);

    if (request.method !== "GET" ||
        !request.url.match(/\.(jpe?g|png|gif|svg|webp|avif)$/)) {
        return;
    }

    console.log("Accepted request", request.url);

    event.respondWith(
        proxyRequest(caches, request)
    );

});