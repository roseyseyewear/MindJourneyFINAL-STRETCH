/**
 * Video Performance Testing and Fallback System
 * Provides video performance monitoring, device capability detection,
 * and intelligent fallback mechanisms for optimal user experience
 */

import { LAB_EXPERIENCE_VIDEOS, GENERAL_VIDEO_ASSETS, type VideoAssetConfig } from './video-assets';

export interface VideoPerformanceMetrics {
  loadTime: number;
  bufferingEvents: number;
  droppedFrames: number;
  averageBitrate: number;
  resolution: { width: number; height: number };
  supportedFormats: string[];
  deviceCapabilities: DeviceCapabilities;
}

export interface DeviceCapabilities {
  maxVideoWidth: number;
  maxVideoHeight: number;
  supportsHEVC: boolean;
  supportsVP9: boolean;
  supportsAV1: boolean;
  hardwareDecoding: boolean;
  memoryLimit: number;
  isLowPowerMode: boolean;
  batteryLevel?: number;
}

export interface VideoFallbackConfig {
  primary: string;
  fallbacks: string[];
  poster?: string;
  minRequirements: {
    bandwidth?: number;
    resolution?: { width: number; height: number };
    formats?: string[];
  };
}

// Global performance monitoring
class VideoPerformanceMonitor {
  private static instance: VideoPerformanceMonitor;
  private metrics: Map<string, VideoPerformanceMetrics> = new Map();
  private deviceCaps: DeviceCapabilities | null = null;
  private performanceObserver: PerformanceObserver | null = null;

  static getInstance(): VideoPerformanceMonitor {
    if (!VideoPerformanceMonitor.instance) {
      VideoPerformanceMonitor.instance = new VideoPerformanceMonitor();
    }
    return VideoPerformanceMonitor.instance;
  }

  async initialize(): Promise<void> {
    await this.detectDeviceCapabilities();
    this.setupPerformanceObserver();
  }

  private async detectDeviceCapabilities(): Promise<void> {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // Test video format support
    const video = document.createElement('video');
    const formatTests = {
      h264: 'video/mp4; codecs="avc1.42E01E"',
      hevc: 'video/mp4; codecs="hev1.1.6.L93.B0"',
      vp9: 'video/webm; codecs="vp09.00.10.08"',
      av1: 'video/mp4; codecs="av01.0.05M.08"'
    };

    const supportedFormats: string[] = [];
    Object.entries(formatTests).forEach(([format, codec]) => {
      if (video.canPlayType(codec) === 'probably' || video.canPlayType(codec) === 'maybe') {
        supportedFormats.push(format);
      }
    });

    // Detect hardware capabilities
    const hardwareDecoding = await this.testHardwareDecoding();
    const memoryInfo = this.getMemoryInfo();
    
    this.deviceCaps = {
      maxVideoWidth: screen.width * (window.devicePixelRatio || 1),
      maxVideoHeight: screen.height * (window.devicePixelRatio || 1),
      supportsHEVC: supportedFormats.includes('hevc'),
      supportsVP9: supportedFormats.includes('vp9'),
      supportsAV1: supportedFormats.includes('av1'),
      hardwareDecoding,
      memoryLimit: memoryInfo.totalJSHeapSize || 512 * 1024 * 1024, // 512MB fallback
      isLowPowerMode: this.detectLowPowerMode(),
      batteryLevel: await this.getBatteryLevel()
    };
  }

  private async testHardwareDecoding(): Promise<boolean> {
    try {
      // Create a small test video and check decode performance
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      
      const startTime = performance.now();
      video.src = '/videos/level1.mp4'; // Use existing video for test
      
      return new Promise((resolve) => {
        video.addEventListener('loadedmetadata', () => {
          const loadTime = performance.now() - startTime;
          // If metadata loads quickly, likely hardware decoding
          resolve(loadTime < 500);
        });
        
        video.addEventListener('error', () => resolve(false));
        
        setTimeout(() => resolve(false), 2000); // Timeout after 2s
      });
    } catch {
      return false;
    }
  }

