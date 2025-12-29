import { useEffect, useState } from 'react';

export default function CursorReactBits() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Add trail
      setTrails(prev => [
        ...prev.slice(-8), // Keep last 8 trails
        { x: e.clientX, y: e.clientY, id: Date.now() }
      ]);
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Clean up old trails
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => prev.slice(-5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div 
        className={`cursor-bit ${isActive ? 'active' : ''}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{ 
            left: trail.x, 
            top: trail.y,
            opacity: (index + 1) / trails.length * 0.4,
            transform: `translate(-50%, -50%) scale(${(index + 1) / trails.length})`
          }}
        />
      ))}
    </>
  );
}