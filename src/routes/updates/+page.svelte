<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Updates — Serenity Engine</title>
	<meta name="description" content="Latest updates from Serenity Engine." />
</svelte:head>

<div class="px-8 pt-32 pb-20 lg:px-12">
	<h1 class="mb-12 text-center text-3xl font-light tracking-[0.15em] text-gold-200 uppercase sm:text-4xl">
		Updates
	</h1>

	{#if data.posts.length === 0}
		<p class="text-center text-steel-400">No updates yet. Check back soon.</p>
	{:else}
		<div class="space-y-8">
			{#each data.posts as post}
				<a href="/updates/{post.slug}" class="group block border border-steel-500/20 p-8 transition-all hover:border-gold-300/30">
					<div class="mb-3 flex items-center justify-between">
						<h2 class="text-lg font-light tracking-[0.05em] text-gold-200 group-hover:text-gold-100 sm:text-xl">
							{post.title}
						</h2>
						{#if post.date}
							<time class="text-xs text-steel-500 tracking-wider">{post.date}</time>
						{/if}
					</div>
					{#if post.summary}
						<p class="text-sm text-steel-400 leading-relaxed">{post.summary}</p>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
