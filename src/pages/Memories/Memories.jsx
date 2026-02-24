import React, {
  useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense
} from "react";
import {
  Heart, Image as ImageIcon, Plus, X, MessageCircle,
  Send, MoreVertical, Bookmark, Grid, Trash2,
  Calendar, Smile, Download, Share2, AlertCircle,
  Search, Filter, Lock, Unlock, TrendingUp,
  Camera, ChevronLeft, ChevronRight, Play,
  Star, Sparkles
} from "lucide-react";

// ================== CONSTANTS ==================
const DIARY_PASSWORD = "fahif"; // Change this for locked memories
const TAGS = ["Love", "Travel", "Friends", "Special", ];

// ================== HELPER FUNCTIONS ==================
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

const getFallbackImage = () => "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Cpath d='M100,150 C133,130 167,130 200,150 C233,170 267,170 300,150' stroke='%23f472b6' stroke-width='3' fill='none'/%3E%3Ccircle cx='100' cy='150' r='8' fill='%23ec4899'/%3E%3Ccircle cx='200' cy='150' r='8' fill='%23ec4899'/%3E%3Ccircle cx='300' cy='150' r='8' fill='%23ec4899'/%3E%3Ctext x='200' y='220' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle'%3EAdd your memories%3C/text%3E%3C/svg%3E";

// ================== CUSTOM HOOKS ==================
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ================== SUBCOMPONENTS ==================
// Search Bar (memoized)
const SearchBar = React.memo(({ searchQuery, setSearchQuery }) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search memories by title or caption..."
      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/70 backdrop-blur-sm"
    />
  </div>
));

// Tag Filter (memoized)
const TagFilter = React.memo(({ selectedTags, setSelectedTags }) => {
  const toggleTag = useCallback((tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, [setSelectedTags]);

  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map(tag => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedTags.includes(tag)
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md scale-105'
              : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
});

// Analytics Dashboard (responsive grid)
const AnalyticsDashboard = React.memo(({ memories }) => {
  const totalMemories = memories.length;
  const totalLikes = memories.reduce((sum, m) => sum + (m.likes || 0), 0);
  const totalComments = memories.reduce((sum, m) => sum + (m.comments?.length || 0), 0);
  const mostLiked = memories.reduce((max, m) => (m.likes > (max?.likes || 0) ? m : max), null);
  const photoPercentage = totalMemories ? Math.round((memories.filter(m => m.image).length / totalMemories) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800">{totalMemories}</div>
        <div className="text-xs text-gray-500">Memories</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-pink-600">{totalLikes}</div>
        <div className="text-xs text-gray-500">Likes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{totalComments}</div>
        <div className="text-xs text-gray-500">Comments</div>
      </div>
      <div className="text-center col-span-2 sm:col-span-1">
        <div className="text-sm font-semibold truncate px-2" title={mostLiked?.title}>
          {mostLiked ? mostLiked.title : '-'}
        </div>
        <div className="text-xs text-gray-500">Most Liked</div>
      </div>
      <div className="text-center col-span-2 sm:col-span-1">
        <div className="text-2xl font-bold text-purple-600">{photoPercentage}%</div>
        <div className="text-xs text-gray-500">Photos</div>
      </div>
    </div>
  );
});

// Like Button with Animation
const LikeButton = React.memo(({ liked, count, onClick }) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    setAnimating(true);
    onClick();
    setTimeout(() => setAnimating(false), 300);
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center gap-1 transition-all duration-200 ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
    >
      <Heart
        size={20}
        fill={liked ? 'currentColor' : 'none'}
        className={`transform transition-transform duration-200 ${animating ? 'scale-150' : ''}`}
      />
      <span className="text-sm font-medium">{count}</span>
      {animating && (
        <span className="absolute -top-6 left-0 animate-bounce text-red-500">❤️</span>
      )}
    </button>
  );
});

