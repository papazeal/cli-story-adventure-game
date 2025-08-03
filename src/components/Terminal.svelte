<script lang="ts">
  import { onMount } from "svelte";
  import { gameState } from "../stores/gameStore";
  import LoadingText from "./LoadingText.svelte";

  let terminalElement: HTMLDivElement;
  let terminalLines: Array<{
    type: "output" | "input" | "choices";
    content: string;
    id: number;
    choices?: Array<{ text: string; index: number }>;
    isStoryText?: boolean;
  }> = [];
  let lineCounter = 0;
  let selectedChoice = 0;
  let showingChoices = false;
  let currentChoices: Array<{ text: string; nextSceneId: string }> = [];
  let storyTypewriterComplete = false;
  let pendingChoices: Array<{ text: string; nextSceneId: string }> = [];
  let currentScreen: "welcome" | "help" | "game" | "gameOver" = "welcome";
  let loadingLineId: number | null = null;

  onMount(() => {
    addLine(
      "output",
      "🎮 Welcome to the CLI Story Adventure Game! ✨",
      undefined,
      true
    );

    // Add keyboard listener
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function showWelcomeChoices() {
    pendingChoices = [{ text: "🚀 Start Game", nextSceneId: "intro" }];
    storyTypewriterComplete = false;
    showingChoices = false;
  }

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

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && showingChoices) {
      // Select current choice
      selectChoice(selectedChoice);
    } else if (event.key === "ArrowUp" && showingChoices) {
      event.preventDefault();
      selectedChoice =
        selectedChoice > 0 ? selectedChoice - 1 : currentChoices.length - 1;
    } else if (event.key === "ArrowDown" && showingChoices) {
      event.preventDefault();
      selectedChoice =
        selectedChoice < currentChoices.length - 1 ? selectedChoice + 1 : 0;
    }
  }

  function selectChoice(choiceIndex: number) {
    if (choiceIndex >= 0 && choiceIndex < currentChoices.length) {
      const selectedChoice = currentChoices[choiceIndex];

      // Add the selected choice to terminal
      addLine("input", `> ${selectedChoice.text}`);

      showingChoices = false;
      currentChoices = []; // Clear choices to prevent duplication

      // Handle different choice types
      if (selectedChoice.nextSceneId === "intro") {
        gameState.startGame();
        displayCurrentScene();
      } else if (selectedChoice.nextSceneId === "help") {
        showHelpScreen();
      } else if (selectedChoice.nextSceneId === "welcome") {
        showWelcomeScreen();
      } else if (selectedChoice.nextSceneId === "restart") {
        gameState.reset();
        location.reload(); // Restart the entire game
      } else {
        gameState.makeChoice(choiceIndex);
        displayCurrentScene();
      }
    }
  }

  function showWelcomeScreen() {
    currentScreen = "welcome";
    addLine("output", "");
    addLine(
      "output",
      "🎮 Welcome to the CLI Story Adventure Game! ✨",
      undefined,
      true
    );
  }

  function showHelpScreen() {
    currentScreen = "help";
    addLine("output", "");
    addLine("output", "📖 How to Play:", undefined, true);
    addLine("output", "");
    addLine("output", "• Use ⬆️ ⬇️ arrow keys to navigate choices");
    addLine("output", "• Press ⏎ Enter to select a choice");
    addLine("output", "• Or simply 🖱️ click on any choice");
    addLine("output", "• Read the story and make decisions to progress");
    addLine("output", "• Different choices lead to different endings!");
    addLine("output", "");
    addLine("output", "Ready to begin your adventure?", undefined, true);
  }

  function displayCurrentScene() {
    const scene = gameState.getCurrentScene();
    if (scene) {
      currentScreen = "game";
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
      } else {
        // Game Over - show choices
        currentScreen = "gameOver";
        addLine("output", "🎭 Game Over!", undefined, true);
        addLine("output", "");
        addLine(
          "output",
          "Thanks for playing! What would you like to do next?"
        );
        addLine("output", "");

        pendingChoices = [
          { text: "🔄 Play Again", nextSceneId: "intro" },
          { text: "🏠 Main Menu", nextSceneId: "welcome" },
        ];
        showingChoices = false;
        gameState.reset();
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

    // Handle different screen completions
    if (currentScreen === "welcome" && pendingChoices.length === 0) {
      showWelcomeChoices();
    } else if (currentScreen === "help" && pendingChoices.length === 0) {
      pendingChoices = [
        { text: "🚀 Start Game", nextSceneId: "intro" },
        { text: "🔙 Back to Menu", nextSceneId: "welcome" },
      ];
    }

    if (pendingChoices.length > 0) {
      currentChoices = pendingChoices;
      showingChoices = true;
      selectedChoice = 0;
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
              <div
                class="cursor-pointer py-1 px-2 rounded transition-colors duration-200"
                class:bg-gray-700={index === selectedChoice && showingChoices}
                on:click={() => selectChoice(index)}
                on:keydown={() => {}}
                role="button"
                tabindex="0"
              >
                {index + 1}. {choice.text}
              </div>
            {/each}
          </div>
        {:else}
          <div class="mb-10">{line.content}</div>
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
