import React from 'react';

const InteractiveSection = ({ projects, onProjectSelect }) => {
  const interactiveProjects = projects.filter(p => p.pages?.includes('interactive'));

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
          marginBottom: '60px',
          color: 'black'
        }}>
          Interactive
        </h2>
        
        {interactiveProjects.length === 0 ? (
          <p style={{ color: '#666', marginTop: '20px', fontWeight: '300', fontSize: '14px', letterSpacing: '0.05em' }}>
            No interactive projects found. Please add projects and tag them for "interactive" in the Project Manager.
          </p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '40px' 
          }}>
            {interactiveProjects.map(project => (
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

export default InteractiveSection;
