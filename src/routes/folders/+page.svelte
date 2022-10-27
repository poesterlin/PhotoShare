<script>
	export let data;
</script>

{#each data.data as folder}
    <a href="/header/{folder}"><div> link to {folder} </div></a>
{/each}