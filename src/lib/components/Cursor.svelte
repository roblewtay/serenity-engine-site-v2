<script lang="ts">
	import { onMount } from 'svelte';

	let x = $state(0);
	let y = $state(0);
	let hovering = $state(false);
	let visible = $state(false);

	onMount(() => {
		function onMove(e: MouseEvent) {
			x = e.clientX;
			y = e.clientY;
			if (!visible) visible = true;
		}

		function checkHover(e: MouseEvent) {
			const target = e.target as HTMLElement;
			hovering = !!target.closest('a, button, [role="button"], input, textarea, select, label, .chip');
		}

		function onLeave() {
			visible = false;
		}

		window.addEventListener('mousemove', onMove, { passive: true });
		window.addEventListener('mouseover', checkHover, { passive: true });
		window.addEventListener('mouseout', checkHover, { passive: true });
		document.addEventListener('mouseleave', onLeave);

		return () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseover', checkHover);
			window.removeEventListener('mouseout', checkHover);
			document.removeEventListener('mouseleave', onLeave);
		};
	});
</script>

<div
	class="cursor-root"
	class:cursor-hover={hovering}
	class:cursor-visible={visible}
	style="left: {x}px; top: {y}px;"
>
	<div class="cursor-h"></div>
	<div class="cursor-v"></div>
	<div class="cursor-dot"></div>
</div>

<style>
	:global(*, *::before, *::after) {
		cursor: none !important;
	}

	.cursor-root {
		position: fixed;
		z-index: 9999;
		pointer-events: none;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.cursor-visible {
		opacity: 1;
	}

	/* Horizontal line */
	.cursor-h {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 24px;
		height: 1px;
		background: var(--color-steel-300);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, background 0.6s ease;
	}

	/* Vertical line */
	.cursor-v {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 1px;
		height: 24px;
		background: var(--color-steel-300);
		transform: translate(-50%, -50%);
		transition: height 0.6s ease, background 0.6s ease;
	}

	/* Centre square */
	.cursor-dot {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 6px;
		height: 6px;
		border: 1px solid var(--color-steel-300);
		transform: translate(-50%, -50%);
		transition: transform 0.6s ease, border-color 0.6s ease, width 0.6s ease, height 0.6s ease;
	}

	/* Hover state */
	.cursor-hover .cursor-h {
		width: 32px;
		background: var(--color-gold-warm);
	}

	.cursor-hover .cursor-v {
		height: 32px;
		background: var(--color-gold-warm);
	}

	.cursor-hover .cursor-dot {
		width: 8px;
		height: 8px;
		border-color: var(--color-gold-warm);
		transform: translate(-50%, -50%) rotate(45deg);
	}
</style>
