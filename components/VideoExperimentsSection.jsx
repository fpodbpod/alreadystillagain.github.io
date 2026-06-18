import React from 'react';

const VideoExperimentsSection = ({ projects, onProjectSelect }) => {
  const items = projects.filter(p => p.pages?.includes('vhs multitracking'));

  return (
    <div style={{ padding: '100px 40px', backgroundColor: 'white', minHeight: 'calc(100vh - 50px)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '40px', marginBottom: '10px' }}>VHS Multitracking</h2>
        <p style={{ color: '#666', marginBottom: '60px', fontWeight: '300', fontSize: '14px', letterSpacing: '0.05em', maxWidth: '800px', lineHeight: '1.6' }}>
          VHS multitracking is a unique process I have developed for combing temporalities in analog video. Inspired by the method of tape multitracking for combining non-contemporaneous music performances, and evoking the work of Alvin Lucier, VHS multitracking uses two VCR’s, two VHS tapes, a video mixer, an audio mixer and a camera to allow live performance to be mixed with previous performance instances. As this process progresses, previous instances degrade through “generation loss,” creating a simultaneous palimpsest of performances as well as the unique aesthetic qualities of analog video tape degradation.
        </p>
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

export default VideoExperimentsSection;
