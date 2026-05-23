/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, WhisperQuote } from '../types';

export const SEED_POSTS: Post[] = [
  {
    id: 'forest-1',
    title: 'The Song of the Silver Birch',
    summary: 'A traditional woodland song of a guardian birch tree that remembers the first magic.',
    category: 'Poems',
    content: `Beneath the canopy of the older sky,
She stands in white and silver, quiet-eyed.
Her roots are deep in memories of stone,
Where ancient brooks in heavy rhythm run.

The wind arrives to comb her leafy hair,
And steals the yellow secrets hidden there.
\"Ah, stay,\" she whispers to the passing bird,
\"And sing the song the ancient rivers heard.\"

We carve our prayers upon her fallen bark,
A glowing talisman against the quiet dark.
For she remembers when the first star fell,
And bound the forest in a dreaming spell.`,
    coverImageURL: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-04-12T14:32:00Z',
    updatedAt: '2026-04-12T14:32:00Z',
    likes: 84,
    bookmarks: 32,
    views: 312,
    isDraft: false,
    authorSig: 'The Moss Keeper',
    readTime: '1 min read'
  },
  {
    id: 'forest-2',
    title: 'The Great Glade: A Field Guide to Pixie Rings',
    summary: 'A scholar\'s record of the mushroom boundaries of the Great Glade and the rules for crossing.',
    category: 'Fantasy Lore',
    content: `<p>In the quiet spaces of the Whispering Woods, where the moss grows so thick it swallows the sound of heavy boots, one may stumble upon a perfect circle of pale mushrooms. These are not mere fungi; they are the <strong>Círculos de Ensuño</strong>, commonly known as Pixie Rings.</p>

<p>According to the elder sprites, these rings mark the thresholds of local courts. Here are the cardinal rules for the curious traveler:</p>

<h3>1. Do Not Step Within</h3>
<p>To step inside an active ring during a full moon invites the enchantment of perpetual dance. Time flows differently inside. A single hour of merriment may translate into seventy years in the world of men.</p>

<h3>2. Payment of the Pewter Coin</h3>
<p>If you must cross near a ring, leave a token on the largest mushroom cap. A small button of brass, a splash of sweet elderberry wine, or a shiny copper penny will ensure the local guardians do not tangle your bootlaces or turn your tea sour.</p>

<h3>3. Of the Blue Lilies</h3>
<p>Should the ring be flanked by blue wood-lilies, it signifies the presence of the Winter Court. Their trickery is sharper, cold like morning frost, but their blessings can heal wounds of deep grief.</p>`,
    coverImageURL: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-05-01T09:15:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
    likes: 120,
    bookmarks: 56,
    views: 450,
    isDraft: false,
    authorSig: 'Scholar Rowan',
    readTime: '4 min read'
  },
  {
    id: 'forest-3',
    title: 'A Letter Found Inside a Hollow Elm',
    summary: 'An unaddressed message written on dried birch parchment, sealed with green clover wax.',
    category: 'Letters',
    content: `Dearest Wanderer,

If your fingers have found this hollow, then my spell has dissolved, and the key is yours to keep. I wrote this while the fog was still rising from the marsh, thick with the scent of wild garlic and wet earth.

Do not look for me where you saw me last. The elderberries are ripe now, and the birds are turning south; I must go where the warmth lingers. I have packed my small tin kettle, three dried mushrooms, and the silver needle you lost by the brook.

I left a jar of preserved honey hidden under the mossy root of the central hazelnut tree. Eat it when your spirits are damp. It is spiced with summer clover and the sound of dry grasshoppers.

Do not fret for the garden. The snails have promised to leave the cabbage leaves alone in exchange for beer-leavings, and the field mice have agreed to watch the chimney stack.

Keep your wood-fires small and sweet-scented.

Yours under the willow boughs,
— M.`,
    coverImageURL: 'https://images.unsplash.com/photo-1510253687831-0f982d7862fc?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-05-18T18:40:00Z',
    updatedAt: '2026-05-18T18:40:00Z',
    likes: 198,
    bookmarks: 94,
    views: 580,
    isDraft: false,
    authorSig: 'M. of the Willow',
    readTime: '3 min read'
  },
  {
    id: 'forest-4',
    title: 'The Lantern-Maker\'s Apprenticeship',
    summary: 'A story of finding light in the dark forests, and the secret bargain of the willow-o\'-the-wisps.',
    category: 'Stories',
    content: `<p>Long before the oil lanterns of the town were forged, there lived a man named Elion who crafted cages for light itself. He did not use steel or iron; he wove his lanterns from living honeysuckle vines and sealed them with dew drops scraped from midnight ferns.</p>

<p>Every autumn, when the cold wind began to bite, Elion would walk into the deepest peat-bogs. He did not carry a weapon, only a small wood-pipe and a bag of salted pumpkin seeds. He would sit on an old log and play a low, lazy tune until the glowing marsh-lights—the Willis—began to rise from the dark water.</p>

<blockquote>"An hour of your light, little sparks," Elion would sing. "An hour of your warmth inside my green lanterns, and in exchange, I will tell you the names of the stars that do not shine on the swamp."</blockquote>

<p>One evening, a tiny amber spark rose. It did not dance like the others; it was pale and moved with a heavy, tired rhythm. It settled on his pipe, its heat like a tiny warm pebble.
'Why are you so faint, little light?' Elion asked.</p>

<p>'The townspeople have built great chimneys,' the spark whispered. 'Their smoke is greasy and covers the night. We cannot see our sisters in the sky, and we are losing our names.'</p>

<p>Elion took the spark and placed it gently inside his honeysuckle cage. That night, he did not sell his lantern. He climbed the tallest oak at the peak of the forest and hung the cage from the highest branch, far above the reach of the town's gray chimneys. The spark grew so bright that the birds mistook it for a second morning, and for three days, the whole woods sang in the golden glow of a saved name.</p>`,
    coverImageURL: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-05-20T22:11:00Z',
    updatedAt: '2026-05-21T02:30:00Z',
    likes: 245,
    bookmarks: 110,
    views: 890,
    isDraft: false,
    authorSig: 'The Elder Bard',
    readTime: '6 min read'
  },
  {
    id: 'forest-5',
    title: 'Thoughts on the Silence of Wild Grapes',
    summary: 'Intimate reflections on the quiet patience of forest growth and human restlessness during the witching hour.',
    category: 'Midnight Thoughts',
    content: `It is 2:00 in the morning, and the forest is breathing in a slow, humid rhythm. 

I sat by the window watching the wild grapes climb the porch trellis. They do not hurry. If they have a voice, it is written in the tendrils they twist around the wire—small, delicate green spirals that hold on with the strength of a quiet vow.

Why are we so frantic to be seen?

The oak does not write pamphlets about its stature. The brook does not seek a certificate for its purity. They simply exist, beautiful because they are faithful to their design. 

Tomorrow, I will put away my ink-wells earlier. I will walk into the damp grass before the slippers of the sun are dry, and I will sit with the wild grapes. Perhaps, if I am very quiet, they will teach me how to cling without crushing, and how to grow in the dark.`,
    coverImageURL: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-05-21T02:05:00Z',
    updatedAt: '2026-05-21T02:05:00Z',
    likes: 72,
    bookmarks: 28,
    views: 204,
    isDraft: false,
    authorSig: 'The Moss Keeper',
    readTime: '2 min read'
  },
  {
    id: 'forest-6',
    title: 'Fragments of Soft Light',
    summary: 'A collection of brief, comforting micro-thoughts written during the spring solstice.',
    category: 'Fragments of Thought',
    content: `<p>• The moss does not ask for permission to blanket the stone. It simply grows, a quiet green forgiveness over years of jagged edges.</p>

<p>• In the heart of every acorn is a forest sleeping, dreaming of centuries of wind.</p>

<p>• Speak to the trees. They do not gossip. They digest your words and turn them into air.</p>

<p>• If you feel forgotten, remember that the dew drop finds the smallest blade of grass just as surely as it finds the lotus flower.</p>`,
    coverImageURL: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-05-21T10:00:00Z',
    updatedAt: '2026-05-21T10:00:00Z',
    likes: 95,
    bookmarks: 41,
    views: 289,
    isDraft: false,
    authorSig: 'The Moss Keeper',
    readTime: '1 min read'
  }
];

