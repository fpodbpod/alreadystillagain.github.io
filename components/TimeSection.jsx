import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const TimeSection = ({ projects, onProjectSelect }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create());

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;
    const engine = engineRef.current;

    // Increase iterations to prevent objects from glitching or falling through floors.
    engine.positionIterations = 10;
    engine.velocityIterations = 10;

    const navHeight = 50; // Accounting for the black header
    const canvasHeight = window.innerHeight - navHeight;

    const world = engine.world;
    world.gravity.y = 0.5; // Slow the fall rate by 50%

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: canvasHeight,
        background: 'transparent',
        wireframes: false, 
      }
    });

    // Using 1000px thick boundaries to prevent "tunneling" (objects falling through)
    const ground = Bodies.rectangle(window.innerWidth / 2, canvasHeight + 500, window.innerWidth, 1000, { isStatic: true });
    const leftWall = Bodies.rectangle(-500, canvasHeight / 2, 1000, canvasHeight, { isStatic: true });
    const rightWall = Bodies.rectangle(window.innerWidth + 500, canvasHeight / 2, 1000, canvasHeight, { isStatic: true });
    Composite.add(world, [ground, leftWall, rightWall]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.1, render: { visible: false } }
    });
    Composite.add(world, mouseConstraint);

    // Use a custom low-res image for the cursor (hotspot set to center 32 32)
    const customCursor = 'url("/assets/eye-cursor.png") 32 32, pointer';

    // Change cursor to pointer when hovering over a project icon
    Events.on(mouseConstraint, 'mousemove', (event) => {
      const foundBody = Matter.Query.point(Composite.allBodies(world), event.mouse.position).find(
        (b) => b.projectId
      );
      render.canvas.style.cursor = foundBody ? customCursor : 'default';
    });

    Events.on(mouseConstraint, 'mousedown', () => {
      const clickedBody = mouseConstraint.body;
      if (clickedBody && clickedBody.projectId) {
        // Force release the body so it doesn't stick to the cursor after the modal opens
        mouseConstraint.mouse.button = -1;
        mouseConstraint.body = null;
        mouseConstraint.constraint.bodyB = null;
        
        onProjectSelect(clickedBody.projectId);
      }
    });

    // Calculate a dynamic drop size so it looks good on both mobile and desktop
    const dropSize = Math.min(window.innerWidth * 0.2, 120);
    const timeouts = [];
    projects.forEach((project, i) => {
      const tid = setTimeout(() => {
        const xPos = (window.innerWidth / 2) + (Math.random() * 200 - 100);
        
        const box = Bodies.rectangle(xPos, -100, dropSize, dropSize, {
          restitution: 0.9, // Increase bouncing behavior by 50%
          friction: 0.5,
          render: {
            sprite: {
              texture: project.thumbnail,
              xScale: dropSize / 300, // Updated to expect 300px source icons
              yScale: dropSize / 300
            }
          }
        });

        box.projectId = project.id;
        Composite.add(world, box);
      }, i * 2250); // Increase time between items falling by 50% (1.5s -> 2.25s)
      timeouts.push(tid);
    });

    Render.run(render);
    // Using isFixed: true makes the physics simulation much more stable
    const runner = Runner.create({ isFixed: true });
    Runner.run(runner, engine);

    const handleResize = () => {
      const newCanvasHeight = window.innerHeight - navHeight;
      render.canvas.width = window.innerWidth;
      render.canvas.height = newCanvasHeight;
      
      // Update render options so Matter.js knows the new boundaries
      render.options.width = window.innerWidth;
      render.options.height = newCanvasHeight;

      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: newCanvasHeight + 500 });
      Matter.Body.setPosition(leftWall, { x: -500, y: newCanvasHeight / 2 });
      Matter.Body.setPosition(rightWall, { x: window.innerWidth + 500, y: newCanvasHeight / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      timeouts.forEach(clearTimeout); // Stop any pending drops when the component resets
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [projects, onProjectSelect]);

  return (
    <div className="time-container relative w-full bg-white" style={{ height: 'calc(100vh - 50px)' }}>
      <div ref={sceneRef} className="absolute inset-0 z-10" />
    </div>
  );
};

export default TimeSection;