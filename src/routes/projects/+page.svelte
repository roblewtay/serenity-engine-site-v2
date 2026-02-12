<script lang="ts">
	const projects = [
		{
			name: 'The Discipline',
			description: 'A contemplative digital sanctuary — an immersive space for discussion, challenge, reflection, and practice. Incorporating a unique aesthic space, spatial audio, and interaction opportunities.',
			url: 'https://thediscipline.org',
			status: 'Active'
		}
	];
</script>

<svelte:head>
	<title>Projects — Serenity Engine</title>
	<meta name="description" content="Projects built by Serenity Engine." />
</svelte:head>

<div class="px-8 pt-32 pb-20 lg:px-12">
	<h1 class="mb-12 text-center text-3xl font-light tracking-[0.15em] text-gold-200 uppercase sm:text-4xl">
		Projects
	</h1>

	<div class="space-y-8">
		{#each projects as project}
			<article class="border border-steel-500/20 p-8 transition-all hover:border-gold-300/30 hover:shadow-[0_0_30px_rgba(212,165,116,0.05)]">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-light tracking-[0.1em] text-gold-200 uppercase sm:text-xl">
						{project.name}
					</h2>
					<span class="border border-gold-300/30 px-3 py-1 text-[10px] tracking-[0.15em] text-gold-300 uppercase">
						{project.status}
					</span>
				</div>
				<p class="mb-6 text-sm leading-relaxed text-steel-300">
					{project.description}
				</p>
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block border border-gold-300/40 px-5 py-2 text-xs tracking-[0.15em] text-gold-300 uppercase transition-all hover:border-gold-200 hover:text-gold-200"
				>
					Visit &rarr;
				</a>
			</article>
		{/each}
	</div>
</div>
