<script lang="ts">
import {server, folder, highlighted} from "$lib/store";
import {browser} from '$app/environment';
import {onMount} from "svelte";

export let id;
export let noPreview = false;
export let width;
export let height;

let preview = !noPreview;

$: media = `${server}/images/${$folder}/${id}?w=${preview ? 40 : width}&h=${preview ? 40 : height}`;

let loading = browser;


function loaded (){
    loading = preview;
    preview  = false;
}

function click(){
    highlighted.set(id);
}
</script>


<style>
.preview{
    filter: blur(4px);
}

picture{
    margin: 10px;
    display: inline-block;
}

picture, picture>* {
    background: rgba(255, 255, 255, 0.25);
    max-width: calc(100vmin - 80px);
    max-height: 95vmin;
    object-fit: contain;
}



.loading {
    position: relative;
}

.loading::before {
  content: "";
  position: absolute;
  min-width: 20px;
  min-height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  animation: turn 2.5s infinite;
  top: calc(50% - 10px);
  left: calc(50% - 10px);
}

@keyframes turn {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>

<svelte:window on:load={loaded} />

<picture class:loading on:click|stopPropagation={()=>click()}  {width} {height}>
    <source class:preview on:load={loaded} srcset="{media}&format=webp" type="image/webp"  {width} {height} />
    <img  class:preview on:load={loaded} alt="" type="image/jpg" loading="lazy" decoding="async" {width} {height} src="{media}&format=jpg" />
</picture>
