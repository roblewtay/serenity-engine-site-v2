<script lang="ts">
	const links = [
		{ href: '/about', label: 'About' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/updates', label: 'Updates' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<footer class="border-t border-steel-500/20 bg-void-200">
	<div class="mx-auto max-w-6xl px-6 py-12">
		<div class="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
			<!-- Brand -->
			<div class="flex items-center gap-3">
				<svg class="h-4 w-4 text-gold-300" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
				</svg>
				<span class="text-xs font-medium tracking-[0.25em] text-gold-200 uppercase">
					Serenity Engine
				</span>
			</div>

			<!-- Links -->
			<div class="flex items-center gap-6">
				{#each links as link}
					<a
						href={link.href}
						class="text-xs tracking-[0.1em] uppercase text-steel-400 hover:text-gold-300 transition-colors"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>

		<div class="mt-8 text-center">
			<p class="text-xs text-steel-500 tracking-wider">
				&copy; {new Date().getFullYear()} Serenity Engine. All rights reserved.
			</p>
		</div>
	</div>
</footer>
