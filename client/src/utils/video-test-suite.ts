/**
 * Video Test Suite - Comprehensive testing for video infrastructure
 * Tests all video assets, performance, fallbacks, and mobile compatibility
 */

import { LAB_EXPERIENCE_VIDEOS, PRELOAD_PRIORITY } from '@/lib/video-assets';
import { performanceMonitor, VideoFallbackSystem } from '@/lib/video-performance';

export interface VideoTestResult {
  path: string;
  status: 'pass' | 'fail' | 'warning';
  loadTime: number;
  fileSize: number;
  resolution: { width: number; height: number };
  duration: number;
  hasAudio: boolean;
  canAutoplay: boolean;
  errors: string[];
  warnings: string[];
}

export interface TestSuiteResults {
  overall: 'pass' | 'fail' | 'warning';
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  results: VideoTestResult[];
  deviceInfo: {
    userAgent: string;
    isMobile: boolean;
    supportsAutoplay: boolean;
    connectionType?: string;
    memoryInfo?: any;
  };
  recommendations: string[];
}

export class VideoTestSuite {
  private static instance: VideoTestSuite;
  private testResults: VideoTestResult[] = [];

  static getInstance(): VideoTestSuite {
    if (!VideoTestSuite.instance) {
      VideoTestSuite.instance = new VideoTestSuite();
    }
    return VideoTestSuite.instance;
  }

  async runFullTestSuite(): Promise<TestSuiteResults> {
    console.log('🎬 Starting Video Test Suite...');
    
    // Initialize performance monitoring
    await performanceMonitor.initialize();

    this.testResults = [];
    
    // Collect all unique video paths
    const videoPaths = this.collectAllVideoPaths();
    
    console.log(`Testing ${videoPaths.length} video assets...`);

    // Test each video
    for (const path of videoPaths) {
      try {
        const result = await this.testVideo(path);
        this.testResults.push(result);
        console.log(`✓ ${path}: ${result.status}`);
      } catch (error) {
        console.error(`✗ ${path}: ${error}`);
        this.testResults.push({
          path,
          status: 'fail',
          loadTime: -1,
          fileSize: 0,
          resolution: { width: 0, height: 0 },
          duration: 0,
          hasAudio: false,
          canAutoplay: false,
          errors: [`Test failed: ${error}`],
          warnings: []
        });
      }
    }

    // Test fallback system
    await this.testFallbackSystem();

    // Test preloader performance
    await this.testPreloaderPerformance();

    // Generate comprehensive results
    return this.generateTestResults();
  }

  private collectAllVideoPaths(): string[] {
    const paths = new Set<string>();

    // Add all lab experience videos
    Object.values(LAB_EXPERIENCE_VIDEOS).forEach(phaseVideos => {
      Object.values(phaseVideos).forEach(config => {
        if (config) {
          paths.add(config.path);
          if (config.fallback) {
            paths.add(config.fallback);
          }
        }
      });
    });

    // Add priority videos
    PRELOAD_PRIORITY.forEach(path => paths.add(path));

    return Array.from(paths);
  }

  private async testVideo(path: string): Promise<VideoTestResult> {
    const result: VideoTestResult = {
      path,
      status: 'pass',
      loadTime: 0,
      fileSize: 0,
      resolution: { width: 0, height: 0 },
      duration: 0,
      hasAudio: false,
      canAutoplay: false,
      errors: [],
      warnings: []
    };

    const startTime = performance.now();

    try {
      // Test file existence and basic properties
      const response = await fetch(path, { method: 'HEAD' });
      
      if (!response.ok) {
        result.errors.push(`HTTP ${response.status}: ${response.statusText}`);
        result.status = 'fail';
        return result;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('video/')) {
        result.errors.push(`Invalid content type: ${contentType}`);
        result.status = 'fail';
        return result;
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        result.fileSize = parseInt(contentLength, 10);
        
        // Warning for large files on mobile
        if (result.fileSize > 50 * 1024 * 1024) { // 50MB
          result.warnings.push('Large file size may impact mobile performance');
          result.status = result.status === 'fail' ? 'fail' : 'warning';
        }
      }

      // Test video loading and properties
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const videoLoadPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video load timeout'));
        }, 10000);

        video.addEventListener('loadedmetadata', () => {
          clearTimeout(timeout);
          
          result.resolution = {
            width: video.videoWidth,
            height: video.videoHeight
          };
          result.duration = video.duration;
          result.hasAudio = video.mozHasAudio || 
                           Boolean(video.webkitAudioDecodedByteCount) ||
                           Boolean(video.audioTracks?.length);

          // Check for common issues
          if (result.resolution.width === 0 || result.resolution.height === 0) {
            result.warnings.push('Invalid video dimensions');
          }

          if (result.duration === 0 || !isFinite(result.duration)) {
            result.warnings.push('Invalid video duration');
          }

          resolve();
        });

