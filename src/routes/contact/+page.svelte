<script lang="ts">
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let status: 'idle' | 'sending' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		status = 'sending';
		errorMessage = '';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Failed to send message');
			}

			status = 'success';
			name = '';
			email = '';
			message = '';
		} catch (err) {
			status = 'error';
			errorMessage = err instanceof Error ? err.message : 'Something went wrong';
		}
	}
</script>

<svelte:head>
	<title>Contact — Serenity Engine</title>
	<meta name="description" content="Get in touch with Serenity Engine." />
</svelte:head>

<div class="mx-auto max-w-xl px-6 pt-32 pb-20">
	<h1 class="mb-4 text-center text-3xl font-light tracking-[0.15em] text-gold-200 uppercase sm:text-4xl">
		Contact
	</h1>
	<p class="mb-12 text-center text-sm text-steel-400">
		Have a question or want to work together? We'd love to hear from you.
	</p>

	{#if status === 'success'}
		<div class="border border-gold-300/30 p-8 text-center">
			<p class="text-gold-200 mb-2">Message sent.</p>
			<p class="text-sm text-steel-400">We'll get back to you as soon as we can.</p>
			<button
				class="mt-6 border border-steel-500/30 px-5 py-2 text-steel-300 hover:border-gold-300/40 hover:text-gold-300 transition-all"
				onclick={() => status = 'idle'}
			>
				Send Another
			</button>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="name" class="mb-2 block text-xs tracking-[0.1em] text-steel-400 uppercase">Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					maxlength="100"
					class="w-full"
					placeholder="Your name"
				/>
			</div>

			<div>
				<label for="email" class="mb-2 block text-xs tracking-[0.1em] text-steel-400 uppercase">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					maxlength="200"
					class="w-full"
					placeholder="your@email.com"
				/>
			</div>

			<div>
				<label for="message" class="mb-2 block text-xs tracking-[0.1em] text-steel-400 uppercase">Message</label>
				<textarea
					id="message"
					bind:value={message}
					required
					maxlength="5000"
					rows="6"
					class="w-full resize-none"
					placeholder="What's on your mind?"
				></textarea>
			</div>

			{#if status === 'error'}
				<p class="text-sm text-red-400">{errorMessage}</p>
			{/if}

			<button
				type="submit"
				disabled={status === 'sending'}
				class="w-full border border-gold-300/40 px-6 py-3 text-gold-300 transition-all hover:border-gold-200 hover:text-gold-200 hover:shadow-[0_0_20px_rgba(212,165,116,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{status === 'sending' ? 'Sending...' : 'Send Message'}
			</button>
		</form>
	{/if}
</div>
