<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { WebGLRenderer } from 'three';
	import LogoScene from './LogoScene.svelte';
	import { browser } from '$app/environment';

	interface Props {
		isHome?: boolean;
	}

	let { isHome = true }: Props = $props();

	function createRenderer(canvas: HTMLCanvasElement) {
		return new WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance'
		});
	}

	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(event: MouseEvent) {
		mouseX = (event.clientX / window.innerWidth) * 2 - 1;
		mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
	}
</script>

<div
	class="logo-canvas-wrapper absolute inset-0 h-full w-full"
	role="presentation"
	onmousemove={handleMouseMove}
>
	{#if browser}
		<Canvas {createRenderer}>
			<LogoScene {mouseX} {mouseY} {isHome} />
		</Canvas>
	{/if}
</div>

<style>
	@media (hover: none) {
		.logo-canvas-wrapper {
			pointer-events: none;
		}
	}
</style>
