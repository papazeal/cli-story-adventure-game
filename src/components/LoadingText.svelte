<script lang="ts">
  import { onMount } from "svelte";

  export let text: string;
  export let delay: number = 1000; // 1 second delay
  export let onComplete: (() => void) | undefined = undefined;
  export let isActiveLoading: boolean = false;

  let showText = false;
  let showLoading = false;

  onMount(() => {
    // Only start loading if this is the active loading line and has content
    if (isActiveLoading && text.trim() !== "") {
      showLoading = true;

      const timer = setTimeout(() => {
        showLoading = false;
        showText = true;

        // Call onComplete callback when text is shown
        if (onComplete) {
          onComplete();
        }
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Show text immediately if not the active loading line or empty content
      showText = true;
      if (onComplete) {
        onComplete();
      }
    }
  });
</script>

{#if showLoading}
  <div class="flex items-center space-x-1">
    <span class="text-gray-400">Loading</span>
    <div class="flex">
      <span class="text-gray-400 animate-pulse">.</span>
      <span class="text-gray-400 animate-pulse delay-150">.</span>
      <span class="text-gray-400 animate-pulse delay-300">.</span>
    </div>
  </div>
{:else if showText}
  <span class="whitespace-pre-line">{text}</span>
{/if}
