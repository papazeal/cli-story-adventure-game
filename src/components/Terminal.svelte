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

  // Item management
  const ITEMS = [
    {
      id: "feather_of_wisdom",
      name: "🪶 Feather of Wisdom",
      description: "Oliver the Owl",
    },
    {
      id: "golden_whisker",
      name: "✨ Golden Whisker",
      description: "Whiskers the Cat",
    },
    {
      id: "lily_pad_crown",
      name: "👑 Lily Pad Crown",
      description: "Freddy the Frog",
    },
    {
      id: "ocean_shell",
      name: "🐚 Ocean Shell",
      description: "Crusty the Crab",
    },
  ];

  function getOwnedItems(): string[] {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("forestFriendsItems");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  }

  function saveItem(itemId: string) {
    if (typeof window !== "undefined") {
      const owned = getOwnedItems();
      if (!owned.includes(itemId)) {
        owned.push(itemId);
        localStorage.setItem("forestFriendsItems", JSON.stringify(owned));
      }
    }
  }

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

      // Check if this choice leads to a correct answer and play appropriate sound
      const rewardScenes = ["owl_reward", "cat_reward", "frog_reward", "crab_reward"];

      const correctScenes = [
        "owl_quiz_1_correct",
        "owl_quiz_2_correct",
        "owl_quiz_3_correct",
        "cat_quiz_1_correct",
        "cat_quiz_2_correct",
        "cat_quiz_3_correct",
        "frog_quiz_1_correct",
        "frog_quiz_2_correct",
        "frog_quiz_3_correct",
        "crab_quiz_1_correct",
        "crab_quiz_2_correct",
        "crab_quiz_3_correct",
      ];

      const wrongScenes = [
        "owl_quiz_1_wrong",
        "owl_quiz_2_wrong",
        "owl_quiz_3_wrong",
        "cat_quiz_1_wrong",
        "cat_quiz_2_wrong",
        "cat_quiz_3_wrong",
        "frog_quiz_1_wrong",
        "frog_quiz_2_wrong",
        "frog_quiz_3_wrong",
        "crab_quiz_1_wrong",
        "crab_quiz_2_wrong",
        "crab_quiz_3_wrong",
      ];

      const funFactScenes = [
        "owl_fun_fact_1",
        "cat_fun_fact_1",
        "frog_fun_fact_1",
        "crab_fun_fact_1",
      ];

      if (rewardScenes.includes(selectedChoice.nextSceneId)) {
        // Super cheerful notes for reward scenes
        audioManager.playChoiceTone("🎊 AMAZING! ALL DONE! 🎊");
      } else if (correctScenes.includes(selectedChoice.nextSceneId)) {
        // Regular cheer for all quiz correct answers
        audioManager.playChoiceTone("🎉 CORRECT!");
      } else if (wrongScenes.includes(selectedChoice.nextSceneId)) {
        // Gentle sad tone for wrong answers
        audioManager.playChoiceTone("❌ WRONG");
      } else if (funFactScenes.includes(selectedChoice.nextSceneId)) {
        // Curious/interesting tone for fun facts
        audioManager.playChoiceTone("💡 FUN FACT");
      } else {
        // Play simple note for all other choices
        audioManager.playChoiceTone("♪");
      }

      // Add the selected choice to terminal
      addLine("input", `> ${selectedChoice.text}`);

      showingChoices = false;
      currentChoices = []; // Clear choices to prevent duplication

      // Navigate directly to the selected choice's destination
      gameState.navigateToScene(selectedChoice.nextSceneId);

      displayCurrentScene();
    }
  }

  function shuffleArray(array: any[]) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function displayCurrentScene() {
    const scene = gameState.getCurrentScene();
    if (scene) {
      // Remove any existing choice lines to prevent duplication
      terminalLines = terminalLines.filter((line) => line.type !== "choices");

      // Save items when reaching reward scenes
      if (scene.id === "owl_reward") {
        saveItem("feather_of_wisdom");
      } else if (scene.id === "cat_reward") {
        saveItem("golden_whisker");
      } else if (scene.id === "frog_reward") {
        saveItem("lily_pad_crown");
      } else if (scene.id === "crab_reward") {
        saveItem("ocean_shell");
      }

      addLine("output", "");
      addLine("output", "");

      // Special handling for items scene
      if (scene.id === "items") {
        const owned = getOwnedItems();
        let itemsDisplay = "";

        ITEMS.forEach((item) => {
          const isOwned = owned.includes(item.id);
          const opacity = isOwned ? "opacity-100" : "opacity-40";
          itemsDisplay += `<div class="${opacity}">${item.name} - ${item.description}</div>`;
        });

        addLine("output", itemsDisplay, undefined, true);
      } else {
        addLine("output", scene.text, undefined, true); // Mark as story text
      }

      addLine("output", "");
      addLine("output", "");

      if (scene.choices.length > 0) {
        // Check if this is a quiz question (has multiple choice answers)
        const isQuizQuestion =
          scene.id.includes("quiz_") &&
          !scene.id.includes("_correct") &&
          !scene.id.includes("_wrong");

        let choicesToShow = scene.choices;
        if (isQuizQuestion) {
          // Shuffle choices for quiz questions, but keep navigation choices at the end
          const quizChoices = scene.choices.filter(
            (choice) => !choice.text.includes("🔙")
          );
          const nonQuizChoices = scene.choices.filter((choice) =>
            choice.text.includes("🔙")
          );

          choicesToShow = [...shuffleArray(quizChoices), ...nonQuizChoices];
        }

        // Store choices to show after story typing completes
        pendingChoices = choicesToShow;
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

<div class="h-screen flex flex-col bg-slate-800 text-white">
  <!-- Terminal Content -->
  <div
    class="flex-1 p-6 overflow-y-auto font-mono text-lg pb-30"
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
          <div class="mt-6">
            {#each currentChoices as choice, index}
              <button
                class="w-full text-left py-2 px-3 rounded transition-colors duration-200 hover:bg-gray-700 active:bg-gray-600 bg-transparent border-none font-mono cursor-pointer text-lime-300"
                on:click={() => selectChoice(index)}
              >
                {index + 1}. {@html choice.text}
              </button>
            {/each}
          </div>
        {:else}
          <div class="mb-10 text-lime-300">{@html line.content}</div>
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
