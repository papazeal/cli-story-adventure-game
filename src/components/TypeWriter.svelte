<script lang="ts">
	import { onMount } from 'svelte';

	export let text: string;
	export let speed: number = 30; // Speed per character
	export let onComplete: (() => void) | undefined = undefined;

	let displayText = '';
	let currentIndex = 0;

	onMount(() => {
		const interval = setInterval(() => {
			if (currentIndex < text.length) {
				displayText += text[currentIndex];
				currentIndex++;
			} else {
				clearInterval(interval);
				// Call onComplete callback when typing is finished
				if (onComplete) {
					onComplete();
				}
			}
		}, speed);

		return () => clearInterval(interval);
	});
</script>

<span>{displayText}</span>