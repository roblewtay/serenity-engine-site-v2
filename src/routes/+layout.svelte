<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { tick, onMount } from 'svelte';
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
	let mainEl: HTMLElement;

	// Smooth scroll state
	let _targetScroll = 0;
	let _isLerping = false;
	let scrollProgress = $state(0);

	function updateProgress() {
		if (!mainEl) return;
		const maxScroll = mainEl.scrollHeight - mainEl.clientHeight;
		if (maxScroll <= 0) { scrollProgress = 0; return; }
		scrollProgress = Math.min(Math.max(_targetScroll / maxScroll, 0), 1);
	}

	onMount(() => {
		if (!mainEl) return;

		function normalizeDelta(e: WheelEvent): number {
			if (e.deltaMode === 1) return e.deltaY * 40;
			if (e.deltaMode === 2) return e.deltaY * 800;
			return e.deltaY;
		}

		function onWheel(e: WheelEvent) {
			// If over a horizontal scroll container, redirect wheel to horizontal scroll
			const hScroll = (e.target as HTMLElement).closest('.roadmap-scroll');
			if (hScroll) {
				e.preventDefault();
				(hScroll as HTMLElement).scrollLeft += normalizeDelta(e);
				return;
			}

			e.preventDefault();
			const maxScroll = mainEl.scrollHeight - mainEl.clientHeight;
			_targetScroll = Math.max(0, Math.min(_targetScroll + normalizeDelta(e), maxScroll));
			if (!_isLerping) {
				_isLerping = true;
				lerp();
			}
		}

		function lerp() {
			const diff = _targetScroll - mainEl.scrollTop;
			if (Math.abs(diff) < 0.5) {
				mainEl.scrollTop = _targetScroll;
				_isLerping = false;
				updateProgress();
				return;
			}
			mainEl.scrollTop += diff * 0.1;
			updateProgress();
			requestAnimationFrame(lerp);
		}

		// Sync targetScroll when scrolled externally (touch, keyboard)
		function onScroll() {
			if (!_isLerping) {
				_targetScroll = mainEl.scrollTop;
				updateProgress();
			}
		}

		function onResize() {
			const maxScroll = mainEl.scrollHeight - mainEl.clientHeight;
			_targetScroll = Math.min(_targetScroll, maxScroll);
			updateProgress();
		}

		mainEl.addEventListener('wheel', onWheel, { passive: false });
		mainEl.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });

		return () => {
			mainEl.removeEventListener('wheel', onWheel);
			mainEl.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});

	beforeNavigate(({ from }) => {
		const wasProject = !!(
			from?.url.pathname.startsWith('/projects/') &&
			from?.url.pathname !== '/projects/'
		);
		leavingProject = wasProject;
		if (wasProject) holdProjectLayout = true;
	});

	afterNavigate(() => {
		// Reset scroll on every navigation
		if (mainEl) {
			mainEl.scrollTop = 0;
			_targetScroll = 0;
			_isLerping = false;
			scrollProgress = 0;
		}

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
			return {
				duration: 1400,
				easing: (t: number) => t,
				css: (t: number) => {
					const fadeT = Math.max(0, (t - 0.57) / 0.43);
					const eased = 1 - Math.pow(1 - fadeT, 3);
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

{#if !isHome}
	<ReadingProgress progress={scrollProgress} fullWidth={isProjectDetail || holdProjectLayout} />
{/if}

<!-- Page content -->
<div
	bind:this={wrapperEl}
	class="relative z-10 flex h-screen flex-col overflow-hidden transition-[margin,width,transform,opacity] duration-700 ease-in-out {isHome ? 'pointer-events-none lg:translate-x-full lg:ml-[50%] lg:w-1/2 lg:opacity-0' : (isProjectDetail || holdProjectLayout) ? 'bg-void-200/90 backdrop-blur-sm' : 'bg-void-200/90 backdrop-blur-sm lg:ml-[50%] lg:w-1/2'}"
>
	<main bind:this={mainEl} class="flex-1 overflow-y-auto overflow-x-hidden">
		<div class="flex min-h-full flex-col">
			<div class="flex-1 relative">
				{#key $page.url.pathname}
					<div in:pageIn out:pageOut>
						{@render children()}
					</div>
				{/key}
			</div>
			{#if !isHome}
				<Footer />
			{/if}
		</div>
	</main>
</div>
