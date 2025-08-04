import { writable } from "svelte/store";

export interface Choice {
  text: string;
  nextSceneId: string;
}

export interface Scene {
  id: string;
  text: string;
  choices: Choice[];
}

export interface GameState {
  currentSceneId: string | null;
  visitedScenes: string[];
  isGameStarted: boolean;
}

const initialState: GameState = {
  currentSceneId: "welcome",
  visitedScenes: ["welcome"],
  isGameStarted: true,
};

export const gameState = createGameStore();

function createGameStore() {
  const { subscribe, set, update } = writable<GameState>(initialState);

  return {
    subscribe,
    startGame() {
      update((state) => ({
        ...state,
        currentSceneId: "intro",
        isGameStarted: true,
        visitedScenes: ["intro"],
      }));
    },
    makeChoice(choiceIndex: number) {
      update((state) => {
        const currentScene = getSceneById(state.currentSceneId!);
        if (currentScene && currentScene.choices[choiceIndex]) {
          const nextSceneId = currentScene.choices[choiceIndex].nextSceneId;
          return {
            ...state,
            currentSceneId: nextSceneId,
            visitedScenes: [...state.visitedScenes, nextSceneId],
          };
        }
        return state;
      });
    },
    getCurrentScene(): Scene | null {
      const state = get(gameState);
      return state.currentSceneId ? getSceneById(state.currentSceneId) : null;
    },
    navigateToScene(sceneId: string) {
      update((state) => ({
        ...state,
        currentSceneId: sceneId,
        visitedScenes: [...state.visitedScenes, sceneId],
      }));
    },
    reset() {
      set(initialState);
    },
  };
}

function get<T>(store: {
  subscribe: (fn: (value: T) => void) => () => void;
}): T {
  let value: T;
  const unsubscribe = store.subscribe((v) => (value = v));
  unsubscribe();
  return value!;
}

