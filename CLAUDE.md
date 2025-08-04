# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands use `pnpm` as the package manager:

- `pnpm dev` - Start development server (usually runs on localhost:4321, auto-finds available port)
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview built site locally
- `pnpm astro add <integration>` - Add Astro integrations (e.g., `pnpm astro add svelte`)

## What This Game Is

**Forest Friends** is a fun quiz game for kids. Kids pick an animal, answer 4 quiz questions, and get a special gift. The game looks like a computer terminal and teaches cool animal facts.

### Tech Used
- **Astro v5**: Makes the website
- **Svelte v5**: Makes the game parts work
- **TailwindCSS v4**: Makes it look good
- **TypeScript**: Helps catch bugs
- **Web Audio API**: Makes quiz sounds

### How It Works

**Game Flow**: Simple steps:
- Pick an animal → Answer 4 quiz questions → Get a gift
- Each animal teaches different cool facts
- Quiz answers get mixed up so kids can't just remember spots

**Game Memory**: Saves where you are in `gameStore.ts`:
- What scene you're on
- What scenes you visited
- Quiz info

**Main Files**: 
- `Terminal.svelte` - Main game screen with sounds and mixed quiz answers
- `LoadingText.svelte` - Makes text appear slowly like typing
- `index.astro` - The web page

**Quiz Sounds**: Three different sounds in `audio.ts`:
- 🎊 **Super Happy** (5 notes): When you finish all 4 quizzes
- 🎉 **Happy** (3 notes): When you get a quiz right
- ♪ **Simple** (2 notes): For everything else

### Current Game Content

**Available Animals**:
- 🦉 **Oliver the Owl** - 4 quizzes about night vision, head rotation, silent flight, asymmetrical ears
- 🐱 **Whiskers the Cat** - 4 quizzes about balance/tails, paw pads, night vision, purring healing

**Quiz Topics by Animal**:
- **Owl Facts**: Night vision, 270° head rotation, silent feathers, ear positioning
- **Cat Facts**: Tail balance, soft paw pads, pupil dilation, purring vibrations

### How Files Work Together

The game uses these tools to work:
- Svelte makes game parts move in `astro.config.mjs`
- TailwindCSS makes it look nice
- Parts load when page opens

### Where Files Go

```
src/
├── components/     # Game parts (Terminal, LoadingText)
├── pages/         # Web pages (just index.astro)
├── stores/        # Game memory
└── utils/         # Sound maker and helpers
```

### Game Rules

**Must Do**: Pick Animal → Answer 4 Quizzes → Get Gift

Every animal works the same way:

1. **Meet Animal**: Say hello to your animal friend
2. **Quiz Time**: Answer 4 questions about cool animal facts
3. **Mixed Answers**: Answers move around so you can't cheat  
4. **Fun Sounds**: Different sounds for right/wrong/winning
5. **Get Gift**: Win a special prize when done

### How Answer Mixing Works

**Where**: `shuffleArray()` function in `Terminal.svelte`
**What**: Only quiz answers get mixed up, menu choices stay the same
**When**: Scenes with `quiz_` in the name (but not `_correct`/`_wrong`)
**Keep Same**: Hint (🤔) and back (🔙) buttons stay at bottom

### Sound System

**Three Different Sounds**:
```typescript
// Super happy sound when you finish all 4 quizzes
rewardScenes: ["owl_reward", "cat_reward"] → "🎊 AMAZING! ALL DONE! 🎊"

// Happy sound for right answers  
correctScenes: ["*_quiz_*_correct"] → "🎉 CORRECT!"

// Simple sound for everything else
allOtherChoices → "♪"
```

**How Sounds Work**: `src/utils/audio.ts` makes sounds
- Different notes for different feelings
- Happy, excited, or simple sounds
- No sound files needed - made by computer

### Gift Collection

**How Gifts Save**: Uses computer memory with key `"forestFriendsItems"`
**How Gifts Look**: Your gifts look bright, missing gifts look dim
**Gifts You Can Get**:
- 🪶 **Feather of Wisdom** - Oliver the Owl's Gift
- ✨ **Golden Whisker** - Whiskers the Cat's Gift

### How to Add New Animals

**Steps to Make New Animal**:
1. Make hello scene: `[animal]_intro`
2. Make 4 quiz scenes: `[animal]_quiz_1` through `[animal]_quiz_4`
3. Make right/wrong scenes for each quiz: `[animal]_quiz_X_correct/wrong`
4. Make gift scene: `[animal]_reward` with gold color
5. Add gift to `ITEMS` list in `Terminal.svelte`
6. Add save code for `[animal]_reward` scene
7. Add new animal to main menu

**Right Answer Format**:
```typescript
{
  id: "[animal]_quiz_X_correct",
  text: "🎉 'Right!' says [Animal]! '[Why this answer is right]' ✨ Quiz X Done! Ready for Quiz Y? 📚",
  choices: [{ text: "📚 Go to Quiz Y", nextSceneId: "[animal]_quiz_Y" }],
}
```

**Gift Scene Format**:
```typescript
{
  id: "[animal]_reward", 
  text: "<div class='text-amber-300'>🎉 'Great job!' [Animal story + gift info] 🎁✨\n\n*You got: [emoji] [Gift Name]!*</div>",
  choices: [
    { text: "🏠 Main Menu", nextSceneId: "welcome" },
    { text: "📚 Pick Another Animal", nextSceneId: "intro" }
  ],
}
```

**Quiz Writing Rules**:
- Use real animal facts that kids can understand
- Tell kids why answers are right or wrong
- Be nice when kids get wrong answers and give hints
- Make quizzes not too hard for kids
- Make each animal friend fun and friendly