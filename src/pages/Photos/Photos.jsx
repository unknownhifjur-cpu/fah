"use client";

import { useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

const Photos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Sample photos
  const photos = [
    {
      id: 1,
      url: "/image/marry.jpg",
      caption: "Tomar r Amar Biye"
    },
    {
      id: 2,
      url: "/image/canva1.png",
      caption: "Kemon Lagche?"
    },
    {
      id: 3,
      url: "/image/aleyen.png",
      caption: "Alien/Aleyen"
    },
    {
      id: 4,
      url: "/image/c2.png",
      caption: "FAHIF=Fahamida+Hifjur"
    },
    {
      id: 5,
      url: "/image/c3.png",
      caption: "HF"
    },
    {
      id: 7,
      url: "/image/6.jpg",
      caption: "Tomake saree te sei lagche!"
    },
    {
      id: 8,
      url: "/image/mrr 1.png",
      caption: "Forever Memories"
    },
    {
      id: 9,
      url: "/image/8.jpg",
      caption: "Pichhi!"
    },
    {
      id: 10,
      url: "/image/9.jpg",
      caption: "Bou Bou lagche!"
    },
    {
      id: 11,
      url: "/image/11.jpeg",
      caption: "Smile!"
    },
    {
      id: 12,
      url: "/image/12.jpeg",
      caption: "Ore Bapre!"
    },
    {
      id: 13,
      url: "/image/13.jpeg",
      caption: "Aura!"
    },
    {
      id: 14,
      url: "/image/14.jpeg",
      caption: "Ei vabe rakhte parba?!"
    },
    {
      id: 15,
      url: "/image/15.jpeg",
      caption: "Sob tumi."
    },
    {
      id: 16,
      url: "/image/16.jpeg",
      caption: "Moti lagche!"
    },
    {
      id: 17,
      url: "/image/17.jpg",
      caption: "Pichhi!"
    },
    {
      id: 18,
      url: "/image/18.jpg",
      caption: "Ka k dekhcho?"
    },
    {
      id: 19,
      url: "/image/19.jpg",
      caption: "What a style!"
    },
    {
      id: 20,
      url: "/image/20.jpg",
      caption: "Tal gach!"
    },
    {
      id: 21,
      url: "/image/21.jpg",
      caption: "Etao tal gach!"
    },
    {
      id: 22,
      url: "/image/22.jpg",
      caption: "Kola gach!"
    },
    {
      id: 23,
      url: "/image/23.jpg",
      caption: "Ami to fidaa!"
    },
    {
      id: 24,
      url: "/image/24.jpg",
      caption: "Forever Memories"
    },
    {
      id: 25,
      url: "/image/25.jpg",
      caption: "Nice!"
    },
    {
      id: 26,
      url: "/image/26.jpg",
      caption: "Forever Memories"
    },
    {
      id: 27,
      url: "/image/27.jpg",
      caption: "Forever Memories"
    },
    {
      id: 28,
      url: "/image/28.jpg",
      caption: "Forever"
    },
    {
      id: 29,
      url: "/image/29.jpg",
      caption: "Forever Memories"
    },
    {
      id: 30,
      url: "/image/30.jpg",
      caption: "Forever Memories"
    },
    {
      id: 31,
      url: "/image/31.jpg",
      caption: "Forever Memories"
    },
    {
      id: 32,
      url: "/image/32.jpg",
      caption: "Forever Memories"
    },
    {
      id: 33,
      url: "/image/33.jpg",
      caption: "Forever Memories"
    },
    {
      id: 34,
      url: "/image/34.jpg",
      caption: "Forever Memories"
    },
    {
      id: 35,
      url: "/image/35.jpeg",
      caption: "Forever Memories"
    },
    {
      id: 36,
      url: "/image/36.jpeg",
      caption: "Forever Memories"
    },

    {
      id: 38,
      url: "/image/3.jpg",
      caption: "Forever Memories"
    },
    {
      id: 39,
      url: "/image/c1.jpeg",
      caption: "Forever Memories"
    },
    
  
    {
      id: 42,
      url: "/image/5.jpg",
      caption: "Forever Memories"
    },
    {
      id: 43,
      url: "/image/c4.jpeg",
      caption: "You and Me!"
    },
    {
      id: 44,
      url: "/image/c5.jpeg",
      caption: "Only You"
    },
    {
      id: 45,
      url: "/image/c6.webp",
      caption: "HF"
    },
    {
      id: 46,
      url: "/image/c7.jpeg",
      caption: "Tumi r ami!"
    },
    {
      id: 47,
      url: "/image/fahif.jpg",
      caption: "Hostel a"
    },
    {
      id: 48,
      url: "/image/farewell.jpg",
      caption: "Teachers' day"
    },
   
    {
      id: 50,
      url: "/image/hif.jpg",
      caption: "Hostel a"
    },
    {
      id: 51,
      url: "/image/letter.jpg",
      caption: "Invitation card"
    },
    {
      id: 52,
      url: "/image/letter1.jpeg",
      caption: "Amar kobita gula"
    },
    {
      id: 53,
      url: "/image/1.jpg",
      caption: "Forever Memories"
    },
    {
      id: 54,
      url: "/image/mni1.jpg",
      caption: "MNi hostel"
    },
    {
      id: 55,
      url: "/image/mni2.jpg",
      caption: "Hostel er samne"
    },
    {
      id: 56,
      url: "/image/note1.jpg",
      caption: "Note"
    },
    {
      id: 57,
      url: "/image/sept51.jpg",
      caption: "5th sept"
    },
    {
      id: 58,
      url: "/image/sept52.jpg",
      caption: "5th sept"
    },
    {
      id: 59,
      url: "/image/tmps1.jpg",
      caption: "TMPS hostel"
    },
    {
      id: 60,
      url: "/image/tmps2.jpg",
      caption: "Hostel "
    },
    {
      id: 61,
      url: "/image/tmps3.jpg",
      caption: "TMPS hostel"
    },
    {
      id: 63,
      url: "/image/canva2.png",
      caption: "Editing"
    },
    {
      id: 64,
      url: "/image/couple1.jpg",
      caption: "Editing"
    },
    {
      id: 65,
      url: "/image/couple2.png",
      caption: "Editing"
    },
    {
      id: 66,
      url: "/image/hand1.png",
      caption: "Editing"
    },
    {
      id: 67,
      url: "/image/invite1.png",
      caption: "Biyer card"
    },
    {
      id: 68,
      url: "/image/little.png",
      caption: "Pichhi!"
    },
    {
      id: 69,
      url: "/image/marry2.jpg",
      caption: "Editing"
    },
    {
      id: 70,
      url: "/image/marry3.png",
      caption: "Editing"
    },
    {
      id: 71,
      url: "/image/7.jpg",
      caption: "Pichhi with T -shirt"
    },
  ];

  const openPhotoViewer = (photo) => {
    setSelectedPhoto(photo);
    setIsViewerOpen(true);
  };

  const closePhotoViewer = () => {
    setIsViewerOpen(false);
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction) => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % photos.length;
    } else {
      newIndex = (currentIndex - 1 + photos.length) % photos.length;
    }
    
    setSelectedPhoto(photos[newIndex]);
  };

  return (
    <div className="min-h-screen bg-rose-50 pt-20 px-4 pb-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-rose-600 mb-3">
            Photos
          </h1>
          <p className="text-gray-600">
            Beautiful memories we've created together
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer"
              onClick={() => openPhotoViewer(photo)}
            >
              {/* Photo */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-lg flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>Click on any photo to view it larger</p>
          <p className="mt-1">Scroll through photos with arrow keys</p>
        </div>
      </div>

      {/* Photo Viewer */}
      {isViewerOpen && selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closePhotoViewer}
            className="absolute top-4 right-4 text-white hover:text-rose-300 transition-colors"
          >
            <X size={28} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={() => navigatePhoto('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-rose-300 transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button
            onClick={() => navigatePhoto('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-rose-300 transition-colors"
          >
            <ChevronRight size={32} />
          </button>

          {/* Photo */}
          <div className="max-w-4xl w-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="w-full h-auto rounded-lg"
            />
            
            {/* Caption */}
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">
                {selectedPhoto.caption}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Photo {photos.findIndex(p => p.id === selectedPhoto.id) + 1} of {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;