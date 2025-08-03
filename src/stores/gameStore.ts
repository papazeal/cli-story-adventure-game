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
    id: "intro",
    text: "🌲 You wake up in a magical forest! The trees sparkle with dewdrops ✨ and you can hear birds singing pretty songs 🎵. You were exploring and now you're on a fun adventure! 😊",
    choices: [
      { text: "🏞️ Go to the water sounds", nextSceneId: "river" },
      { text: "🌳 Climb a big tree", nextSceneId: "tree" },
      { text: "🎒 Look in your bag", nextSceneId: "backpack" },
    ],
  },
  {
    id: "river",
    text: "💧 You find a babbling stream with crystal clear water! 🌊 In the soft mud you see footprints - some from people and some from a big friendly animal. The water makes peaceful sounds! 🐾✨",
    choices: [
      { text: "👤 Follow the people footprints", nextSceneId: "village" },
      { text: "🔍 Follow the big animal tracks", nextSceneId: "creature" },
      { text: "🚰 Get some water and go back", nextSceneId: "intro" },
    ],
  },
  {
    id: "tree",
    text: "🌳 You climb up a tall tree and reach the top! The view is amazing! ✨ You can see a cozy village with chimney smoke 🏘️💨 and a mysterious cave with twinkling lights! 🕳️⭐",
    choices: [
      { text: "🏘️ Go to the village", nextSceneId: "village" },
      { text: "🕳️ Check out the cave", nextSceneId: "cave" },
      { text: "🦅 Stay here and wait", nextSceneId: "rescue" },
    ],
  },
  {
    id: "backpack",
    text: "🎒 You look in your bag and find helpful things! A shiny compass 🧭, yummy snacks 🍫, a bright flashlight 🔦, and a special map with glowing lines! 🗺️✨",
    choices: [
      { text: "🧭 Use the compass", nextSceneId: "village" },
      { text: "🔮 Look at the magic map", nextSceneId: "portal" },
      { text: "🍫 Eat a snack and rest", nextSceneId: "rest" },
    ],
  },
  {
    id: "village",
    text: "🏘️ You find a cheerful little village! People are playing music and dancing in the square! 🎵💃 A kind grandma 👵 comes to say hello with a warm smile. Some kids are playing fun games nearby! 🎈",
    choices: [
      { text: "🏠 Go with the nice grandma", nextSceneId: "helper" },
      { text: "🎈 Play with the village kids", nextSceneId: "friends" },
      { text: "🎵 Join the music and dancing", nextSceneId: "dance_party" },
    ],
  },
  {
    id: "creature",
    text: "🐺 You find a big, fluffy wolf! It looks very friendly and wags its tail. It has sparkly fur and kind eyes ✨👁️.",
    choices: [
      { text: "🚶‍♂️ Walk up to say hello", nextSceneId: "friendship" },
      { text: "↩️ Wave and go back", nextSceneId: "intro" },
      { text: "🥜 Give it some snacks", nextSceneId: "friendship" },
    ],
  },
  {
    id: "cave",
    text: "🕳️ You find a pretty cave with glowing pictures on the walls! It feels warm and magical inside ✨⚡. You also notice beautiful glowing flowers growing near the entrance! 🌸",
    choices: [
      { text: "🔦 Go deeper with your flashlight", nextSceneId: "treasure" },
      { text: "📜 Look at the pretty pictures", nextSceneId: "treasure" },
      { text: "🌸 Study the magical flowers", nextSceneId: "garden_discovery" },
      { text: "⚠️ Go back outside", nextSceneId: "intro" },
    ],
  },
  {
    id: "portal",
    text: "🌊 Your magic map shows you a sparkly rainbow door 🌀 behind a waterfall! It looks like it goes to a fun place 🌌!",
    choices: [
      { text: "🚪 Jump through the rainbow door", nextSceneId: "otherworld" },
      { text: "🤚 Touch the sparkles", nextSceneId: "otherworld" },
      { text: "📍 Remember this place and go back", nextSceneId: "village" },
    ],
  },
  {
    id: "helper",
    text: "🏠 The nice grandma's house is full of fun books 📚 and pretty things! She tells you that you are special and can help make the forest happy ✨. She gives you cookies! 🍪",
    choices: [
      { text: "✨ Yes! I want to help the forest", nextSceneId: "hero" },
      { text: "🍪 Can I have more cookies?", nextSceneId: "hero" },
      { text: "🤗 Thank you for being so nice", nextSceneId: "hero" },
    ],
  },
  {
    id: "rest",
    text: "😴 You eat your snacks and feel much better! When it gets dark 🌙, you see pretty fireflies dancing between the trees ✨🌲. They want to show you something cool!",
    choices: [
      { text: "🏠 Follow the fireflies", nextSceneId: "village" },
      { text: "✨ Dance with the fireflies", nextSceneId: "friends" },
      { text: "⭐ Look up at the beautiful stars", nextSceneId: "star_watching" },
    ],
  },
  {
    id: "dance_party",
    text: "🎵💃 You join the village music and dancing! Everyone is so happy to have you join their celebration! The music makes your heart feel light and joyful! ✨",
    choices: [
      { text: "🎶 Learn to make music with them", nextSceneId: "music_maker" },
      { text: "💃 Teach them new dance moves", nextSceneId: "dance_teacher" },
      { text: "😊 Help shy people join the fun", nextSceneId: "laughter_bringer" },
    ],
  },
  {
    id: "star_watching",
    text: "⭐🌙 You look up at the sparkling night sky! The stars are so bright and beautiful! You notice they seem to make patterns and tell stories about adventures! ✨",
    choices: [
      { text: "🧭 Learn to navigate by the stars", nextSceneId: "star_guide" },
      { text: "☁️ Watch the clouds drift by", nextSceneId: "cloud_watcher" },
      { text: "🔍 Help others find their way", nextSceneId: "helper_finder" },
    ],
  },
  {
    id: "garden_discovery",
    text: "🌸✨ You discover that these magical flowers can grow anywhere! You learn their secrets and how to help other plants grow strong and beautiful too! 🌻🌿",
    choices: [
      { text: "🌱 Become a master gardener", nextSceneId: "magic_gardener" },
      { text: "🔍 Help others find these flowers", nextSceneId: "helper_finder" },
      { text: "🏠 Share the discovery with the village", nextSceneId: "village" },
    ],
  },
  {
    id: "friends",
    text: "💪 You make friends with all the forest animals and kids from the village! You have tea parties with rabbits 🐰, play hide-and-seek with squirrels 🐿️, and sing songs with the birds 🐦. Best day ever! 👁️✨🌍",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "hero",
    text: "🎆 You become the Forest Helper! You learn to talk to animals and help keep the forest happy 🌍✨. All the forest friends love you and you have the best adventures every day! 💪🏆",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "otherworld",
    text: "🌌 You go through the rainbow door and find a magical land with flying unicorns 🦄 and talking flowers 🌸! Everything is colorful and happy. You decide to stay and play forever! 🏠❤️",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "friendship",
    text: "🐺❤️ The fluffy wolf becomes your best friend! Together you play in the forest every day 🌲🌀. The wolf teaches you how to talk to all the animals 🛡️. You have the most fun adventures together! ✨🏰",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "treasure",
    text: "💰 In the cave, you find a box full of shiny crystals 🏺 that make you feel happy and smart ⚡🧠. Now you know you came here to take care of this special place! 🛡️✨",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "rescue",
    text: "🚁 A rescue helicopter finds you! You go home safely 🏢, but you always remember the magical forest and plan to visit again soon! 🌲😊",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "music_maker",
    text: "🎵✨ You become the Forest Music Maker! You learn to play beautiful songs with the animals. The birds sing harmony 🐦🎶, the frogs play drums on lily pads 🐸🥁, and everyone loves your forest concerts! 🌲🎼",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "dance_teacher",
    text: "💃🕺 You become a happy dance teacher in the forest! You teach all the animals fun, gentle dances. The rabbits hop-dance 🐰, the bears do slow waltzes 🐻, and you have the most joyful dance parties! 🎵✨",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "laughter_bringer",
    text: "😊🌟 You become the Forest Laughter Bringer! You help all the sad animals feel happy again with gentle jokes and fun games. Everyone loves spending time with you because you make them smile! 😄💫",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "helper_finder",
    text: "🔍💝 You become the Forest Helper Finder! You're really good at helping lost animals find their way home and helping friends find each other. Everyone knows they can count on you when they need help! 🏠✨",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "cloud_watcher",
    text: "☁️⭐ You become a Cloud Watcher! You learn to read the shapes in the clouds and predict the weather. You help farmers know when to plant and help everyone prepare for sunny or rainy days! 🌦️🌱",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "magic_gardener",
    text: "🌻🔮 You become a Magic Gardener! You learn to grow the most beautiful flowers and help plants grow big and strong. Your garden becomes a peaceful place where all creatures come to rest! 🌸🦋",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
  {
    id: "star_guide",
    text: "⭐🧭 You become a Star Guide! You learn to read the stars and help travelers find their way at night. Your knowledge of the sky helps everyone feel safe when it gets dark, and you love sharing stories about constellations! 🌙✨",
    choices: [
      { text: "🏠 Main Menu", nextSceneId: "welcome" },
    ],
  },
];

function getSceneById(id: string): Scene | null {
  return scenes.find((scene) => scene.id === id) || null;
}
