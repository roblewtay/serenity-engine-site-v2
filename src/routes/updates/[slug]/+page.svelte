<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title} — Serenity Engine</title>
</svelte:head>

<div class="px-8 pt-32 pb-20 lg:px-12">
	<a href="/updates" class="mb-8 inline-block text-xs tracking-[0.1em] text-steel-400 uppercase hover:text-gold-warm transition-colors">
		&larr; All Updates
	</a>

	<article>
		<header class="mb-10">
			<h1 class="mb-3 text-2xl font-light tracking-[0.05em] text-gold-200 sm:text-3xl">
				{data.post.title}
			</h1>
			<div class="flex items-center gap-3 text-xs text-steel-500 tracking-wider">
				{#if data.post.date}
					<time>{data.post.date}</time>
				{/if}
				{#if data.post.readingTime}
					<span>&middot;</span>
					<span>{data.post.readingTime} min read</span>
				{/if}
			</div>
			{#if data.post.category || data.post.tags.length > 0}
				<div class="mt-3 flex flex-wrap items-center gap-2">
					{#if data.post.category}
						<a
							href="/updates/category/{data.post.category}"
							class="chip border border-steel-500/20 px-2 py-0.5 text-[10px] tracking-[0.1em] text-steel-400 uppercase hover:text-gold-warm"
						>
							{data.post.category}
						</a>
					{/if}
					{#each data.post.tags as tag}
						<a
							href="/updates/tag/{tag}"
							class="text-[10px] tracking-wider text-steel-500 hover:text-gold-warm transition-colors"
						>
							#{tag}
						</a>
					{/each}
				</div>
			{/if}
		</header>

		<div class="prose-engine">
			{@html data.post.html}
		</div>
	</article>
</div>
