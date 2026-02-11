import type { PageServerLoad } from './$types';

interface PostMeta {
	title: string;
	date: string;
	summary: string;
	slug: string;
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

export const load: PageServerLoad = async () => {
	const modules = import.meta.glob('/src/lib/content/updates/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	const posts: PostMeta[] = [];

	for (const [, raw] of Object.entries(modules)) {
		const { meta } = parseFrontmatter(raw as string);
		if (meta.title && meta.slug) {
			posts.push({
				title: meta.title,
				date: meta.date || '',
				summary: meta.summary || '',
				slug: meta.slug
			});
		}
	}

	posts.sort((a, b) => (b.date > a.date ? 1 : -1));

	return { posts };
};
