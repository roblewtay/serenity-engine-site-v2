<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SpaceBackground from '$lib/components/SpaceBackground.svelte';
	import LogoCanvas from '$lib/components/three/LogoCanvas.svelte';
	import ReadingProgress from '$lib/components/ReadingProgress.svelte';
	import Cursor from '$lib/components/Cursor.svelte';

	let { children } = $props();
	let isHome = $derived($page.url.pathname === '/');
	let isArticle = $derived($page.url.pathname.startsWith('/updates/') && $page.url.pathname !== '/updates/');
	let isProjectDetail = $derived($page.url.pathname.startsWith('/projects/') && $page.url.pathname !== '/projects/');

	let leavingProject = $state(false);
	let holdProjectLayout = $state(false);
	let wrapperEl: HTMLElement;
	let logoEl: HTMLElement;

	beforeNavigate(({ from }) => {
		const wasProject = !!(
			from?.url.pathname.startsWith('/projects/') &&
			from?.url.pathname !== '/projects/'
		);
		leavingProject = wasProject;
		if (wasProject) holdProjectLayout = true;
	});

	afterNavigate(() => {
		if (holdProjectLayout) {
			setTimeout(() => {
				// Kill CSS transitions on wrapper + logo
				if (wrapperEl) wrapperEl.style.transition = 'none';
				if (logoEl) logoEl.style.transition = 'none';

				// Release hold — classes change to half-width layout
				holdProjectLayout = false;
				leavingProject = false;

				// Force reflow so the snap renders, then re-enable transitions
				tick().then(() => {
					requestAnimationFrame(() => {
						if (wrapperEl) {
							wrapperEl.offsetHeight;
							wrapperEl.style.transition = '';
						}
						if (logoEl) {
							logoEl.offsetHeight;
							logoEl.style.transition = '';
						}
					});
				});
			}, 750);
		}
	});

	function pageIn(node: Element) {
		if (leavingProject) {
			// Invisible during 0–800ms (slide + snap), then fade in 800–1400ms
			return {
				duration: 1400,
				easing: (t: number) => t, // linear — we need precise timing
				css: (t: number) => {
					// t is linear: 0→1 over 1400ms
					// Fade starts at ~800ms (t≈0.57)
					const fadeT = Math.max(0, (t - 0.57) / 0.43);
					const eased = 1 - Math.pow(1 - fadeT, 3); // cubicOut on fade portion
					return `opacity: ${eased}`;
				}
			};
		}
		if (isHome) return { duration: 0, css: () => '' };
		return {
			duration: 500,
			css: (t: number) => `opacity: ${t}`
		};
	}

	function pageOut(node: Element) {
		if (leavingProject) {
			return {
				duration: 700,
				easing: cubicOut,
				css: (t: number) => `position: absolute; top: 0; left: 0; right: 0; z-index: 10; transform: translateX(${(1 - t) * 100}%)`
			};
		}
		return { duration: 0, css: () => '' };
	}
</script>

<Cursor />

<!-- Starfield — always full viewport -->
<div class="fixed inset-0 z-0">
	<SpaceBackground />
</div>

<Nav />

<!-- 3D Logo — transitions from full viewport to left half -->
<div
	bind:this={logoEl}
	class="fixed top-0 left-0 h-full z-[1] transition-all duration-700 ease-in-out {isHome ? 'w-full' : (isProjectDetail || holdProjectLayout) ? 'w-0 opacity-0' : 'w-0 opacity-0 lg:w-1/2 lg:opacity-100'}"
>
	<LogoCanvas {isHome} />
</div>

{#if isArticle}
	<ReadingProgress />
{/if}

<!-- Page content -->
<div
	bind:this={wrapperEl}
	class="relative z-10 flex min-h-screen flex-col transition-[margin,width,transform,opacity] duration-700 ease-in-out {isHome ? 'pointer-events-none lg:translate-x-full lg:ml-[50%] lg:w-1/2 lg:opacity-0' : (isProjectDetail || holdProjectLayout) ? 'bg-void-200/90 backdrop-blur-sm' : 'bg-void-200/90 backdrop-blur-sm lg:ml-[50%] lg:w-1/2'}"
>
	<main class="flex-1 relative overflow-hidden">
		{#key $page.url.pathname}
			<div in:pageIn out:pageOut>
				{@render children()}
			</div>
		{/key}
	</main>
	{#if !isHome}
		<Footer />
	{/if}
</div>
