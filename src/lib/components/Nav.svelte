<script lang="ts">
	import { page } from '$app/stores';

	let mobileOpen = $state(false);

	const links = [
		{ href: '/about', label: 'About' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/updates', label: 'Updates' },
		{ href: '/contact', label: 'Contact' }
	];

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-50 border-b border-steel-500/30 bg-void-200/80 backdrop-blur-md">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href="/" class="nav-brand flex items-center gap-2.5 text-xs font-medium tracking-[0.25em] text-gold-200 uppercase transition-colors hover:text-gold-warm">
			<svg class="nav-logo h-[9px] w-auto relative -top-px" viewBox="0 0 729.82 329.37" fill="currentColor">
				<path d="M729.82,62.41V0H53.74C14.15,0,0,32.07,0,62.41v98.81h324.17v73.68s0,32.07-29.47,32.07H0v62.41h729.82v-62.41h-295.57c-28.14-.03-28.6-32.07-28.6-32.07v-73.68h324.17v-62.37l-648.35-.04v-9.53s0-26.87,29.47-26.87"/>
			</svg>
			Serenity Engine
		</a>

		<!-- Desktop links -->
		<div class="hidden items-center gap-8 sm:flex">
			{#each links as link}
				<a
					href={link.href}
					class="nav-link text-xs tracking-[0.15em] uppercase {$page.url.pathname.startsWith(link.href) ? 'nav-link-active' : 'text-steel-300'}"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<!-- Mobile hamburger -->
		<button
			class="sm:hidden text-steel-300 hover:text-gold-warm transition-colors"
			onclick={() => mobileOpen = !mobileOpen}
			aria-label="Toggle navigation"
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				{#if mobileOpen}
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="border-t border-steel-500/20 bg-void-200/95 backdrop-blur-md sm:hidden">
			<div class="flex flex-col gap-1 px-6 py-4">
				{#each links as link}
					<a
						href={link.href}
						onclick={closeMobile}
						class="py-2 text-xs tracking-[0.15em] uppercase nav-link {$page.url.pathname.startsWith(link.href) ? 'nav-link-active' : 'text-steel-300'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>

<style>
	.nav-logo {
		animation: logo-spin 6s linear infinite;
		filter: drop-shadow(0 0 3px rgba(212, 165, 116, 0.3));
		transition: filter 0.6s ease;
	}

	@keyframes logo-spin {
		from { transform: rotateY(0deg); }
		to { transform: rotateY(360deg); }
	}

	.nav-brand:hover .nav-logo {
		filter: drop-shadow(0 0 4px rgba(212, 165, 116, 0.4));
	}

	.nav-link {
		position: relative;
		transition: color 0.6s ease;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -4px;
		width: 0;
		height: 1px;
		background: var(--color-gold-warm);
		transition: width 0.6s ease;
	}

	.nav-link:hover {
		color: var(--color-gold-warm);
	}

	.nav-link:hover::after {
		width: 100%;
	}

	.nav-link-active {
		color: var(--color-gold-warm);
	}

	.nav-link-active::after {
		width: 100%;
	}
</style>
