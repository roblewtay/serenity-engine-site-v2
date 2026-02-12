import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/server/posts';

export const load: PageServerLoad = async ({ params }) => {
	const allPosts = getAllPosts();
	const posts = allPosts.filter((p) => p.tags.includes(params.tag));
	return { posts, tag: params.tag };
};
