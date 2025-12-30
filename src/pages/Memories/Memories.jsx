import React, { useState, useEffect } from "react";
import { 
  Heart, Image as ImageIcon, Plus, X, MessageCircle, 
  Send, MoreVertical, Bookmark, Grid, Trash2, 
  Calendar, Smile, Download, Share2, AlertCircle
} from "lucide-react";



const Memories = () => {
  // Load memories from localStorage on component mount
  const [memories, setMemories] = useState(() => {
    const savedMemories = localStorage.getItem("memoriesData");
    return savedMemories ? JSON.parse(savedMemories) : [
      {
        id: 1,
        image: "https://i.pinimg.com/736x/a2/ef/d6/a2efd664e9b1ae6679ad18599ef09c2a.jpg", // Your own image
        title: "First Meet 💕",
        date: "15 March 2023",
        likes: 152,
        comments: 12,
        saved: true,
        timestamp: "2023-03-15",
        caption: "The day our story began! ❤️ #FirstMeet"
      },
      {
        id: 2,
        image: "https://wallpaperbat.com/img/492674-cute-girl-art-4k-iphone-hd-4k-wallpaper-image-background-photo-and-picture.jpg", // Your own image
        title: "Mountain Trip 🌄",
        date: "10 July 2023",
        likes: 198,
        comments: 24,
        saved: false,
        timestamp: "2023-07-10",
        caption: "Adventures together are the best! 🏔️"
      },
      {
        id: 3,
        image: "/images/memory3.jpg", // Your own image
        title: "Coffee Date ☕",
        date: "02 Jan 2024",
        likes: 234,
        comments: 18,
        saved: true,
        timestamp: "2024-01-02",
        caption: "Morning coffee dates are our favorite ritual! ✨"
      },
      {
        id: 4,
        image: "/images/memory4.jpg", // Your own image
        title: "Beach Sunset 🌅",
        date: "25 May 2024",
        likes: 189,
        comments: 15,
        saved: false,
        timestamp: "2024-05-25",
        caption: "Beautiful sunset by the beach! 🏖️"
      },
    ];
  });

  // Rest of your component remains the same...
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [newMemory, setNewMemory] = useState({ 
    title: "", 
    caption: "",
    date: new Date().toISOString().split('T')[0] 
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => {
    const savedLikes = localStorage.getItem("likedPosts");
    return savedLikes ? JSON.parse(savedLikes) : {};
  });
  const [savedPosts, setSavedPosts] = useState(() => {
    const savedSaves = localStorage.getItem("savedPosts");
    return savedSaves ? JSON.parse(savedSaves) : {};
  });
  const [commentInputs, setCommentInputs] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [failedImages, setFailedImages] = useState(new Set());

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("memoriesData", JSON.stringify(memories));
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }, [memories, likedPosts, savedPosts]);

  // Fallback image function
  const getFallbackImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Cpath d='M100,150 C133,130 167,130 200,150 C233,170 267,170 300,150' stroke='%23f472b6' stroke-width='3' fill='none'/%3E%3Ccircle cx='100' cy='150' r='8' fill='%23ec4899'/%3E%3Ccircle cx='200' cy='150' r='8' fill='%23ec4899'/%3E%3Ccircle cx='300' cy='150' r='8' fill='%23ec4899'/%3E%3Ctext x='200' y='220' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle'%3EAdd your memories%3C/text%3E%3C/svg%3E";
  };

  const handleImageError = (id) => {
    console.log(`Image ${id} failed to load`);
    setFailedImages(prev => new Set(prev).add(id));
  };

  const getImageUrl = (memory) => {
    if (failedImages.has(memory.id)) {
      return getFallbackImage();
    }
    return memory.image;
  };

  // Rest of your functions remain the same...
  const handleLike = (id) => {
    const isLiked = likedPosts[id];
    setLikedPosts(prev => ({
      ...prev,
      [id]: !isLiked
    }));
    
    setMemories(prev => prev.map(memory => 
      memory.id === id 
        ? { ...memory, likes: isLiked ? memory.likes - 1 : memory.likes + 1 }
        : memory
    ));
  };

  const handleSave = (id) => {
    const isSaved = savedPosts[id];
    setSavedPosts(prev => ({
      ...prev,
      [id]: !isSaved
    }));
    
    setMemories(prev => prev.map(memory => 
      memory.id === id 
        ? { ...memory, saved: !isSaved }
        : memory
    ));
  };

  const handleAddMemory = () => {
    if (!newMemory.title || !uploadedImage) {
      alert("Please add a title and image!");
      return;
    }
    
    const newMem = {
      id: Date.now(),
      image: uploadedImage,
      title: newMemory.title,
      caption: newMemory.caption,
      date: new Date(newMemory.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      timestamp: newMemory.date,
      likes: 0,
      comments: 0,
      saved: false,
    };
    
    setMemories([newMem, ...memories]);
    setNewMemory({ title: "", caption: "", date: new Date().toISOString().split('T')[0] });
    setUploadedImage(null);
    setShowUploadModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.onerror = () => {
        alert("Error reading the image file. Please try another image.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddComment = (id) => {
    const comment = commentInputs[id]?.trim();
    if (!comment) return;
    
    setMemories(prev => prev.map(memory => 
      memory.id === id 
        ? { ...memory, comments: memory.comments + 1 }
        : memory
    ));
    
    // Clear the input for this post
    setCommentInputs(prev => ({ ...prev, [id]: "" }));
  };

  const handleDeletePost = (id) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      setMemories(prev => prev.filter(memory => memory.id !== id));
    }
  };

  const handleDownloadImage = (imageUrl, title) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Unable to download image. Please try again.");
    }
  };

  const handleShareMemory = async (memory) => {
    const shareText = `Check out this memory: ${memory.title}\n${memory.caption}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert("Memory details copied to clipboard!");
    }
  };

  const filteredMemories = memories.filter(memory => {
    if (activeFilter === "saved") return savedPosts[memory.id];
    if (activeFilter === "liked") return likedPosts[memory.id];
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 px-4 py-24">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Mini Instagram
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            A mini Instagram feed, specially created for Ariya — from Ariyan.
          </p>
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Heart className="text-pink-500" size={18} />
              <span className="font-medium">{memories.reduce((sum, mem) => sum + mem.likes, 0)} total likes</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <MessageCircle className="text-blue-500" size={18} />
              <span className="font-medium">{memories.reduce((sum, mem) => sum + mem.comments, 0)} comments</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Add Memory
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "feed" : "grid")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Grid size={20} />
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "all" ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All ({memories.length})
            </button>
            <button
              onClick={() => setActiveFilter("liked")}
              className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "liked" ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Liked ({Object.values(likedPosts).filter(Boolean).length})
            </button>
            <button
              onClick={() => setActiveFilter("saved")}
              className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "saved" ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Saved ({Object.values(savedPosts).filter(Boolean).length})
            </button>
          </div>
        </div>
      </div>

      {/* Memories Display */}
      {filteredMemories.length > 0 ? (
        viewMode === "grid" ? (
          // Grid View
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image with overlay */}
                  <div 
                    className="relative h-64 overflow-hidden cursor-pointer group bg-gradient-to-br from-pink-50 to-purple-50"
                    onClick={() => {
                      setSelectedImage(getImageUrl(memory));
                      setShowImageModal(true);
                    }}
                  >
                    <img
                      src={getImageUrl(memory)}
                      alt={memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(memory.id)}
                      loading="lazy"
                    />
                    {failedImages.has(memory.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <AlertCircle className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Image not found</p>
                          <p className="text-xs text-gray-500">Add /images/memory{memory.id}.jpg to public folder</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick actions overlay */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(memory.id);
                        }}
                        className={`p-2 rounded-full ${likedPosts[memory.id] ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-800'}`}
                      >
                        <Heart size={20} fill={likedPosts[memory.id] ? "white" : "none"} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(memory.id);
                        }}
                        className={`p-2 rounded-full ${savedPosts[memory.id] ? 'bg-yellow-500 text-white' : 'bg-white/90 text-gray-800'}`}
                      >
                        <Bookmark size={20} fill={savedPosts[memory.id] ? "white" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800">{memory.title}</h3>
                      <button
                        onClick={() => handleDeletePost(memory.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{memory.caption}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart size={16} className={likedPosts[memory.id] ? "text-red-500 fill-red-500" : ""} />
                          <span>{memory.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{memory.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{memory.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Feed View
          <div className="max-w-2xl mx-auto space-y-6">
            {filteredMemories.map((memory) => (
              <div key={memory.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center text-white font-bold">
                      {memory.title.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{memory.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {memory.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareMemory(memory)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(memory.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div 
                  className="relative h-96 cursor-pointer bg-gradient-to-br from-pink-50 to-purple-50"
                  onClick={() => {
                    setSelectedImage(getImageUrl(memory));
                    setShowImageModal(true);
                  }}
                >
                  <img
                    src={getImageUrl(memory)}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(memory.id)}
                    loading="lazy"
                  />
                  {failedImages.has(memory.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Add your own image</p>
                        <p className="text-sm text-gray-500 mt-1">Place memory{memory.id}.jpg in /public/images/ folder</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(memory.id)}
                        className={`flex items-center gap-2 ${likedPosts[memory.id] ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                      >
                        <Heart size={24} fill={likedPosts[memory.id] ? "currentColor" : "none"} />
                        <span className="font-medium">{memory.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                        <MessageCircle size={24} />
                        <span className="font-medium">{memory.comments}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleSave(memory.id)}
                      className={savedPosts[memory.id] ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}
                    >
                      <Bookmark size={24} fill={savedPosts[memory.id] ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Caption */}
                  <p className="text-gray-800 mb-4">
                    <span className="font-bold">{memory.title.split(' ')[0]}</span> {memory.caption}
                  </p>

                  {/* Comment Input */}
                  <div className="flex gap-2 mt-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Smile size={20} />
                    </button>
                    <input
                      type="text"
                      value={commentInputs[memory.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ 
                        ...prev, 
                        [memory.id]: e.target.value 
                      }))}
                      placeholder="Add a comment..."
                      className="flex-1 border-none focus:outline-none focus:ring-0"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(memory.id)}
                    />
                    <button
                      onClick={() => handleAddComment(memory.id)}
                      disabled={!commentInputs[memory.id]?.trim()}
                      className="text-blue-500 font-semibold disabled:text-gray-400"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Empty State
        <div className="max-w-md mx-auto text-center py-20">
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <ImageIcon size={80} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No memories yet</h3>
            <p className="text-gray-600 mb-8">
              {activeFilter === "all" 
                ? "Start capturing your beautiful moments together!" 
                : `No ${activeFilter} memories found`}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Add Your First Memory
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Add New Memory</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedImage(null);
                  setNewMemory({ title: "", caption: "", date: new Date().toISOString().split('T')[0] });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div
                className="border-3 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-pink-400 transition-colors bg-gray-50"
                onClick={() => document.getElementById('memory-image-upload').click()}
              >
                <input
                  type="file"
                  id="memory-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  capture="environment"
                />
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-xl" 
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-700 font-medium mb-2">Tap to upload photo</p>
                    <p className="text-sm text-gray-500">Use camera or choose from gallery</p>
                    <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, GIF</p>
                  </>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Memory Title *
                </label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  placeholder="Give this memory a title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={newMemory.caption}
                  onChange={(e) => setNewMemory({ ...newMemory, caption: e.target.value })}
                  placeholder="Write something about this memory..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newMemory.date}
                  onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleAddMemory}
                disabled={!newMemory.title || !uploadedImage}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Save Memory
              </button>

              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                <p>💾 Images are saved locally on your device</p>
                <p className="text-xs mt-1">Add your own images to /public/images/ folder</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image View Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
          >
            <X size={30} />
          </button>
          
          <div className="relative w-full max-w-4xl">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = getFallbackImage();
              }}
            />
            
            {/* Download Button */}
            <button
              onClick={() => handleDownloadImage(selectedImage, "memory")}
              className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Download size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-bounce-slow"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Memories;