  private getMemoryInfo(): any {
    // @ts-ignore - performance.memory is experimental
    return (performance as any).memory || { totalJSHeapSize: 512 * 1024 * 1024 };
  }

  private detectLowPowerMode(): boolean {
    // Heuristics for detecting low power mode
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad/.test(ua);
    const isOldDevice = /cpu os [5-9]_|android [2-4]\./.test(ua);
    
    return isMobile && isOldDevice;
  }

  private async getBatteryLevel(): Promise<number | undefined> {
    try {
      // @ts-ignore - Battery API is experimental
      const battery = await navigator.getBattery?.();
      return battery?.level;
    } catch {
      return undefined;
    }
  }

  private setupPerformanceObserver(): void {
    if (!window.PerformanceObserver) return;

    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.startsWith('video-')) {
          // Track video-related performance metrics
          console.log(`Video performance: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });

    this.performanceObserver.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
  }

  // Monitor individual video performance
  monitorVideo(videoElement: HTMLVideoElement, videoUrl: string): () => void {
    const startTime = performance.now();
    let bufferingEvents = 0;
    let lastBufferTime = 0;

    const handleLoadStart = () => {
      performance.mark(`video-load-start-${videoUrl}`);
    };

    const handleCanPlay = () => {
      const loadTime = performance.now() - startTime;
      performance.mark(`video-can-play-${videoUrl}`);
      performance.measure(`video-load-${videoUrl}`, `video-load-start-${videoUrl}`, `video-can-play-${videoUrl}`);
      
      // Update metrics
      this.updateVideoMetrics(videoUrl, { loadTime });
    };

    const handleWaiting = () => {
      bufferingEvents++;
      lastBufferTime = performance.now();
    };

    const handlePlaying = () => {
      if (lastBufferTime > 0) {
        const bufferTime = performance.now() - lastBufferTime;
        console.log(`Buffer recovered in ${bufferTime}ms`);
        lastBufferTime = 0;
      }
    };

    const handleError = (event: Event) => {
      console.error('Video error:', event);
      this.updateVideoMetrics(videoUrl, { 
        loadTime: -1, // Indicates error
        bufferingEvents 
      });
    };

    // Add event listeners
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('error', handleError);

    // Return cleanup function
    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('error', handleError);
    };
  }

  private updateVideoMetrics(videoUrl: string, updates: Partial<VideoPerformanceMetrics>): void {
    const existing = this.metrics.get(videoUrl) || {
      loadTime: 0,
      bufferingEvents: 0,
      droppedFrames: 0,
      averageBitrate: 0,
      resolution: { width: 0, height: 0 },
      supportedFormats: [],
      deviceCapabilities: this.deviceCaps!
    };

    this.metrics.set(videoUrl, { ...existing, ...updates });
  }

  getVideoMetrics(videoUrl: string): VideoPerformanceMetrics | null {
    return this.metrics.get(videoUrl) || null;
  }

  getDeviceCapabilities(): DeviceCapabilities | null {
    return this.deviceCaps;
  }

  // Performance-based recommendations
  getOptimalVideoConfig(baseConfig: VideoAssetConfig): VideoAssetConfig & { quality: 'low' | 'medium' | 'high' } {
    if (!this.deviceCaps) {
      return { ...baseConfig, quality: 'medium' };
    }

    const { isLowPowerMode, memoryLimit, batteryLevel, hardwareDecoding } = this.deviceCaps;
    
    // Determine quality based on device capabilities
    let quality: 'low' | 'medium' | 'high' = 'medium';
    
    if (isLowPowerMode || (batteryLevel && batteryLevel < 0.2) || memoryLimit < 256 * 1024 * 1024) {
      quality = 'low';
    } else if (hardwareDecoding && memoryLimit > 1024 * 1024 * 1024) {
      quality = 'high';
    }

    return {
      ...baseConfig,
      quality,
      preload: quality === 'low' ? false : baseConfig.preload,
      autoplay: (quality === 'low' || !hardwareDecoding) ? false : baseConfig.autoplay
    };
  }
}

// Fallback system
export class VideoFallbackSystem {
  private static fallbackConfigs: Map<string, VideoFallbackConfig> = new Map();

  static registerFallbacks(): void {
    // Register fallbacks for lab experience videos
    Object.entries(LAB_EXPERIENCE_VIDEOS).forEach(([phase, phaseVideos]) => {
      Object.entries(phaseVideos).forEach(([type, config]) => {
        if (config) {
          this.fallbackConfigs.set(config.path, {
            primary: config.path,
            fallbacks: this.generateFallbacks(config.path),
            poster: this.getPosterImage(config.path),
            minRequirements: {
              bandwidth: 1000, // 1Mbps minimum
              resolution: { width: 480, height: 320 }
            }
          });
        }
      });
    });
  }

  private static generateFallbacks(primaryPath: string): string[] {
    const fallbacks: string[] = [];
    
    // Generate quality variants
    const pathParts = primaryPath.split('/');
    const filename = pathParts.pop()?.replace('.mp4', '') || 'video';
    const basePath = pathParts.join('/');
    
    // Add quality variants (these would need to exist)
    fallbacks.push(`${basePath}/${filename}-720p.mp4`);
    fallbacks.push(`${basePath}/${filename}-480p.mp4`);
    
    // Add generic fallbacks
    if (primaryPath.includes('lab-phases')) {
      fallbacks.push('/videos/level1.mp4');
    } else if (primaryPath.includes('backgrounds')) {
      fallbacks.push('/videos/backgrounds/welcome-ambient.mp4');
    }
    
    fallbacks.push(GENERAL_VIDEO_ASSETS.fallback.path);
    
    return fallbacks.filter(path => path !== primaryPath);
  }

  private static getPosterImage(videoPath: string): string {
    // Generate poster image path from video path
    return videoPath.replace('.mp4', '-poster.jpg').replace('/videos/', '/images/posters/');
  }

  static async getWorkingVideo(primaryPath: string): Promise<VideoFallbackConfig | null> {
    const config = this.fallbackConfigs.get(primaryPath);
    if (!config) return null;

    // Test primary video first
    if (await this.testVideoUrl(config.primary)) {
      return config;
    }

    // Test fallbacks
    for (const fallbackUrl of config.fallbacks) {
      if (await this.testVideoUrl(fallbackUrl)) {
        return {
          ...config,
          primary: fallbackUrl
        };
      }
    }

    return null;
  }

  private static async testVideoUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.startsWith('video/');
    } catch {
      return false;
    }
  }
}

// Utility functions
export function isVideoSupported(): boolean {
  const video = document.createElement('video');
  return !!video.canPlayType;
}

export function getBrowserVideoCapabilities(): { formats: string[]; maxResolution: { width: number; height: number } } {
  const video = document.createElement('video');
  const formats: string[] = [];
  
  const testFormats = [
    { name: 'MP4/H.264', type: 'video/mp4; codecs="avc1.42E01E"' },
    { name: 'WebM/VP8', type: 'video/webm; codecs="vp8"' },
    { name: 'WebM/VP9', type: 'video/webm; codecs="vp9"' },
    { name: 'MP4/HEVC', type: 'video/mp4; codecs="hev1.1.6.L93.B0"' }
  ];

  testFormats.forEach(format => {
    const support = video.canPlayType(format.type);
    if (support === 'probably' || support === 'maybe') {
      formats.push(format.name);
    }
  });

  return {
    formats,
    maxResolution: {
      width: screen.width * (window.devicePixelRatio || 1),
      height: screen.height * (window.devicePixelRatio || 1)
    }
  };
}

// Initialize on module load
export const performanceMonitor = VideoPerformanceMonitor.getInstance();

// Auto-initialize fallback system
if (typeof window !== 'undefined') {
  VideoFallbackSystem.registerFallbacks();
}