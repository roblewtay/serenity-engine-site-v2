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
		<a href="/" class="flex items-center gap-2.5 text-xs font-medium tracking-[0.25em] text-gold-200 uppercase hover:text-gold-warm transition-colors">
			<svg class="nav-logo h-4 w-4 text-gold-300 transition-colors group-hover:text-gold-warm" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
	}

	@keyframes logo-spin {
		from { transform: rotateY(0deg); }
		to { transform: rotateY(360deg); }
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
