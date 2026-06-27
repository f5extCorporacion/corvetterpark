// app/adminprocess/page.tsx
'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { 
  FaCamera, 
  FaMotorcycle, 
  FaMoneyBillWave, 
  FaCar, 
  FaCreditCard,
} from 'react-icons/fa';
import gsap from 'gsap';
import { IoIosAddCircle } from "react-icons/io";

// Types
interface ParticleCardProps {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  glowColor?: string;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  particleCount?: number;
  iconOnly?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconSize?: string;
  showTitle?: boolean;
  showValue?: boolean;
  showDescription?: boolean;
  title?: string;
  value?: string;
  description?: string;
}

interface CardData {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value?: string;
  description?: string;
  color: string;
  iconOnly?: boolean;
  iconSize?: string;
}

// Componente de tarjeta con partículas y efectos
const ParticleCard: React.FC<ParticleCardProps> = ({ 
  children, 
  className = '', 
  color = '#120F17',
  glowColor = '255, 62, 0',
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  particleCount = 8,
  iconOnly = false,
  icon: Icon,
  iconSize = 'text-8xl',
  showTitle = true,
  showValue = true,
  showDescription = true,
  title = '',
  value = '',
  description = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const createParticleElement = useCallback((x: number, y: number): HTMLDivElement => {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(${glowColor}, 1);
      box-shadow: 0 0 6px rgba(${glowColor}, 0.6);
      pointer-events: none;
      z-index: 10;
      left: ${x}px;
      top: ${y}px;
    `;
    return el;
  }, [glowColor]);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height)
    );
    particlesInitialized.current = true;
  }, [particleCount, createParticleElement]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    if (magnetismAnimationRef.current) {
      magnetismAnimationRef.current.kill();
      magnetismAnimationRef.current = null;
    }

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current?.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { 
          scale: 1, 
          opacity: 1, 
          duration: 0.3, 
          ease: 'back.out(1.7)' 
        });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      element.style.setProperty('--glow-intensity', '1');
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      element.style.setProperty('--glow-intensity', '0');
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty('--glow-x', `${relativeX}%`);
      element.style.setProperty('--glow-y', `${relativeY}%`);

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        if (magnetismAnimationRef.current) {
          magnetismAnimationRef.current.kill();
        }
        
        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            if (ripple.parentNode) {
              ripple.parentNode.removeChild(ripple);
            }
          }
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    element.style.setProperty('--glow-color', glowColor);
    element.style.setProperty('--glow-intensity', '0');

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,62,0,0.15)] hover:-translate-y-0.5 rounded-xl`}
      style={{
        backgroundColor: color,
        '--glow-color': glowColor,
        '--glow-intensity': '0',
        minHeight: '180px'
      } as React.CSSProperties}
    >
      {/* Efecto de glow en hover */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-[1]"
        style={{
          opacity: 'var(--glow-intensity, 0)',
          background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), 
            rgba(${glowColor}, 0.15) 0%, 
            rgba(${glowColor}, 0.05) 50%, 
            transparent 100%)`
        }}
      />
      
      {/* Border glow effect */}
      <div 
        className="absolute -inset-[2px] rounded-[inherit] pointer-events-none transition-opacity duration-300 z-0"
        style={{
          opacity: 'var(--glow-intensity, 0)',
          padding: '2px',
          background: `radial-gradient(
            circle at var(--glow-x, 50%) var(--glow-y, 50%),
            rgba(${glowColor}, var(--glow-intensity, 0)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity, 0) * 0.5)) 40%,
            transparent 70%
          )`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
      />
      
      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col">
        {iconOnly && Icon ? (
          // Modo solo ícono - ocupa todo el bento
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <Icon className={`${iconSize} text-[#FF3E00] opacity-90 transition-all duration-300 group-hover:scale-110`} />
            {title && (
              <span className="text-white/60 text-sm mt-4 font-medium">{title}</span>
            )}
          </div>
        ) : (
          // Modo normal con children
          <div className="h-full">
            {children ? (
              children
            ) : (
              <div className="p-4">
                {showTitle && title && (
                  <div className="flex items-center gap-2 mb-2">
                    {Icon && <Icon className="text-[#FF3E00] text-xl" />}
                    <span className="text-white font-medium">{title}</span>
                  </div>
                )}
                {showValue && value && (
                  <h2 className="text-3xl font-bold text-white">{value}</h2>
                )}
                {showDescription && description && (
                  <p className="text-white/60 text-sm">{description}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminProcess() {
  // Datos de las tarjetas superiores
  const topCards: CardData[] = [
    {
      id: 'camara',
      title: 'Cámaras',
      icon: FaCamera,
      value: '12',
      description: 'Cámaras activas para registrar autos al llegar puedes utilizar tu celular o cámara especial',
      color: '#120F17',
      iconOnly: true, // Solo esta tarjeta tendrá ícono grande
      iconSize: 'text-9xl'
    },
      {
      id: 'motor',
      title: 'Agregar',
      icon: IoIosAddCircle ,
      value: '8',
      description: 'Motores en línea para registrar autos al llegar',
      color: '#120F17',
      iconOnly: true, // ✅ Ahora también tiene ícono grande
      iconSize: 'text-9xl'
    },
    {
      id: 'ingresos',
      title: 'Ingresos',
      icon: FaMoneyBillWave,
      value: '$2,450',
      description: 'Ingresos del día',
      color: '#120F17'
    },
  ];

  // Datos de las tarjetas inferiores
  const bottomCards: CardData[] = [
    {
      id: 'autos',
      title: 'Vehículos',
      icon: FaCar,
      value: '24',
      description: 'Vehículos estacionados',
      color: '#120F17'
    },
    {
      id: 'pagos',
      title: 'Pagos',
      icon: FaCreditCard,
      value: '18',
      description: 'Pagos realizados hoy',
      color: '#120F17'
    },
  ];

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="bg-gradient-to-r from-[#FF3E00] to-orange-500 bg-clip-text text-transparent">
          CorvettePark
        </span>
        <span className="text-white/60 text-xl">| Panel de Control</span>
      </h1>

      {/* Grid superior: 3 tarjetas - Solo la de cámara tiene ícono grande */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {topCards.map((card) => (
          <ParticleCard
            key={card.id}
            color={card.color}
            glowColor="255, 62, 0"
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            particleCount={card.iconOnly ? 12 : 8}
            className="h-full"
            iconOnly={card.iconOnly || false}
            icon={card.icon}
            iconSize={card.iconSize || 'text-8xl'}
            title={card.title}
            value={card.value}
            description={card.description}
          />
        ))}
      </div>

      {/* Grid inferior: 2 tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bottomCards.map((card) => (
          <ParticleCard
            key={card.id}
            color={card.color}
            glowColor="255, 62, 0"
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            particleCount={8}
            className="h-full"
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}