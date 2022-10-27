<script>
	import {images, highlighted } from '$lib/store';
	import Image from '$lib/Image.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let data;

	const INITIAL_POSTS = 6;
	
	images.set(data.data);

	let limit = INITIAL_POSTS;

	function morePostsAvailable() {
		return limit < $images.length || next;
	}
	  let footer;

	onMount(() => {
		if (!browser) {
			return;
		}
		const handleIntersect = (entries, observer) => {
			entries.forEach((entry) => {
				if (!morePostsAvailable()) {
					observer.unobserve(entry.target);
				}
				showMorePosts();
			});
		};
		const options = { threshold: 0.5, rootMargin: '-100% 0% 100%' };
		const observer = new IntersectionObserver(handleIntersect, options);
		observer.observe(footer);

		maxWidth = Math.floor(window.innerWidth * 0.70);
		maxHeight = Math.floor(window.innerHeight * 0.95);
	});

	$: showMorePosts;

	$: maxHeight = 600;
	$: maxWidth = 800;

	async function showMorePosts() {
		const newLimit = limit + INITIAL_POSTS;
		if (newLimit <= $images.length) {
			limit = newLimit;
		}
	}

	function go(offset){
		const idx = $images.findIndex(i=>i === $highlighted);

		if (idx == $images.length - 1){
			showMorePosts();
		}

		highlighted.set(undefined);
		setTimeout(() => {
			highlighted.set($images[idx + offset]);
		}, 20);		
	}

	
function move(event) {
	console.log(event.keyCode)
    if(event.keyCode == 37) {
        go(-1);
    }
    else if(event.keyCode == 39) {
        go(1);
    }
    else if(event.keyCode == 27) {
        highlighted.set(undefined);
    }
}
</script>

<svelte:window  on:keydown={move} />

<main class="container">
	<h1>{data.name}</h1>
	{#if $highlighted}
		<div class="fullscreen" on:click={()=> highlighted.set(undefined)}>
			<button on:click|stopPropagation={()=>go(-1)}>&lt;</button>
			<Image id={$highlighted} height={maxHeight}></Image>
			<button on:click|stopPropagation={()=>go(1)}>&gt;</button>
		</div>
	{/if}
	<section>
		{#each $images?.slice(0, limit) as id, index}
			<Image width={250} height={250} {id}></Image>
		{:else}
			No images found...
		{/each}
	</section>
</main>
<footer bind:this={footer}>
</footer>

<style>

.fullscreen{
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
    align-items: center;
	z-index: 10;
}

</style>