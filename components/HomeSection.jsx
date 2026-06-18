import React, { useRef } from 'react';

const HomeSection = ({ projects, onProjectSelect }) => {
  const audioRef = useRef(null);
  const recentWorks = projects.filter(p => p.pages?.includes('recent work')).slice(0, 4);

  const playStatement = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(`${import.meta.env.BASE_URL}assets/statement.mp3`);
      }
      audioRef.current.play();
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        backgroundColor: 'black', 
        minHeight: 'calc(100vh - 50px)',
        overflowY: 'auto'
      }}
    >
      {/* Top Hero Section */}
      <div style={{ position: 'relative', height: 'calc(100vh - 50px)', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        {/* Instructional Overlay */}
        <div
          className="home-hero-hint"
          style={{ 
            position: 'absolute', 
            top: '144px', 
          left: 'calc(25% + 48px)', // Moved right 1/2"
          color: 'white', 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.2em',
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '300'
        }}
      >
        click to get hip 
        <div style={{ 
          width: 0, 
          height: 0, 
          borderTop: '5.5px solid transparent',
          borderBottom: '5.5px solid transparent',
          borderLeft: '9.5px solid white'
        }} />
      </div>

        <img 
          src={`${import.meta.env.BASE_URL}assets/pinksean.gif`}
          alt="alreadystillagain" 
          onClick={playStatement}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            cursor: 'pointer'
          }} 
        />
      </div>

      {/* Recent Works Section */}
      <div style={{ backgroundColor: 'white', padding: '100px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            fontSize: '40px',
            marginBottom: '60px',
            color: 'black'
          }}>
            Recent Works
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '40px' 
          }}>
            {recentWorks.map(project => (
              <div 
                key={project.id} 
                onClick={() => onProjectSelect(project.id)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: '1px solid #eee' }} 
                />
                <h3 style={{ marginTop: '15px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {project.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
