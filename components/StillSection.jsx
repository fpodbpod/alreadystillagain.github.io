import React from 'react';

const StillSection = ({ projects, onProjectSelect }) => {
  const items = projects.filter(p => p.pages?.includes('still'));

  return (
    <div style={{ padding: '100px 40px', backgroundColor: 'white', minHeight: 'calc(100vh - 50px)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '40px', marginBottom: '60px' }}>Still</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
          {items.map(project => (
            <div key={project.id} onClick={() => onProjectSelect(project.id)} style={{ cursor: 'pointer' }}>
              <img src={project.thumbnail} alt={project.title} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: '1px solid #eee' }} />
              <h3 style={{ marginTop: '15px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{project.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StillSection;