<script lang="ts">
	import { page } from '$app/stores';
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
					description: 'Discussion spaces, user profiles, and contemplative conversation tools.',
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
					description: 'Public launch. A digital sanctuary, open to all who seek depth.',
					status: 'upcoming',
					highlight: true
				}
			]
		}
	};

	const slug = $derived($page.params.slug);
	const project = $derived(projects[slug]);
	const title = $derived(project ? `${project.name} — Serenity Engine` : 'Project Not Found — Serenity Engine');

	let roadmapVisible = $state(false);
	let roadmapEl: HTMLElement;
	let scrollContainerEl: HTMLElement;
	let scrollProgress = $state(0);
	let isDragging = $state(false);
	let sliderTrackEl: HTMLElement;

	function updateScrollProgress() {
		if (!scrollContainerEl) return;
		const maxScroll = scrollContainerEl.scrollWidth - scrollContainerEl.clientWidth;
		if (maxScroll <= 0) { scrollProgress = 1; return; }
		scrollProgress = Math.min(Math.max(scrollContainerEl.scrollLeft / maxScroll, 0), 1);
	}

	function onSliderDown(e: PointerEvent) {
		isDragging = true;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		seekToPointer(e);
	}

	function onSliderMove(e: PointerEvent) {
		if (!isDragging) return;
		seekToPointer(e);
	}

	function onSliderUp() {
		isDragging = false;
	}

	function seekToPointer(e: PointerEvent) {
		if (!sliderTrackEl || !scrollContainerEl) return;
		const rect = sliderTrackEl.getBoundingClientRect();
		const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
		const maxScroll = scrollContainerEl.scrollWidth - scrollContainerEl.clientWidth;
		scrollContainerEl.scrollLeft = ratio * maxScroll;
		scrollProgress = ratio;
	}

	onMount(() => {
		if (!roadmapEl) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					roadmapVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.15 }
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
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-200 uppercase sm:text-5xl">
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
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-200 uppercase sm:text-5xl">
				How
			</h2>
			<p class="mb-12 max-w-2xl text-base leading-relaxed text-steel-300 font-light">
				{project.how.statement}
			</p>
			<div class="grid gap-6 sm:grid-cols-3">
				{#each project.how.principles as principle}
					<div class="border border-steel-500/15 p-6 transition-all hover:border-gold-warm/30">
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
			<div class="mx-4 h-1.5 w-1.5 rotate-45 border border-gold-warm/40"></div>
			<div class="h-px w-16 bg-steel-500/30"></div>
		</div>

		<!-- WHAT -->
		<section class="py-20 animate-fade-in" style="animation-delay: 0.6s; opacity: 0;">
			<span class="mb-6 block text-[11px] tracking-[0.3em] text-steel-500">03</span>
			<h2 class="mb-8 text-3xl font-light tracking-[0.2em] text-gold-200 uppercase sm:text-5xl">
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
			<h2 class="mb-16 text-3xl font-light tracking-[0.2em] text-gold-200 uppercase sm:text-5xl">
				Roadmap
			</h2>

			<div class="roadmap" class:roadmap-visible={roadmapVisible}>
				<!-- Track line -->
				<div class="roadmap-track">
					<div class="roadmap-track-fill"></div>
				</div>

				<!-- Milestones — horizontal scroll -->
				<div
					class="roadmap-scroll"
					bind:this={scrollContainerEl}
					onscroll={updateScrollProgress}
				>
					<div class="roadmap-items">
						{#each project.roadmap as milestone, i}
							<div
								class="roadmap-item"
								class:roadmap-item-complete={milestone.status === 'complete'}
								class:roadmap-item-active={milestone.status === 'active'}
								class:roadmap-item-highlight={milestone.highlight}
								style="--delay: {i * 0.15}s;"
							>
								<div class="roadmap-marker">
									<div class="roadmap-marker-dot"></div>
								</div>
								<div class="roadmap-content">
									<span class="block text-[10px] tracking-[0.2em] uppercase mb-1.5 {milestone.highlight ? 'text-gold-warm' : milestone.status === 'complete' ? 'text-steel-400' : milestone.status === 'active' ? 'text-gold-warm' : 'text-steel-500'}">
										{milestone.date}
									</span>
									<h3 class="text-sm font-light tracking-[0.1em] uppercase mb-2 {milestone.highlight ? 'text-gold-warm' : milestone.status === 'complete' ? 'text-steel-300' : milestone.status === 'active' ? 'text-gold-warm' : 'text-gold-200'}">
										{milestone.title}
									</h3>
									<p class="text-xs leading-relaxed font-light {milestone.highlight ? 'text-gold-warm/70' : 'text-steel-400'}">
										{milestone.description}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Custom slider -->
				<div
					class="roadmap-slider"
					bind:this={sliderTrackEl}
					onpointerdown={onSliderDown}
					onpointermove={onSliderMove}
					onpointerup={onSliderUp}
					onpointercancel={onSliderUp}
					role="slider"
					aria-valuenow={Math.round(scrollProgress * 100)}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label="Roadmap scroll"
					tabindex={0}
				>
					<div class="roadmap-slider-track"></div>
					<div
						class="roadmap-slider-fill"
						style="width: {scrollProgress * 100}%; background: color-mix(in srgb, var(--color-steel-400) {Math.round((1 - scrollProgress) * 100)}%, var(--color-gold-warm));"
					></div>
					<div
						class="roadmap-slider-thumb"
						style="left: {scrollProgress * 100}%; border-color: color-mix(in srgb, var(--color-steel-400) {Math.round((1 - scrollProgress) * 100)}%, var(--color-gold-warm));"
					></div>
				</div>
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
					class="inline-block px-6 py-2.5 text-xs tracking-[0.15em] text-steel-400 uppercase transition-all hover:text-gold-warm"
				>
					&larr; Back to Projects
				</a>
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block border border-steel-500/30 px-6 py-2.5 text-xs tracking-[0.15em] text-steel-300 uppercase transition-all hover:border-gold-warm hover:text-gold-warm"
				>
					Visit {project.name} &rarr;
				</a>
			</div>
		</section>
	</div>
{/if}

<style>
	.roadmap {
		position: relative;
	}

	/* Horizontal track line across the top */
	.roadmap-track {
		position: absolute;
		top: 8px;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--color-steel-500);
		opacity: 0.2;
		z-index: 0;
	}

	.roadmap-track-fill {
		height: 100%;
		width: 0;
		background: linear-gradient(to right, var(--color-steel-400), var(--color-gold-warm));
		transition: width 1.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.roadmap-visible .roadmap-track-fill {
		width: 100%;
	}

	/* Scroll container — hides native scrollbar */
	.roadmap-scroll {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		position: relative;
	}

	.roadmap-scroll::-webkit-scrollbar {
		display: none;
	}

	/* Items row — never wraps */
	.roadmap-items {
		display: flex;
		gap: 2rem;
		position: relative;
		padding-right: 2rem;
	}

	/* Individual milestone — fixed width */
	.roadmap-item {
		flex: 0 0 220px;
		padding-top: 2rem;
		position: relative;
		opacity: 0;
		transform: translateY(12px);
	}

	.roadmap-visible .roadmap-item {
		animation: roadmapReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: var(--delay);
	}

	@keyframes roadmapReveal {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Marker on the track */
	.roadmap-marker {
		position: absolute;
		top: 0;
		left: 0;
		width: 17px;
		height: 17px;
		transform: translate(-1px, 0);
	}

	.roadmap-marker-dot {
		width: 7px;
		height: 7px;
		border: 1px solid var(--color-steel-400);
		transform: rotate(45deg) translate(2px, 2px);
		transition: border-color 0.6s ease, background 0.6s ease, box-shadow 0.6s ease;
	}

	.roadmap-item-complete .roadmap-marker-dot {
		border-color: var(--color-steel-400);
		background: var(--color-steel-400);
	}

	.roadmap-item-active .roadmap-marker-dot {
		border-color: var(--color-gold-warm);
		background: var(--color-gold-warm);
		box-shadow: 0 0 8px rgba(212, 165, 116, 0.4);
	}

	/* Highlighted milestone (e.g. LAUNCH) — gold with glow */
	.roadmap-item-highlight .roadmap-marker-dot {
		border-color: var(--color-gold-warm);
		background: var(--color-gold-warm);
		box-shadow: 0 0 12px rgba(212, 165, 116, 0.6), 0 0 24px rgba(212, 165, 116, 0.2);
	}

	/* Content */
	.roadmap-content {
		padding-top: 0.75rem;
	}

	/* ── Custom slider ── */
	.roadmap-slider {
		position: relative;
		height: 24px;
		margin-top: 2rem;
		cursor: pointer;
		touch-action: none;
		user-select: none;
	}

	.roadmap-slider-track {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--color-steel-500);
		opacity: 0.25;
		transform: translateY(-50%);
	}

	.roadmap-slider-fill {
		position: absolute;
		top: 50%;
		left: 0;
		height: 1px;
		transform: translateY(-50%);
	}

	.roadmap-slider-thumb {
		position: absolute;
		top: 50%;
		width: 9px;
		height: 9px;
		border: 1px solid var(--color-steel-400);
		transform: translate(-50%, -50%) rotate(45deg);
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.roadmap-slider:hover .roadmap-slider-thumb,
	.roadmap-slider:active .roadmap-slider-thumb {
		box-shadow: 0 0 8px rgba(212, 165, 116, 0.3);
	}
</style>
