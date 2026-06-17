import React, { useState, useEffect, useRef } from 'react';

const MusicTelevisionSection = ({ projects }) => {
  // Filter for both old and new tags to ensure transition is smooth
  const tvVideos = projects.filter(p => 
    p.type === 'video' && 
    (p.pages?.includes('watch tv') || p.pages?.includes('music television') || p.pages?.includes('musical fortune'))
  );

  const [playlist, setPlaylist] = useState([]);
  const [pointer, setPointer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const iframeRef = useRef(null);

  // Control the Vimeo player without reloading the iframe
  useEffect(() => {
    if (iframeRef.current) {
      const cmd = isPlaying ? 'play' : 'pause';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ method: cmd }), '*');
    }
  }, [isPlaying]);

  // Generate a randomized playlist when the component mounts or videos change
  useEffect(() => {
    if (tvVideos.length > 0) {
      const indices = tvVideos.map((_, i) => i);
      // Fisher-Yates shuffle algorithm
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setPlaylist(indices);
      setPointer(0);
    }
  }, [tvVideos.length]);

  const nextChannel = () => {
    if (playlist.length === 0) return;
    // Move to the next index in the shuffled playlist, looping back to 0 at the end
    setPointer((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevChannel = () => {
    if (playlist.length === 0) return;
    // Move backwards in the playlist, looping to the end if at the start
    setPointer((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  // Resolve the active video from our shuffled playlist
  const activeVideo = playlist.length > 0 ? tvVideos[playlist[pointer]] : null;
  const green = "#39FF14"; // Old School TV Neon Green

  return (
    <div style={{ 
      width: '100%', 
      height: 'calc(100vh - 50px)', 
      backgroundColor: 'black', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* TV Frame Container */}
      <div className="watch-tv-frame" style={{ position: 'relative', width: '100%', height: '100%' }}>
        
        {/* Video Layer (Sits behind the mask) */}
        <div className="watch-tv-video-layer" style={{ 
          position: 'absolute', 
          top: 'calc(12.2% - 50px)', 
          left: '13%', 
          width: '68.8%', 
          height: '68.6%', 
          backgroundColor: '#111',
          zIndex: 1,
          overflow: 'hidden'
        }}>
          {activeVideo && (
            <iframe
              ref={iframeRef}
              src={`https://player.vimeo.com/video/${activeVideo.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&api=1`}
              style={{ width: '100%', height: '100%', border: 'none', opacity: isPlaying ? 1 : 0 }}
              allow="autoplay; fullscreen; picture-in-picture"
              title={activeVideo.title}
              frameBorder="0"
            />
          )}
          {activeVideo && (
             <img 
               src={activeVideo.thumbnail} 
               style={{ 
                 position: 'absolute', top: 0, left: 0, 
                 width: '100%', height: '100%', 
                 objectFit: 'cover', opacity: isPlaying ? 0 : 0.4,
                 pointerEvents: 'none',
                 transition: 'opacity 0.3s ease'
               }} 
             />
          )}
        </div>

        {/* Mask Layer */}
        <img
          className="watch-tv-mask"
          src={`${import.meta.env.BASE_URL}assets/tv.png`}
          alt="TV Mask" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 2, 
            pointerEvents: 'none' 
          }} 
        />

        {/* Green TV Controls - Now overlaid on the frame */}
        <div className="watch-tv-controls" style={{ 
          position: 'absolute',
          bottom: 'calc(8% + 15px)',
          left: 'calc(50% - 50px)',
          transform: 'translateX(-50%)',
          display: 'flex', 
          gap: '40px', 
          zIndex: 10 
        }}>
          <button onClick={prevChannel} style={controlStyle(green)}>
            <svg width="50" height="40" viewBox="0 0 24 24" fill={green}>
              <path d="M18 6l-8.5 6 8.5 6V6zM8 6l-8.5 6 8.5 6V6z" />
            </svg>
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={controlStyle(green)}>
            {isPlaying ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill={green}>
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill={green}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button onClick={nextChannel} style={controlStyle(green)}>
            <svg width="50" height="40" viewBox="0 0 24 24" fill={green}>
              <path d="M6 18l8.5-6L6 6v12zM16 18l8.5-6L16 6v12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const controlStyle = (color) => ({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  filter: `drop-shadow(0 0 8px ${color})`
});

export default MusicTelevisionSection;
