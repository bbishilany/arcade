const WORD_LIST = [
    // CHARACTERS - Easy
    { word: 'ELEVEN', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'MIKE', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'WILL', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'DUSTIN', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'MAX', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'JOYCE', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'STEVE', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'NANCY', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'ROBIN', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'EDDIE', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'VECNA', category: 'CHARACTER', difficulty: 'easy' },
    { word: 'BARB', category: 'CHARACTER', difficulty: 'easy' },
    // CHARACTERS - Medium
    { word: 'HOPPER', category: 'CHARACTER', difficulty: 'medium' },
    { word: 'JONATHAN', category: 'CHARACTER', difficulty: 'medium' },
    { word: 'MURRAY', category: 'CHARACTER', difficulty: 'medium' },
    { word: 'BRENNER', category: 'CHARACTER', difficulty: 'medium' },
    { word: 'ARGYLE', category: 'CHARACTER', difficulty: 'medium' },
    // CHARACTERS - Hard
    { word: 'BOB NEWBY', category: 'CHARACTER', difficulty: 'hard' },

    // PLACES - Easy
    { word: 'THE LAB', category: 'PLACE', difficulty: 'easy' },
    // PLACES - Medium
    { word: 'HAWKINS', category: 'PLACE', difficulty: 'medium' },
    { word: 'STARCOURT', category: 'PLACE', difficulty: 'medium' },
    { word: 'SKULL ROCK', category: 'PLACE', difficulty: 'medium' },
    { word: 'RUSSIA', category: 'PLACE', difficulty: 'medium' },
    { word: 'THE VOID', category: 'PLACE', difficulty: 'medium' },
    // PLACES - Hard
    { word: 'UPSIDE DOWN', category: 'PLACE', difficulty: 'hard' },
    { word: 'BYERS HOUSE', category: 'PLACE', difficulty: 'hard' },
    { word: 'CREEL HOUSE', category: 'PLACE', difficulty: 'hard' },
    { word: 'LOVERS LAKE', category: 'PLACE', difficulty: 'hard' },
    { word: 'RINK O MANIA', category: 'PLACE', difficulty: 'hard' },
    { word: 'CAMP KNOW WHERE', category: 'PLACE', difficulty: 'hard' },

    // CREATURES - Easy
    { word: 'DART', category: 'CREATURE', difficulty: 'easy' },
    // CREATURES - Medium
    { word: 'DEMODOG', category: 'CREATURE', difficulty: 'medium' },
    { word: 'DEMOBAT', category: 'CREATURE', difficulty: 'medium' },
    { word: 'THE SPIDER', category: 'CREATURE', difficulty: 'medium' },
    // CREATURES - Hard
    { word: 'DEMOGORGON', category: 'CREATURE', difficulty: 'hard' },
    { word: 'MIND FLAYER', category: 'CREATURE', difficulty: 'hard' },

    // THINGS - Easy
    { word: 'GATE', category: 'THING', difficulty: 'easy' },
    // THINGS - Medium
    { word: 'SUPERCOM', category: 'THING', difficulty: 'medium' },
    { word: 'FIREBALL', category: 'THING', difficulty: 'medium' },
    { word: 'NOSEBLEED', category: 'THING', difficulty: 'medium' },
    // THINGS - Hard
    { word: 'WALKIE TALKIE', category: 'THING', difficulty: 'hard' },
    { word: 'EGGO WAFFLES', category: 'THING', difficulty: 'hard' },
    { word: 'SCOOPS AHOY', category: 'THING', difficulty: 'hard' },
    { word: 'HELLFIRE CLUB', category: 'THING', difficulty: 'hard' },
    { word: 'RAINBOW ROOM', category: 'THING', difficulty: 'hard' },
    { word: 'DUNGEONS AND DRAGONS', category: 'THING', difficulty: 'hard' },

    // QUOTES - Easy
    { word: 'RUN', category: 'QUOTE', difficulty: 'easy' },
    // QUOTES - Medium
    { word: 'BITCHIN', category: 'QUOTE', difficulty: 'medium' },
    // QUOTES - Hard
    { word: 'FRIENDS DONT LIE', category: 'QUOTE', difficulty: 'hard' },
    { word: 'MOUTH BREATHER', category: 'QUOTE', difficulty: 'hard' },
    { word: 'WILL IS ALIVE', category: 'QUOTE', difficulty: 'hard' },
    { word: 'AHOY LADIES', category: 'QUOTE', difficulty: 'hard' },
];

let recentWords = [];

export function getRandomWord(difficultyPool) {
    let pool;
    if (difficultyPool === 'easy') {
        pool = WORD_LIST.filter(w => w.difficulty === 'easy');
    } else if (difficultyPool === 'medium') {
        pool = WORD_LIST.filter(w => w.difficulty === 'easy' || w.difficulty === 'medium');
    } else {
        pool = [...WORD_LIST]; // hard = all words
    }

    // Avoid recent repeats
    const available = pool.filter(w => !recentWords.includes(w.word));
    const selection = available.length > 0 ? available : pool;

    const entry = selection[Math.floor(Math.random() * selection.length)];

    // Track recent words (keep last 10)
    recentWords.push(entry.word);
    if (recentWords.length > 10) recentWords.shift();

    return entry;
}

export function getUniqueLetters(word) {
    return new Set(word.replace(/[^A-Z]/g, '').split(''));
}
