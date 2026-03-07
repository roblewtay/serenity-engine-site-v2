<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	interface Milestone {
		date: string;
		title: string;
		description: string;
		status: 'complete' | 'active' | 'upcoming';
		highlight?: boolean;
	}

	const projects: Record<string, {
		name: string;
		url: string;
		why: string;
		how: { statement: string; principles: { title: string; description: string }[] };
		what: { statement: string; highlights: string[] };
		roadmap: Milestone[];
	}> = {
		'the-discipline': {
			name: 'The Discipline',
			url: 'https://thediscipline.org',
			why: 'The internet has become noise. We believe digital spaces should serve the human need for reflection, growth, and genuine connection — not extract attention as a commodity.',
			how: {
				statement: 'Through immersive environments, spatial audio, and interaction models built for depth over speed. Every element is deliberate.',
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
				statement: 'The Discipline is an immersive online space for discussion, challenge, reflection, and practice — where design, technology, and philosophy converge.',
				highlights: [
					'Contemplative discussion spaces',
					'Immersive visual environments',
					'Spatial audio integration',
					'Philosophy-driven interaction design',
					'Community built around depth'
				]
			},
			roadmap: [
				{
					date: 'Q4 2025',
					title: 'Foundation',
					description: 'Core platform architecture, design system, and spatial environment prototypes.',
					status: 'complete'
				},
				{
					date: 'Q1 2026',
					title: 'Environment',
					description: 'Immersive 3D spaces, ambient soundscapes, and initial interaction models.',
					status: 'active'
				},
				{
					date: 'Q2 2026',
					title: 'Community',
					description: 'Discussion spaces, user profiles, and tools built for considered conversation.',
					status: 'upcoming'
				},
				{
					date: 'Q3 2026',
					title: 'Audio',
					description: 'Spatial audio engine, ambient compositions, and sound-as-architecture features.',
					status: 'upcoming'
				},
				{
					date: 'Q4 2026',
					title: 'Practice',
					description: 'Reflection tools, challenge frameworks, and personal growth tracking.',
					status: 'upcoming'
				},
				{
					date: '2027',
					title: 'Launch',
					description: 'Public launch. Open to all.',
					status: 'upcoming',
					highlight: true
				}
			]
		}
	};

	const slug = $derived(page.params.slug);
	const project = $derived(projects[slug]);
	const title = $derived(project ? `${project.name} — Serenity Engine` : 'Project Not Found — Serenity Engine');

	let roadmapVisible = $state(false);
	let roadmapEl: HTMLElement;

	onMount(() => {
		if (!roadmapEl) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					roadmapVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		observer.observe(roadmapEl);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

{#if !project}
	<div class="px-8 pt-32 pb-20 text-center">
		<p class="text-steel-400">Project not found.</p>
		<a href="/projects" class="mt-4 inline-block text-xs tracking-[0.1em] text-steel-400 uppercase hover:text-gold-warm transition-colors">
			&larr; Back to Projects
		</a>
	</div>
{:else}
	<div class="mx-auto max-w-5xl px-8 pt-32 pb-20 lg:px-12">
		<a href="/projects" class="mb-16 inline-block text-xs tracking-[0.1em] text-steel-400 uppercase hover:text-gold-warm transition-colors">
			&larr; All Projects
		</a>

		<!-- WHY -->
		<section class="py-20 text-center animate-fade-in">
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">01</span>
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-warm uppercase sm:text-5xl">
				Why
			</h2>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed text-steel-300 font-light sm:text-xl">
				{project.why}
			</p>
		</section>

		<!-- Divider -->
		<div class="flex items-center justify-center py-4">
			<div class="h-px w-16 bg-steel-500/30"></div>
			<div class="mx-4 h-1.5 w-1.5 rotate-45 border border-gold-warm/40"></div>
			<div class="h-px w-16 bg-steel-500/30"></div>
		</div>

		<!-- HOW -->
		<section class="py-20 animate-fade-in" style="animation-delay: 0.3s; opacity: 0;">
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">02</span>
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-warm uppercase sm:text-5xl">
				How
			</h2>
			<p class="mb-12 max-w-2xl text-base leading-relaxed text-steel-300 font-light">
				{project.how.statement}
			</p>
			<div class="grid gap-6 sm:grid-cols-3">
				{#each project.how.principles as principle}
					<div class="border border-steel-500/15 p-6 transition-all hover:border-gold-warm/30">
						<h3 class="mb-3 text-xs font-light tracking-[0.15em] text-gold-warm uppercase">
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
			<div class="mx-4 h-1.5 w-1.5 rotate-45 border border-gold-warm/40"></div>
			<div class="h-px w-16 bg-steel-500/30"></div>
		</div>

		<!-- WHAT -->
		<section class="py-20 animate-fade-in" style="animation-delay: 0.6s; opacity: 0;">
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">03</span>
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-warm uppercase sm:text-5xl">
				What
			</h2>
			<p class="mb-10 max-w-2xl text-base leading-relaxed text-steel-300 font-light">
				{project.what.statement}
			</p>
			<ul class="mb-12 space-y-3 max-w-xl">
				{#each project.what.highlights as highlight}
					<li class="flex items-center gap-3 text-sm text-steel-400 font-light">
						<span class="h-px w-4 bg-gold-warm/40"></span>
						{highlight}
					</li>
				{/each}
			</ul>
		</section>

		<!-- Divider -->
		<div class="flex items-center justify-center py-4">
			<div class="h-px w-16 bg-steel-500/30"></div>
			<div class="mx-4 h-1.5 w-1.5 rotate-45 border border-gold-warm/40"></div>
			<div class="h-px w-16 bg-steel-500/30"></div>
		</div>

		<!-- ROADMAP -->
		<section class="py-20" bind:this={roadmapEl}>
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">04</span>
			<h2 class="mb-16 text-3xl font-light tracking-[0.2em] text-gold-warm uppercase sm:text-5xl">
				Roadmap
			</h2>

			<div class="timeline" class:timeline-visible={roadmapVisible}>
				{#each project.roadmap as milestone, i}
					<div
						class="timeline-item"
						class:timeline-item-complete={milestone.status === 'complete'}
						class:timeline-item-active={milestone.status === 'active'}
						class:timeline-item-highlight={milestone.highlight}
						style="--delay: {i * 0.12}s;"
					>
						<div class="timeline-marker">
							<div class="timeline-dot"></div>
						</div>
						<div class="timeline-body">
							<span class="timeline-date">
								{milestone.date}
							</span>
							<h3 class="timeline-title">
								{milestone.title}
							</h3>
							<p class="timeline-desc">
								{milestone.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Divider -->
		<div class="flex items-center justify-center py-4">
			<div class="h-px w-16 bg-steel-500/30"></div>
			<div class="mx-4 h-1.5 w-1.5 rotate-45 border border-gold-warm/40"></div>
			<div class="h-px w-16 bg-steel-500/30"></div>
		</div>

		<!-- CTA -->
		<section class="py-20 text-center">
			<div class="flex flex-wrap items-center justify-center gap-4">
				<a
					href="/projects"
					class="btn"
				>
					&larr; Back to Projects
				</a>
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					class="btn"
				>
					Visit {project.name} &rarr;
				</a>
			</div>
		</section>
	</div>
{/if}

<style>
	/* ── Vertical timeline ── */
	.timeline {
		position: relative;
		padding-left: 2rem;
	}

	.timeline-item {
		position: relative;
		padding-bottom: 2.5rem;
		opacity: 0;
		transform: translateY(10px);
	}

	.timeline-item:last-child {
		padding-bottom: 0;
	}

	/* Line segment from diamond centre down to next diamond centre */
	.timeline-item:not(:last-child)::before {
		content: '';
		position: absolute;
		left: calc(-2rem + 7px);
		top: 11px;
		bottom: calc(-11px);
		width: 1px;
		background: color-mix(in srgb, var(--color-steel-400) 40%, transparent);
		transition: opacity 0.6s ease;
	}

	.timeline-visible .timeline-item {
		animation: timelineReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: var(--delay);
	}

	@keyframes timelineReveal {
		to { opacity: 1; transform: translateY(0); }
	}

	/* Diamond marker */
	.timeline-marker {
		position: absolute;
		left: calc(-2rem - 1px);
		top: 3px;
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.timeline-dot {
		width: 7px;
		height: 7px;
		border: 1px solid var(--color-steel-400);
		transform: rotate(45deg);
		background: var(--color-void-200);
		transition: border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
	}

	.timeline-item-complete .timeline-dot {
		border-color: var(--color-steel-400);
		background: var(--color-steel-400);
	}

	.timeline-item-active .timeline-dot {
		border-color: var(--color-gold-warm);
		background: var(--color-gold-warm);
		box-shadow: 0 0 8px rgba(212, 165, 116, 0.5);
	}

	.timeline-item-highlight .timeline-dot {
		border-color: var(--color-gold-warm);
		background: var(--color-gold-warm);
		box-shadow: 0 0 12px rgba(212, 165, 116, 0.6), 0 0 24px rgba(212, 165, 116, 0.2);
	}

	.timeline-body {
		padding-left: 0.5rem;
	}

	.timeline-date {
		display: block;
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-steel-500);
		margin-bottom: 0.3rem;
	}

	.timeline-item-active .timeline-date,
	.timeline-item-highlight .timeline-date {
		color: var(--color-gold-warm);
	}

	.timeline-title {
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-gold-200);
		margin-bottom: 0.4rem;
	}

	.timeline-item-active .timeline-title,
	.timeline-item-highlight .timeline-title {
		color: var(--color-gold-warm);
	}

	.timeline-desc {
		font-size: 0.8rem;
		line-height: 1.6;
		font-weight: 300;
		color: var(--color-steel-400);
	}

	.timeline-item-highlight .timeline-desc {
		color: rgba(212, 165, 116, 0.6);
	}
</style>
