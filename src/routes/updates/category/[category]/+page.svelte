<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Updates: {data.category} — Serenity Engine</title>
</svelte:head>

<div class="px-8 pt-32 pb-20 lg:px-12">
	<a href="/updates" class="mb-8 inline-block text-xs tracking-[0.1em] text-steel-400 uppercase hover:text-gold-300 transition-colors">
		&larr; All Updates
	</a>

	<h1 class="mb-12 text-center text-3xl font-light tracking-[0.15em] text-gold-200 uppercase sm:text-4xl">
		Updates: {data.category}
	</h1>

	{#if data.posts.length === 0}
		<p class="text-center text-steel-400">No updates in this category.</p>
	{:else}
		<div class="space-y-8">
			{#each data.posts as post}
				<a href="/updates/{post.slug}" class="group block border border-steel-500/20 p-8 transition-all hover:border-gold-300/30">
					<div class="mb-3 flex items-center justify-between">
						<h2 class="text-lg font-light tracking-[0.05em] text-gold-200 group-hover:text-gold-100 sm:text-xl">
							{post.title}
						</h2>
						<div class="flex items-center gap-3 text-xs text-steel-500 tracking-wider">
							{#if post.readingTime}
								<span>{post.readingTime} min read</span>
							{/if}
							{#if post.date}
								<time>{post.date}</time>
							{/if}
						</div>
					</div>
					{#if post.summary}
						<p class="text-sm text-steel-400 leading-relaxed">{post.summary}</p>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
