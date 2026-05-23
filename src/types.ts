/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Stories' | 'Poems' | 'Fragments of Thought' | 'Midnight Thoughts' | 'Letters' | 'Fantasy Lore';

export interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Category;
  coverImageURL?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  bookmarks: number;
  views: number;
  isDraft: boolean;
  authorSig?: string; // e.g. "The Moss Keeper"
  readTime: string; // e.g. "3 min read"
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: string;
  isWhisper: boolean; // special fairycore aesthetic comments
}

export interface WhisperQuote {
  id: string;
  text: string;
  source: string;
}
