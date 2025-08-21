import { useState, useRef, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { getLabPhaseVideo, type VideoAssetConfig } from "@/lib/video-assets";

interface VideoTransitionProps {
  fromPhase: 'hypothesis' | 'chat' | 'labEntrance' | 'labHub';
  toPhase: 'hypothesis' | 'chat' | 'labEntrance' | 'labHub';
  isActive: boolean;
  onComplete: () => void;
  duration?: number;
  className?: string;
}

type TransitionType = 'fade' | 'slide' | 'morph' | 'doorway' | 'portal';

const TRANSITION_EFFECTS: Record<string, TransitionType> = {
  'hypothesis-chat': 'fade',
  'chat-labEntrance': 'doorway',
  'labEntrance-labHub': 'portal',
  'hypothesis-labHub': 'morph',
};

const TRANSITION_DURATIONS = {
  fade: 1000,
  slide: 1500,
  morph: 2000,
  doorway: 2500,
  portal: 3000,
};

export default function VideoTransition({
  fromPhase,
  toPhase,
  isActive,
  onComplete,
  duration,
  className = "",
}: VideoTransitionProps) {
  const isMobile = useMobile();
  const transitionVideoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<TransitionType>('fade');

  const transitionKey = `${fromPhase}-${toPhase}`;
  const effectType = TRANSITION_EFFECTS[transitionKey] || 'fade';
  const effectDuration = duration || TRANSITION_DURATIONS[effectType];

  // Get transition-specific video if available
  const transitionVideoConfig = getLabPhaseVideo(toPhase, 'transition');

  useEffect(() => {
    if (!isActive) {
      setTransitionProgress(0);
      setIsTransitioning(false);
      return;
    }

    setCurrentEffect(effectType);
    setIsTransitioning(true);
    
    // Start transition animation
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / effectDuration, 1);
      
      setTransitionProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
        onComplete();
      }
    };

    // Handle special video transitions (doorway, portal)
    if ((effectType === 'doorway' || effectType === 'portal') && transitionVideoConfig) {
      playTransitionVideo();
    } else {
      requestAnimationFrame(animate);
    }

  }, [isActive, effectType, effectDuration, onComplete, transitionVideoConfig]);

  const playTransitionVideo = () => {
    const video = transitionVideoRef.current;
    if (!video || !transitionVideoConfig) return;

    video.src = transitionVideoConfig.path;
    video.muted = true;
    video.playsInline = true;
    
    video.play().catch(console.error);
    
    video.addEventListener('ended', () => {
      setIsTransitioning(false);
      onComplete();
    });

    video.addEventListener('timeupdate', () => {
      if (video.duration > 0) {
        setTransitionProgress(video.currentTime / video.duration);
      }
    });

    // Fallback timeout
    setTimeout(() => {
      if (isTransitioning) {
        setIsTransitioning(false);
        onComplete();
      }
    }, effectDuration);
  };

  const getTransitionStyles = (): React.CSSProperties => {
    const progress = transitionProgress;
    const midpoint = 0.5;
    
    switch (currentEffect) {
      case 'fade':
        return {
          background: `rgba(0, 0, 0, ${progress * 0.9})`,
          transition: 'background 0.1s ease-out',
        };
        
      case 'slide':
        return {
          transform: `translateX(${(progress - 0.5) * 200}%)`,
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.8), transparent)',
          transition: 'transform 0.1s ease-out',
        };
        
      case 'morph':
        const scale = progress < midpoint ? 1 + progress : 2 - progress;
        const blur = progress * 10;
        return {
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          background: `radial-gradient(circle, rgba(0,0,0,${progress * 0.7}) 0%, transparent 70%)`,
          transition: 'all 0.1s ease-out',
        };
        
      case 'doorway':
        const doorProgress = progress * 2;
        const leftDoor = Math.min(doorProgress, 1) * 50;
        const rightDoor = Math.min(doorProgress, 1) * 50;
        return {
          background: `linear-gradient(90deg, 
            black ${50 - leftDoor}%, 
            transparent ${50 - leftDoor + 5}%, 
            transparent ${50 + rightDoor - 5}%, 
            black ${50 + rightDoor}%)`,
          transition: 'background 0.1s ease-out',
        };
        
      case 'portal':
        const portalSize = progress * 100;
        const glow = (1 - Math.abs(progress - 0.5) * 2) * 100;
        return {
          background: `radial-gradient(circle ${portalSize}% at center, 
            transparent ${portalSize * 0.8}%, 
            rgba(100, 200, 255, ${glow / 200}) ${portalSize * 0.9}%, 
            black ${portalSize}%)`,
          transition: 'background 0.1s ease-out',
        };
        
      default:
        return {};
    }
  };

  const getParticleEffect = () => {
    if (!isTransitioning || isMobile) return null;
    
    const particleCount = currentEffect === 'portal' ? 20 : 
                        currentEffect === 'morph' ? 15 : 
                        currentEffect === 'doorway' ? 10 : 5;
                        
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: particleCount }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-float-${currentEffect} ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${0.5 + transitionProgress})`,
            }}
          />
        ))}
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className={`fixed inset-0 z-40 ${className}`}>
      {/* Video transition for special effects */}
      {(currentEffect === 'doorway' || currentEffect === 'portal') && transitionVideoConfig && (
        <video
          ref={transitionVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />
      )}
      
      {/* Overlay with transition effect */}
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full"
        style={getTransitionStyles()}
      />
      
      {/* Particle effects */}
      {getParticleEffect()}
      
      {/* Progress indicator for debugging (optional) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 text-white text-xs bg-black/50 px-2 py-1 rounded">
          {currentEffect}: {Math.round(transitionProgress * 100)}%
        </div>
      )}
      
      {/* Transition-specific UI elements */}
      {currentEffect === 'portal' && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: Math.sin(transitionProgress * Math.PI) }}
        >
          <div className="text-center text-white">
            <div className="w-16 h-16 border-2 border-white rounded-full animate-spin mb-4" />
            <p className="text-lg font-light">Entering Lab Environment...</p>
          </div>
        </div>
      )}
      
      {currentEffect === 'doorway' && transitionProgress > 0.7 && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: (transitionProgress - 0.7) / 0.3 }}
        >
          <div className="text-center text-white">
            <p className="text-xl font-light">Welcome to The Lab</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Add CSS animations for particle effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes particle-float-fade {
    0%, 100% { opacity: 0.3; transform: translateY(0px) scale(0.5); }
    50% { opacity: 1; transform: translateY(-20px) scale(1); }
  }
  
  @keyframes particle-float-slide {
    0% { opacity: 0; transform: translateX(-100px) rotate(0deg); }
    50% { opacity: 1; transform: translateX(50px) rotate(180deg); }
    100% { opacity: 0; transform: translateX(200px) rotate(360deg); }
  }
  
  @keyframes particle-float-morph {
    0%, 100% { opacity: 0.2; transform: scale(0.5) rotate(0deg); }
    50% { opacity: 1; transform: scale(2) rotate(180deg); }
  }
  
  @keyframes particle-float-doorway {
    0% { opacity: 0; transform: translateX(-50px); }
    25% { opacity: 1; transform: translateX(0px); }
    75% { opacity: 1; transform: translateX(0px); }
    100% { opacity: 0; transform: translateX(50px); }
  }
  
  @keyframes particle-float-portal {
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
    100% { opacity: 0; transform: scale(0) rotate(360deg); }
  }
`;

if (!document.head.querySelector('style[data-transition-particles]')) {
  styleSheet.setAttribute('data-transition-particles', 'true');
  document.head.appendChild(styleSheet);
}