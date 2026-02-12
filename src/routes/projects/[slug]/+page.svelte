<script lang="ts">
	import { page } from '$app/stores';

	const projects: Record<string, {
		name: string;
		url: string;
		why: string;
		how: { statement: string; principles: { title: string; description: string }[] };
		what: { statement: string; highlights: string[] };
	}> = {
		'the-discipline': {
			name: 'The Discipline',
			url: 'https://thediscipline.org',
			why: 'The internet has become noise. We believe digital spaces should serve the human need for reflection, growth, and genuine connection — not extract attention as a commodity.',
			how: {
				statement: 'Through contemplative design — immersive environments, spatial audio, and interaction models that reward depth over speed. Every element is intentional.',
				principles: [
					{
						title: 'Immersive Space',
						description: 'Environments designed to hold attention gently, not capture it aggressively.'
					},
					{
						title: 'Spatial Audio',
						description: 'Sound as architecture — creating presence and atmosphere through dimensional audio.'
					},
					{
						title: 'Depth Over Speed',
						description: 'Interaction models that reward contemplation, patience, and genuine engagement.'
					}
				]
			},
			what: {
				statement: 'The Discipline is a digital sanctuary for discussion, challenge, reflection, and practice. An immersive online space where design, technology, and philosophy converge.',
				highlights: [
					'Contemplative discussion spaces',
					'Immersive visual environments',
					'Spatial audio integration',
					'Philosophy-driven interaction design',
					'Community built around depth'
				]
			}
		}
	};

	const slug = $derived($page.params.slug);
	const project = $derived(projects[slug]);
	const title = $derived(project ? `${project.name} — Serenity Engine` : 'Project Not Found — Serenity Engine');
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

{#if !project}
	<div class="px-8 pt-32 pb-20 text-center">
		<p class="text-steel-400">Project not found.</p>
		<a href="/projects" class="mt-4 inline-block text-xs tracking-[0.1em] text-steel-400 uppercase hover:text-gold-300 transition-colors">
			&larr; Back to Projects
		</a>
	</div>
{:else}
	<div class="px-8 pt-32 pb-20 lg:px-12">
		<a href="/projects" class="mb-16 inline-block text-xs tracking-[0.1em] text-steel-400 uppercase hover:text-gold-300 transition-colors">
			&larr; All Projects
		</a>

		<!-- WHY -->
		<section class="py-20 text-center animate-fade-in">
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">01</span>
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-300 uppercase sm:text-5xl">
				Why
			</h2>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed text-steel-300 font-light sm:text-xl">
				{project.why}
			</p>
		</section>

		<!-- Divider -->
		<div class="flex items-center justify-center py-4">
			<div class="h-px w-16 bg-steel-500/30"></div>
			<div class="mx-4 h-1.5 w-1.5 rotate-45 border border-gold-300/40"></div>
			<div class="h-px w-16 bg-steel-500/30"></div>
		</div>

		<!-- HOW -->
		<section class="py-20 animate-fade-in" style="animation-delay: 0.3s; opacity: 0;">
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">02</span>
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-300 uppercase sm:text-5xl">
				How
			</h2>
			<p class="mb-12 max-w-2xl text-base leading-relaxed text-steel-300 font-light">
				{project.how.statement}
			</p>
			<div class="grid gap-6 sm:grid-cols-3">
				{#each project.how.principles as principle}
					<div class="border border-steel-500/15 p-6 transition-all hover:border-gold-300/20">
						<h3 class="mb-3 text-xs font-light tracking-[0.15em] text-gold-200 uppercase">
							{principle.title}
						</h3>
						<p class="text-sm leading-relaxed text-steel-400 font-light">
							{principle.description}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Divider -->
		<div class="flex items-center justify-center py-4">
			<div class="h-px w-16 bg-steel-500/30"></div>
			<div class="mx-4 h-1.5 w-1.5 rotate-45 border border-gold-300/40"></div>
			<div class="h-px w-16 bg-steel-500/30"></div>
		</div>

		<!-- WHAT -->
		<section class="py-20 animate-fade-in" style="animation-delay: 0.6s; opacity: 0;">
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">03</span>
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-300 uppercase sm:text-5xl">
				What
			</h2>
			<p class="mb-10 max-w-2xl text-base leading-relaxed text-steel-300 font-light">
				{project.what.statement}
			</p>
			<ul class="mb-12 space-y-3 max-w-xl">
				{#each project.what.highlights as highlight}
					<li class="flex items-center gap-3 text-sm text-steel-400 font-light">
						<span class="h-px w-4 bg-gold-300/40"></span>
						{highlight}
					</li>
				{/each}
			</ul>

			<div class="flex flex-wrap items-center gap-4">
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block border border-gold-300/40 px-6 py-2.5 text-xs tracking-[0.15em] text-gold-300 uppercase transition-all hover:border-gold-200 hover:text-gold-200"
				>
					Visit {project.name} &rarr;
				</a>
				<a
					href="/projects"
					class="inline-block px-6 py-2.5 text-xs tracking-[0.15em] text-steel-400 uppercase transition-all hover:text-gold-300"
				>
					&larr; Back to Projects
				</a>
			</div>
		</section>
	</div>
{/if}
