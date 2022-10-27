import { server, folder } from '$lib/store';
import { error } from '@sveltejs/kit';

export const prerender = false;

export async function load({ params, fetch }) {
    try {

        const req = await fetch(server + "/images/" + params.id);
        const res = await req.json();

        folder.set(params.id);

        return {
            data: res.content,
            name: params.name
        };
    } catch (err) {
        console.log('Error: ', err);
        throw error(500, err.message);
    }
}