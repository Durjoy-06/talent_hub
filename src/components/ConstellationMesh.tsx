import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'Student' | 'Event' | 'Community';
}

export default function ConstellationMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = 420;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.target.clientHeight || 420;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Generate Nodes
    const originalNodeCount = Math.min(32, Math.floor(width / 35));
    const nodes: Node[] = [];
    const types: ('Student' | 'Event' | 'Community')[] = ['Student', 'Event', 'Community'];

    for (let i = 0; i < originalNodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.5,
        type: types[i % 3]
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Node Physics & Attraction
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Cursor repulsion logic
        if (mousePosition) {
          const dx = node.x - mousePosition.x;
          const dy = node.y - mousePosition.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 140;

          if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            // Push nodes away gently
            node.x += (dx / dist) * force * 1.5;
            node.y += (dy / dist) * force * 1.5;
          }
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        // Colors mapping to our color system
        if (node.type === 'Student') {
          ctx.fillStyle = '#355872'; // Primary slate
        } else if (node.type === 'Event') {
          ctx.fillStyle = '#7AAACE'; // Secondary
        } else {
          ctx.fillStyle = '#9CD5FF'; // Accent bright
        }
        
        ctx.fill();
      });

      // Draw Connection Lines (Pulsing and glowing based on hover proximity)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist) {
            let opacity = (1 - dist / maxDist) * 0.15;

            // Highlight line if near cursor
            if (mousePosition) {
              const midX = (n1.x + n2.x) / 2;
              const midY = (n1.y + n2.y) / 2;
              const mdx = midX - mousePosition.x;
              const mdy = midY - mousePosition.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              
              if (mdist < 100) {
                const boost = (1 - mdist / 100) * 0.4;
                opacity += boost;
                
                // Active Pulse glow
                ctx.beginPath();
                ctx.strokeStyle = `rgba(122, 170, 206, ${opacity})`;
                ctx.lineWidth = 1.2;
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.stroke();
                continue;
              }
            }

            ctx.beginPath();
            ctx.strokeStyle = `rgba(53, 88, 114, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw custom glowing cursor indicator lines if within canvas
      if (mousePosition) {
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(156, 213, 255, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#355872';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mousePosition]);

  return (
    <div id="constellation-mesh" ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
