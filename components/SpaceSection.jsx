import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const SpaceSection = ({ projects, onProjectSelect }) => {
  // Generate random positions for background stars
  const bgStars = useMemo(() => {
    return Array.from({ length: 800 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  // Generate random positions for projects, ensuring they stay somewhat within the viewport
  const projectStars = useMemo(() => {
    return projects.map((project) => {
      // Generate random vibrant colors for blinking
      const hue1 = Math.random() * 360;
      const hue2 = (hue1 + 180 + (Math.random() * 60 - 30)) % 360; // Opposite hue with some variation
      const saturation = Math.random() * 30 + 70; // 70-100% saturation
      const lightness = Math.random() * 20 + 60; // 60-80% lightness

      return {
        ...project,
        x: Math.random() * 80 + 10, // 10% to 90% range
        y: Math.random() * 80 + 10,
        duration: Math.random() * 2 + 1, // For star seed opacity blink
        delay: Math.random() * 2, // For star seed opacity blink
        starColor1: `hsl(${hue1}, ${saturation}%, ${lightness}%)`,
        starColor2: `hsl(${hue2}, ${saturation}%, ${lightness}%)`,
        colorDuration: Math.random() * 2 + 1.5, // 1.5 to 3.5 seconds for color blink
        starSize: Math.random() * 20 + 40, // 40px to 60px for star font size
      };
    });
  }, [projects]);

  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 50px)', 
        backgroundColor: 'black', 
        overflow: 'hidden',
        cursor: 'default'
      }}
    >
      {/* Background Twinkling Stars */}
      {bgStars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            color: 'white',
            fontSize: `${star.size * 5}px`,
            lineHeight: 1,
            pointerEvents: 'none'
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        >
          *
        </motion.div>
      ))}

      {/* Project Constellation */}
      {projectStars.map((project) => (
        <motion.div
          key={project.id}
          style={{
            position: 'absolute',
            left: `${project.x}%`,
            top: `${project.y}%`,
            zIndex: 10,
            width: '150px', // Adjusted hit area to 150px
            height: '150px', // Adjusted hit area to 150px
            background: 'rgba(255, 255, 255, 0.001)', // Ensures the mouse "hits" the empty space
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
          whileHover="active"
          onClick={() => onProjectSelect(project.id)}
        >
          {/* The Star Seed */}
          <motion.div
            style={{
              color: project.starColor1, // Use generated color
              fontSize: `${project.starSize}px`, // Use generated size
              position: 'absolute',
              textShadow: '0 0 20px rgba(255,255,255,0.8)', // More prominent glow
              pointerEvents: 'none'
            }}
            variants={{
              active: { opacity: 0, scale: 0.5 }
            }}
            animate={{ color: [project.starColor1, project.starColor2, project.starColor1], opacity: [0.5, 1, 0.5] }} // Blink between generated colors
            transition={{ duration: project.colorDuration, repeat: Infinity, delay: project.delay, ease: "easeInOut" }} // Use generated duration
          >
            *
          </motion.div>

          {/* The Expanding Artwork */}
          <motion.div
            variants={{
              active: { scale: 1, opacity: 1 }
            }}
            initial={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            style={{ textAlign: 'center', pointerEvents: 'none' }}
          >
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              style={{ 
                width: '200px', 
                height: '200px', 
                aspectRatio: '1 / 1', // Ensure square aspect ratio
                objectFit: 'cover', 
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 0 40px rgba(255,255,255,0.1)'
              }} 
            />
            <div style={{ color: 'white', fontSize: '10px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              {project.title}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default SpaceSection;