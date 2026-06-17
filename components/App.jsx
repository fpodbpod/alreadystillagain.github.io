import React, { useState, useCallback } from 'react';
import { projects } from './projects.js';
import RecentWorkSection from './RecentWorkSection.jsx';
import HomeSection from './HomeSection.jsx';
import InteractiveSection from './InteractiveSection.jsx';
import MusicVideosSection from './MusicVideosSection.jsx';
import VideoExperimentsSection from './VideoExperimentsSection.jsx';
import StillSection from './StillSection.jsx';
import MusicTelevisionSection from './MusicalFortuneSection.jsx';
import AboutSection from './AboutSection.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeProject = projects.find(p => p.id === selectedId);

  const handleProjectSelect = useCallback((id) => {
    const project = projects.find(p => p.id === id);
    // If it's a link, open in new tab instead of opening modal
    if (project?.type === 'link') {
      window.open(project.linkUrl, '_blank');
    } else {
      setSelectedId(id);
    }
  }, []);

  return (
    <div className="relative overflow-hidden font-sans" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Global Navigation Bar */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          zIndex: 10000, 
          backgroundColor: 'black', 
          padding: '12px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: '300', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          {currentSection === 'about' ? (
            <>Who is <span style={{ fontWeight: '900' }}>Sean Olmstead</span>?</>
          ) : (
            <><span style={{ fontWeight: '900' }}>Already Still Again</span> <span style={{ textTransform: 'lowercase' }}>the art of</span> <span style={{ fontWeight: '900' }}>Sean Olmstead</span></>
          )}
        </h1>
        
        <nav style={{ position: 'relative' }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '14px',
              letterSpacing: '0.2em',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            INDEX {isMenuOpen ? '↑' : '↓'}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: '-40px',
                  backgroundColor: 'black',
                  padding: '24px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  minWidth: '220px',
                  textAlign: 'right',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {['home', 'recent work', 'vhs multitracking', 'still', 'music videos', 'music', 'watch tv', 'interactive', 'about'].map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      setCurrentSection(section);
                      setIsMenuOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: currentSection === section ? 'white' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '0.3em',
                      transition: 'color 0.3s ease',
                      padding: '4px 0',
                      textAlign: 'right',
                      width: '100%'
                    }}
                  >
                    {section}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Main Experience */}
      <main style={{ paddingTop: '50px' }}>
        {currentSection === 'home' && (
          <HomeSection projects={projects} onProjectSelect={handleProjectSelect} />
        )}
        {currentSection === 'recent work' && (
          <RecentWorkSection projects={projects} onProjectSelect={handleProjectSelect} />
        )}
        {currentSection === 'about' && (
          <AboutSection />
        )}
        {currentSection === 'music videos' && (
          <MusicVideosSection projects={projects} onProjectSelect={handleProjectSelect} />
        )}
        {currentSection === 'vhs multitracking' && (
          <VideoExperimentsSection projects={projects} onProjectSelect={handleProjectSelect} />
        )}
        {currentSection === 'still' && (
          <StillSection projects={projects} onProjectSelect={handleProjectSelect} />
        )}
        {currentSection === 'watch tv' && (
          <MusicTelevisionSection projects={projects} onProjectSelect={handleProjectSelect} />
        )}
        {currentSection === 'interactive' && (
          <InteractiveSection projects={projects} onProjectSelect={handleProjectSelect} />
        )}
        {!['home', 'recent work', 'vhs multitracking', 'still', 'music videos', 'watch tv', 'interactive', 'about'].includes(currentSection) && (
          <div style={{ padding: '100px 40px', backgroundColor: 'white', minHeight: 'calc(100vh - 50px)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <h2 style={{ fontWeight: '300', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '24px' }}>{currentSection}</h2>
              <p style={{ color: '#666', marginTop: '20px', fontWeight: '300', fontSize: '14px', letterSpacing: '0.05em' }}>This section is currently under construction.</p>
            </div>
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '20px',
              backgroundColor: 'white', 
              zIndex: 9999 
            }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div 
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              style={{ 
                backgroundColor: 'white', 
                width: '100%', 
                maxWidth: '1100px', 
                maxHeight: '90vh', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ position: 'relative', width: '100%', backgroundColor: '#000', display: 'block' }}>
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedId(null)}
                  style={{ 
                    position: 'absolute', top: '15px', right: '20px', zIndex: 100,
                    border: 'none', background: 'none', cursor: 'pointer', 
                    lineHeight: '1', color: 'black', padding: '10px',
                    fontSize: '40px', fontWeight: '300'
                  }}
                  aria-label="Close"
                >
                  &times;
                </button>

                {activeProject?.type === 'video' && (
                  <div 
                    key={activeProject.id} 
                    style={{ 
                      position: 'relative', 
                      width: '100%', 
                      padding: '56.25% 0 0 0', 
                      backgroundColor: '#000',
                    }}
                  >
                    <iframe
                      src={`https://player.vimeo.com/video/${activeProject.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1`}
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        border: 'none',
                        display: 'block',
                        visibility: 'visible',
                        opacity: 1
                      }}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      title={activeProject.title}
                    ></iframe>
                  </div>
                )}

                {activeProject?.type === 'image' && (
                  <div className="flex justify-center items-center bg-black min-h-[400px]">
                    <img 
                      src={activeProject.imageUrl || activeProject.thumbnail} 
                      alt={activeProject.title}
                      className="max-w-full max-h-[80vh] object-contain block mx-auto"
                    />
                  </div>
                )}

                {activeProject?.type === 'audio' && (
                  <div className="flex flex-col items-center p-12 w-full">
                    <img src={activeProject.thumbnail} className="w-48 h-48 mb-8 rounded-lg shadow-lg object-cover" alt="Album Art" />
                    <audio controls src={activeProject.audioUrl} className="w-full max-w-md">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
              <div className="p-8 text-black bg-white border-t border-black/10">
                <h2 className="text-3xl font-light tracking-tight">{activeProject?.title}</h2>
                <p className="text-neutral-600 mt-2 font-light leading-relaxed whitespace-pre-wrap">{activeProject?.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;