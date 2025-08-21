import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, X, ArrowLeft, SkipForward, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { type ExperimentLevel } from "@shared/schema";
import FuturisticChatInterface from "@/components/futuristic-chat-interface";
import LevelCompleteScreen from "@/components/level-complete-screen";
import PostSubmissionVideo from "@/components/post-submission-video";
import { 
  LAB_EXPERIENCE_VIDEOS, 
  getLabPhaseVideo, 
  shouldPreloadVideo, 
  getOptimalVideoConfig,
  type VideoAssetConfig 
} from "@/lib/video-assets";

interface EnhancedVideoLightboxProps {
  level: ExperimentLevel;
  sessionId: string;
  onVideoEnd: () => void;
  onQuestionComplete: (responses: any[]) => void;
  onClose: () => void;
  isOpen: boolean;
  onSelectFrame?: () => void;
  onFindTheLab?: () => void;
  visitorNumber?: number | null;
  labPhase?: 'hypothesis' | 'chat' | 'labEntrance' | 'labHub';
}

export default function EnhancedVideoLightbox({
  level,
  sessionId,
  onVideoEnd,
  onQuestionComplete,
  onClose,
  isOpen,
  onSelectFrame,
  onFindTheLab,
  visitorNumber,
  labPhase = 'hypothesis',
}: EnhancedVideoLightboxProps) {
  const isMobile = useMobile();
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const preloadVideoRef = useRef<HTMLVideoElement>(null);
  const transitionVideoRef = useRef<HTMLVideoElement>(null);
  
  const [currentPhase, setCurrentPhase] = useState<'video' | 'questions' | 'post-submission' | 'complete' | 'loading' | 'transition'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [videoLoadError, setVideoLoadError] = useState(false);

  const [isReversePhase, setIsReversePhase] = useState(false);
  const [videoEndTime, setVideoEndTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  
  const reverseAnimationRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Get video configuration based on lab phase
  const currentVideoConfig = getLabPhaseVideo(labPhase, 'intro');
  const backgroundVideoConfig = getLabPhaseVideo(labPhase, 'background');
  const transitionVideoConfig = getLabPhaseVideo(labPhase, 'transition');

  // Progressive video preloading based on device capabilities
  useEffect(() => {
    if (!isOpen || !preloadVideoRef.current) return;

    const preloadNextPhase = async () => {
      // Determine next phase videos to preload
      const nextPhases: (keyof typeof LAB_EXPERIENCE_VIDEOS)[] = [];
      
      switch (labPhase) {
        case 'hypothesis':
          nextPhases.push('chat');
          break;
        case 'chat':
          nextPhases.push('labEntrance');
          break;
        case 'labEntrance':
          nextPhases.push('labHub');
          break;
        default:
          break;
      }

      // Preload videos for next phases
      for (const phase of nextPhases) {
        const introVideo = getLabPhaseVideo(phase, 'intro');
        const bgVideo = getLabPhaseVideo(phase, 'background');
        
        if (introVideo && shouldPreloadVideo(introVideo.path, isMobile)) {
          const preloadVid = document.createElement('video');
          preloadVid.src = introVideo.path;
          preloadVid.preload = 'metadata';
          preloadVid.load();
        }
        
        if (bgVideo && shouldPreloadVideo(bgVideo.path, isMobile)) {
          const preloadVid = document.createElement('video');
          preloadVid.src = bgVideo.path;
          preloadVid.preload = 'metadata';
          preloadVid.load();
        }
      }
    };

    preloadNextPhase();
  }, [isOpen, labPhase, isMobile]);

  // Reset state when lightbox opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentPhase('video');
      setHasStarted(false);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setIsReversePhase(false);
      setVideoLoadError(false);
      setIsTransitioning(false);
      
      // Clear any existing transition timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    }
  }, [isOpen]);

  // Enhanced video event handling with error fallbacks
  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video || !isOpen) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoLoadError(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setVideoEndTime(video.duration);
      
      // Check if we have a transition video before going to questions
      if (transitionVideoConfig && labPhase === 'labEntrance') {
        setCurrentPhase('transition');
        playTransitionVideo();
      } else {
        setCurrentPhase('questions');
        onVideoEnd();
      }
    };

    const handleCanPlay = () => {
      if (!hasStarted) {
        video.play().catch((error) => {
          console.warn('Autoplay failed, user interaction required:', error);
          // On mobile or autoplay failure, show play button
          setHasStarted(true);
        });
        setIsPlaying(true);
        setHasStarted(true);
      }
    };

    const handleError = () => {
      console.error('Video failed to load, attempting fallback');
      setVideoLoadError(true);
      
      // Try fallback video if available
      const config = currentVideoConfig || { path: level.videoUrl, fallback: "/videos/level1.mp4" };
      if (config.fallback && config.path !== config.fallback) {
        video.src = config.fallback;
        video.load();
      } else {
        toast({
          title: "Video Loading Error",
          description: "Unable to load video content. Please check your connection.",
          variant: "destructive",
        });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [onVideoEnd, hasStarted, isOpen, currentVideoConfig, transitionVideoConfig, labPhase, level.videoUrl, toast]);

  // Transition video playback
  const playTransitionVideo = () => {
    const transitionVideo = transitionVideoRef.current;
    if (!transitionVideo || !transitionVideoConfig) return;

    setIsTransitioning(true);
    transitionVideo.src = transitionVideoConfig.path;
    transitionVideo.muted = true;
    transitionVideo.play().catch(console.error);

    transitionVideo.onended = () => {
      setIsTransitioning(false);
      setCurrentPhase('questions');
      onVideoEnd();
    };

    // Fallback timeout in case transition video fails
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      setCurrentPhase('questions');
      onVideoEnd();
    }, 5000);
  };

  // Enhanced background video handling
  useEffect(() => {
    if (currentPhase === 'questions' && isOpen) {
      startBackgroundVideo();
    }
    
    return () => {
      if (reverseAnimationRef.current) {
        cancelAnimationFrame(reverseAnimationRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      setIsReversePhase(false);
      setIsTransitioning(false);
    };
  }, [currentPhase, isOpen]);

  const startBackgroundVideo = () => {
    const bgVideo = backgroundVideoRef.current;
    if (!bgVideo) return;
    
    console.log('Starting enhanced background video for lab phase:', labPhase);
    
    // Use lab phase specific background or fallback
    const bgConfig = backgroundVideoConfig;
    const videoPath = bgConfig?.path || level.backgroundVideoUrl || "/videos/backgrounds/chat-loop.mp4";
    
    const optimalConfig = getOptimalVideoConfig({ 
      path: videoPath, 
      muted: true, 
      loop: true, 
      autoplay: true 
    }, isMobile);
    
    bgVideo.src = optimalConfig.path;
    bgVideo.muted = optimalConfig.muted ?? true;
    bgVideo.loop = optimalConfig.loop ?? true;
    bgVideo.playsInline = true;
    
    // Start from end time for seamless continuation
    if (videoEndTime > 0) {
      bgVideo.currentTime = videoEndTime;
    }
    
    if (optimalConfig.autoplay) {
      bgVideo.play().catch(console.error);
    }
  };

  // Enhanced control functions
  const togglePlay = () => {
    const video = mainVideoRef.current;
    if (!video || currentPhase !== 'video') return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = mainVideoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const replay = () => {
    const video = mainVideoRef.current;
    if (!video) return;

    setCurrentPhase('video');
    video.currentTime = 0;
    video.play().catch(console.error);
    setIsPlaying(true);
  };

  const skipToEnd = () => {
    const video = mainVideoRef.current;
    if (!video || currentPhase !== 'video') return;

    video.currentTime = video.duration;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const goBackToVideo = () => {
    setCurrentPhase('video');
    const bgVideo = backgroundVideoRef.current;
    if (bgVideo) {
      bgVideo.pause();
    }
  };

  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Get optimal video configuration
  const optimalMainVideoConfig = currentVideoConfig ? 
    getOptimalVideoConfig(currentVideoConfig, isMobile) : 
    { path: level.videoUrl, autoplay: true };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={containerRef}
        className="video-lightbox-container pov-vignette relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 aspect-video"
        onMouseEnter={() => currentPhase === 'video' && setShowControls(true)}
        onMouseLeave={() => currentPhase === 'video' && setShowControls(false)}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors hover:text-white"
          style={{ color: '#eeeeee' }}
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Loading State */}
        {videoLoadError && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-5">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-white mb-4" />
              <p className="text-white">Loading video content...</p>
            </div>
          </div>
        )}

        {/* Main Video (shown during video phase) */}
        {currentPhase === 'video' && (
          <video
            ref={mainVideoRef}
            className="w-full h-full object-cover"
            src={optimalMainVideoConfig.path}
            muted={isMuted}
            playsInline
            preload="auto"
          />
        )}

        {/* Transition Video (shown during lab entrance) */}
        {(currentPhase === 'transition' || isTransitioning) && (
          <video
            ref={transitionVideoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
          />
        )}

        {/* Background Video (shown during questions phase) */}
        {currentPhase === 'questions' && (
          <video
            ref={backgroundVideoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay={!isMobile}
          />
        )}

        {/* Enhanced Video Controls */}
        {currentPhase === 'video' && (
          <div className={`video-controls ${showControls || !isPlaying ? 'show' : ''}`}>
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="transition-colors hover:text-white"
                style={{ color: '#eeeeee' }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={toggleMute}
                className="transition-colors hover:text-white"
                style={{ color: '#eeeeee' }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <span className="text-sm experiment-text-secondary">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              
              {/* Lab Phase Indicator */}
              <span className="text-xs text-white/50 px-2 py-1 rounded bg-black/30">
                {labPhase.charAt(0).toUpperCase() + labPhase.slice(1)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={replay}
                className="transition-colors hover:text-white"
                style={{ color: '#eeeeee' }}
                aria-label="Replay"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={skipToEnd}
                className="transition-colors hover:text-white"
                style={{ color: '#eeeeee' }}
                aria-label="Skip to end"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Progress bar */}
        {currentPhase === 'video' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full experiment-text-primary transition-all duration-100 progress-glow"
              style={{ 
                width: `${progress}%`, 
                backgroundColor: 'var(--off-white)',
                background: `linear-gradient(90deg, var(--off-white) 0%, rgba(255,255,255,0.8) ${progress}%)`
              }}
            />
          </div>
        )}

        {/* Futuristic Chat Interface */}
        {currentPhase === 'questions' && (
          <FuturisticChatInterface
            level={level}
            sessionId={sessionId}
            visitorNumber={visitorNumber}
            onComplete={(responses: any[]) => {
              setCurrentPhase('post-submission');
            }}
            onBack={goBackToVideo}
          />
        )}

        {/* Post-Submission Video */}
        {currentPhase === 'post-submission' && level.postSubmissionVideoUrl && (
          <PostSubmissionVideo
            videoUrl={level.postSubmissionVideoUrl}
            backgroundVideoUrl={level.completionVideoUrl || backgroundVideoConfig?.path}
            onComplete={() => {
              setCurrentPhase('complete');
            }}
          />
        )}

        {/* Level Complete Screen */}
        {(currentPhase === 'complete' || currentPhase === 'post-submission') && (
          <div className={`${currentPhase === 'complete' ? 'z-10' : 'z-0 opacity-0'} transition-opacity duration-0`}>
            <LevelCompleteScreen
              onContinue={(contact) => {
                console.log('Contact captured:', contact);
                if (onQuestionComplete) {
                  onQuestionComplete([]);
                }
              }}
              visitorNumber={visitorNumber}
              level={level.levelNumber}
              phase={labPhase}
            />
          </div>
        )}

        {/* Hidden preload video for seamless transitions */}
        <video
          ref={preloadVideoRef}
          className="hidden"
          muted
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
}