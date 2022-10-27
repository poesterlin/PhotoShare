import { writable } from 'svelte/store';

const images = writable([]);
const folder = writable("");
const server = "https://imagebackend.oesterlin.dev";
const highlighted = writable();

export { images, folder, highlighted, server };
