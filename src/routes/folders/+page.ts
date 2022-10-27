import { server } from '$lib/store';
import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
    try {

        const req = await fetch(server + "/folders");
        const res = await req.json();

        return { data: res.content };
    } catch (err) {
        console.log('Error: ', err);
        throw error(500, err.message);
    }
}