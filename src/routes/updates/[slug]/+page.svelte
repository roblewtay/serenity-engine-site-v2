<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title} — Serenity Engine</title>
</svelte:head>

<div class="px-8 pt-32 pb-20 lg:px-12">
	<a href="/updates" class="mb-8 inline-block text-xs tracking-[0.1em] text-steel-400 uppercase hover:text-gold-300 transition-colors">
		&larr; All Updates
	</a>

	<article>
		<header class="mb-10">
			<h1 class="mb-3 text-2xl font-light tracking-[0.05em] text-gold-200 sm:text-3xl">
				{data.post.title}
			</h1>
			{#if data.post.date}
				<time class="text-xs text-steel-500 tracking-wider">{data.post.date}</time>
			{/if}
		</header>

		<div class="prose-engine">
			{@html data.post.html}
		</div>
	</article>
</div>
