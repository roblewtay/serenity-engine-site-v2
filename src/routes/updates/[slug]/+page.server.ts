import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';

interface PostData {
	title: string;
	date: string;
	html: string;
}

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
	const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { meta: {}, body: content };

	const meta: Record<string, string> = {};
	for (const line of match[1].split('\n')) {
		const idx = line.indexOf(':');
		if (idx > 0) {
			meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
		}
	}
	return { meta, body: match[2] };
}

export const load: PageServerLoad = async ({ params }) => {
	const modules = import.meta.glob('/src/lib/content/updates/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	for (const [, raw] of Object.entries(modules)) {
		const { meta, body } = parseFrontmatter(raw as string);
		if (meta.slug === params.slug) {
			const html = await marked(body);
			return {
				post: {
					title: meta.title || '',
					date: meta.date || '',
					html
				} satisfies PostData
			};
		}
	}

	error(404, 'Post not found');
};