// Comment Modal
const CommentModal = React.memo(({ memory, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(memory.id, newComment);
    setNewComment('');
  }, [memory.id, newComment, onAddComment]);

  if (!memory) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Comments</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {memory.comments?.length > 0 ? (
            memory.comments.map((c, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{c.user}</span>
                  <span className="text-xs text-gray-500">{c.date}</span>
                </div>
                <p className="text-sm">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No comments yet.</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50 transition-opacity"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
});

// Image Modal with Zoom and Swipe (simplified touch)
const ImageModal = React.memo(({ image, title, onClose, onDownload }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="relative max-w-4xl w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          loading="lazy"
          onError={(e) => (e.target.src = getFallbackImage())}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <button
          onClick={() => onDownload(image, title)}
          className="absolute bottom-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          aria-label="Download"
        >
          <Download size={24} />
        </button>
      </div>
    </div>
  );
});

// Slideshow Modal with touch navigation
const SlideshowModal = React.memo(({ memories, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef(0);

  const handlePrev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : memories.length - 1)), [memories.length]);
  const handleNext = useCallback(() => setIndex((i) => (i < memories.length - 1 ? i + 1 : 0)), [memories.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const memory = memories[index];

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white z-10 bg-black/30 rounded-full p-2">
        <X size={30} />
      </button>
      <button onClick={handlePrev} className="absolute left-4 text-white bg-black/30 rounded-full p-2 hidden md:block">
        <ChevronLeft size={30} />
      </button>
      <button onClick={handleNext} className="absolute right-4 text-white bg-black/30 rounded-full p-2 hidden md:block">
        <ChevronRight size={30} />
      </button>
      <div className="text-center px-4 w-full">
        <img
          src={memory.image}
          alt={memory.title}
          className="max-h-[70vh] max-w-full mx-auto object-contain rounded-lg"
          loading="lazy"
          onError={(e) => (e.target.src = getFallbackImage())}
        />
        <h3 className="text-white text-xl mt-4">{memory.title}</h3>
        <p className="text-gray-300">{memory.caption}</p>
        <div className="flex justify-center gap-4 mt-4 md:hidden">
          <button onClick={handlePrev} className="text-white bg-black/30 rounded-full p-2"><ChevronLeft size={24} /></button>
          <button onClick={handleNext} className="text-white bg-black/30 rounded-full p-2"><ChevronRight size={24} /></button>
        </div>
      </div>
    </div>
  );
});

// Memory Card (Grid View) with lazy image and skeleton
const MemoryCard = React.memo(({ memory, onLike, onSave, onDelete, onShare, onComment, onImageClick, liked, saved }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showLockPrompt, setShowLockPrompt] = useState(false);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(`memory_unlocked_${memory.id}`) === 'true');

  const handleUnlock = useCallback((pwd) => {
    if (pwd === DIARY_PASSWORD) {
      setUnlocked(true);
      sessionStorage.setItem(`memory_unlocked_${memory.id}`, 'true');
      setShowLockPrompt(false);
    } else {
      alert('Incorrect password');
    }
  }, [memory.id]);

  if (memory.locked && !unlocked) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center transition-all duration-300">
        <Lock size={40} className="mx-auto text-gray-400 mb-3" />
        <h3 className="font-semibold text-gray-700 mb-2">Locked Memory</h3>
        {showLockPrompt ? (
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Enter password"
              className="border rounded-lg px-3 py-2 w-full text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock(e.target.value)}
            />
            <button
              onClick={() => handleUnlock(document.querySelector('.lock-input')?.value)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm w-full"
            >
              Unlock
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLockPrompt(true)}
            className="text-pink-500 text-sm hover:underline"
          >
            Tap to unlock
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48 sm:h-56 md:h-64 cursor-pointer" onClick={() => onImageClick(memory.image)}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={imageError ? getFallbackImage() : memory.image}
          alt={memory.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => { setImageError(true); setImageLoaded(true); }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onSave(memory.id); }}
            className={`p-2 rounded-full transition-transform hover:scale-110 ${saved ? 'bg-yellow-500 text-white' : 'bg-white/90 text-gray-800'}`}
            aria-label="Save"
          >
            <Bookmark size={16} fill={saved ? 'white' : 'none'} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 truncate">{memory.title}</h3>
          <button onClick={() => onDelete(memory.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete">
            <Trash2 size={16} />
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{memory.caption}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <LikeButton liked={liked} count={memory.likes} onClick={() => onLike(memory.id)} />
            <button
              onClick={() => onComment(memory)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={16} />
              <span>{memory.comments?.length || 0}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onShare(memory)} className="text-gray-400 hover:text-blue-500 transition-colors" aria-label="Share">
              <Share2 size={16} />
            </button>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Calendar size={12} />
              <span>{new Date(memory.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {memory.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

// Memory Feed Item (Feed View)
const MemoryFeedItem = React.memo(({ memory, onLike, onSave, onDelete, onShare, onComment, onImageClick, liked, saved }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showLockPrompt, setShowLockPrompt] = useState(false);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(`memory_unlocked_${memory.id}`) === 'true');

  const handleUnlock = useCallback((pwd) => {
    if (pwd === DIARY_PASSWORD) {
      setUnlocked(true);
      sessionStorage.setItem(`memory_unlocked_${memory.id}`, 'true');
      setShowLockPrompt(false);
    } else alert('Incorrect password');
  }, [memory.id]);

  if (memory.locked && !unlocked) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center">
        <Lock size={40} className="mx-auto text-gray-400 mb-3" />
        <h3 className="font-semibold text-gray-700 mb-2">Locked Memory</h3>
        {showLockPrompt ? (
          <div className="space-y-2">
            <input type="password" placeholder="Enter password" className="border rounded-lg px-3 py-2 w-full" />
            <button onClick={() => handleUnlock(document.querySelector('.lock-input')?.value)} className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm w-full">Unlock</button>
          </div>
        ) : (
          <button onClick={() => setShowLockPrompt(true)} className="text-pink-500 text-sm hover:underline">Tap to unlock</button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center text-white font-bold">
            {memory.title.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{memory.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={14} />
              {new Date(memory.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button onClick={() => onShare(memory)} className="text-gray-400 hover:text-blue-500 transition-colors">
            <Share2 size={20} />
          </button>
          <button onClick={() => onDelete(memory.id)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="relative cursor-pointer" onClick={() => onImageClick(memory.image)}>
        {!imageLoaded && !imageError && (
          <div className="w-full h-64 sm:h-96 bg-gray-200 animate-pulse" />
        )}
        <img
          src={imageError ? getFallbackImage() : memory.image}
          alt={memory.title}
          className={`w-full max-h-96 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => { setImageError(true); setImageLoaded(true); }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <LikeButton liked={liked} count={memory.likes} onClick={() => onLike(memory.id)} />
            <button onClick={() => onComment(memory)} className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">{memory.comments?.length || 0}</span>
            </button>
          </div>
          <button onClick={() => onSave(memory.id)} className={`transition-colors ${saved ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`}>
            <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="text-gray-800 mb-2 leading-relaxed">
          <span className="font-bold">{memory.title.split(' ')[0]}</span> {memory.caption}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {memory.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
});

// ================== MAIN COMPONENT ==================
const Memories = () => {
  // State
  const [memories, setMemories] = useLocalStorage('memoriesData', [
    {
      id: 1,
      image: '/image/9.jpg',
      title: 'First Meet 💕',
      caption: 'The day our story began! ❤️ #FirstMeet',
      date: '15 March 2023',
      timestamp: '2023-03-15',
      likes: 152,
      comments: [
        { user: 'Ariya', text: 'So beautiful!', date: '2023-03-15' },
        { user: 'Ariyan', text: 'Unforgettable day', date: '2023-03-16' }
      ],
      tags: ['Date', 'Special'],
      locked: false
    },
    {
      id: 2,
      image: '/image/8.jpg',
      title: 'Mountain Trip 🌄',
      caption: 'Adventures together are the best! 🏔️',
      date: '10 July 2023',
      timestamp: '2023-07-10',
      likes: 198,
      comments: [],
      tags: ['Trip', 'Mountain'],
      locked: false
    },
    {
      id: 3,
      image: '/image/7.jpg',
      title: 'Coffee Date ☕',
      caption: 'Morning coffee dates are our favorite ritual! ✨',
      date: '02 Jan 2024',
      timestamp: '2024-01-02',
      likes: 234,
      comments: [],
      tags: ['Coffee', 'Date'],
      locked: false
    },
    {
      id: 4,
      image: '/image/6.jpg',
      title: 'Beach Sunset 🌅',
      caption: 'Beautiful sunset by the beach! 🏖️',
      date: '25 May 2024',
      timestamp: '2024-05-25',
      likes: 189,
      comments: [],
      tags: ['Beach', 'Sunset'],
      locked: false
    }
  ]);

  const [likedPosts, setLikedPosts] = useLocalStorage('likedPosts', {});
  const [savedPosts, setSavedPosts] = useLocalStorage('savedPosts', {});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedMemoryForComment, setSelectedMemoryForComment] = useState(null);
  const [newMemory, setNewMemory] = useState({
    title: '',
    caption: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    locked: false
  });
  const [uploadedImage, setUploadedImage] = useState(null);

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filtered & sorted memories
  const filteredMemories = useMemo(() => {
    let filtered = memories.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           m.caption.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesTags = selectedTags.length === 0 || m.tags?.some(tag => selectedTags.includes(tag));
      return matchesSearch && matchesTags;
    });

    filtered.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
      else return new Date(a.timestamp) - new Date(b.timestamp);
    });

    return filtered;
  }, [memories, debouncedSearch, sortOrder, selectedTags]);

  // Handlers
  const handleLike = useCallback((id) => {
    setLikedPosts(prev => {
      const newLiked = !prev[id];
      // Update memory likes count
      setMemories(prevMemories =>
        prevMemories.map(m =>
          m.id === id ? { ...m, likes: m.likes + (newLiked ? 1 : -1) } : m
        )
      );
      return { ...prev, [id]: newLiked };
    });
  }, [setLikedPosts, setMemories]);

  const handleSave = useCallback((id) => {
    setSavedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  }, [setSavedPosts]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Delete this memory?')) {
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  }, [setMemories]);

  const handleShare = useCallback(async (memory) => {
    const shareData = {
      title: memory.title,
      text: memory.caption,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log('Share cancelled'); }
    } else {
      navigator.clipboard.writeText(`${memory.title}\n${memory.caption}`);
      alert('Copied to clipboard!');
    }
  }, []);

  const handleAddComment = useCallback((memoryId, text) => {
    const newComment = {
      user: 'You',
      text,
      date: new Date().toLocaleDateString()
    };
    setMemories(prev => prev.map(m =>
      m.id === memoryId ? { ...m, comments: [...(m.comments || []), newComment] } : m
    ));
  }, [setMemories]);

  const handleAddMemory = useCallback(() => {
    if (!newMemory.title || !uploadedImage) {
      alert('Please add a title and image!');
      return;
    }

    const memory = {
      id: generateId(),
      image: uploadedImage,
      title: newMemory.title,
      caption: newMemory.caption,
      date: new Date(newMemory.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: newMemory.date,
      likes: 0,
      comments: [],
      tags: newMemory.tags,
      locked: newMemory.locked
    };

    setMemories(prev => [memory, ...prev]);
    setNewMemory({ title: '', caption: '', date: new Date().toISOString().split('T')[0], tags: [], locked: false });
    setUploadedImage(null);
    setShowUploadModal(false);
  }, [newMemory, uploadedImage, setMemories]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large (max 10MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const openCommentModal = useCallback((memory) => {
    setSelectedMemoryForComment(memory);
    setShowCommentModal(true);
  }, []);

  const openSlideshow = useCallback((index) => {
    setSlideshowStartIndex(index);
    setShowSlideshow(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 px-4 py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Mini Instagram
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
            A mini Instagram feed, specially created for Ariya — from Ariyan.
          </p>
        </div>

        {/* Controls Bar - Responsive stacking */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="flex gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'feed' : 'grid')}
              className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Toggle view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Tag Filter */}
        <TagFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

        {/* Analytics Dashboard */}
        <AnalyticsDashboard memories={filteredMemories} />

        {/* Memories Display */}
        {filteredMemories.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredMemories.map((memory, idx) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  liked={!!likedPosts[memory.id]}
                  saved={!!savedPosts[memory.id]}
                  onLike={handleLike}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onComment={openCommentModal}
                  onImageClick={(img) => { setSelectedImage(img); setShowImageModal(true); }}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
              {filteredMemories.map((memory, idx) => (
                <MemoryFeedItem
                  key={memory.id}
                  memory={memory}
                  liked={!!likedPosts[memory.id]}
                  saved={!!savedPosts[memory.id]}
                  onLike={handleLike}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onComment={openCommentModal}
                  onImageClick={(img) => { setSelectedImage(img); setShowImageModal(true); }}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl">
            <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No memories found</h3>
            <p className="text-gray-500">Try adjusting your filters or add a new memory.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button with safe area */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse"
        style={{ bottom: 'env(safe-area-inset-bottom, 1rem)' }}
      >
        <Plus size={28} />
      </button>

      {/* Modals - conditionally rendered */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold">Add Memory</h2>
              <button onClick={() => { setShowUploadModal(false); setUploadedImage(null); }} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div
                className="border-3 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-pink-400 bg-gray-50 transition-colors"
                onClick={() => document.getElementById('memory-image').click()}
              >
                <input type="file" id="memory-image" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {uploadedImage ? (
                  <div className="space-y-2">
                    <img src={uploadedImage} alt="preview" className="max-h-40 mx-auto rounded-lg" />
                    <button onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }} className="text-sm text-red-500 hover:underline">Remove</button>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-700 font-medium">Tap to upload photo</p>
                    <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                  </>
                )}
              </div>
              <input
                type="text"
                placeholder="Title *"
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <textarea
                placeholder="Caption"
                value={newMemory.caption}
                onChange={(e) => setNewMemory({ ...newMemory, caption: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />
              <input
                type="date"
                value={newMemory.date}
                onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewMemory(prev => ({
                        ...prev,
                        tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
                      }))}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${newMemory.tags.includes(tag) ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newMemory.locked}
                  onChange={(e) => setNewMemory({ ...newMemory, locked: e.target.checked })}
                />
                <Lock size={18} />
                <span className="text-sm">Lock this memory (password required)</span>
              </label>
              <button
                onClick={handleAddMemory}
                disabled={!newMemory.title || !uploadedImage}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold disabled:opacity-50 transition-opacity"
              >
                Save Memory
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <ImageModal
          image={selectedImage}
          title="Memory"
          onClose={() => setShowImageModal(false)}
          onDownload={(img, title) => {
            const a = document.createElement('a');
            a.href = img;
            a.download = `${title.replace(/\s+/g, '_')}.jpg`;
            a.click();
          }}
        />
      )}

      {showCommentModal && selectedMemoryForComment && (
        <CommentModal
          memory={selectedMemoryForComment}
          onClose={() => setShowCommentModal(false)}
          onAddComment={handleAddComment}
        />
      )}

      {showSlideshow && (
        <SlideshowModal
          memories={filteredMemories}
          startIndex={slideshowStartIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}
    </div>
  );
};

export default Memories;