        video.addEventListener('error', (error) => {
          clearTimeout(timeout);
          reject(new Error(`Video load error: ${error}`));
        });
      });

      video.src = path;
      await videoLoadPromise;

      // Test autoplay capability
      try {
        await video.play();
        result.canAutoplay = true;
        video.pause();
      } catch {
        result.canAutoplay = false;
        result.warnings.push('Autoplay not supported - user interaction required');
      }

      result.loadTime = performance.now() - startTime;

      // Performance warnings
      if (result.loadTime > 5000) {
        result.warnings.push(`Slow load time: ${Math.round(result.loadTime)}ms`);
        result.status = result.status === 'fail' ? 'fail' : 'warning';
      }

    } catch (error) {
      result.errors.push(`Test failed: ${error}`);
      result.status = 'fail';
      result.loadTime = performance.now() - startTime;
    }

    return result;
  }

  private async testFallbackSystem(): Promise<void> {
    console.log('🔄 Testing fallback system...');
    
    // Test a few key videos with their fallbacks
    const keyVideos = [
      '/videos/lab-phases/hypothesis-intro.mp4',
      '/videos/backgrounds/chat-loop.mp4',
      '/videos/transitions/door-opening.mp4'
    ];

    for (const videoPath of keyVideos) {
      try {
        const fallbackConfig = await VideoFallbackSystem.getWorkingVideo(videoPath);
        
        if (!fallbackConfig) {
          console.warn(`⚠️ No working video found for ${videoPath}`);
          continue;
        }

        console.log(`✓ Fallback system working for ${videoPath} -> ${fallbackConfig.primary}`);
      } catch (error) {
        console.error(`✗ Fallback test failed for ${videoPath}:`, error);
      }
    }
  }

  private async testPreloaderPerformance(): Promise<void> {
    console.log('⚡ Testing preloader performance...');
    
    // Test preloading of priority videos
    const preloadTests = PRELOAD_PRIORITY.slice(0, 3); // Test first 3

    const preloadPromises = preloadTests.map(async (path) => {
      const startTime = performance.now();
      
      try {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        
        return new Promise<number>((resolve) => {
          video.addEventListener('canplaythrough', () => {
            resolve(performance.now() - startTime);
          });
          
          video.addEventListener('error', () => {
            resolve(-1); // Error
          });
          
          setTimeout(() => resolve(-2), 10000); // Timeout
          
          video.src = path;
        });
      } catch (error) {
        return -1;
      }
    });

    const preloadResults = await Promise.all(preloadPromises);
    
    preloadResults.forEach((time, index) => {
      const path = preloadTests[index];
      if (time === -1) {
        console.error(`✗ Preload failed: ${path}`);
      } else if (time === -2) {
        console.warn(`⚠️ Preload timeout: ${path}`);
      } else {
        console.log(`✓ Preloaded ${path} in ${Math.round(time)}ms`);
      }
    });
  }

  private generateTestResults(): TestSuiteResults {
    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;
    const warnings = this.testResults.filter(r => r.status === 'warning').length;

    let overall: 'pass' | 'fail' | 'warning' = 'pass';
    if (failed > 0) {
      overall = 'fail';
    } else if (warnings > 0) {
      overall = 'warning';
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations();

    // Get device info
    const deviceInfo = this.getDeviceInfo();

    return {
      overall,
      totalTests: this.testResults.length,
      passed,
      failed,
      warnings,
      results: this.testResults,
      deviceInfo,
      recommendations
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Analyze results for recommendations
    const failedVideos = this.testResults.filter(r => r.status === 'fail');
    const slowVideos = this.testResults.filter(r => r.loadTime > 3000);
    const largeVideos = this.testResults.filter(r => r.fileSize > 20 * 1024 * 1024);
    const noAutoplayVideos = this.testResults.filter(r => !r.canAutoplay);

    if (failedVideos.length > 0) {
      recommendations.push(`${failedVideos.length} videos failed to load. Check file paths and server configuration.`);
    }

    if (slowVideos.length > 0) {
      recommendations.push(`${slowVideos.length} videos have slow load times. Consider video compression or CDN.`);
    }

    if (largeVideos.length > 0) {
      recommendations.push(`${largeVideos.length} videos are large (>20MB). Consider creating mobile-optimized versions.`);
    }

    if (noAutoplayVideos.length > 0) {
      recommendations.push(`${noAutoplayVideos.length} videos cannot autoplay. Ensure proper user interaction handling.`);
    }

    // Device-specific recommendations
    const deviceCaps = performanceMonitor.getDeviceCapabilities();
    if (deviceCaps?.isLowPowerMode) {
      recommendations.push('Device is in low power mode. Consider reducing video quality and disabling preloading.');
    }

    if (deviceCaps?.batteryLevel && deviceCaps.batteryLevel < 0.2) {
      recommendations.push('Low battery detected. Consider energy-efficient video settings.');
    }

    return recommendations;
  }

  private getDeviceInfo() {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    // @ts-ignore
    const memoryInfo = (performance as any).memory;

    return {
      userAgent: navigator.userAgent,
      isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
      supportsAutoplay: true, // Will be updated by actual test results
      connectionType: connection?.effectiveType || 'unknown',
      memoryInfo: memoryInfo ? {
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        usedJSHeapSize: memoryInfo.usedJSHeapSize,
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit
      } : undefined
    };
  }

  // Generate detailed report
  generateReport(results: TestSuiteResults): string {
    const report = [];
    
    report.push('='.repeat(60));
    report.push('VIDEO INFRASTRUCTURE TEST REPORT');
    report.push('='.repeat(60));
    report.push('');
    
    // Summary
    report.push(`Overall Status: ${results.overall.toUpperCase()}`);
    report.push(`Total Tests: ${results.totalTests}`);
    report.push(`Passed: ${results.passed}`);
    report.push(`Failed: ${results.failed}`);
    report.push(`Warnings: ${results.warnings}`);
    report.push('');
    
    // Device Info
    report.push('DEVICE INFORMATION:');
    report.push(`- Mobile: ${results.deviceInfo.isMobile ? 'Yes' : 'No'}`);
    report.push(`- Connection: ${results.deviceInfo.connectionType || 'Unknown'}`);
    if (results.deviceInfo.memoryInfo) {
      const memMB = Math.round(results.deviceInfo.memoryInfo.totalJSHeapSize / 1024 / 1024);
      report.push(`- Memory: ${memMB}MB`);
    }
    report.push('');
    
    // Failed Tests
    if (results.failed > 0) {
      report.push('FAILED TESTS:');
      results.results
        .filter(r => r.status === 'fail')
        .forEach(result => {
          report.push(`- ${result.path}`);
          result.errors.forEach(error => {
            report.push(`  Error: ${error}`);
          });
        });
      report.push('');
    }
    
    // Warnings
    if (results.warnings > 0) {
      report.push('WARNINGS:');
      results.results
        .filter(r => r.status === 'warning')
        .forEach(result => {
          report.push(`- ${result.path}`);
          result.warnings.forEach(warning => {
            report.push(`  Warning: ${warning}`);
          });
        });
      report.push('');
    }
    
    // Recommendations
    if (results.recommendations.length > 0) {
      report.push('RECOMMENDATIONS:');
      results.recommendations.forEach((rec, index) => {
        report.push(`${index + 1}. ${rec}`);
      });
      report.push('');
    }
    
    // Performance Summary
    const avgLoadTime = results.results.reduce((sum, r) => sum + (r.loadTime > 0 ? r.loadTime : 0), 0) / results.results.length;
    const totalFileSize = results.results.reduce((sum, r) => sum + r.fileSize, 0);
    
    report.push('PERFORMANCE SUMMARY:');
    report.push(`- Average Load Time: ${Math.round(avgLoadTime)}ms`);
    report.push(`- Total File Size: ${Math.round(totalFileSize / 1024 / 1024)}MB`);
    report.push(`- Autoplay Support: ${results.results.filter(r => r.canAutoplay).length}/${results.totalTests}`);
    
    return report.join('\n');
  }
}

// Export convenience function for quick testing
export async function runVideoTests(): Promise<TestSuiteResults> {
  const testSuite = VideoTestSuite.getInstance();
  return await testSuite.runFullTestSuite();
}

// Debug utility - run tests and log results
export async function debugVideoInfrastructure(): Promise<void> {
  console.log('🎬 Running video infrastructure debug...');
  
  const results = await runVideoTests();
  const report = VideoTestSuite.getInstance().generateReport(results);
  
  console.log(report);
  
  // Also save to localStorage for persistence
  localStorage.setItem('video-test-results', JSON.stringify(results));
  localStorage.setItem('video-test-report', report);
  
  console.log('📊 Results saved to localStorage');
}