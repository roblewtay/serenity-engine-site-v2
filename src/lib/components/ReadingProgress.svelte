<script lang="ts">
	import { onMount } from 'svelte';

	let progress = $state(0);

	onMount(() => {
		function update() {
			const el = document.scrollingElement || document.documentElement;
			const maxScroll = el.scrollHeight - el.clientHeight;

			if (maxScroll <= 0) return;
			progress = Math.min(Math.max(el.scrollTop / maxScroll, 0), 1);
		}

		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update, { passive: true });
		update();

		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	});
</script>

<div class="fixed left-0 lg:left-1/2 bottom-0 z-[60] h-full w-[2px]">
	<div
		class="w-full absolute bottom-0 transition-[height,background-color] duration-300"
		style="height: {Math.max(progress * 100, progress > 0 ? 2 : 0)}%; background: color-mix(in srgb, var(--color-steel-400) {Math.round((1 - progress) * 100)}%, var(--color-gold-warm));"
	></div>
</div>
