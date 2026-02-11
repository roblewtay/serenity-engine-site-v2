<script lang="ts">
	import SpaceBackground from '$lib/components/SpaceBackground.svelte';
	import LogoCanvas from '$lib/components/three/LogoCanvas.svelte';
</script>

<svelte:head>
	<title>Serenity Engine</title>
	<meta name="description" content="Serenity Engine — Building contemplative digital experiences" />
</svelte:head>

<section class="relative flex min-h-screen items-center justify-center overflow-hidden">
	<!-- Starfield background -->
	<SpaceBackground />

	<!-- 3D Logo -->
	<div class="absolute inset-0" style="z-index: 1;">
		<LogoCanvas />
	</div>

	<!-- Overlay content -->
	<div class="relative z-10 mx-auto max-w-2xl px-6 text-center pointer-events-none">
		<h1 class="mb-4 text-4xl font-light tracking-[0.15em] text-gold-200 uppercase sm:text-6xl animate-fade-in">
			Serenity Engine
		</h1>
		<p class="mb-8 text-sm leading-relaxed text-steel-300 sm:text-base animate-fade-in" style="animation-delay: 0.3s; opacity: 0;">
			Building contemplative digital spaces where technology serves reflection.
		</p>
		<div class="flex items-center justify-center gap-6 pointer-events-auto animate-fade-in" style="animation-delay: 0.6s; opacity: 0;">
			<a
				href="/projects"
				class="border border-gold-300/40 px-6 py-3 text-xs tracking-[0.15em] text-gold-300 uppercase transition-all hover:border-gold-200 hover:text-gold-200 hover:shadow-[0_0_20px_rgba(212,165,116,0.15)]"
			>
				Our Projects
			</a>
			<a
				href="/about"
				class="px-6 py-3 text-xs tracking-[0.15em] text-steel-300 uppercase transition-colors hover:text-gold-300"
			>
				Learn More
			</a>
		</div>
	</div>
</section>
