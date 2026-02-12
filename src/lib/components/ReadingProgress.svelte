<script lang="ts">
	let { progress = 0, fullWidth = false }: { progress: number; fullWidth?: boolean } = $props();
</script>

<div class="fixed {fullWidth ? 'left-0' : 'left-0 lg:left-1/2'} bottom-0 z-[60] h-full w-[2px] pointer-events-none">
	<div
		class="w-full absolute bottom-0 transition-[height,background-color] duration-300"
		style="height: {Math.max(progress * 100, progress > 0 ? 2 : 0)}%; background: color-mix(in srgb, var(--color-steel-400) {Math.round((1 - progress) * 100)}%, var(--color-gold-warm));"
	></div>
</div>
