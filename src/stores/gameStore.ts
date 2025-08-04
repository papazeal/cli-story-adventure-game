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
    text: "✨ Story Adventure Game",
    choices: [
      { text: "🚀 Start Game", nextSceneId: "intro" },
      { text: "❓ How to Play", nextSceneId: "help" },
      { text: "📝 What's New", nextSceneId: "changelog" },
    ],
  },
  {
    id: "help",
    text: "📖 How to Play:\n\n• 🖱️ Click on any choice to select it\n• 📚 Read the story and make decisions\n• 🌟 Different choices lead to different endings!\n• 🎈 Have fun exploring the magical forest!\n\nReady to begin your adventure?",
    choices: [
      { text: "🚀 Start Game", nextSceneId: "intro" },
      { text: "🔙 Back to Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "changelog",
    text: "📝 What's New in the Forest! 🌲\n\n🆕 **Latest Updates:**\n• 🧩 Added fun puzzles! Solve riddles and color games!\n• 🎵 New choice sounds! Each button makes music!\n• 🌈 Rainbow door puzzle in the magical portal!\n• 🔢 Number riddle in the treasure cave!\n• 🎵 Rhyming game with village kids!\n• ✨ 12 different story endings to discover!\n• 🎶 Smart audio that matches what you choose!\n\n**Coming Soon:** More puzzles and adventures! 🌟",
    choices: [
      { text: "🚀 Start Game", nextSceneId: "intro" },
      { text: "🔙 Back to Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "intro",
    text: "🌲 You wake up in a magic forest! The trees shine with water drops ✨ and birds sing happy songs 🎵. A squirrel waves at you and says 'Good morning!' in a tiny squeaky voice! 😊",
    choices: [
      { text: "🏞️ Go to the water sounds", nextSceneId: "river" },
      { text: "🌳 Climb a big tree", nextSceneId: "tree" },
      { text: "🎒 Look in your bag", nextSceneId: "backpack" },
    ],
  },
  {
    id: "river",
    text: "💧 You find a small river with clean water! 🌊 In the mud you see footprints - some from people and some from a big nice animal. A fish pops its head up and says 'Blub blub, welcome to my neighborhood!' then splashes back down! 🐾✨",
    choices: [
      { text: "👤 Follow the people footprints", nextSceneId: "village" },
      { text: "🔍 Follow the big animal tracks", nextSceneId: "creature" },
      { text: "🚰 Get some water and go back", nextSceneId: "intro" },
    ],
  },
  {
    id: "tree",
    text: "🌳 You climb up a big tree to the top! You can see far! ✨ You see a small town with smoke 🏘️💨 and a cave with pretty lights! A bird lands next to you and says 'Nice climbing! I've been watching - you're almost as good as me!' 🕳️⭐",
    choices: [
      { text: "🏘️ Go to the village", nextSceneId: "village" },
      { text: "🕳️ Check out the cave", nextSceneId: "cave" },
      { text: "🦅 Stay here and wait", nextSceneId: "rescue" },
    ],
  },
  {
    id: "backpack",
    text: "🎒 You look in your bag and find good things! A shiny compass 🧭, yummy snacks 🍫, a bright light 🔦, and a magic map that wiggles and says 'Pick me! Pick me!' in a tiny paper voice! 🗺️✨",
    choices: [
      { text: "🧭 Use the compass", nextSceneId: "village" },
      { text: "🔮 Look at the magic map", nextSceneId: "portal" },
      { text: "🍫 Eat a snack and rest", nextSceneId: "rest" },
    ],
  },
  {
    id: "village",
    text: "🏘️ You find a happy little town! People play music and dance! 🎵💃 A nice grandma 👵 says hello with a big smile. Kids play fun games! One kid is trying to juggle three cookies but keeps eating them instead! 🎈",
    choices: [
      { text: "🏠 Go with the nice grandma", nextSceneId: "helper" },
      { text: "🎈 Play with the village kids", nextSceneId: "rhyme_puzzle" },
      { text: "🎵 Join the music and dancing", nextSceneId: "dance_party" },
    ],
  },
  {
    id: "rhyme_puzzle",
    text: "🎈 The kids play a word game! A smart owl 🦉 adjusts his tiny glasses and says: 'Find a word that sounds like GATE!' One kid whispers 'I hope it's not LATE because I'm hungry!' 🤔",
    choices: [
      { text: "🍰 CAKE", nextSceneId: "rhyme_wrong" },
      { text: "🎱 EIGHT", nextSceneId: "rhyme_solved" },
      { text: "🐭 MOUSE", nextSceneId: "rhyme_wrong" },
      { text: "🤔 Think more", nextSceneId: "village" },
    ],
  },
  {
    id: "rhyme_solved",
    text: "🎉 'EIGHT!' you say! The kids cheer! 'Yes! GATE and EIGHT sound the same!' 🦉 The owl does a little happy dance on his branch and says 'Hoot hoot! You're quite the word wizard!' Now you can play!",
    choices: [
      { text: "🎈 Play games with new friends", nextSceneId: "friends" },
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
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
      { text: "🚶‍♂️ Walk up to say hello", nextSceneId: "friendship" },
      { text: "↩️ Wave and go back", nextSceneId: "intro" },
      { text: "🥜 Give it some snacks", nextSceneId: "friendship" },
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
    text: "<div class='text-amber-300'>🎉 GREAT! The lock opens with a happy 'DING!' You got it right: 4 + 2 + 3 = 9 legs! Inside the box are pretty crystals that make you feel smart and happy! One crystal winks and says 'You're a math wizard!' 💎🧠✨</div>",
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
    text: "📜 The glowing pictures show the story of the forest! They tell about magical creatures, friendly villages, and hidden treasures. One picture shows a bunny wearing a tiny crown! Another shows a fish playing a guitar! Reading them makes you feel wise and giggly! 📚✨",
    choices: [
      { text: "🔦 Now go find the treasure", nextSceneId: "treasure_puzzle" },
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
    text: "🎉 WOW! All seven gems glow in rainbow order - RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET! The magic door opens with pretty rainbow light and makes happy musical sounds like 'TA-DA!' You did the rainbow puzzle! ✨🌈",
    choices: [
      { text: "🚪 Step through the magic door", nextSceneId: "otherworld" },
      { text: "🏃‍♂️ Go back to look around more", nextSceneId: "village" },
    ],
  },
  {
    id: "portal_wrong",
    text: "💫 The gems flicker but don't stay bright. A gentle voice giggles and says: 'Oops! Think about rainbow colors... Red comes first! Remember Roy G. Biv - he's very organized!' 🌈 Try again!",
    choices: [
      { text: "🔄 Try the puzzle again", nextSceneId: "portal" },
      { text: "📍 Go back to the village", nextSceneId: "village" },
    ],
  },
  {
    id: "helper",
    text: "🏠 The nice grandma's house is full of fun books 📚 and pretty things! She tells you that you are special and can help make the forest happy ✨. She gives you cookies that are shaped like tiny stars and smell like magic! 🍪",
    choices: [
      { text: "✨ Yes! I want to help the forest", nextSceneId: "hero" },
      { text: "🍪 Can I have more cookies?", nextSceneId: "hero" },
      { text: "🤗 Thank you for being so nice", nextSceneId: "hero" },
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
    text: "🎵💃 You join the village music and dancing! Everyone is so happy to have you join their celebration! One person is dancing with two left feet but having the most fun ever! The music makes your heart feel light and joyful! ✨",
    choices: [
      { text: "🎶 Learn to make music with them", nextSceneId: "music_maker" },
      { text: "💃 Teach them new dance moves", nextSceneId: "dance_teacher" },
      {
        text: "😊 Help shy people join the fun",
        nextSceneId: "laughter_bringer",
      },
    ],
  },
  {
    id: "star_watching",
    text: "⭐🌙 You look up at the sparkling night sky! The stars are so bright and beautiful! You notice they seem to make patterns and tell stories about adventures! One star seems to be winking at you like it's telling a joke! ✨",
    choices: [
      { text: "🧭 Learn to navigate by the stars", nextSceneId: "star_guide" },
      { text: "☁️ Watch the clouds drift by", nextSceneId: "cloud_watcher" },
      { text: "🔍 Help others find their way", nextSceneId: "helper_finder" },
    ],
  },
  {
    id: "garden_discovery",
    text: "🌸✨ You discover that these magical flowers can grow anywhere! You learn their secrets and how to help other plants grow strong and beautiful too! One flower even grows upside down and says 'Look at me, I'm doing a headstand!' 🌻🌿",
    choices: [
      { text: "🌱 Become a master gardener", nextSceneId: "magic_gardener" },
      {
        text: "🔍 Help others find these flowers",
        nextSceneId: "helper_finder",
      },
      {
        text: "🏠 Share the discovery with the village",
        nextSceneId: "village",
      },
    ],
  },
  {
    id: "friends",
    text: "<div class='text-amber-300'>💪 You make friends with all the forest animals and kids from the town! You have tea parties with bunnies 🐰, play hide-and-seek with squirrels 🐿️ (they always win!), and sing songs with the birds 🐦. One bunny spills tea on his nose and everyone giggles! Best day ever! 👁️✨🌍</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "hero",
    text: "<div class='text-amber-300'>🎆 You become the Forest Helper! You learn to talk to animals and help keep the forest happy 🌍✨. All the forest friends love you and you have the best fun every day! A chipmunk even makes you a tiny crown out of acorns! 💪🏆</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "otherworld",
    text: "<div class='text-amber-300'>🌌 You go through the rainbow door and find a magic land with flying unicorns 🦄 and talking flowers 🌸! Everything is colorful and happy. One unicorn is trying to do loop-de-loops but keeps getting dizzy! A flower offers to teach you how to giggle in different colors! You want to stay and play here forever! 🏠❤️</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "friendship",
    text: "<div class='text-amber-300'>🐺❤️ The soft wolf becomes your best friend! You play in the forest every day 🌲🌀. The wolf teaches you how to talk to all the animals 🛡️. The wolf's favorite game is fetch, but he always brings back sticks that are way too big! You have the most fun times together! ✨🏰</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "rescue",
    text: "<div class='text-amber-300'>🚁 A rescue helicopter finds you! The pilot waves and says 'Hope you had fun camping!' You go home safe 🏢, but you always remember the magic forest and want to visit again soon! You even draw pictures of your talking animal friends! 🌲😊</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "music_maker",
    text: "<div class='text-amber-300'>🎵✨ You become the Forest Music Maker! You learn to play beautiful songs with the animals. The birds sing harmony 🐦🎶, the frogs play drums on lily pads 🐸🥁, and one cricket thinks he's the lead singer but only knows one note! Everyone loves your forest concerts! 🌲🎼</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "dance_teacher",
    text: "<div class='text-amber-300'>💃🕺 You become a happy dance teacher in the forest! You teach all the animals fun, gentle dances. The rabbits hop-dance 🐰, the bears do slow waltzes 🐻, and the skunks do the wiggle dance (which is their favorite)! You have the most joyful dance parties! 🎵✨</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "laughter_bringer",
    text: "<div class='text-amber-300'>😊🌟 You become the Forest Laughter Bringer! You help all the sad animals feel happy again with gentle jokes and fun games. Even a grumpy old owl learns to laugh at your silly riddles! Everyone loves spending time with you because you make them smile! 😄💫</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "helper_finder",
    text: "<div class='text-amber-300'>🔍💝 You become the Forest Helper Finder! You're really good at helping lost animals find their way home and helping friends find each other. You once helped a baby bird find its mom who was hiding in the wrong tree! Everyone knows they can count on you when they need help! 🏠✨</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "cloud_watcher",
    text: "<div class='text-amber-300'>☁️⭐ You become a Cloud Watcher! You learn to read the shapes in the clouds and predict the weather. You help farmers know when to plant and help everyone prepare for sunny or rainy days! Your favorite cloud looks like a bunny riding a bicycle! 🌦️🌱</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "magic_gardener",
    text: "<div class='text-amber-300'>🌻🔮 You become a Magic Gardener! You learn to grow the most beautiful flowers and help plants grow big and strong. Your garden becomes a peaceful place where all creatures come to rest! One flower even grows in the shape of a smiley face! 🌸🦋</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
  {
    id: "star_guide",
    text: "<div class='text-amber-300'>⭐🧭 You become a Star Guide! You learn to read the stars and help travelers find their way at night. Your knowledge of the sky helps everyone feel safe when it gets dark, and you love sharing stories about constellations! Your favorite constellation looks like a dancing pizza! 🌙✨</div>",
    choices: [{ text: "🏠 Main Menu", nextSceneId: "welcome" }],
  },
];

function getSceneById(id: string): Scene | null {
  return scenes.find((scene) => scene.id === id) || null;
}
