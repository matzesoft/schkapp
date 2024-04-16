import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    return {text: "Hello World from !"};

    error(404, 'Not found');
}