/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Bookmark, Heart, Share2, ArrowLeft, ArrowRight, Sun, Moon, Sparkles, Send, HelpCircle
} from 'lucide-react';
import { Post, Comment } from '../types';

interface PostReaderProps {
  post: Post;
  onClose: () => void;
  onNavigatePost: (postId: string) => void;
  allPosts: Post[];
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleHeart: (id: string) => void;
  comments: Comment[];
  onAddComment: (postId: string, author: string, content: string, isWhisper: boolean) => void;
}

export default function PostReader({
  post,
  onClose,
  onNavigatePost,
  allPosts,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleHeart,
  comments,
  onAddComment,
}: PostReaderProps) {
  // Reading mode theme: 'parchment' (default warm light) or 'forest-night' (dimmed dark)
  const [theme, setTheme] = useState<'parchment' | 'night'>('parchment');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  // Comments input form
  const [author, setAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isWhisperChoice, setIsWhisperChoice] = useState(true);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Filter out drafts to find valid next/prev posts
  const publicPosts = allPosts.filter(p => !p.isDraft);
  const currentIndex = publicPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? publicPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < publicPosts.length - 1 ? publicPosts[currentIndex + 1] : null;

  // Track scroll progress inside reader container
  useEffect(() => {
    const handleScroll = () => {
      const el = readerContainerRef.current;
      if (!el) return;
      
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = (el.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    };

    const el = readerContainerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [post.id]);

  // Handle Share copy link mock or real API
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }).catch(() => {
      // Fallback
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    onAddComment(
      post.id,
      author.trim() || 'A Quiet Traveler',
      commentText.trim(),
      isWhisperChoice
    );
    setCommentText('');
    // Keep author saved for convenience!
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-3 sm:p-5"
    >
      {/* Scroll indicator bar at the very top of frame */}
      <div className="absolute top-0 left-0 w-full h-1 bg-stone-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div
        ref={readerContainerRef}
        className={`relative w-full max-w-4xl h-[92vh] rounded-2xl overflow-y-auto shadow-2xl transition-all duration-500 flex flex-col ${
          theme === 'parchment' 
            ? 'bg-parchment-100 text-stone-800 border-2 border-parchment-300' 
            : 'bg-stone-900 border-2 border-stone-850 text-stone-200'
        }`}
      >
        {/* Header navigation bar */}
        <div className={`sticky top-0 z-10 p-4 flex items-center justify-between border-b transition-colors duration-500 ${
          theme === 'parchment' ? 'bg-parchment-200/90 border-parchment-300' : 'bg-stone-900/95 border-stone-800'
        } backdrop-blur-md`}>
          
          <button
            id="reader-back-btn"
            onClick={onClose}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-serif transition-colors text-sm ${
              theme === 'parchment' 
                ? 'text-stone-700 hover:bg-stone-800/5 hover:text-stone-950' 
                : 'text-stone-300 hover:bg-stone-100/5 hover:text-stone-100'
            }`}
          >
            <X size={15} />
            <span>Return to Shelf</span>
          </button>

          {/* Quick theme toggler & indicators */}
          <div className="flex items-center space-x-3">
            {/* Reading theme togglers */}
            <div className="flex bg-stone-950/10 p-1 rounded-lg border border-stone-400/20">
              <button
                id="reader-theme-parchment"
                onClick={() => setTheme('parchment')}
                className={`p-1.5 rounded transition ${
                  theme === 'parchment' 
                    ? 'bg-white text-emerald-800 shadow-sm' 
                    : 'text-stone-450 hover:text-stone-200'
                }`}
                title="Parchment Day Mode"
              >
                <Sun size={14} />
              </button>
              <button
                id="reader-theme-night"
                onClick={() => setTheme('night')}
                className={`p-1.5 rounded transition ${
                  theme === 'night' 
                    ? 'bg-stone-800 text-amber-300 shadow-sm' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                title="Enchanted Night Mode"
              >
                <Moon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Parchment Story Body Content */}
        <div className="flex-grow p-6 sm:p-12 md:px-16 md:py-14 max-w-2xl mx-auto w-full flex flex-col">
          {/* Category Stamp */}
          <div className="text-center mb-4">
            <span className={`inline-block border px-3 py-0.5 rounded-full font-serif text-[11px] uppercase tracking-widest ${
              theme === 'parchment' 
                ? 'border-forest-600/30 text-forest-700' 
                : 'border-amber-500/20 text-amber-300'
            }`}>
              {post.category}
            </span>
          </div>

          {/* Master Literary Heading */}
          <h1 className={`font-display text-3xl sm:text-4.5xl font-semibold text-center leading-tight mb-3 ${
            theme === 'parchment' ? 'text-stone-900' : 'text-stone-100'
          }`}>
            {post.title}
          </h1>

          {/* Signature Tag */}
          <div className={`font-serif italic text-xs text-center mb-8 ${
            theme === 'parchment' ? 'text-stone-500' : 'text-stone-400'
          }`}>
            <span>Composed by </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{post.authorSig || 'The Forest Archivist'}</span>
            <span> • {post.readTime}</span>
          </div>

          {/* Featured Cover Illustration */}
          {post.coverImageURL && (
            <div className="mb-8 rounded-xl overflow-hidden relative group max-h-[280px]">
              <img
                src={post.coverImageURL}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover max-h-[280px] filter saturate-[0.85] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>
          )}

          {/* Actual Narrative text area with wide typography spacing */}
          <article 
            className={`font-body text-lg leading-relaxed space-y-6 ${
              theme === 'parchment' ? 'text-stone-900' : 'text-stone-200'
            }`}
          >
            {post.content.startsWith('<') ? (
              // If we have HTML from a rich-text / formatted editor
              <div 
                className="prose prose-stone max-w-none prose-p:mb-5 prose-p:leading-relaxed prose-h3:font-display prose-h3:text-xl prose-h3:font-medium prose-h3:mt-6 prose-h3:text-emerald-800 dark:prose-h3:text-amber-300"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            ) : (
              // Raw string fallback formatted by line endings
              post.content.split('\n\n').map((para, i) => (
                <p key={i} className="whitespace-pre-line mb-4">
                  {para}
                </p>
              ))
            )}
          </article>

          {/* Interaction panel: hearts, bookmarks, likes count */}
          <div className={`mt-12 pt-6 border-t flex flex-wrap items-center justify-between gap-4 ${
            theme === 'parchment' ? 'border-stone-200' : 'border-stone-800'
          }`}>
            <div className="flex items-center space-x-2.5">
              <button
                id="reader-heart-btn"
                onClick={() => onToggleHeart(post.id)}
                className={`py-2 px-4 rounded-full flex items-center space-x-2 transition ${
                  isLiked 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 font-medium' 
                    : 'border hover:bg-stone-500/5 hover:text-rose-400 text-stone-500 dark:text-stone-400 border-stone-400/20'
                }`}
                title={isLiked ? 'Heart Unclicked' : 'Pour Sweet Blessings'}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'scale-110 animate-pulse' : ''} />
                <span className="font-mono text-xs">{post.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                id="reader-bookmark-btn"
                onClick={() => onToggleBookmark(post.id)}
                className={`py-2 px-4 rounded-full flex items-center space-x-2 transition ${
                  isBookmarked 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                    : 'border hover:bg-stone-500/5 hover:text-amber-400 text-stone-500 dark:text-stone-400 border-stone-400/20'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Add to reading chest'}
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                <span className="font-serif text-xs">Archive Keep</span>
              </button>
            </div>

            <button
              id="reader-share-btn"
              onClick={handleShare}
              className={`py-2 px-4 border rounded-full flex items-center space-x-2 transition ${
                shareSuccess 
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  : 'hover:bg-stone-500/5 text-stone-500 dark:text-stone-400 border-stone-400/20'
              }`}
            >
              <Share2 size={16} className={shareSuccess ? 'scale-90' : ''} />
              <span className="font-serif text-xs">{shareSuccess ? 'Spell Cast! Copied link' : 'Whisper to others (Share)'}</span>
            </button>
          </div>

          {/* Prev / Next navigation of scrolls */}
          <div className={`mt-8 py-5 border-y flex items-center justify-between gap-4 ${
            theme === 'parchment' ? 'border-stone-200' : 'border-stone-800'
          }`}>
            <div>
              {prevPost ? (
                <button
                  id="reader-prev-scroll-btn"
                  onClick={() => onNavigatePost(prevPost.id)}
                  className="text-left group"
                >
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#a8a29e] group-hover:text-amber-500 flex items-center space-x-1 transition-colors">
                    <ArrowLeft size={10} />
                    <span>Previous Scroll</span>
                  </div>
                  <div className={`font-serif text-sm mt-0.5 max-w-[150px] truncate ${
                    theme === 'parchment' ? 'text-stone-800' : 'text-stone-300'
                  }`}>
                    {prevPost.title}
                  </div>
                </button>
              ) : (
                <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block opacity-40">First Elder Scroll</span>
              )}
            </div>

            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block"></div>

            <div className="text-right">
              {nextPost ? (
                <button
                  id="reader-next-scroll-btn"
                  onClick={() => onNavigatePost(nextPost.id)}
                  className="text-right group"
                >
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#a8a29e] group-hover:text-amber-500 flex items-center justify-end space-x-1 transition-colors">
                    <span>Next Scroll</span>
                    <ArrowRight size={10} />
                  </div>
                  <div className={`font-serif text-sm mt-0.5 max-w-[150px] truncate ${
                    theme === 'parchment' ? 'text-stone-800' : 'text-stone-300'
                  }`}>
                    {nextPost.title}
                  </div>
                </button>
              ) : (
                <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block opacity-40 text-right">Deepest Lore Reached</span>
              )}
            </div>
          </div>

          {/* Cozy integrated aesthetic comment system of the woods */}
          <div className="mt-14 space-y-6">
            <h3 className={`font-fantasy text-base tracking-wider text-center uppercase ${
              theme === 'parchment' ? 'text-emerald-900' : 'text-amber-300'
            }`}>
              ✧ Whispers on the Wind ✧
            </h3>
            <p className={`text-center font-serif text-xs italic ${
              theme === 'parchment' ? 'text-stone-500' : 'text-stone-400'
            }`}>
              Leave a quiet thought, letters, or dream carvings for future wanderers to stumble upon.
            </p>

            {/* Comments List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mt-4">
              <AnimatePresence initial={false}>
                {comments.filter(c => c.postId === post.id).length === 0 ? (
                  <div className="text-center py-6 font-serif italic text-stone-400 text-sm">
                    No travelers have left inscriptions yet. Be the first to carve a message.
                  </div>
                ) : (
                  comments
                    .filter(c => c.postId === post.id)
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-xl p-4 border transition-all ${
                          item.isWhisper 
                            ? theme === 'parchment'
                              ? 'bg-[#eae4cc]/40 border-[#d0c4a4]/40 text-stone-800'
                              : 'bg-stone-800/60 border-amber-900/40 text-stone-200'
                            : theme === 'parchment'
                              ? 'bg-[#ffffff]/50 border-stone-200 text-stone-800'
                              : 'bg-stone-900/40 border-stone-800 text-stone-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 bg-stone-500/5 px-2 py-0.5 rounded-md">
                          <span className="font-serif text-xs font-semibold text-emerald-800 dark:text-amber-200 flex items-center space-x-1">
                            {item.isWhisper && <Sparkles size={10} className="text-amber-500 mr-1 animate-pulse" />}
                            <span>{item.author}</span>
                          </span>
                          <span className="font-mono text-[9px] text-stone-400 tracking-wider">
                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="font-serif text-sm leading-relaxed whitespace-pre-line pl-1.5 pt-0.5">
                          {item.content}
                        </p>
                      </motion.div>
                    ))
                )}
              </AnimatePresence>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="flex flex-col space-y-3 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  id="comment-author-input"
                  type="text"
                  placeholder="Your woodland pseudonym (e.g., Elder Bud)..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={40}
                  className={`px-3.5 py-2 rounded-lg text-sm font-serif border focus:outline-none focus:ring-1 ${
                    theme === 'parchment' 
                      ? 'bg-white text-stone-950 border-stone-300 focus:ring-emerald-700/55' 
                      : 'bg-stone-950 text-stone-200 border-stone-850 focus:ring-amber-500/50'
                  }`}
                />
                
                {/* Is Whisper style checkbox */}
                <div className="flex items-center space-x-2.5 px-1 justify-start sm:justify-end">
                  <label htmlFor="is-whisper-toggle" className="font-serif text-xs text-stone-400 flex items-center space-x-1 cursor-pointer select-none">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>Lace with forest dust (Magical style)</span>
                  </label>
                  <input
                    id="is-whisper-toggle"
                    type="checkbox"
                    checked={isWhisperChoice}
                    onChange={(e) => setIsWhisperChoice(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-stone-900 border-stone-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="relative">
                <textarea
                  id="comment-textbox"
                  placeholder="Type your message of peace, lore, or poetic greeting..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  maxLength={600}
                  required
                  className={`w-full p-3.5 rounded-lg text-sm font-serif border focus:outline-none focus:ring-1 resize-none ${
                    theme === 'parchment' 
                      ? 'bg-white text-stone-950 border-stone-300 focus:ring-emerald-700/55' 
                      : 'bg-stone-950 text-stone-200 border-stone-850 focus:ring-amber-500/50'
                  }`}
                />
                
                <button
                  id="comment-submit-btn"
                  type="submit"
                  className={`absolute right-3.5 bottom-3.5 p-1.5 rounded-full transition-all flex items-center text-xs space-x-1 ${
                    commentText.trim()
                      ? 'bg-emerald-700 hover:bg-emerald-600 dark:bg-amber-500 dark:hover:bg-amber-400 text-stone-50 cursor-pointer shadow-sm'
                      : 'bg-stone-400/20 text-stone-400/50 cursor-not-allowed'
                  }`}
                  disabled={!commentText.trim()}
                  title="Inscribe on wind"
                >
                  <Send size={12} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
