import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/server/posts';

const POSTS_PER_PAGE = 6;

export const load: PageServerLoad = async ({ url }) => {
	const categoryFilter = url.searchParams.get('category') || '';
	const tagFilter = url.searchParams.get('tag') || '';
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));

	let posts = getAllPosts();

	const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
	const tags = [...new Set(posts.flatMap((p) => p.tags))];

	if (categoryFilter) {
		posts = posts.filter((p) => p.category === categoryFilter);
	}
	if (tagFilter) {
		posts = posts.filter((p) => p.tags.includes(tagFilter));
	}

	const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * POSTS_PER_PAGE;
	const paginatedPosts = posts.slice(start, start + POSTS_PER_PAGE);

	return {
		posts: paginatedPosts,
		categories,
		tags,
		pagination: { currentPage, totalPages },
		activeFilters: { category: categoryFilter, tag: tagFilter }
	};
};
