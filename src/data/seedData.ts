/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, WhisperQuote } from '../types';

export const SEED_POSTS: Post[] = [];

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
