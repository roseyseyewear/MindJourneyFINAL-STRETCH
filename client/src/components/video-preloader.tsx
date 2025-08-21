import { useState, useEffect, useRef } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { 
  LAB_EXPERIENCE_VIDEOS, 
  PRELOAD_PRIORITY, 
  MOBILE_VIDEO_CONFIG,
  shouldPreloadVideo,
  type VideoAssetConfig 
} from "@/lib/video-assets";
import { Loader, Wifi, WifiOff, Download, CheckCircle, AlertCircle } from "lucide-react";

interface VideoPreloaderProps {
  currentPhase: 'hypothesis' | 'chat' | 'labEntrance' | 'labHub';
  onPreloadComplete?: (phase: string) => void;
  onPreloadError?: (phase: string, error: string) => void;
  visible?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface PreloadStatus {
  path: string;
  status: 'pending' | 'loading' | 'loaded' | 'error';
  progress: number;
  error?: string;
}

// Connection quality detection
const getConnectionQuality = (): 'high' | 'medium' | 'low' => {
  // @ts-ignore - Navigator connection API is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return 'medium';
  
  const effectiveType = connection.effectiveType;
  if (effectiveType === '4g' || effectiveType === '3g') return 'high';
  if (effectiveType === '2g') return 'low';
  
  return 'medium';
};

export default function VideoPreloader({
  currentPhase,
  onPreloadComplete,
  onPreloadError,
  visible = false,
  priority = 'medium'
}: VideoPreloaderProps) {
  const isMobile = useMobile();
  const [preloadStatuses, setPreloadStatuses] = useState<Map<string, PreloadStatus>>(new Map());
  const [connectionQuality, setConnectionQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [totalProgress, setTotalProgress] = useState(0);
  const [currentlyLoading, setCurrentlyLoading] = useState<string[]>([]);
  
  const preloadRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setConnectionQuality(getConnectionQuality());
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine videos to preload based on current phase and device capabilities
  const getVideosToPreload = (): VideoAssetConfig[] => {
    const videos: VideoAssetConfig[] = [];
    
    // Current phase videos (highest priority)
    const currentPhaseVideos = LAB_EXPERIENCE_VIDEOS[currentPhase];
    if (currentPhaseVideos) {
      Object.values(currentPhaseVideos).forEach(config => {
        if (config && shouldPreloadVideo(config.path, isMobile)) {
          videos.push(config);
        }
      });
    }
    
    // Next phase videos (medium priority)
    const phases = ['hypothesis', 'chat', 'labEntrance', 'labHub'] as const;
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex >= 0 && currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      const nextPhaseVideos = LAB_EXPERIENCE_VIDEOS[nextPhase];
      if (nextPhaseVideos) {
        Object.values(nextPhaseVideos).forEach(config => {
          if (config && shouldPreloadVideo(config.path, isMobile)) {
            videos.push(config);
          }
        });
      }
    }
    
    // Apply connection and device-based filtering
    const maxVideos = isMobile ? MOBILE_VIDEO_CONFIG.preloadLimit : 
                     connectionQuality === 'low' ? 2 : 
                     connectionQuality === 'medium' ? 4 : 8;
    
    return videos.slice(0, maxVideos);
  };

  // Preload videos progressively
  useEffect(() => {
    if (!isOnline || (isMobile && connectionQuality === 'low')) {
      return;
    }

    const videosToPreload = getVideosToPreload();
    const newStatuses = new Map<string, PreloadStatus>();
    
    // Initialize preload statuses
    videosToPreload.forEach(video => {
      if (!preloadStatuses.has(video.path)) {
        newStatuses.set(video.path, {
          path: video.path,
          status: 'pending',
          progress: 0
        });
      }
    });
    
    setPreloadStatuses(prev => new Map([...prev, ...newStatuses]));
    
    // Start preloading
    videosToPreload.forEach((video, index) => {
      // Stagger preloading to avoid overwhelming the network
      setTimeout(() => {
        preloadVideo(video);
      }, index * (connectionQuality === 'low' ? 2000 : 1000));
    });

    return () => {
      // Cleanup: abort ongoing downloads
      abortControllers.current.forEach(controller => {
        controller.abort();
      });
      abortControllers.current.clear();
    };
  }, [currentPhase, isOnline, connectionQuality, isMobile]);

  const preloadVideo = async (videoConfig: VideoAssetConfig) => {
    const { path } = videoConfig;
    
    // Skip if already loaded or loading
    const currentStatus = preloadStatuses.get(path);
    if (currentStatus?.status === 'loaded' || currentStatus?.status === 'loading') {
      return;
    }

    // Create abort controller for this request
    const abortController = new AbortController();
    abortControllers.current.set(path, abortController);

    try {
      setPreloadStatuses(prev => new Map(prev.set(path, {
        path,
        status: 'loading',
        progress: 0
      })));
      
      setCurrentlyLoading(prev => [...prev, path]);

      const video = document.createElement('video');
      video.preload = connectionQuality === 'low' ? 'metadata' : 'auto';
      video.muted = true;
      video.playsInline = true;
      
      preloadRefs.current.set(path, video);

      // Track loading progress
      let progressInterval: number;
      const updateProgress = () => {
        if (video.buffered.length > 0 && video.duration > 0) {
          const progress = (video.buffered.end(0) / video.duration) * 100;
          setPreloadStatuses(prev => new Map(prev.set(path, {
            path,
            status: 'loading',
            progress: Math.min(progress, 100)
          })));
        }
      };

      video.addEventListener('loadstart', () => {
        progressInterval = window.setInterval(updateProgress, 500);
      });

      video.addEventListener('canplaythrough', () => {
        clearInterval(progressInterval);
        setPreloadStatuses(prev => new Map(prev.set(path, {
          path,
          status: 'loaded',
          progress: 100
        })));
        
        setCurrentlyLoading(prev => prev.filter(p => p !== path));
        
        if (onPreloadComplete) {
          onPreloadComplete(path);
        }
        
        abortControllers.current.delete(path);
      });

      video.addEventListener('error', (error) => {
        clearInterval(progressInterval);
        const errorMessage = `Failed to load: ${path}`;
        
        setPreloadStatuses(prev => new Map(prev.set(path, {
          path,
          status: 'error',
          progress: 0,
          error: errorMessage
        })));
        
        setCurrentlyLoading(prev => prev.filter(p => p !== path));
        
        if (onPreloadError) {
          onPreloadError(path, errorMessage);
        }
        
        abortControllers.current.delete(path);
      });

      // Handle abort
      abortController.signal.addEventListener('abort', () => {
        clearInterval(progressInterval);
        setCurrentlyLoading(prev => prev.filter(p => p !== path));
        video.src = '';
        preloadRefs.current.delete(path);
      });

      // Start loading
      video.src = path;
      video.load();
      
    } catch (error) {
      const errorMessage = `Preload failed: ${error}`;
      setPreloadStatuses(prev => new Map(prev.set(path, {
        path,
        status: 'error',
        progress: 0,
        error: errorMessage
      })));
      
      setCurrentlyLoading(prev => prev.filter(p => p !== path));
      
      if (onPreloadError) {
        onPreloadError(path, errorMessage);
      }
      
      abortControllers.current.delete(path);
    }
  };

  // Calculate total progress
  useEffect(() => {
    if (preloadStatuses.size === 0) {
      setTotalProgress(0);
      return;
    }
    
    let totalProgress = 0;
    let totalVideos = 0;
    
    preloadStatuses.forEach(status => {
      totalProgress += status.progress;
      totalVideos++;
    });
    
    setTotalProgress(totalVideos > 0 ? totalProgress / totalVideos : 0);
  }, [preloadStatuses]);

  // Get preload status for external access
  const getPreloadStatus = (path: string): PreloadStatus | null => {
    return preloadStatuses.get(path) || null;
  };

  // Get preloaded video element for external use
  const getPreloadedVideo = (path: string): HTMLVideoElement | null => {
    return preloadRefs.current.get(path) || null;
  };

  if (!visible || (!currentlyLoading.length && totalProgress === 100)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 min-w-64 max-w-sm">
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className="text-sm text-white/70">
            {connectionQuality.toUpperCase()} • {isMobile ? 'Mobile' : 'Desktop'}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white font-medium">Optimizing Experience</span>
          <span className="text-xs text-white/60">{Math.round(totalProgress)}%</span>
        </div>
        
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        
        {currentlyLoading.length > 0 && (
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {currentlyLoading.slice(0, 3).map(path => {
              const status = preloadStatuses.get(path);
              const filename = path.split('/').pop()?.replace('.mp4', '') || 'Video';
              
              return (
                <div key={path} className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center space-x-1">
                    {status?.status === 'loading' && <Loader className="w-3 h-3 animate-spin" />}
                    {status?.status === 'loaded' && <CheckCircle className="w-3 h-3 text-green-400" />}
                    {status?.status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
                    <Download className="w-3 h-3 text-white/50" />
                  </div>
                  <span className="text-white/70 truncate flex-1">{filename}</span>
                  <span className="text-white/50">{Math.round(status?.progress || 0)}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Connection quality indicator */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>
            {connectionQuality === 'low' && "Reduced quality for better performance"}
            {connectionQuality === 'medium' && "Standard quality loading"}
            {connectionQuality === 'high' && "High quality experience"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Export utility functions for external use
export { getConnectionQuality };
export type { PreloadStatus };