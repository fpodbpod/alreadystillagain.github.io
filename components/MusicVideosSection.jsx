import React from 'react';

const MusicVideosSection = ({ projects, onProjectSelect }) => {
  const musicVideos = projects.filter(p => p.pages?.includes('music videos'));

  return (
    <div style={{ 
      padding: '100px 40px', 
      backgroundColor: 'white', 
      minHeight: 'calc(100vh - 50px)' 
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          letterSpacing: '0.2em', 
          fontSize: '40px',
          marginBottom: '10px',
          color: 'black'
        }}>
          Music Videos
        </h2>
        <p style={{ color: '#666', marginBottom: '60px', fontWeight: '300', fontSize: '14px', letterSpacing: '0.05em' }}>
          Commissioned work for music made by my friends as well as my side project, Duke II.
        </p>
        
        {musicVideos.length === 0 ? (
          <p style={{ color: '#666', marginTop: '20px', fontWeight: '300', fontSize: '14px', letterSpacing: '0.05em' }}>
            No projects found. Please add projects and tag them for "music videos" in the Project Manager.
          </p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '40px' 
          }}>
            {musicVideos.map(project => (
              <div 
                key={project.id} 
                onClick={() => onProjectSelect(project.id)}
                style={{ cursor: 'pointer' }}
              >
                <img src={project.thumbnail} alt={project.title} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: '1px solid #eee' }} />
                <h3 style={{ marginTop: '15px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{project.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicVideosSection;