const scenes: Scene[] = [
  {
    id: "welcome",
    text: "🌲 Forest Friends 🌲",
    choices: [
      { text: "🚀 Start Game", nextSceneId: "intro" },
      { text: "🎁 Friendship Collection", nextSceneId: "items" },
      { text: "❓ How to Play", nextSceneId: "help" },
      // { text: "📝 What's New", nextSceneId: "changelog" },
    ],
  },
  {
    id: "help",
    text: "📖 How to Play:\n\n• 🦉 Choose an animal to learn about\n• 📚 Complete 4 fun fact quizzes\n• 🎁 Earn a special gift from your animal friend\n• 🔄 More animals coming soon!",
    choices: [
      { text: "🚀 Start Game", nextSceneId: "intro" },
      { text: "🔙 Back to Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "changelog",
    text: "📝 What's New! 🌲\n\n• 🎁 Friendship Collection system\n• 🐾 7 forest animals to befriend\n• 🧩 Earn gifts by solving puzzles\n• 💾 Your collection saves forever!",
    choices: [
      { text: "🚀 Start Game", nextSceneId: "intro" },
      { text: "🔙 Back to Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "intro",
    text: "🌲 Welcome to Forest Friends! 🌲\n\nChoose an animal to learn about! Complete 4 quizzes to earn their special gift! 🎁✨",
    choices: [
      { text: "🦉 Oliver the Owl", nextSceneId: "owl_intro" },
      { text: "🐱 Whiskers the Cat", nextSceneId: "cat_intro" },
      { text: "🔙 Back to Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "owl_intro",
    text: "🦉 Hello! I'm Oliver the Owl! 🎩 I'm excited to teach you 4 amazing facts about owls like me! Ready to learn? Let's start with Quiz 1! ✨",
    choices: [
      { text: "📚 Start Quiz 1", nextSceneId: "owl_quiz_1" },
      { text: "🔙 Choose Different Animal", nextSceneId: "intro" },
    ],
  },
  {
    id: "owl_quiz_1",
    text: "🦉 Quiz 1: Oliver adjusts his tiny glasses and asks: 'We owls are famous for being very good at something! When mice and other small animals try to hide from us, we can still find them easily. What are we owls especially good at?' 👁️🌙",
    choices: [
      { text: "👁️ Seeing in the dark", nextSceneId: "owl_quiz_1_correct" },
      { text: "🏊‍♂️ Swimming underwater", nextSceneId: "owl_quiz_1_wrong" },
      { text: "🏃‍♂️ Running very fast", nextSceneId: "owl_quiz_1_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "owl_quiz_1" },
    ],
  },
  {
    id: "owl_quiz_1_correct",
    text: "🎉 'Excellent!' hoots Oliver happily! 'We owls have amazing night vision! Our big eyes help us see in the dark much better than most animals!' ✨ Quiz 1 Complete! Ready for Quiz 2? 📚",
    choices: [
      { text: "📚 Continue to Quiz 2", nextSceneId: "owl_quiz_2" },
    ],
  },
  {
    id: "owl_quiz_1_wrong",
    text: "🦉 Oliver tilts his head thoughtfully: 'Good guess, but not quite! Think about when it gets dark at night - what can owls do that many other animals can't? We hunt at night when it's hard to see!' 🌙",
    choices: [
      { text: "🔄 Try again", nextSceneId: "owl_quiz_1" },
    ],
  },
  {
    id: "owl_quiz_2",
    text: "🦉 Quiz 2: Oliver fluffs his feathers proudly and asks: 'Our heads are very special! We can turn our heads much farther than humans can. How far can we owls turn our heads?' 🔄",
    choices: [
      { text: "🔄 270 degrees (almost all the way around)", nextSceneId: "owl_quiz_2_correct" },
      { text: "🔄 90 degrees (just to the side)", nextSceneId: "owl_quiz_2_wrong" },
      { text: "🔄 180 degrees (halfway around)", nextSceneId: "owl_quiz_2_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "owl_quiz_2" },
    ],
  },
  {
    id: "owl_quiz_2_correct",
    text: "🎉 'Amazing!' Oliver spins his head almost all the way around to demonstrate! 'We can turn our heads 270 degrees! That's because we have 14 neck bones - humans only have 7!' ✨ Quiz 2 Complete! Ready for Quiz 3? 📚",
    choices: [
      { text: "📚 Continue to Quiz 3", nextSceneId: "owl_quiz_3" },
    ],
  },
  {
    id: "owl_quiz_2_wrong",
    text: "🦉 Oliver slowly turns his head very far to show you: 'More than that! We can turn our heads much, much farther than humans. It's almost like we can see behind us!' 👀",
    choices: [
      { text: "🔄 Try again", nextSceneId: "owl_quiz_2" },
    ],
  },
  {
    id: "owl_quiz_3",
    text: "🦉 Quiz 3: Oliver spreads his wings wide and asks: 'When we fly, we're very special compared to other birds! Most birds make noise when they fly, but we owls are different. What makes our flight special?' 🪶✈️",
    choices: [
      { text: "🤫 We fly completely silently", nextSceneId: "owl_quiz_3_correct" },
      { text: "🌪️ We fly faster than any other bird", nextSceneId: "owl_quiz_3_wrong" },
      { text: "⬆️ We fly higher than other birds", nextSceneId: "owl_quiz_3_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "owl_quiz_3" },
    ],
  },
  {
    id: "owl_quiz_3_correct",
    text: "🎉 'Perfect!' Oliver flaps his wings without making any sound! 'Our feathers have special soft edges that make us silent hunters! Our prey never hears us coming!' ✨ Quiz 3 Complete! Ready for the final Quiz 4? 📚",
    choices: [
      { text: "📚 Continue to Quiz 4", nextSceneId: "owl_quiz_4" },
    ],
  },
  {
    id: "owl_quiz_3_wrong",
    text: "🦉 Oliver flaps his wings and you notice there's no sound at all: 'Listen carefully... do you hear anything when I flap my wings? That's our special ability!' 🤫",
    choices: [
      { text: "🔄 Try again", nextSceneId: "owl_quiz_3" },
    ],
  },
  {
    id: "owl_quiz_4",
    text: "🦉 Quiz 4 (Final): Oliver points to his ear with his wing: 'Our hearing is incredibly powerful! We don't just have good ears - we have something very special about them. What makes owl ears so amazing?' 👂🎯",
    choices: [
      { text: "👂 Our ears are at different heights", nextSceneId: "owl_quiz_4_correct" },
      { text: "👂 Our ears are much bigger than other birds", nextSceneId: "owl_quiz_4_wrong" },
      { text: "👂 We have four ears instead of two", nextSceneId: "owl_quiz_4_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "owl_quiz_4" },
    ],
  },
  {
    id: "owl_quiz_4_correct",
    text: "🎉 'Outstanding!' Oliver tilts his head to show you: 'Our ears are at different heights on our heads! This helps us pinpoint exactly where sounds come from - even tiny mouse footsteps!' 🎯✨ All 4 Quizzes Complete! Time for your special gift! 🎁",
    choices: [
      { text: "🎁 Receive Oliver's Gift", nextSceneId: "owl_reward" },
    ],
  },
  {
    id: "owl_quiz_4_wrong",
    text: "🦉 Oliver turns his head to show you his ear area: 'Close! It's about the position of our ears. Think about how this might help us locate sounds more precisely!' 🎯",
    choices: [
      { text: "🔄 Try again", nextSceneId: "owl_quiz_4" },
    ],
  },
  {
    id: "owl_reward",
    text: "<div class='text-amber-300'>🎉 'Congratulations!' hoots Oliver proudly! 'You've learned so much about owls! As a reward for completing all 4 quizzes, I'm giving you my special Feather of Wisdom!' 🪶✨ Oliver tells you: 'This feather will remind you of all the amazing things you learned about owls today!' He gives you a beautiful owl feather that glows softly. 🦉💫\n\n*You received: 🪶 Feather of Wisdom!*</div>",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
      { text: "📚 Learn About Another Animal", nextSceneId: "intro" },
    ],
  },
  {
    id: "cat_intro",
    text: "🐱 Hello! I'm Whiskers the Cat! 😸 I'm excited to teach you 4 amazing facts about cats like me! Ready to learn? Let's start with Quiz 1! ✨",
    choices: [
      { text: "📚 Start Quiz 1", nextSceneId: "cat_quiz_1" },
      { text: "🔙 Choose Different Animal", nextSceneId: "intro" },
    ],
  },
  {
    id: "cat_quiz_1",
    text: "🐱 Quiz 1: Whiskers twitches his whiskers and asks: 'We cats have amazing balance! We can walk on very narrow things and almost never fall. What helps us keep our balance so well?' 🤸‍♀️",
    choices: [
      { text: "🐾 Our long tails", nextSceneId: "cat_quiz_1_correct" },
      { text: "👂 Our big ears", nextSceneId: "cat_quiz_1_wrong" },
      { text: "🦵 Our strong legs", nextSceneId: "cat_quiz_1_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "cat_quiz_1" },
    ],
  },
  {
    id: "cat_quiz_1_correct",
    text: "🎉 'Perfect!' purrs Whiskers, swishing his tail! 'Our tails help us balance like a tightrope walker's pole! We move our tails to stay steady when we walk on fences or climb trees!' ✨ Quiz 1 Complete! Ready for Quiz 2? 📚",
    choices: [
      { text: "📚 Continue to Quiz 2", nextSceneId: "cat_quiz_2" },
    ],
  },
  {
    id: "cat_quiz_1_wrong",
    text: "🐱 Whiskers swishes his tail back and forth: 'Good guess! But look at what I'm moving right now to help me balance. It's long and fluffy and helps me stay steady!' 🐾",
    choices: [
      { text: "🔄 Try again", nextSceneId: "cat_quiz_1" },
    ],
  },
  {
    id: "cat_quiz_2",
    text: "🐱 Quiz 2: Whiskers stretches and shows his paws: 'We cats are amazing hunters! We can sneak up on mice without making any sound. What do we have on our paws that helps us walk silently?' 🤫🐾",
    choices: [
      { text: "🧸 Soft paw pads", nextSceneId: "cat_quiz_2_correct" },
      { text: "🧤 Furry mittens", nextSceneId: "cat_quiz_2_wrong" },
      { text: "👟 Tiny shoes", nextSceneId: "cat_quiz_2_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "cat_quiz_2" },
    ],
  },
  {
    id: "cat_quiz_2_correct",
    text: "🎉 'Excellent!' Whiskers shows you his soft paw pads! 'These squishy pads cushion our steps so we can sneak up on prey silently! They're like built-in slippers!' ✨ Quiz 2 Complete! Ready for Quiz 3? 📚",
    choices: [
      { text: "📚 Continue to Quiz 3", nextSceneId: "cat_quiz_3" },
    ],
  },
  {
    id: "cat_quiz_2_wrong",
    text: "🐱 Whiskers lifts his paw to show you: 'Look at the bottom of my paws! Feel how soft and squishy they are. These help me walk without making noise!' 🤫",
    choices: [
      { text: "🔄 Try again", nextSceneId: "cat_quiz_2" },
    ],
  },
  {
    id: "cat_quiz_3",
    text: "🐱 Quiz 3: Whiskers' eyes get big and round: 'We cats can see much better than humans in low light! Our eyes have something special that helps us see in the dark. What makes our eyes so good at night vision?' 👁️🌙",
    choices: [
      { text: "👁️ Our pupils get very big", nextSceneId: "cat_quiz_3_correct" },
      { text: "👁️ Our eyes glow in the dark", nextSceneId: "cat_quiz_3_wrong" },
      { text: "👁️ We have extra eyelids", nextSceneId: "cat_quiz_3_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "cat_quiz_3" },
    ],
  },
  {
    id: "cat_quiz_3_correct",
    text: "🎉 'Amazing!' Whiskers' pupils get huge and round! 'Our pupils can open very wide to let in more light! This helps us see when it's almost dark!' ✨ Quiz 3 Complete! Ready for the final Quiz 4? 📚",
    choices: [
      { text: "📚 Continue to Quiz 4", nextSceneId: "cat_quiz_4" },
    ],
  },
  {
    id: "cat_quiz_3_wrong",
    text: "🐱 Whiskers looks at you with his big round eyes: 'Look at my eyes in the dim light - see how the black center gets bigger and smaller? That's the secret!' 👁️",
    choices: [
      { text: "🔄 Try again", nextSceneId: "cat_quiz_3" },
    ],
  },
  {
    id: "cat_quiz_4",
    text: "🐱 Quiz 4 (Final): Whiskers starts purring loudly: 'We cats make this happy sound when we're content! But purring isn't just for showing happiness - it has a special benefit for our bodies too. What else does purring do for us?' 💚😸",
    choices: [
      { text: "💊 It helps heal our bones and muscles", nextSceneId: "cat_quiz_4_correct" },
      { text: "🍽️ It helps us digest our food", nextSceneId: "cat_quiz_4_wrong" },
      { text: "💤 It helps us fall asleep faster", nextSceneId: "cat_quiz_4_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "cat_quiz_4" },
    ],
  },
  {
    id: "cat_quiz_4_correct",
    text: "🎉 'Outstanding!' Whiskers purrs even louder! 'The vibrations from purring actually help heal our bones and muscles! It's like having our own built-in medicine!' 💚✨ All 4 Quizzes Complete! Time for your special gift! 🎁",
    choices: [
      { text: "🎁 Receive Whiskers' Gift", nextSceneId: "cat_reward" },
    ],
  },
  {
    id: "cat_quiz_4_wrong",
    text: "🐱 Whiskers purrs and you can feel the vibrations: 'Feel how my whole body vibrates when I purr? These vibrations are actually good for my body in a healing way!' 💚",
    choices: [
      { text: "🔄 Try again", nextSceneId: "cat_quiz_4" },
    ],
  },
  {
    id: "cat_reward",
    text: "<div class='text-amber-300'>🎉 'Congratulations!' purrs Whiskers proudly! 'You've learned so much about cats! As a reward for completing all 4 quizzes, I'm giving you my special Golden Whisker!' 🥇✨ Whiskers tells you: 'This golden whisker will remind you of all the amazing things you learned about cats today!' He gives you one of his magical golden whiskers that shimmers softly. 🐱💫\n\n*You received: ✨ Golden Whisker!*</div>",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
      { text: "📚 Learn About Another Animal", nextSceneId: "intro" },
    ],
  },
  {
    id: "river",
    text: "💧 You find a small river with clean water! 🌊 In the mud you see footprints - some from people 👣 and some from a big animal 🐾.",
    choices: [
      { text: "👣 Follow the people footprints", nextSceneId: "village" },
      { text: "🐾 Follow the big animal tracks", nextSceneId: "creature" },
      { text: "🚰 Get some water and go back", nextSceneId: "intro" },
    ],
  },
  {
    id: "tree",
    text: "🌳 You climb up a big tree to the top! You can see far! ✨ You see a small village with smoke 🏘️💨 and a cave with pretty lights! A bird lands next to you and says 'Nice climbing! I've been watching - you're almost as good as me!' 🕳️⭐",
    choices: [
      { text: "🏘️ Go to the village", nextSceneId: "village" },
      { text: "🕳️ Check out the cave", nextSceneId: "cave" },
    ],
  },
  {
    id: "backpack",
    text: "🎒 You look in your bag and find good things! A shiny compass 🧭, yummy snacks 🍫, a bright light 🔦, and a magic map that wiggles and says 'Pick me! Pick me!' in a tiny paper voice! You're feeling a bit tired from your forest adventure. 🗺️✨",
    choices: [
      { text: "🧭 Use the compass", nextSceneId: "village" },
      { text: "🔮 Look at the magic map", nextSceneId: "portal" },
      { text: "🍫 Eat a snack and rest", nextSceneId: "rest" },
    ],
  },
  {
    id: "village",
    text: "🏘️ You find a happy little village! People play music and dance! 🎵💃 A nice grandma 👵 says hello with a big smile. Under a big tree, you see kids gathered around a wise owl teacher 🦉 with tiny glasses who is helping them with word games! One kid is trying to juggle three cookies but keeps eating them instead! 🎈",
    choices: [
      { text: "🏠 Go with the nice grandma", nextSceneId: "helper" },
      { text: "🦉 Join the owl's word game", nextSceneId: "rhyme_puzzle" },
      { text: "🎵 Join the music and dancing", nextSceneId: "dance_party" },
    ],
  },
  {
    id: "rhyme_puzzle",
    text: "🦉 You join the kids around the wise owl teacher! He adjusts his tiny glasses and welcomes you warmly: 'Wonderful! A new student!' The kids giggle excitedly. 'Let's play our word game together!' says the owl. 'Find a word that sounds like GATE!' One kid whispers 'I hope it's not LATE because I'm hungry!' 🤔",
    choices: [
      { text: "🍰 CAKE", nextSceneId: "rhyme_wrong" },
      { text: "🎱 EIGHT", nextSceneId: "rhyme_solved" },
      { text: "🐭 MOUSE", nextSceneId: "rhyme_wrong" },
      { text: "🤔 Think more", nextSceneId: "village" },
    ],
  },
  {
    id: "rhyme_solved",
    text: "<div class='text-amber-300'>🎉 'EIGHT!' you say! The kids cheer! 'Yes! GATE and EIGHT sound the same!' 🦉 The owl does a little happy dance on his branch and says 'Hoot hoot! You're quite the word wizard!' The village kids crown you their Word Champion and give you a tiny golden crown! 'You are now our friend!' they giggle together. 👑✨\n\n*You received: 👑 Word Crown!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "rhyme_wrong",
    text: "🦉 The owl says nicely: 'Not quite! Think of a word that sounds like GATE... GA-ATE... what else ends like ATE?' One kid giggles and says 'My tummy rumbles like ATE!' The other kids laugh! 😊",
    choices: [
      { text: "🔄 Try the rhyme again", nextSceneId: "rhyme_puzzle" },
      { text: "🏃‍♂️ Go back to the village", nextSceneId: "village" },
    ],
  },
  {
    id: "creature",
    text: "🐺 You find a big, soft wolf! It looks very nice and wags its tail so hard its whole body wiggles! It tilts its head and seems to be smiling. 'Woof?' it says politely, like asking 'How do you do?' ✨👁️",
    choices: [
      { text: "🚶‍♂️ Walk up to say hello", nextSceneId: "wolf_puzzle" },
      { text: "↩️ Wave and go back", nextSceneId: "intro" },
      { text: "🥜 Give it some snacks", nextSceneId: "wolf_puzzle" },
    ],
  },
  {
    id: "cave",
    text: "🕳️ You find a nice cave with bright pictures on the walls! It feels warm and magic inside ✨⚡. You see pretty glowing flowers by the door that seem to be winking at you! One flower whispers 'Psst, we're magic!' 🌸",
    choices: [
      {
        text: "🔦 Go deeper with your light",
        nextSceneId: "treasure_puzzle",
      },
      { text: "📜 Look at the pretty pictures", nextSceneId: "cave_pictures" },
      { text: "🌸 Look at the magic flowers", nextSceneId: "garden_discovery" },
      { text: "⚠️ Go back outside", nextSceneId: "intro" },
    ],
  },
  {
    id: "treasure_puzzle",
    text: "💰 Deep in the cave, you find a shiny treasure box! But it has a number lock that seems to be humming a tune! 🔢 There's a math puzzle carved in sparkly letters: 'A bunny has 4 legs 🐰, a bird has 2 legs 🐦, and a person with a stick has 3 legs 🚶‍♂️🦯. How many legs all together?' The lock giggles softly! 🤔",
    choices: [
      { text: "🔢 Answer: 6 legs", nextSceneId: "treasure_wrong" },
      { text: "🔢 Answer: 9 legs", nextSceneId: "treasure_solved" },
      { text: "🔢 Answer: 12 legs", nextSceneId: "treasure_wrong" },
      { text: "🤔 Think more and go back", nextSceneId: "cave" },
    ],
  },
  {
    id: "treasure_solved",
    text: "<div class='text-amber-300'>🎉 GREAT! The lock opens with a happy 'DING!' You got it right: 4 + 2 + 3 = 9 legs! Inside the box are pretty crystals that make you feel smart and happy! The largest crystal glows and says 'You are now a friend of the Treasure Cave! Take this special gem as proof of your cleverness!' 💎🧠✨\n\n*You received: 💎 Crystal Gem!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "treasure_wrong",
    text: "🔒 The lock stays closed and makes a tiny 'bonk' sound. A nice crystal pops up and says: 'Hmm, let me help! Count again... 4 bunny legs + 2 bird legs + 3 legs with stick = ?' and does a little counting dance! Try again! 🤗",
    choices: [
      { text: "🔄 Try the puzzle again", nextSceneId: "treasure_puzzle" },
      { text: "🏃‍♂️ Go back to look around", nextSceneId: "cave" },
    ],
  },
  {
    id: "cave_pictures",
    text: "📜 The glowing pictures show the story of the forest! They tell about magical creatures, friendly villages, and hidden treasures. One picture shows a bunny wearing a tiny crown! Another shows a fish playing a guitar! At the end of the cave, you see a wise old turtle with a glowing memory stone! 📚✨",
    choices: [
      { text: "🔦 Now go find the treasure", nextSceneId: "treasure_puzzle" },
      {
        text: "🧩 Visit the pattern stone turtle",
        nextSceneId: "pattern_puzzle",
      },
      { text: "🏃‍♂️ Go back outside", nextSceneId: "intro" },
    ],
  },
  {
    id: "portal",
    text: "🌊 Your magic map shows you a sparkly rainbow door 🌀 behind a waterfall! But wait... there are 7 colored gems that seem to be doing a little wiggle dance! The map giggles and whispers: 'Follow all the colors of a real rainbow - Roy G. Biv! He's a funny guy!' 🌈",
    choices: [
      {
        text: '<div class="inline-flex gap-2"><div class="w-4 h-4 bg-[#ffdd44]"></div><div class="w-4 h-4 bg-[#4488ff]"></div><div class="w-4 h-4 bg-[#ff4444]"></div><div class="w-4 h-4 bg-[#aa44ff]"></div><div class="w-4 h-4 bg-[#44ff44]"></div><div class="w-4 h-4 bg-[#6644ff]"></div><div class="w-4 h-4 bg-[#ff8844]"></div></div>',
        nextSceneId: "portal_wrong",
      },
      {
        text: '<div class="inline-flex gap-2"><div class="w-4 h-4 bg-[#ff4444]"></div><div class="w-4 h-4 bg-[#ff8844]"></div><div class="w-4 h-4 bg-[#ffdd44]"></div><div class="w-4 h-4 bg-[#44ff44]"></div><div class="w-4 h-4 bg-[#4488ff]"></div><div class="w-4 h-4 bg-[#6644ff]"></div><div class="w-4 h-4 bg-[#aa44ff]"></div></div>',
        nextSceneId: "portal_solved",
      },
      {
        text: '<div class="inline-flex gap-2"><div class="w-4 h-4 bg-[#44ff44]"></div><div class="w-4 h-4 bg-[#aa44ff]"></div><div class="w-4 h-4 bg-[#ff8844]"></div><div class="w-4 h-4 bg-[#4488ff]"></div><div class="w-4 h-4 bg-[#ffdd44]"></div><div class="w-4 h-4 bg-[#ff4444]"></div><div class="w-4 h-4 bg-[#6644ff]"></div></div>',
        nextSceneId: "portal_wrong",
      },

      { text: "📍 Remember this place and go back", nextSceneId: "village" },
    ],
  },
  {
    id: "portal_solved",
    text: "<div class='text-amber-300'>🎉 WOW! All seven gems glow in rainbow order - RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET! The magic door opens with pretty rainbow light and makes happy musical sounds like 'TA-DA!' A gentle voice whispers: 'You understand the rainbow's secret! You are now a friend of the Portal!' A shimmering rainbow badge appears in your hand. You step through the magical rainbow door into a world of wonder! ✨🌈\n\n*You received: 🌈 Rainbow Badge!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "portal_wrong",
    text: "💫 The gems flicker but don't stay bright. A gentle voice giggles and says: 'Oops! Think about rainbow colors... Red comes first! Remember Roy G. Biv - he's very organized!' 🌈 Try again!",
    choices: [
      { text: "🔄 Try the puzzle again", nextSceneId: "portal" },
      { text: "📍 Put away the map", nextSceneId: "backpack" },
    ],
  },
  {
    id: "helper",
    text: "🏠 The nice grandma's house is full of fun books 📚 and pretty things! She tells you that you are special and can help make the forest happy ✨. She gives you cookies that are shaped like tiny stars and smell like magic! 🍪",
    choices: [
      {
        text: "✨ Yes! I want to help the forest",
        nextSceneId: "riddle_puzzle",
      },
    ],
  },
  {
    id: "rest",
    text: "😴 You eat your snacks and feel much better! When it gets dark 🌙, you see pretty fireflies dancing between the trees ✨🌲. One firefly does a tiny backflip and winks at you! They want to show you something cool!",
    choices: [
      { text: "🏠 Follow the fireflies", nextSceneId: "village" },
      { text: "✨ Dance with the fireflies", nextSceneId: "friends" },
      {
        text: "⭐ Look up at the beautiful stars",
        nextSceneId: "star_watching",
      },
    ],
  },
  {
    id: "dance_party",
    text: "🎵💃 You join the village music and dancing! Everyone is so happy to have you join their celebration! You hear animals nearby having their own sound contest! One person is dancing with two left feet but having the most fun ever! The music makes your heart feel light and joyful! ✨",
    choices: [
      {
        text: "🎶 Learn to make music with them",
        nextSceneId: "animal_sounds_puzzle",
      },
      {
        text: "🎵 Join the animal sounds",
        nextSceneId: "animal_sounds_puzzle",
      },
    ],
  },
  {
    id: "star_watching",
    text: "⭐🌙 You look up at the sparkling night sky! The stars are so bright and beautiful! You notice they seem to make patterns and tell stories about adventures! You hear a wise owl hooting nearby with a riddle challenge! One star seems to be winking at you like it's telling a joke! ✨",
    choices: [{ text: "🦉 Visit the wise owl", nextSceneId: "riddle_puzzle" }],
  },
  {
    id: "garden_discovery",
    text: "🌸✨ You discover that these magical flowers can grow anywhere! You learn their secrets and how to help other plants grow strong and beautiful too! You hear happy bunny voices nearby having a counting party! One flower even grows upside down and says 'Look at me, I'm doing a headstand!' 🌻🌿",
    choices: [
      { text: "🐰 Join the bunny party", nextSceneId: "counting_puzzle" },
      {
        text: "🏠 Share the discovery with the village",
        nextSceneId: "village",
      },
    ],
  },
  {
    id: "friends",
    text: "✨ You dance with the magical fireflies! A wise old firefly with a tiny glowing crown flies up to you and says: 'I want to teach you about fireflies like us! We make light with our bodies using something special. What do we fireflies use to create our beautiful glow?' The other fireflies twinkle excitedly, waiting for your answer! 🌟",
    choices: [
      {
        text: "🧪 A chemical reaction in our bodies",
        nextSceneId: "cooperation_solved",
      },
      {
        text: "🔥 Tiny fires inside us",
        nextSceneId: "cooperation_wrong",
      },
      {
        text: "⚡ Electricity from lightning",
        nextSceneId: "cooperation_wrong",
      },
      { text: "🤔 Give me a hint", nextSceneId: "friends" },
    ],
  },
  {
    id: "pattern_puzzle",
    text: "🧩 You find a magical pattern stone that glows with different shapes! A wise old turtle 🐢 with tiny spectacles says: 'Watch carefully, young one!' The stone shows: ⭐🌙⭐🌙 then pauses... 'What comes next in the pattern?' the turtle asks kindly. 🤔✨",
    choices: [
      { text: "⭐ Star", nextSceneId: "pattern_solved" },
      { text: "🌙 Moon", nextSceneId: "pattern_wrong" },
      { text: "🌟 Shooting Star", nextSceneId: "pattern_wrong" },
      { text: "🤔 Ask to see it again", nextSceneId: "pattern_puzzle" },
    ],
  },
  {
    id: "pattern_solved",
    text: "<div class='text-amber-300'>🎉 'Perfect!' says the turtle with a big smile! 'You are now my friend!' 🐢❤️ Terry the Turtle tells you a secret: 'I once got lost trying to follow a zigzag pattern of flowers, but I kept going in circles! That's when I learned that sometimes the best pattern is just... slow and steady!' He giggles and gives you a tiny shell necklace. You are now friends with Wise Turtle Terry! 🧩✨\n\n*You received: 🐚 Shell Necklace!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "pattern_wrong",
    text: "🐢 The wise turtle smiles kindly: 'Not quite right, but that's okay! Pattern recognition takes practice. The pattern was star, moon, star, moon... so what comes next? Think about the repeating pattern!' A friendly mouse whispers 'You've got this!' 🌟",
    choices: [
      { text: "🔄 Try the pattern again", nextSceneId: "pattern_puzzle" },
      { text: "🏃‍♂️ Come back later", nextSceneId: "intro" },
    ],
  },
  {
    id: "riddle_puzzle",
    text: "🦉 A clever owl wearing a tiny hat sits on a mushroom! 'I have a riddle for you!' he hoots excitedly. 'I'm tall when I'm young, and short when I'm old. I give light in the dark, but I'm not the sun! What am I?' A cricket chirps 'This is a good one!' 🕯️🤔",
    choices: [
      { text: "🕯️ A candle", nextSceneId: "riddle_solved" },
      { text: "🌳 A tree", nextSceneId: "riddle_wrong" },
      { text: "⭐ A star", nextSceneId: "riddle_wrong" },
      { text: "🤔 Think more", nextSceneId: "riddle_puzzle" },
    ],
  },
  {
    id: "riddle_solved",
    text: "<div class='text-amber-300'>🎉 'Excellent!' hoots the owl, doing a little wing dance! 'You are now my friend!' 🦉❤️ Oliver Owl shares a funny story: 'I once tried to blow out a candle with my wings, but I accidentally fanned the flame and made it bigger! The other forest animals thought I was doing a fire magic show! Now I just ask the mice to help me blow out candles!' He gives you a tiny feather bookmark. You are now friends with Oliver Owl! 🧠🕯️\n\n*You received: 🪶 Feather Bookmark!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "riddle_wrong",
    text: "🦉 The owl tilts his head thoughtfully: 'Good guess, but not quite! Think about something that gets shorter as it's used, and gives light when it's dark. The cricket whispers 'It rhymes with handle!' Try again! 🤗",
    choices: [
      { text: "🔄 Try again", nextSceneId: "riddle_puzzle" },
      { text: "🏃‍♂️ Come back later", nextSceneId: "intro" },
    ],
  },
  {
    id: "counting_puzzle",
    text: "🐰 You meet a family of counting bunnies! Papa Bunny says: 'We're having a carrot party! 🥕 I have 3 carrots, Mama has 5 carrots, and our 4 baby bunnies each have 2 carrots. How many carrots do we have for our party?' Baby Bunny giggles 'I love math parties!' 🎉",
    choices: [
      { text: "🔢 Answer: 16 carrots", nextSceneId: "counting_solved" },
      { text: "🔢 Answer: 14 carrots", nextSceneId: "counting_wrong" },
      { text: "🔢 Answer: 12 carrots", nextSceneId: "counting_wrong" },
      { text: "🤔 Count again carefully", nextSceneId: "counting_puzzle" },
    ],
  },
  {
    id: "counting_solved",
    text: "<div class='text-amber-300'>🎉 'Hooray!' cheer all the bunnies! 'You are now part of our family!' 🐰❤️ Papa Bunny tells you a silly story: 'One day we tried to count all the flowers in the meadow, but I kept getting distracted and eating them! Mama Bunny had to remind me that flowers are for smelling, not for snacking! Now I only count carrots!' The whole bunny family gives you tiny carrot earrings. You are now friends with the Counting Bunny Family! 🥕🐰\n\n*You received: 🥕 Carrot Earrings!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "counting_wrong",
    text: "🐰 Papa Bunny smiles sweetly: 'Almost! Let me help you count: I have 3, Mama has 5, and each of our 4 babies has 2 carrots. So that's 3 + 5 + 2 + 2 + 2 + 2. Try adding them up!' Mama Bunny nods encouragingly! 🥕",
    choices: [
      { text: "🔄 Try again", nextSceneId: "counting_puzzle" },
      { text: "🏃‍♂️ Come back later", nextSceneId: "intro" },
    ],
  },
  {
    id: "animal_sounds_puzzle",
    text: "🎵 You find a musical clearing where animals are having a sound contest! A fox 🦊 says: 'We each make a sound! Listen carefully: I say YIP! The cow says MOO! The duck says QUACK! What sound does the sheep make?' A little lamb giggles behind a tree! 🐑",
    choices: [
      { text: "🐑 BAA!", nextSceneId: "sounds_solved" },
      { text: "🐄 MOO!", nextSceneId: "sounds_wrong" },
      { text: "🐦 CHIRP!", nextSceneId: "sounds_wrong" },
      { text: "🤔 Listen again", nextSceneId: "animal_sounds_puzzle" },
    ],
  },
  {
    id: "sounds_solved",
    text: "<div class='text-amber-300'>🎉 'BAA! BAA!' bleats the happy little sheep as she jumps out! 'You are now part of our music band!' 🐑❤️ Melody the Sheep tells you a funny story: 'Once I tried to sound like a cow because I thought MOO was prettier than BAA, but when I did it, all the other cows looked at me funny and asked if I was feeling okay! Now I love my BAA - it's the most beautiful sound in the world!' She gives you a tiny wool friendship bracelet. You are now friends with the Musical Animal Band! 🎵🐑\n\n*You received: 🧶 Wool Bracelet!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "sounds_wrong",
    text: "🦊 The fox giggles: 'That's a good sound, but not quite right! The sheep is fluffy and white and says... well, what do you think she says? Listen to the wind - sometimes it sounds like sheep!' The little lamb giggles again! 🐑💨",
    choices: [
      { text: "🔄 Try again", nextSceneId: "animal_sounds_puzzle" },
      { text: "🏃‍♂️ Come back later", nextSceneId: "intro" },
    ],
  },
  {
    id: "cooperation_solved",
    text: "<div class='text-amber-300'>🎉 'Excellent!' twinkles the wise firefly! 'Yes! We use bioluminescence - a special chemical reaction!' ✨ All the fireflies glow brighter with excitement! The wise firefly tells you: 'We mix special chemicals called luciferin and luciferase in our bodies to make light without heat! It's like nature's own magic!' They swirl around you in a beautiful light dance and give you a tiny magical candle that glows without melting! 🕯️💫\n\n*You received: 🕯️ Magic Candle!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "cooperation_wrong",
    text: "✨ The wise firefly dims slightly and says gently: 'Good guess, but not quite right! We don't use fire or electricity - that would be dangerous! Think about it... we make light that doesn't burn or hurt us. It's a special process that happens inside our bodies with natural chemicals!' The other fireflies encourage you with gentle twinkles! 🌟",
    choices: [
      { text: "🔄 Try again", nextSceneId: "friends" },
      { text: "🏃‍♂️ Come back later", nextSceneId: "intro" },
    ],
  },
  {
    id: "wolf_puzzle",
    text: "🐺 The friendly wolf wants to test your animal knowledge! He says: 'Here's a fun fact about wolves like me! We live together in groups. What do you call a group of wolves?' He wags his tail excitedly, waiting for your answer! 🤔",
    choices: [
      { text: "🐺 A pack", nextSceneId: "wolf_solved" },
      { text: "🐺 A herd", nextSceneId: "wolf_wrong" },
      { text: "🐺 A flock", nextSceneId: "wolf_wrong" },
      { text: "🤔 Give me a hint", nextSceneId: "wolf_puzzle" },
    ],
  },
  {
    id: "wolf_solved",
    text: "<div class='text-amber-300'>🎉 'Perfect!' howls the wolf happily! 'We live in packs!' 🐺❤️ Winston the Wolf tells you his story: 'My pack is like my family! We hunt together, play together, and take care of each other. The best part is howling together under the stars - it sounds like the most beautiful song!' He gives you a tiny wolf paw print charm. You are now friends with Wise Wolf Winston! 🧩🐾\n\n*You received: 🐾 Wolf Paw Charm!*</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "wolf_wrong",
    text: "🐺 The wolf shakes his head gently and says: 'Not quite! Think about it - we wolves work together like a team. What do you call a group of animals that work together as a team? It starts with P!' His tail wags encouragingly! 🤗",
    choices: [
      { text: "🔄 Try again", nextSceneId: "wolf_puzzle" },
      { text: "🏃‍♂️ Come back later", nextSceneId: "intro" },
    ],
  },
  {
    id: "items",
    text: "🎁 Friendship Collection",
    choices: [{ text: "🔙 Back to Menu", nextSceneId: "welcome" }],
  },
];

function getSceneById(id: string): Scene | null {
  return scenes.find((scene) => scene.id === id) || null;
}
