import { marked } from 'marked';

export interface PostMeta {
	title: string;
	date: string;
	summary: string;
	slug: string;
	category: string;
	tags: string[];
	readingTime: number;
}

export interface Post extends PostMeta {
	html: string;
}

export function calculateReadingTime(text: string): number {
	const words = text.trim().split(/\s+/).length;
	return Math.ceil(words / 200);
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

function loadModules(): Record<string, string> {
	return import.meta.glob('/src/lib/content/updates/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;
}

function parsePost(raw: string): { meta: PostMeta; body: string } | null {
	const { meta, body } = parseFrontmatter(raw);
	if (!meta.title || !meta.slug) return null;

	const tags = meta.tags
		? meta.tags.split(',').map((t) => t.trim()).filter(Boolean)
		: [];

	return {
		meta: {
			title: meta.title,
			date: meta.date || '',
			summary: meta.summary || '',
			slug: meta.slug,
			category: meta.category || '',
			tags,
			readingTime: calculateReadingTime(body)
		},
		body
	};
}

export function getAllPosts(): PostMeta[] {
	const modules = loadModules();
	const posts: PostMeta[] = [];

	for (const raw of Object.values(modules)) {
		const parsed = parsePost(raw);
		if (parsed) posts.push(parsed.meta);
	}

	posts.sort((a, b) => (b.date > a.date ? 1 : -1));
	return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
	const modules = loadModules();

	for (const raw of Object.values(modules)) {
		const parsed = parsePost(raw);
		if (parsed && parsed.meta.slug === slug) {
			const html = await marked(parsed.body);
			return { ...parsed.meta, html };
		}
	}

	return null;
}
