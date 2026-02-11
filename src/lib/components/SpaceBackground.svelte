<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;
	let stars: Star[] = [];
	let nebulaClouds: NebulaCloud[] = [];
	let time = 0;

	interface Star {
		x: number;
		y: number;
		size: number;
		brightness: number;
		twinkleSpeed: number;
		twinkleOffset: number;
		color: string;
	}

	interface NebulaCloud {
		x: number;
		y: number;
		radius: number;
		color: string;
		opacity: number;
		driftX: number;
		driftY: number;
	}

	const nebulaColors = [
		'rgba(212, 165, 116, 0.03)',
		'rgba(201, 149, 108, 0.02)',
		'rgba(232, 193, 127, 0.02)',
		'rgba(45, 59, 45, 0.04)',
		'rgba(92, 64, 51, 0.03)'
	];

	const starColors = ['#FFFFFF', '#F5F5F5', '#E8E8FF', '#FFE8D4', '#D4A574'];

	function initStars(width: number, height: number) {
		stars = [];
		const density = 0.00006;
		const count = Math.floor(width * height * density);

		for (let i = 0; i < count; i++) {
			stars.push({
				x: Math.random() * width,
				y: Math.random() * height,
				size: Math.random() * 1.5 + 0.5,
				brightness: Math.random() * 0.5 + 0.5,
				twinkleSpeed: Math.random() * 2 + 0.5,
				twinkleOffset: Math.random() * Math.PI * 2,
				color: starColors[Math.floor(Math.random() * starColors.length)]
			});
		}
	}

	function initNebula(width: number, height: number) {
		nebulaClouds = [];
		const count = 8;

		for (let i = 0; i < count; i++) {
			nebulaClouds.push({
				x: Math.random() * width,
				y: Math.random() * height,
				radius: Math.random() * 300 + 150,
				color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
				opacity: Math.random() * 0.5 + 0.5,
				driftX: (Math.random() - 0.5) * 0.02,
				driftY: (Math.random() - 0.5) * 0.02
			});
		}
	}

	function drawNebula() {
		if (!ctx) return;
		const context = ctx;

		nebulaClouds.forEach((cloud) => {
			cloud.x += cloud.driftX;
			cloud.y += cloud.driftY;

			if (cloud.x < -cloud.radius) cloud.x = canvas.width + cloud.radius;
			if (cloud.x > canvas.width + cloud.radius) cloud.x = -cloud.radius;
			if (cloud.y < -cloud.radius) cloud.y = canvas.height + cloud.radius;
			if (cloud.y > canvas.height + cloud.radius) cloud.y = -cloud.radius;

			const gradient = context.createRadialGradient(
				cloud.x, cloud.y, 0,
				cloud.x, cloud.y, cloud.radius
			);
			gradient.addColorStop(0, cloud.color);
			gradient.addColorStop(1, 'transparent');

			context.fillStyle = gradient;
			context.globalAlpha = cloud.opacity;
			context.fillRect(
				cloud.x - cloud.radius,
				cloud.y - cloud.radius,
				cloud.radius * 2,
				cloud.radius * 2
			);
			context.globalAlpha = 1;
		});
	}

	function drawStars() {
		if (!ctx) return;
		const context = ctx;

		stars.forEach((star) => {
			const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6;
			const flicker =
				Math.sin(time * star.twinkleSpeed * 3.7 + star.twinkleOffset * 2.1) * 0.15 + 0.85;
			const alpha = star.brightness * twinkle * flicker;

			const sizePulse = 1 + Math.sin(time * star.twinkleSpeed * 1.5 + star.twinkleOffset) * 0.2;
			const currentSize = star.size * sizePulse;

			context.beginPath();
			context.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
			context.fillStyle = star.color;
			context.globalAlpha = alpha;
			context.fill();

			const glowSize = currentSize * 4;
			const glow = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
			glow.addColorStop(0, star.color);
			glow.addColorStop(0.4, star.color);
			glow.addColorStop(1, 'transparent');
			context.fillStyle = glow;
			context.globalAlpha = alpha * 0.25;
			context.fillRect(star.x - glowSize, star.y - glowSize, glowSize * 2, glowSize * 2);

			context.globalAlpha = 1;
		});
	}

	function draw() {
		if (!ctx || !canvas) return;

		ctx.fillStyle = '#0A0A0A';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		drawNebula();
		drawStars();

		const vignette = ctx.createRadialGradient(
			canvas.width / 2, canvas.height / 2, 0,
			canvas.width / 2, canvas.height / 2,
			Math.max(canvas.width, canvas.height) / 1.5
		);
		vignette.addColorStop(0, 'transparent');
		vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
		ctx.fillStyle = vignette;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		time += 0.016;
		animationId = requestAnimationFrame(draw);
	}

	function handleResize() {
		if (!canvas || !browser) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		initStars(canvas.width, canvas.height);
		initNebula(canvas.width, canvas.height);
	}

	onMount(() => {
		if (!browser || !canvas) return;

		ctx = canvas.getContext('2d');
		if (!ctx) return;

		handleResize();
		window.addEventListener('resize', handleResize);
		draw();
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', handleResize);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full" style="z-index: 0;"></canvas>
