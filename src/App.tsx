/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Heart, Bookmark, Eye, Feather, Key, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { Post, Comment, Category } from './types';
import { SEED_POSTS } from './data/seedData';
import ParticlesBg from './components/ParticlesBg';
import AudioPlayer from './components/AudioPlayer';
import QuoteReveal from './components/QuoteReveal';
import PostReader from './components/PostReader';
import KeeperDesk from './components/KeeperDesk';

const LOR_SHELFS: Category[] = ['Stories', 'Poems', 'Fragments of Thought', 'Midnight Thoughts', 'Letters', 'Fantasy Lore'];

export default function App() {
  // 1. Core State
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  
  // 2. Navigation / Filtering State
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isKeeperDeskOpen, setIsKeeperDeskOpen] = useState(false);

  // 3. Setup and seed initial data on mount
  useEffect(() => {
    // Check if initial posts exist in localStorage
    const savedPostsStr = localStorage.getItem('whispering_forest_posts');
    if (savedPostsStr) {
      try {
        setPosts(JSON.parse(savedPostsStr));
      } catch (e) {
        setPosts(SEED_POSTS);
      }
    } else {
      setPosts(SEED_POSTS);
      localStorage.setItem('whispering_forest_posts', JSON.stringify(SEED_POSTS));
    }

    // Check if initial comments exist
    const savedCommentsStr = localStorage.getItem('whispering_forest_comments');
    if (savedCommentsStr) {
      try {
        setComments(JSON.parse(savedCommentsStr));
      } catch (e) {
        setComments(getInitialComments());
      }
    } else {
      const startingComments = getInitialComments();
      setComments(startingComments);
      localStorage.setItem('whispering_forest_comments', JSON.stringify(startingComments));
    }

    // Check personal bookmarks
    const savedBookmarksStr = localStorage.getItem('whispering_forest_bookmarks');
    if (savedBookmarksStr) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarksStr));
      } catch (e) {}
    }

    // Check personal likes
    const savedLikesStr = localStorage.getItem('whispering_forest_likes');
    if (savedLikesStr) {
      try {
        setLikedIds(JSON.parse(savedLikesStr));
      } catch (e) {}
    }
  }, []);

  // Standard initial comments for realism
  const getInitialComments = (): Comment[] => {
    return [
      {
        id: 'comm-1',
        postId: 'forest-4',
        author: 'A Wood Wanderer',
        content: 'This lantern tale feels so soothing. I can almost smell the dried honeysuckle and hear the crackling birch wood. Thank you for recording this.',
        timestamp: '2026-05-21T03:15:00Z',
        isWhisper: true
      },
      {
        id: 'comm-2',
        postId: 'forest-1',
        author: 'Nymph_Rowan',
        content: 'The rhythm here is lovely, it flows just like leaf-melt in early spring.',
        timestamp: '2026-04-13T09:40:00Z',
        isWhisper: false
      }
    ];
  };

  // Helper to persist posts
  const savePostsToStorage = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('whispering_forest_posts', JSON.stringify(updatedPosts));
  };

  // Helper to persist bookmarks
  const saveBookmarksToStorage = (updatedBookmarks: string[]) => {
    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem('whispering_forest_bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Helper to persist likes
  const saveLikesToStorage = (updatedLikes: string[]) => {
    setLikedIds(updatedLikes);
    localStorage.setItem('whispering_forest_likes', JSON.stringify(updatedLikes));
  };

  // Helper to persist comments
  const saveCommentsToStorage = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    localStorage.setItem('whispering_forest_comments', JSON.stringify(updatedComments));
  };

  // 4. Core Actions
  const handleToggleBookmark = (id: string) => {
    const nextBookmarks = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((bId) => bId !== id)
      : [...bookmarkedIds, id];
    
    saveBookmarksToStorage(nextBookmarks);

    // Increment/Decrement bookmark count on post
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        const diff = bookmarkedIds.includes(id) ? -1 : 1;
        return { ...post, bookmarks: Math.max(0, post.bookmarks + diff) };
      }
      return post;
    });
    savePostsToStorage(updatedPosts);
  };

  const handleToggleHeart = (id: string) => {
    const nextLikes = likedIds.includes(id)
      ? likedIds.filter((lId) => lId !== id)
      : [...likedIds, id];
    
    saveLikesToStorage(nextLikes);

    // Increment/Decrement like count on post
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        const diff = likedIds.includes(id) ? -1 : 1;
        return { ...post, likes: Math.max(0, post.likes + diff) };
      }
      return post;
    });
    savePostsToStorage(updatedPosts);
  };

  const handleIncrementViews = (id: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        return { ...post, views: post.views + 1 };
      }
      return post;
    });
    savePostsToStorage(updatedPosts);
  };

  const handleAddComment = (postId: string, author: string, content: string, isWhisper: boolean) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      author,
      content,
      timestamp: new Date().toISOString(),
      isWhisper
    };
    const nextComments = [newComment, ...comments];
    saveCommentsToStorage(nextComments);
  };

  const handleOpenReader = (post: Post) => {
    setActivePost(post);
    handleIncrementViews(post.id);
  };

  const handleAddPost = (newPost: Post) => {
    const updated = [newPost, ...posts];
    savePostsToStorage(updated);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    const updated = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    savePostsToStorage(updated);
    if (activePost && activePost.id === updatedPost.id) {
      setActivePost(updatedPost);
    }
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    savePostsToStorage(updated);
    if (activePost && activePost.id === id) {
      setActivePost(null);
    }
  };

  const handleResetToSeeds = () => {
    if (confirm('Do you wish to restore the library to its initial pre-compiled state? All drafts and updates will disappear.')) {
      setPosts(SEED_POSTS);
      setComments(getInitialComments());
      setBookmarkedIds([]);
      setLikedIds([]);
      localStorage.setItem('whispering_forest_posts', JSON.stringify(SEED_POSTS));
      localStorage.setItem('whispering_forest_comments', JSON.stringify(getInitialComments()));
      localStorage.setItem('whispering_forest_bookmarks', JSON.stringify([]));
      localStorage.setItem('whispering_forest_likes', JSON.stringify([]));
    }
  };

  // 5. Query Filter Logic
  const filteredPosts = posts.filter((post) => {
    // Hide drafts from visitors
    if (post.isDraft && !isKeeperDeskOpen) return false;

    // Category filter
    if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;

    // Search query matching (title, summary, and author)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchSummary = post.summary.toLowerCase().includes(q);
      const matchAuthor = post.authorSig?.toLowerCase().includes(q) || false;
      return matchTitle || matchSummary || matchAuthor;
    }

    return true;
  });

  // Featured Post Section (The highly rated non-draft post)
  const featuredPost = posts.find(p => !p.isDraft && p.id === 'forest-4') || posts.find(p => !p.isDraft);

  return (
    <div id="whispering-woods-root" className="min-h-screen relative overflow-hidden bg-[#0a110a] text-parchment-50 font-body flex flex-col pb-12 select-none">
      
      {/* 🔮 Background Canvas Effects */}
      <ParticlesBg />

      {/* 🍂 Gilded header & navigational crown */}
      <header id="main-header" className="relative z-10 w-full border-b border-forest-800/40 bg-forest-950/70 backdrop-blur-md px-4 py-5 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Title Logo Frame */}
        <div className="flex items-center space-x-3 text-center md:text-left cursor-pointer" onClick={() => { setSelectedCategory('All'); setIsKeeperDeskOpen(false); }}>
          <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center bg-forest-900 shadow-glow-amber text-amber-300">
            <Feather size={18} className="translate-x-[-1px] rotate-12" />
          </div>
          <div>
            <h1 className="font-fantasy text-xl sm:text-2xl font-bold tracking-widest text-parchment-100 flex items-center justify-center md:justify-start gap-1">
              <span>The Whispering Woods</span>
              <span className="text-amber-400 font-mono text-[10px] bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/20 translate-y-[-2px]">ARCHIVE</span>
            </h1>
            <p className="font-serif text-[11px] text-stone-450 tracking-wider italic mt-0.5">
              A cozy forest sanctuary for scrolls, verses, and wild lore
            </p>
          </div>
        </div>

        {/* Ambient music controls panel */}
        <div className="flex items-center space-x-3 flex-wrap justify-center">
          <AudioPlayer />
          
          <button
            id="header-keeper-desk-btn"
            onClick={() => setIsKeeperDeskOpen(!isKeeperDeskOpen)}
            className={`px-4 py-2 rounded-xl text-xs font-fantasy tracking-wider uppercase border transition duration-300 flex items-center space-x-1.5 ${
              isKeeperDeskOpen 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-glow-amber' 
                : 'border-forest-800 hover:border-amber-400/50 text-stone-300 hover:text-amber-200 bg-forest-900/40'
            }`}
          >
            <Key size={12} className="text-amber-500 animate-pulse" />
            <span>{isKeeperDeskOpen ? 'Review shelves' : 'The Keeper’s Desk'}</span>
          </button>
        </div>
      </header>

      {/* 🏰 Main Display Area */}
      <main id="main-content" className="relative z-10 flex-grow px-4 max-w-6xl w-full mx-auto mt-6 md:mt-10">
        
        <AnimatePresence mode="wait">
          {isKeeperDeskOpen ? (
            /* Admin Panel desk view toggled */
            <motion.div
              key="admin-desk"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <KeeperDesk 
                posts={posts}
                onAddPost={handleAddPost}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
                onClose={() => setIsKeeperDeskOpen(false)}
              />
            </motion.div>
          ) : (
            /* Reader landing home page */
            <motion.div
              key="library-vault"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              
              {/* Featured scroll: Big introductory layout for one story */}
              {featuredPost && selectedCategory === 'All' && searchQuery === '' && (
                <section id="featured-whisper" className="bg-[#142416]/50 border border-forest-700/30 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 p-8 text-amber-400/5 font-bold pointer-events-none text-9xl font-sans">✧</div>
                  
                  {featuredPost.coverImageURL && (
                    <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-square rounded-xl overflow-hidden relative shadow-md group border border-forest-800/40">
                      <img
                        src={featuredPost.coverImageURL}
                        alt="Eldest scroll picture"
                        className="w-full h-full object-cover filter brightness-[0.9] saturate-[0.80] group-hover:scale-105 duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={11} className="text-amber-400" />
                      <span className="font-fantasy text-xs uppercase tracking-widest text-amber-300">Featured Scroll</span>
                    </div>

                    <h2 className="font-display text-2.5xl sm:text-3.5xl font-semibold leading-tight text-parchment-100 italic">
                      {featuredPost.title}
                    </h2>

                    <p className="font-serif text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
                      {featuredPost.summary}
                    </p>

                    <div className="flex items-center space-x-4 pb-2 text-xs font-serif text-[#a8a29e]">
                      <span className="text-emerald-400">{featuredPost.authorSig || 'The Moss Keeper'}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Heart size={11} className="text-rose-400 fill-rose-400/20" />
                        <span>{featuredPost.likes}</span>
                      </span>
                    </div>

                    <button
                      id="unwrap-featured-scroll"
                      onClick={() => handleOpenReader(featuredPost)}
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 border border-amber-500/20 hover:border-amber-400/40 rounded-xl font-serif text-sm font-medium tracking-wide text-stone-50 transition duration-300 flex items-center space-x-2 shadow-md hover:shadow-glow-amber hover:scale-[1.02]"
                    >
                      <BookOpen size={14} />
                      <span>Unwrap the Scroll</span>
                    </button>
                  </div>
                </section>
              )}

              {/* 📖 Library Wings Section (Categories bar) */}
              <section id="library-wings" className="space-y-4 text-center">
                <div className="flex justify-center items-center space-x-1 mb-2.5 text-amber-300">
                  <span className="h-px w-8 bg-forest-700"></span>
                  <span className="font-fantasy text-xs tracking-widest uppercase">The Library Wings</span>
                  <span className="h-px w-8 bg-forest-700"></span>
                </div>
                
                {/* Ancient glowing book covers styled categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-4xl mx-auto">
                  
                  {/* "All Shelves" Option */}
                  <button
                    id="wing-all"
                    onClick={() => setSelectedCategory('All')}
                    className={`relative p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                      selectedCategory === 'All'
                        ? 'bg-gradient-to-b from-forest-800 to-forest-850 border-amber-400 shadow-glow-amber text-amber-200'
                        : 'bg-forest-900/40 border-forest-800/60 hover:bg-forest-850 hover:border-forest-700 text-stone-300'
                    }`}
                  >
                    <BookOpen size={16} className={`mb-1.5 ${selectedCategory === 'All' ? 'text-amber-400' : 'text-stone-400'}`} />
                    <span className="font-fantasy tracking-wider text-xs uppercase">All Shelves</span>
                  </button>

                  {LOR_SHELFS.map((wing) => {
                    const isSelected = selectedCategory === wing;
                    return (
                      <button
                        key={wing}
                        id={`wing-${wing.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setSelectedCategory(wing)}
                        className={`relative p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group ${
                          isSelected
                            ? 'bg-gradient-to-b from-forest-800 to-forest-850 border-amber-400 shadow-glow-amber text-amber-200'
                            : 'bg-forest-900/40 border-forest-800/60 hover:bg-forest-850 hover:border-forest-700 text-stone-300'
                        }`}
                      >
                        <span className={`text-[10px] font-mono lowercase tracking-widest block mb-0.5 text-[#a8a29e]`}>wing</span>
                        <span className="font-fantasy tracking-wider text-xs uppercase block truncate max-w-full">
                          {wing.replace('Fragments of Thought', 'Fragments')}
                        </span>
                        
                        {/* Soft gold hover glow indicators */}
                        <div className="absolute inset-0 rounded-xl bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 🔍 Search bar with glassmorphic filter styling */}
              <section id="search-section" className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 text-stone-500" size={16} />
                  <input
                    id="search-whisper-bar"
                    type="text"
                    placeholder="Search whispers by word or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-stone-900/55 text-stone-100 border border-forest-800/60 focus:border-amber-400 rounded-xl font-serif text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/25 shadow-sm transition"
                  />
                  {searchQuery && (
                    <button
                      id="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-200 text-xs font-mono"
                    >
                      clear
                    </button>
                  )}
                </div>
              </section>

              {/* 📜 The Memory Shelf: Collected Whispers (Posts list cards mapping) */}
              <section id="the-memory-shelf" className="space-y-6">
                <div className="flex items-center justify-between border-b border-forest-800/40 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Filter size={13} className="text-stone-400" />
                    <h3 className="font-fantasy text-lg text-amber-300 tracking-wider">
                      Collected Whispers {selectedCategory !== 'All' && <span>— {selectedCategory}</span>}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-[#a8a29e]">{filteredPosts.length} scroll leaf found</span>
                </div>

                {filteredPosts.length === 0 ? (
                  <div className="text-center py-14 max-w-sm mx-auto space-y-3.5 bg-stone-900/20 border border-forest-900/40 rounded-xl p-6">
                    <p className="font-serif italic text-stone-400 text-sm">
                      "Alas, the pages are bare on this shelf. The inkwell has dried or the wind swept them away."
                    </p>
                    <button
                      id="clear-filters-btn"
                      onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                      className="text-xs font-fantasy uppercase text-amber-300 hover:text-amber-100 border border-amber-500/15 hover:border-amber-400/35 px-4 py-1.5 rounded-full transition-all"
                    >
                      Browse All Shelves
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredPosts.map((post) => {
                        const isBookmarked = bookmarkedIds.includes(post.id);
                        const isLiked = likedIds.includes(post.id);

                        return (
                          <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            className="group relative flex flex-col justify-between bg-gradient-to-b from-stone-900/70 to-stone-900/40 border border-forest-850 hover:border-amber-400/30 rounded-xl p-5.5 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-glow-amber backdrop-blur-sm"
                          >
                            <div>
                              {/* Metadata ribbon */}
                              <div className="flex items-center justify-between text-[10px] font-mono text-[#a8a29e] mb-3 uppercase tracking-wider">
                                <span className="bg-forest-950/90 px-2 py-0.5 rounded border border-forest-800/40 text-glow-cream">
                                  {post.category}
                                </span>
                                <span>{post.readTime}</span>
                              </div>

                              {/* Story book Title */}
                              <h4 
                                onClick={() => handleOpenReader(post)}
                                className="font-display text-lg font-semibold text-parchment-100 hover:text-amber-300 transition-colors duration-250 cursor-pointer leading-snug line-clamp-2"
                              >
                                {post.title}
                              </h4>

                              {/* Story Poet signature */}
                              <p className="font-serif italic text-stone-450 text-[11px] mt-1 mb-2.5">
                                By {post.authorSig || 'Unknown scribe'}
                              </p>

                              {/* Short sensory excerpt */}
                              <p className="font-serif text-xs text-stone-300 leading-relaxed line-clamp-3 mb-4 italic">
                                "{post.summary}"
                              </p>
                            </div>

                            {/* Card footer interaction actions */}
                            <div className="flex items-center justify-between pt-3.5 border-t border-forest-800/30 text-xs">
                              <span className="font-mono text-[10px] text-stone-400">
                                {new Date(post.createdAt || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>

                              <div className="flex items-center space-x-2.5">
                                <button
                                  id={`heart-${post.id}`}
                                  onClick={() => handleToggleHeart(post.id)}
                                  className={`p-1 hover:scale-105 transition ${isLiked ? 'text-rose-500' : 'text-stone-500 hover:text-stone-300'}`}
                                  title="Heart whisper"
                                >
                                  <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                                </button>
                                <span className="font-mono text-[10px] text-stone-400">{post.likes + (isLiked ? 1 : 0)}</span>

                                <button
                                  id={`bookmark-${post.id}`}
                                  onClick={() => handleToggleBookmark(post.id)}
                                  className={`p-1 hover:scale-105 transition ${isBookmarked ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
                                  title="Save to trunk"
                                >
                                  <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                            </div>

                            {/* Subtle particle glow indicator */}
                            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 duration-500 pointer-events-none text-emerald-400">
                              <Sparkles size={8} />
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </section>

              {/* 🕯️ "Reveal a Whisper" garden widget area */}
              <section id="whisper-quote-area" className="py-6 border-t border-forest-800/20">
                <QuoteReveal />
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 📖 Immersive Parchment Reader Overlay */}
      <AnimatePresence>
        {activePost && (
          <PostReader
            post={activePost}
            onClose={() => setActivePost(null)}
            onNavigatePost={(postId) => {
              const newPost = posts.find(p => p.id === postId);
              if (newPost) handleOpenReader(newPost);
            }}
            allPosts={posts}
            isBookmarked={bookmarkedIds.includes(activePost.id)}
            isLiked={likedIds.includes(activePost.id)}
            onToggleBookmark={handleToggleBookmark}
            onToggleHeart={handleToggleHeart}
            comments={comments}
            onAddComment={handleAddComment}
          />
        )}
      </AnimatePresence>

      {/* 🌲 Ground Footer bar with secret resetting leaf */}
      <footer id="main-footer" className="relative z-10 w-full mt-16 pt-8 border-t border-forest-800/20 text-center space-y-3 px-4">
        <p className="font-serif text-xs text-stone-450 italic">
          \"There is a grove where wind sings of forgotten ink; touch the leaf to see of what we think.\"
        </p>
        <div className="flex items-center justify-center space-x-3.5">
          <p className="font-mono text-[10px] text-stone-500">
            © 2026 The Whispering Woods Archive • Hand-scribed under candle shadow
          </p>
          <span>•</span>
          <button
            id="reset-seeds-btn"
            onClick={handleResetToSeeds}
            className="text-stone-500 hover:text-amber-400 font-mono text-[10px] flex items-center space-x-1 transition cursor-pointer bg-forest-900/10 hover:bg-forest-900/30 px-2 py-1 rounded"
            title="Reset library state"
          >
            <RefreshCw size={9} className="mr-0.5" />
            <span>Reset Seals</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
