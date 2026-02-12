<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
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

	beforeNavigate(({ from }) => {
		leavingProject = !!(
			from?.url.pathname.startsWith('/projects/') &&
			from?.url.pathname !== '/projects/'
		);
	});

	function pageIn(node: Element) {
		if (leavingProject) {
			return {
				duration: 700,
				easing: cubicOut,
				css: (t: number) => `transform: translateX(${(1 - t) * -100}%)`
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
				css: (t: number) => `transform: translateX(${(1 - t) * 100}%)`
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
	class="fixed top-0 left-0 h-full z-[1] transition-all duration-700 ease-in-out {isHome ? 'w-full' : isProjectDetail ? 'w-0 opacity-0' : 'w-0 opacity-0 lg:w-1/2 lg:opacity-100'}"
>
	<LogoCanvas {isHome} />
</div>

{#if isArticle}
	<ReadingProgress />
{/if}

<!-- Page content -->
<div
	class="relative z-10 flex min-h-screen flex-col transition-[margin,width,transform,opacity] duration-700 ease-in-out {isHome ? 'pointer-events-none lg:translate-x-full lg:ml-[50%] lg:w-1/2 lg:opacity-0' : isProjectDetail ? 'bg-void-200/90 backdrop-blur-sm' : 'bg-void-200/90 backdrop-blur-sm lg:ml-[50%] lg:w-1/2'}"
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
