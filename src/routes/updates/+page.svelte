<script lang="ts">
	let { data } = $props();

	function buildQueryString(newPage: number): string {
		const params = new URLSearchParams();
		if (data.activeFilters.category) params.set('category', data.activeFilters.category);
		if (data.activeFilters.tag) params.set('tag', data.activeFilters.tag);
		if (newPage > 1) params.set('page', String(newPage));
		const qs = params.toString();
		return qs ? `?${qs}` : '';
	}
</script>

<svelte:head>
	<title>Updates — Serenity Engine</title>
	<meta name="description" content="Latest updates from Serenity Engine." />
</svelte:head>

<div class="px-8 pt-32 pb-20 lg:px-12">
	<h1 class="mb-12 text-center text-3xl font-light tracking-[0.15em] text-gold-200 uppercase sm:text-4xl">
		Updates
	</h1>

	<!-- Filter chips -->
	<div class="mb-10 flex flex-wrap justify-center gap-2">
		<a
			href="/updates"
			class="chip border border-steel-500/30 px-3 py-1 text-[10px] tracking-[0.15em] uppercase {!data.activeFilters.category && !data.activeFilters.tag ? 'chip-active' : 'text-steel-400 hover:text-gold-warm'}"
		>
			All
		</a>
		{#each data.categories as category}
			<a
				href="/updates?category={category}"
				class="chip border border-steel-500/30 px-3 py-1 text-[10px] tracking-[0.15em] uppercase {data.activeFilters.category === category ? 'chip-active' : 'text-steel-400 hover:text-gold-warm'}"
			>
				{category}
			</a>
		{/each}
		{#each data.tags as tag}
			<a
				href="/updates?tag={tag}"
				class="chip border border-steel-500/30 px-3 py-1 text-[10px] tracking-[0.15em] {data.activeFilters.tag === tag ? 'chip-active' : 'text-steel-400 hover:text-gold-warm'}"
			>
				#{tag}
			</a>
		{/each}
	</div>

	{#if data.posts.length === 0}
		<p class="text-center text-steel-400">No updates found.</p>
	{:else}
		<div class="space-y-8">
			{#each data.posts as post}
				<a href="/updates/{post.slug}" class="group block border border-steel-500/20 p-8 transition-all hover:border-gold-warm/40">
					<div class="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<h2 class="text-lg font-light tracking-[0.05em] text-gold-200 group-hover:text-gold-warm sm:text-xl">
							{post.title}
						</h2>
						<div class="mt-1 sm:mt-0 flex items-center gap-3 text-xs text-steel-500 tracking-wider">
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
					{#if post.category || post.tags.length > 0}
						<div class="mt-3 flex flex-wrap gap-2">
							{#if post.category}
								<span class="border border-steel-500/20 px-2 py-0.5 text-[10px] tracking-[0.1em] text-steel-400 uppercase transition-colors group-hover:text-gold-warm/70 group-hover:border-gold-warm/20">
									{post.category}
								</span>
							{/if}
							{#each post.tags as tag}
								<span class="text-[10px] tracking-wider text-steel-500 transition-colors group-hover:text-gold-warm/60">#{tag}</span>
							{/each}
						</div>
					{/if}
				</a>
			{/each}
		</div>
	{/if}

	<!-- Pagination -->
	{#if data.pagination.totalPages > 1}
		<div class="mt-12 flex items-center justify-center gap-4 text-sm tracking-wider">
			{#if data.pagination.currentPage > 1}
				<a
					href="/updates{buildQueryString(data.pagination.currentPage - 1)}"
					class="text-steel-400 transition-colors hover:text-gold-warm"
				>
					&larr; Prev
				</a>
			{:else}
				<span class="text-steel-500/40">&larr; Prev</span>
			{/if}

			<span class="text-steel-500">
				{data.pagination.currentPage} / {data.pagination.totalPages}
			</span>

			{#if data.pagination.currentPage < data.pagination.totalPages}
				<a
					href="/updates{buildQueryString(data.pagination.currentPage + 1)}"
					class="text-steel-400 transition-colors hover:text-gold-warm"
				>
					Next &rarr;
				</a>
			{:else}
				<span class="text-steel-500/40">Next &rarr;</span>
			{/if}
		</div>
	{/if}
</div>
