import React, { useState } from 'react';

const AboutSection = () => {
  const [activeAudio, setActiveAudio] = useState(null);

  const handleHear = (src) => {
    setActiveAudio(src);
  };

  return (
    <div style={{ 
      padding: '60px 40px', 
      backgroundColor: 'white', 
      minHeight: 'calc(100vh - 50px)',
      maxWidth: '1600px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', alignItems: 'flex-start' }}>
        {/* Artist Statement Section */}
        <div style={{ marginBottom: '0' }}>
          <h2 className="section-title section-title-large" style={{ 
            fontSize: '60px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em',
            margin: '0 0 20px 0' 
          }}>
            Artist Statement
          </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <a 
                href={`${import.meta.env.BASE_URL}assets/statement.pdf`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: 'none', color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.5' }}>
                  click to
                </span>
                <span style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.2' }}>
                  see
                </span>
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <button 
                onClick={() => handleHear(`${import.meta.env.BASE_URL}assets/statement.mp3`)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.5' }}>
                  click to
                </span>
                <span style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.2' }}>
                  hear
                </span>
              </button>
              {activeAudio?.includes('statement.mp3') && (
                <audio key={activeAudio} controls autoPlay style={{ height: '32px' }}>
                  <source src={activeAudio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        </div>

        {/* CV Section */}
        <div style={{ marginBottom: '0' }}>
          <h2 className="section-title section-title-large" style={{ 
            fontSize: '60px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            margin: '0 0 20px 0' 
          }}>
            CV
          </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <a 
                href={`${import.meta.env.BASE_URL}assets/cv.pdf`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: 'none', color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.5' }}>
                  click to
                </span>
                <span style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.2' }}>
                  see
                </span>
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <button 
                onClick={() => handleHear(`${import.meta.env.BASE_URL}assets/cv.mp3`)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.5' }}>
                  click to
                </span>
                <span style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.2' }}>
                  hear
                </span>
              </button>
              {activeAudio?.includes('cv.mp3') && (
                <audio key={activeAudio} controls autoPlay style={{ height: '32px' }}>
                  <source src={activeAudio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        </div>

        {/* Reach Out Section */}
        <div style={{ marginBottom: '0' }}>
          <h2 className="section-title section-title-large" style={{ 
            fontSize: '60px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            margin: '0 0 20px 0' 
          }}>
            Reach Out
          </h2>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <a 
              href="https://instagram.com/alreadystillagain" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ textDecoration: 'none', color: 'black', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              IG
            </a>
            <span style={{ fontSize: '11px', color: 'black' }}>|</span>
            <a 
              href="mailto:fpodbpod@gmail.com" 
              style={{ textDecoration: 'none', color: 'black', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              fpodbpod@gmail.com
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutSection;
