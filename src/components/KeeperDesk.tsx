/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, BookOpen, Clock, Heart, Eye, ArrowLeft, Trash2, Edit, PlusCircle, CheckCircle, Save, FileText, Image, Sparkles
} from 'lucide-react';
import { Post, Category } from '../types';
import { SUGGESTED_COVER_IMAGES } from '../data/seedData';

interface KeeperDeskProps {
  posts: Post[];
  onAddPost: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onClose: () => void;
}

const CATEGORIES: Category[] = ['Stories', 'Poems', 'Fragments of Thought', 'Midnight Thoughts', 'Letters', 'Fantasy Lore'];

export default function KeeperDesk({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onClose,
}: KeeperDeskProps) {
  // Passcode authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active sub-screen: 'list' | 'create' | 'edit'
  const [deskView, setDeskView] = useState<'list' | 'editor'>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Editor states
  const [editorTitle, setEditorTitle] = useState('');
  const [editorSummary, setEditorSummary] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorCategory, setEditorCategory] = useState<Category>('Stories');
  const [editorCoverUrl, setEditorCoverUrl] = useState('');
  const [editorAuthorSig, setEditorAuthorSig] = useState('The Moss Keeper');
  const [editorIsDraft, setEditorIsDraft] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  // Success banners
  const [bannerMessage, setBannerMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase().trim() === 'frank') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('The forest spirits do not recognize this rune.');
    }
  };

  // Pre-fill editor for creating a new post
  const handleOpenCreator = () => {
    setEditingPostId(null);
    setEditorTitle('');
    setEditorSummary('');
    setEditorContent('<p>Write your magical narrative here...</p>');
    setEditorCategory('Stories');
    setEditorCoverUrl(SUGGESTED_COVER_IMAGES[0].url);
    setEditorAuthorSig('The Moss Keeper');
    setEditorIsDraft(false);
    setIsPreviewActive(false);
    setDeskView('editor');
  };

  // Pre-fill editor for editing an existing post
  const handleOpenEditor = (post: Post) => {
    setEditingPostId(post.id);
    setEditorTitle(post.title);
    setEditorSummary(post.summary);
    setEditorContent(post.content);
    setEditorCategory(post.category);
    setEditorCoverUrl(post.coverImageURL || '');
    setEditorAuthorSig(post.authorSig || 'The Moss Keeper');
    setEditorIsDraft(post.isDraft);
    setIsPreviewActive(false);
    setDeskView('editor');
  };

  // Text formatting generator for the custom editor
  const handleInsertFormat = (tag: 'strong' | 'em' | 'h3' | 'blockquote' | 'p') => {
    let wrapStart = `<${tag}>`;
    let wrapEnd = `</${tag}>`;
    
    // Custom blocks format
    if (tag === 'blockquote') {
      wrapStart = '\n<blockquote>"';
      wrapEnd = '"</blockquote>\n';
    } else if (tag === 'p') {
      wrapStart = '\n<p>';
      wrapEnd = '</p>\n';
    } else if (tag === 'h3') {
      wrapStart = '\n<h3>';
      wrapEnd = '</h3>\n';
    }

    const textarea = document.getElementById('keeper-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const startIdx = textarea.selectionStart;
    const endIdx = textarea.selectionEnd;
    const originalText = textarea.value;

    const selectedText = originalText.substring(startIdx, endIdx) || 'text';
    const modifiedText = originalText.substring(0, startIdx) + wrapStart + selectedText + wrapEnd + originalText.substring(endIdx);

    setEditorContent(modifiedText);
    
    // Focus back and highlight
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startIdx + wrapStart.length, startIdx + wrapStart.length + selectedText.length);
    }, 50);
  };

  const handleSavePost = () => {
    if (!editorTitle.trim()) {
      alert('The chronicle must have a title to be cataloged.');
      return;
    }

    // Estimate reading time: ~150 words/minute
    const plainText = editorContent.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length || 1;
    const minutes = Math.max(1, Math.ceil(wordCount / 150));
    const calculatedReadTime = `${minutes} min read`;

    const cleanContent = editorContent.trim();

    if (editingPostId) {
      // Update
      const original = posts.find(p => p.id === editingPostId);
      if (!original) return;

      const updatedPost: Post = {
        ...original,
        title: editorTitle.trim(),
        summary: editorSummary.trim() || 'A short tale from the leaves.',
        content: cleanContent,
        category: editorCategory,
        coverImageURL: editorCoverUrl.trim(),
        updatedAt: new Date().toISOString(),
        isDraft: editorIsDraft,
        authorSig: editorAuthorSig.trim() || 'The Moss Keeper',
        readTime: calculatedReadTime,
      };

      onUpdatePost(updatedPost);
      showBanner('Whisper updated in the Master Chronicle.');
    } else {
      // Add new
      const newId = `post-${Date.now()}`;
      const newPost: Post = {
        id: newId,
        title: editorTitle.trim(),
        summary: editorSummary.trim() || 'A short tale from the leaves.',
        content: cleanContent,
        category: editorCategory,
        coverImageURL: editorCoverUrl.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        bookmarks: 0,
        views: 0,
        isDraft: editorIsDraft,
        authorSig: editorAuthorSig.trim() || 'The Moss Keeper',
        readTime: calculatedReadTime,
      };

      onAddPost(newPost);
      showBanner('Whisper successfully cast and bound into the library.');
    }

    setDeskView('list');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you wish to burn this page from the archive? It cannot be retrieved.')) {
      onDeletePost(id);
      showBanner('Whisper burnt to ash.');
    }
  };

  const showBanner = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(''), 3500);
  };

  // Calculations for Admin Analytics
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const draftCount = posts.filter(p => p.isDraft).length;
  
  const topReadPosts = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-forest-900/90 border border-forest-600/40 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-glow-amber">
            <Lock size={26} />
          </div>

          <h2 className="font-fantasy text-2xl text-stone-100 tracking-wider mb-2">The Keeper's Gate</h2>
          <p className="font-serif text-sm text-stone-300 leading-relaxed mb-6">
            Enter the magical rune phrase to unlock the roll-top desk and record the memories.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                id="passcode-input"
                type="password"
                placeholder="Type the rune..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-stone-950 border border-forest-800 rounded-lg text-amber-200 placeholder-stone-500 font-serif text-center text-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {authError && (
              <p className="font-serif text-xs italic text-rose-400">{authError}</p>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                id="passcode-cancel-btn"
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-transparent border border-stone-500/20 text-stone-300 rounded-lg font-serif text-sm hover:bg-stone-500/5 transition duration-200"
              >
                Back to Shelf
              </button>
              <button
                id="passcode-unlock-btn"
                type="submit"
                className="flex-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-stone-50 rounded-lg font-serif text-sm shadow-md transition duration-200"
              >
                Unlock Desk
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-forest-800/50">
            <p className="font-serif text-[11px] text-stone-400 italic">
              "Quiet grows the moss upon the lock; speak of green, and we shall talk."
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-stone-100 font-serif">
      {/* Top Keeper Banner Info */}
      <div className="bg-forest-900/60 border border-forest-700/30 rounded-xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <Sparkles size={16} className="animate-pulse" />
            <span className="font-fantasy tracking-widest text-xs uppercase text-amber-300">Administrative Cell</span>
          </div>
          <h2 className="font-fantasy text-3xl text-stone-100 tracking-wide">The Keeper's roll-top Desk</h2>
          <p className="font-serif text-xs text-stone-300 italic mt-0.5">
            You are seated with the inkwells. Craft tales, edit the mossy scrolls, and monitor the forest's curiosity.
          </p>
        </div>

        <div className="flex space-x-3.5 flex-wrap">
          <button
            id="keeper-leave-btn"
            onClick={() => {
              setIsAuthenticated(false);
              setPasscode('');
              onClose();
            }}
            className="px-4 py-2 bg-stone-900 border border-forest-800 text-stone-300 text-xs rounded-lg hover:bg-stone-850 hover:text-stone-100 transition flex items-center space-x-1.5"
          >
            <ArrowLeft size={13} />
            <span>Leave Desk</span>
          </button>
          
          {deskView === 'list' && (
            <button
              id="keeper-compose-btn"
              onClick={handleOpenCreator}
              className="px-4 py-2 bg-emerald-700 text-stone-50 text-xs rounded-lg hover:bg-emerald-600 transition flex items-center space-x-1.5 font-medium shadow-glow-amber hover:scale-105 duration-200"
            >
              <PlusCircle size={13} />
              <span>Compose New Whisper</span>
            </button>
          )}
        </div>
      </div>

      {/* Success banner notifications */}
      {bannerMessage && (
        <div className="bg-emerald-800/90 border border-emerald-500/30 text-stone-100 rounded-xl px-5 py-3.5 mb-6 text-sm flex items-center space-x-2.5 shadow-md animate-fade-in">
          <CheckCircle size={16} className="text-amber-300" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {deskView === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chronicle ledger */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-forest-800 pb-3">
              <h3 className="font-fantasy text-lg text-amber-300 tracking-wider">The Recorded Whispers ({posts.length})</h3>
              <span className="font-mono text-xs text-stone-400">{draftCount} drafts waiting</span>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-stone-900/60 border border-forest-500/10 hover:border-forest-500/20 rounded-xl p-4 flex items-center justify-between gap-4 transition duration-200"
                >
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center space-x-2.5 mb-1 flex-wrap gap-1">
                      <span className="font-mono text-[10px] uppercase bg-forest-950/80 px-2 py-0.5 rounded border border-forest-800/40 text-[#a8a29e]">
                        {post.category}
                      </span>
                      {post.isDraft ? (
                        <span className="font-serif text-[10px] italic bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          Draft scroll
                        </span>
                      ) : (
                        <span className="font-serif text-[10px] italic bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          Spoken live
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-base font-semibold text-stone-150 truncate max-w-sm">
                      {post.title}
                    </h4>
                    <p className="font-serif text-stone-400 text-xs italic truncate mt-0.5">
                      {post.summary}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      id={`edit-${post.id}`}
                      onClick={() => handleOpenEditor(post)}
                      className="p-1.8 bg-forest-950 hover:bg-forest-800 border border-forest-700/50 text-stone-300 hover:text-amber-300 rounded-lg transition"
                      title="Amend post"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      id={`delete-${post.id}`}
                      onClick={() => handleDelete(post.id)}
                      className="p-1.8 bg-stone-950 hover:bg-rose-950 border border-rose-900/30 text-stone-400 hover:text-rose-400 rounded-lg transition"
                      title="Burn Post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidelight Analytics Scroll */}
          <div className="space-y-6">
            <div className="bg-stone-900/80 border border-forest-500/15 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 font-bold pointer-events-none text-9xl">✧</div>
              
              <h3 className="font-fantasy text-base text-amber-300 tracking-wider border-b border-forest-800 pb-2.5 mb-4 uppercase">
                Library Analytics
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-forest-950/60 p-3 rounded-lg border border-forest-800/40 text-center">
                  <div className="font-serif text-xs text-stone-400 flex items-center justify-center space-x-1">
                    <Eye size={12} className="text-amber-400" />
                    <span>Views</span>
                  </div>
                  <div className="font-mono text-xl font-bold mt-1 text-stone-100">{totalViews}</div>
                </div>

                <div className="bg-forest-950/60 p-3 rounded-lg border border-forest-800/40 text-center">
                  <div className="font-serif text-xs text-stone-400 flex items-center justify-center space-x-1">
                    <Heart size={12} className="text-rose-400" />
                    <span>Hearts Given</span>
                  </div>
                  <div className="font-mono text-xl font-bold mt-1 text-stone-100">{totalLikes}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-fantasy text-xs tracking-wider uppercase text-stone-300">
                  Most Frequented Whispers
                </h4>
                
                <div className="space-y-2">
                  {topReadPosts.map((post, idx) => (
                    <div 
                      key={post.id} 
                      className="flex items-center justify-between text-xs py-2 border-b border-forest-800/30 last:border-0"
                    >
                      <span className="truncate max-w-[170px] font-serif text-stone-200">
                        {idx + 1}. {post.title}
                      </span>
                      <span className="font-mono text-amber-300 flex items-center space-x-1">
                        <Eye size={11} />
                        <span>{post.views}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Rich Text composition edit/create scroll board */
        <div className="bg-stone-900 border border-forest-800/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex border-b border-forest-850 pb-4 mb-6 justify-between items-center flex-wrap gap-3">
            <h3 className="font-fantasy text-xl text-amber-300 tracking-wider">
              {editingPostId ? 'Amend an Elder Whisper' : 'Inscribe a New Leaf'}
            </h3>
            
            <div className="flex space-x-2.5">
              <button
                id="editor-toggle-preview"
                type="button"
                onClick={() => setIsPreviewActive(!isPreviewActive)}
                className={`px-3 py-1.5 border rounded-lg text-xs font-serif transition ${
                  isPreviewActive 
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
                    : 'border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {isPreviewActive ? 'Compose mode' : 'Preview Parchment'}
              </button>

              <button
                id="editor-back-to-ledger"
                type="button"
                onClick={() => setDeskView('list')}
                className="px-3 py-1.5 bg-stone-950 hover:bg-stone-850 text-stone-300 text-xs rounded-lg border border-stone-800 transition"
              >
                Cancel
              </button>

              <button
                id="editor-save-btn"
                type="button"
                onClick={handleSavePost}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-stone-50 text-xs rounded-lg transition font-medium flex items-center space-x-1"
              >
                <Save size={13} />
                <span>Bind Scroll</span>
              </button>
            </div>
          </div>

          {isPreviewActive ? (
            /* Immersive Pre-rendered Parchment page within Editor */
            <div className="bg-parchment-100 text-stone-900 rounded-xl p-8 max-w-xl mx-auto border-2 border-parchment-300 shadow-md min-h-[350px]">
              <div className="text-center mb-3">
                <span className="inline-block border border-forest-600/30 px-3 py-0.5 rounded-full font-serif text-[10px] uppercase tracking-widest text-forest-700 bg-stone-50/10">
                  {editorCategory}
                </span>
              </div>
              <h1 className="font-display text-2.5xl font-semibold text-center leading-tight mb-2 text-stone-950">
                {editorTitle || 'An Unwritten Riddle'}
              </h1>
              <div className="font-serif italic text-[11px] text-center text-stone-500 mb-6">
                By <span className="font-semibold text-emerald-800">{editorAuthorSig || 'The Anonymous Sprite'}</span>
              </div>
              
              {editorCoverUrl && (
                <div className="mb-6 rounded-lg overflow-hidden max-h-[160px]">
                  <img src={editorCoverUrl} alt="Cover preview" className="w-full h-full object-cover max-h-[160px]" referrerPolicy="no-referrer" />
                </div>
              )}

              <article className="prose prose-stone leading-relaxed font-body text-base space-y-4">
                <div dangerouslySetInnerHTML={{ __html: editorContent }} />
              </article>
            </div>
          ) : (
            /* Creation and edit input panels */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form entries */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="editor-title" className="block text-xs font-fantasy tracking-wider uppercase text-amber-200 mb-1.5">Whisper Title</label>
                    <input
                      id="editor-title"
                      type="text"
                      placeholder="e.g., The Moss-Draped Solitude"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-950 text-amber-100 border border-forest-800 rounded-lg font-serif focus:outline-none focus:ring-1 focus:ring-amber-500/40 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="editor-sign" className="block text-xs font-fantasy tracking-wider uppercase text-amber-200 mb-1.5">Compose Signature</label>
                    <input
                      id="editor-sign"
                      type="text"
                      placeholder="e.g., Elder Bard"
                      value={editorAuthorSig}
                      onChange={(e) => setEditorAuthorSig(e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-950 text-amber-100 border border-forest-800 rounded-lg font-serif focus:outline-none focus:ring-1 focus:ring-amber-500/40 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="editor-sum" className="block text-xs font-fantasy tracking-wider uppercase text-amber-200 mb-1.5">Short Ledger Summary</label>
                  <input
                    id="editor-sum"
                    type="text"
                    placeholder="Provide a sentence describing the theme..."
                    value={editorSummary}
                    onChange={(e) => setEditorSummary(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-950 text-amber-100 border border-forest-800 rounded-lg font-serif focus:outline-none focus:ring-1 focus:ring-amber-500/40 text-sm"
                  />
                </div>

                {/* HTML formatting toolbar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="keeper-editor-textarea" className="block text-xs font-fantasy tracking-wider uppercase text-amber-200">The Scroll Body (Rich formatting tags enabled)</label>
                    
                    <div className="flex space-x-1.5 bg-stone-950 px-2 py-1 rounded-lg border border-forest-805">
                      <button
                        type="button"
                        onClick={() => handleInsertFormat('strong')}
                        className="px-1.5 py-0.5 text-xs text-stone-300 hover:text-white font-bold"
                        title="Bold Text"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormat('em')}
                        className="px-1.5 py-0.5 text-xs text-stone-300 hover:text-white italic"
                        title="Italic Text"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormat('h3')}
                        className="px-1.5 py-0.5 text-[10px] text-stone-300 hover:text-white tracking-widest font-fantasy uppercase"
                        title="Literary Heading"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormat('blockquote')}
                        className="px-1.5 py-0.5 text-xs text-stone-300 hover:text-white font-serif"
                        title="Centered Blockquote"
                      >
                        Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormat('p')}
                        className="px-1.5 py-0.5 text-xs text-stone-300 hover:text-white font-mono"
                        title="Paragraph Wrap"
                      >
                        P
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="keeper-editor-textarea"
                    placeholder="Compose with passion. HTML elements like <p>, <h3>, and <blockquote> can be added using the bar buttons."
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    rows={12}
                    className="w-full p-4 bg-stone-950 text-amber-100 border border-forest-800 rounded-lg font-serif focus:outline-none focus:ring-1 focus:ring-amber-500/40 text-sm leading-relaxed resize-y"
                  />
                </div>
              </div>

              {/* Sidebar adjustments: cover image and category */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="editor-category" className="block text-xs font-fantasy tracking-wider uppercase text-amber-200 mb-1.5">Library Wing (Category)</label>
                  <select
                    id="editor-category"
                    value={editorCategory}
                    onChange={(e) => setEditorCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 text-amber-100 border border-forest-800 rounded-lg font-serif focus:outline-none focus:ring-1 focus:ring-amber-500/40 text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="editor-cover" className="block text-xs font-fantasy tracking-wider uppercase text-amber-200 mb-1.5">Illustrative Cover URL</label>
                  <input
                    id="editor-cover"
                    type="text"
                    placeholder="Secure Image link..."
                    value={editorCoverUrl}
                    onChange={(e) => setEditorCoverUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-950 text-amber-100 border border-forest-800 rounded-lg font-serif focus:outline-none focus:ring-1 focus:ring-amber-500/40 text-sm mb-3"
                  />

                  {/* Suggested quick image lists */}
                  <div className="space-y-2 mt-2">
                    <span className="block text-[10px] text-stone-400 lowercase italic">Choose an existing forest illustration:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SUGGESTED_COVER_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditorCoverUrl(img.url)}
                          className={`relative aspect-video rounded overflow-hidden border-2 transition ${
                            editorCoverUrl === img.url ? 'border-amber-400' : 'border-stone-800 hover:border-stone-605'
                          }`}
                          title={img.label}
                        >
                          <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={img.label} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* State switch: publish/draft */}
                <div className="bg-stone-950 p-4 rounded-xl border border-forest-800/40">
                  <span className="block text-xs font-fantasy tracking-wider uppercase text-amber-200 mb-2">Chronicle Visibility</span>
                  
                  <div className="flex flex-col space-y-2.5">
                    <label className="inline-flex items-center space-x-2.5 cursor-pointer text-sm font-serif">
                      <input
                        type="radio"
                        name="isDraftRadio"
                        checked={editorIsDraft === false}
                        onChange={() => setEditorIsDraft(false)}
                        className="w-4 h-4 rounded-full text-emerald-600 bg-stone-900 border-stone-800 focus:ring-0"
                      />
                      <span className="text-stone-300">Publish to reader shelves</span>
                    </label>

                    <label className="inline-flex items-center space-x-2.5 cursor-pointer text-sm font-serif">
                      <input
                        type="radio"
                        name="isDraftRadio"
                        checked={editorIsDraft === true}
                        onChange={() => setEditorIsDraft(true)}
                        className="w-4 h-4 rounded-full text-amber-500 bg-stone-900 border-stone-800 focus:ring-0"
                      />
                      <span className="text-stone-300">Keep inside draft drawers</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
