<script lang="ts">
	import { server, folder, images } from '$lib/store';
	import Image from '$lib/Image.svelte';

    let fileinput;
    let uploading = false;

    async function createFolder(){
        const req = await fetch(server + "/folders/new");
        const res = await req.json();

        folder.set(res.id);
    }

    async function submit(event) {
        event.preventDefault();
        uploading = true;

        for (const file of fileinput.files) {
            const formData = new FormData();
            formData.append('image', file);

            const req = await fetch(server + '/upload/' + $folder, {
                method: 'POST',
                body: formData
            });
            const res = await req.json();

            $images = $images.concat([res.id]);
        }
        uploading = false;
    }

    async function clear() {
        await fetch(server + "/folders/clear");
    }
</script>

<button on:click={createFolder}>Create Folder</button>
<button on:click={clear}>Clear All </button>

{#if $folder}
    <a href="/header/{$folder}"><div> link to folder</div></a>
    <form on:submit={e=>submit(e)}>
        <button on:click={()=>{fileinput.click();}}>Choose Image</button>
        <input style="display:none" type="file" accept=".jpg, .jpeg, .png" multiple bind:this={fileinput} >
    </form>
    <button action="submit">submit</button>
{/if}

{#if uploading}
    <b>uploading</b>
{/if}

<div>
    {#each $images as img}
        <Image id={img} width={255} height={255} ></Image>
    {/each}
</div>