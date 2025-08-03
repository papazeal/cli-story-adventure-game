import { writable } from 'svelte/store';

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
	currentSceneId: null,
	visitedScenes: [],
	isGameStarted: false
};

export const gameState = createGameStore();

function createGameStore() {
	const { subscribe, set, update } = writable<GameState>(initialState);

	return {
		subscribe,
		startGame() {
			update(state => ({
				...state,
				currentSceneId: 'intro',
				isGameStarted: true,
				visitedScenes: ['intro']
			}));
		},
		makeChoice(choiceIndex: number) {
			update(state => {
				const currentScene = getSceneById(state.currentSceneId!);
				if (currentScene && currentScene.choices[choiceIndex]) {
					const nextSceneId = currentScene.choices[choiceIndex].nextSceneId;
					return {
						...state,
						currentSceneId: nextSceneId,
						visitedScenes: [...state.visitedScenes, nextSceneId]
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
		}
	};
}

function get<T>(store: { subscribe: (fn: (value: T) => void) => () => void }): T {
	let value: T;
	const unsubscribe = store.subscribe(v => value = v);
	unsubscribe();
	return value!;
}

const scenes: Scene[] = [
	{
		id: 'intro',
		text: '🌲 You wake up in a mysterious forest. The morning mist swirls around ancient trees, and you hear strange sounds in the distance. Your memory is hazy, but you remember being on a hiking trip that went wrong. 😵‍💫',
		choices: [
			{ text: '🏞️ Follow the sound of running water', nextSceneId: 'river' },
			{ text: '🌳 Climb the tallest tree to get your bearings', nextSceneId: 'tree' },
			{ text: '🎒 Search your backpack for supplies', nextSceneId: 'backpack' }
		]
	},
	{
		id: 'river',
		text: '💧 You follow the sound and discover a crystal-clear stream flowing through the forest. As you approach, you notice footprints in the mud - both human 👣 and something else, much larger. 🐾',
		choices: [
			{ text: '👤 Follow the human footprints upstream', nextSceneId: 'village' },
			{ text: '🔍 Investigate the mysterious large tracks', nextSceneId: 'creature' },
			{ text: '🚰 Fill your water bottle and head back', nextSceneId: 'intro' }
		]
	},
	{
		id: 'tree',
		text: '🌳 You climb the towering oak tree, its bark rough against your hands. From the canopy, you can see smoke rising from what appears to be a village to the north 🏘️💨, and a dark cave entrance to the east. 🕳️',
		choices: [
			{ text: '🏘️ Head toward the village smoke', nextSceneId: 'village' },
			{ text: '🕳️ Explore the mysterious cave', nextSceneId: 'cave' },
			{ text: '🦅 Stay in the tree and wait for help', nextSceneId: 'rescue' }
		]
	},
	{
		id: 'backpack',
		text: '🎒 Rummaging through your backpack, you find a compass 🧭, some energy bars 🍫, a flashlight 🔦, and a map with strange markings 🗺️✨. The map shows this forest, but includes areas that seem... otherworldly.',
		choices: [
			{ text: '🧭 Follow the compass north', nextSceneId: 'village' },
			{ text: '🔮 Investigate the strange markings on the map', nextSceneId: 'portal' },
			{ text: '🍫 Eat an energy bar and rest', nextSceneId: 'rest' }
		]
	},
	{
		id: 'village',
		text: '🏘️ You arrive at a small village where the inhabitants eye you suspiciously 👀. They speak in hushed tones about "the awakening" ✨ and seem to recognize something about you. An elderly woman 👵 approaches and offers you shelter.',
		choices: [
			{ text: '🏠 Accept the woman\'s offer of shelter', nextSceneId: 'shelter' },
			{ text: '❓ Ask about "the awakening"', nextSceneId: 'prophecy' },
			{ text: '🏃‍♂️ Leave the village immediately', nextSceneId: 'flee' }
		]
	},
	{
		id: 'creature',
		text: '🐺 Following the large tracks leads you to a clearing where you encounter a magnificent creature - part wolf, part something ancient and magical ✨. It doesn\'t seem hostile, but watches you with intelligent eyes 👁️.',
		choices: [
			{ text: '🚶‍♂️ Approach the creature slowly', nextSceneId: 'ally' },
			{ text: '↩️ Back away carefully', nextSceneId: 'intro' },
			{ text: '🥜 Offer it some food from your backpack', nextSceneId: 'friendship' }
		]
	},
	{
		id: 'cave',
		text: '🕳️ The cave entrance looms before you, carved with ancient symbols that seem to glow faintly in the darkness ✨. As you step inside, you feel a strange energy ⚡ calling to you from the depths.',
		choices: [
			{ text: '🔦 Venture deeper into the cave', nextSceneId: 'treasure' },
			{ text: '📜 Study the glowing symbols', nextSceneId: 'magic' },
			{ text: '⚠️ Turn back - this feels dangerous', nextSceneId: 'intro' }
		]
	},
	{
		id: 'portal',
		text: '🌊 Following the map\'s strange markings, you discover a shimmering portal 🌀 hidden behind a waterfall. Through it, you glimpse another world entirely 🌌 - one that seems to be calling your name.',
		choices: [
			{ text: '🚪 Step through the portal', nextSceneId: 'otherworld' },
			{ text: '🤚 Touch the portal\'s edge cautiously', nextSceneId: 'power' },
			{ text: '📍 Mark the location and leave', nextSceneId: 'village' }
		]
	},
	{
		id: 'shelter',
		text: '🏠 The woman\'s home is filled with ancient books 📚 and mystical artifacts 🗺️. She reveals that you are the prophesied "Forest Walker" 🌲🚶‍♂️ - one who can travel between worlds and restore balance ⚖️. Your hiking trip was no accident. ✨',
		choices: [
			{ text: '✨ Accept your destiny as the Forest Walker', nextSceneId: 'hero' },
			{ text: '❓ Demand more answers about the prophecy', nextSceneId: 'truth' },
			{ text: '🙅‍♂️ Refuse to believe and try to leave', nextSceneId: 'denial' }
		]
	},
	{
		id: 'hero',
		text: '🎆 You embrace your role as the Forest Walker. The woman teaches you to harness your newfound abilities ⚡, and you set out to restore balance between the worlds 🌍✨. Your adventure has just begun, but you face it with courage and purpose! 💪🏆',
		choices: []
	},
	{
		id: 'otherworld',
		text: '🌌 You step through the portal and find yourself in a realm where magic flows like water 💧✨ and the very air shimmers with possibility 🌈. You realize this is where you truly belong 🏠❤️, and your old life seems like a distant dream. 😴',
		choices: []
	},
	{
		id: 'friendship',
		text: '🐺❤️ The creature accepts your offering and becomes your loyal companion. Together, you discover that the forest is a gateway between worlds 🌲🌀, and your animal friend is its guardian 🛡️. You have found your true calling as a protector of the mystical realm! ✨🏰',
		choices: []
	},
	{
		id: 'treasure',
		text: '💰 Deep in the cave, you find an ancient artifact 🏺 that fills you with power and knowledge ⚡🧠. You understand now that you were brought here for a purpose - to become the new guardian of this magical place! 🛡️✨',
		choices: []
	},
	{
		id: 'rescue',
		text: '🚁 After hours of waiting, a search helicopter finds you. You\'re rescued and returned to civilization 🏢, but you can never shake the feeling that you left something important behind in that mysterious forest. 🌲😔',
		choices: []
	},
	{
		id: 'rest',
		text: '😴 You rest and regain your strength, but as night falls 🌙, you realize the forest is far more dangerous than it seemed. Strange shadows move between the trees 👻🌲, and you must find shelter quickly or face unknown perils! ⚠️',
		choices: [
			{ text: '🏠 Find a safe place to hide', nextSceneId: 'village' },
			{ text: '⚔️ Stand your ground and face the shadows', nextSceneId: 'courage' }
		]
	},
	{
		id: 'courage',
		text: '💪 You stand firm as the shadows approach, and they reveal themselves to be forest spirits 👻✨. Impressed by your bravery, they accept you as one of their own and grant you the power to see the magic hidden in all things! 👁️✨🌍',
		choices: []
	}
];

function getSceneById(id: string): Scene | null {
	return scenes.find(scene => scene.id === id) || null;
}