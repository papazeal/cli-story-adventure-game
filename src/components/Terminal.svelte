<script lang="ts">
  import { onMount } from "svelte";
  import { gameState } from "../stores/gameStore";
  import LoadingText from "./LoadingText.svelte";
  import { audioManager } from "../utils/audio";

  let terminalElement: HTMLDivElement;
  let terminalLines: Array<{
    type: "output" | "input" | "choices";
    content: string;
    id: number;
    choices?: Array<{ text: string; index: number }>;
    isStoryText?: boolean;
  }> = [];
  let lineCounter = 0;
  let showingChoices = false;
  let currentChoices: Array<{ text: string; nextSceneId: string }> = [];
  let storyTypewriterComplete = false;
  let pendingChoices: Array<{ text: string; nextSceneId: string }> = [];
  let loadingLineId: number | null = null;

  onMount(() => {
    // Start with the first scene from the game state
    displayCurrentScene();
  });

  function addLine(
    type: "output" | "input" | "choices",
    content: string,
    choices?: Array<{ text: string; index: number }>,
    isStoryText: boolean = false
  ) {
    const lineId = lineCounter++;

    // If this line should show loading, set it as the current loading line
    if (type === "output" && content.trim() !== "") {
      loadingLineId = lineId;
    }

    terminalLines = [
      ...terminalLines,
      { type, content, id: lineId, choices, isStoryText },
    ];
    setTimeout(() => {
      terminalElement.scrollTop = terminalElement.scrollHeight;
    }, 100);
  }

  function selectChoice(choiceIndex: number) {
    if (choiceIndex >= 0 && choiceIndex < currentChoices.length) {
      const selectedChoice = currentChoices[choiceIndex];

      // Play audio based on the choice text
      audioManager.playChoiceTone(selectedChoice.text);

      // Add the selected choice to terminal
      addLine("input", `> ${selectedChoice.text}`);

      showingChoices = false;
      currentChoices = []; // Clear choices to prevent duplication

      // Use the standard game choice logic
      gameState.makeChoice(choiceIndex);
      displayCurrentScene();
    }
  }

  function displayCurrentScene() {
    const scene = gameState.getCurrentScene();
    if (scene) {
      // Remove any existing choice lines to prevent duplication
      terminalLines = terminalLines.filter((line) => line.type !== "choices");

      addLine("output", "");
      addLine("output", "");
      addLine("output", scene.text, undefined, true); // Mark as story text
      addLine("output", "");
      addLine("output", "");

      if (scene.choices.length > 0) {
        // Store choices to show after story typing completes
        pendingChoices = scene.choices;
        storyTypewriterComplete = false;
        showingChoices = false;
      }
    }
  }

  function onLineComplete(completedLineId: number) {
    // Find the next line that needs to show loading
    const nextLoadingLine = terminalLines.find(
      (line) =>
        line.type === "output" &&
        line.content.trim() !== "" &&
        line.id > completedLineId
    );

    if (nextLoadingLine) {
      loadingLineId = nextLoadingLine.id;
    } else {
      loadingLineId = null;
    }
  }

  function onStoryComplete() {
    // Clear loading state when story completes
    loadingLineId = null;

    if (pendingChoices.length > 0) {
      currentChoices = pendingChoices;
      showingChoices = true;
      storyTypewriterComplete = true;

      // Add a single choices block
      addLine("choices", "");

      pendingChoices = [];
    }
  }
</script>

<div class="h-screen flex flex-col bg-gray-900 text-white">
  <!-- Terminal Content -->
  <div
    class="flex-1 p-6 overflow-y-auto font-mono text-lg bg-slate-900"
    bind:this={terminalElement}
  >
    {#each terminalLines as line (line.id)}
      <div class="mb-1" class:text-gray-300={line.type === "input"}>
        {#if line.type === "output"}
          <LoadingText
            text={line.content}
            isActiveLoading={line.id === loadingLineId}
            onComplete={line.isStoryText
              ? onStoryComplete
              : () => onLineComplete(line.id)}
          />
        {:else if line.type === "choices" && currentChoices.length > 0}
          <div class="mt-2">
            {#each currentChoices as choice, index}
              <button
                class="w-full text-left py-2 px-3 rounded transition-colors duration-200 hover:bg-gray-700 active:bg-gray-600 bg-transparent border-none text-white font-mono cursor-pointer"
                on:click={() => selectChoice(index)}
              >
                {index + 1}. {choice.text}
              </button>
            {/each}
          </div>
        {:else}
          <div class="mb-10 text-amber-200">{line.content}</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
  }
</style>
