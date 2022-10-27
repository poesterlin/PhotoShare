import { writable } from 'svelte/store';

const images = writable([]);
const folder = writable("");
const server = "http://localhost:3000";
const highlighted = writable();

export { images, folder, highlighted, server };