export const WHISPER_QUOTES: WhisperQuote[] = [
  { id: 'q1', text: '“Not all those who wander are lost, but some are just gathering mushrooms.”', source: 'Ancient Herb-lore' },
  { id: 'q2', text: '“The forest is not silent; it just speaks in a language too slow for human ears.”', source: 'The Moss Keeper' },
  { id: 'q3', text: '“If you look closely at the dew on a spiderweb, you can see the maps of yesterday’s dreams.”', source: 'A Book of Unwritten Lore' },
  { id: 'q4', text: '“The fireflies dance because they have forgotten that the dark is supposed to be frightening.”', source: 'Elion, Lantern Maker' },
  { id: 'q5', text: '“Patience is the root of the oak; hope is the first green bud of the spring.”', source: 'Folklore Tapestry' },
  { id: 'q6', text: '“May your tea be sweet, your fire snug, and your heart as deep as the roots of the oldest elm.”', source: 'A Hearth Blessing' },
  { id: 'q7', text: '“Whisper your troubles to the bark of the silver birch. She has carried heavier burdens and still stands tall.”', source: 'Rowan’s Field Notes' },
  { id: 'q8', text: '“To love a wild thing is to know that it might fly into the green canopy and never look back.”', source: 'Fragment from a forgotten letter' },
  { id: 'q9', text: '“A house made of reeds can weather the storm if it learns to dance with the wind.”', source: 'Elder Reed-weaver' }
];

export const SUGGESTED_COVER_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1000&auto=format&fit=crop', label: 'Silver Birch Forest' },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop', label: 'Enchanted Green Woods' },
  { url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1000&auto=format&fit=crop', label: 'Cozy Lantern Light' },
  { url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop', label: 'Sunlight filtering through Oak' },
  { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000&auto=format&fit=crop', label: 'Magical Old Oak Tree' },
  { url: 'https://images.unsplash.com/photo-1510253687831-0f982d7862fc?q=80&w=1000&auto=format&fit=crop', label: 'Parchment and Herbs' }
];
