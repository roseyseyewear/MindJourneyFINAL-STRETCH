/**
 * Video Infrastructure Demo Component
 * Demonstrates all video features: assets, transitions, preloading, fallbacks
 */

import { useState, useEffect } from "react";
import { Play, Settings, TestTube2, Monitor, Smartphone, Wifi, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";

import EnhancedVideoLightbox from "./enhanced-video-lightbox";
import VideoTransition from "./video-transition";
import VideoPreloader from "./video-preloader";
import { LAB_EXPERIENCE_VIDEOS } from "@/lib/video-assets";
import { performanceMonitor } from "@/lib/video-performance";
import { runVideoTests, type TestSuiteResults } from "@/utils/video-test-suite";

const DEMO_LEVEL = {
  id: "demo-level",
  levelNumber: 1,
  videoUrl: "/videos/lab-phases/hypothesis-intro.mp4",
  backgroundVideoUrl: "/videos/backgrounds/chat-loop.mp4",
  postSubmissionVideoUrl: "/videos/lab-phases/lab-hub.mp4",
  completionVideoUrl: "/videos/backgrounds/futuristic-interface-1.mp4",
  questions: [],
  branchingLogic: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  experimentId: "demo"
};

type LabPhase = 'hypothesis' | 'chat' | 'labEntrance' | 'labHub';

export default function VideoDemo() {
  const isMobile = useMobile();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<LabPhase>('hypothesis');
  const [showTransition, setShowTransition] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState<LabPhase>('hypothesis');
  const [transitionTo, setTransitionTo] = useState<LabPhase>('chat');
  const [showPreloader, setShowPreloader] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResults | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  // Initialize performance monitoring
  useEffect(() => {
    const initializePerformance = async () => {
      await performanceMonitor.initialize();
      const caps = performanceMonitor.getDeviceCapabilities();
      setDeviceInfo(caps);
    };

    initializePerformance();
  }, []);

  const handlePhaseChange = (newPhase: LabPhase) => {
    if (newPhase !== currentPhase) {
      setTransitionFrom(currentPhase);
      setTransitionTo(newPhase);
      setShowTransition(true);
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setCurrentPhase(transitionTo);
  };

  const runPerformanceTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await runVideoTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getPhaseDescription = (phase: LabPhase): string => {
    switch (phase) {
      case 'hypothesis':
        return 'Initial hypothesis entry with immersive intro video';
      case 'chat':
        return 'Interactive chat interface with looping background';
      case 'labEntrance':
        return 'Lab entrance with doorway transition animation';
      case 'labHub':
        return 'Lab hub environment with futuristic atmosphere';
    }
  };

  const getPhaseVideos = (phase: LabPhase) => {
    return LAB_EXPERIENCE_VIDEOS[phase] || {};
  };

  const renderDeviceInfo = () => (
    <Card className="p-4 space-y-3">
      <div className="flex items-center space-x-2">
        {isMobile ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
        <span className="font-medium">Device Information</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Platform:</span>
          <Badge variant={isMobile ? "secondary" : "default"}>
            {isMobile ? "Mobile" : "Desktop"}
          </Badge>
        </div>
        
        {deviceInfo && (
          <>
            <div className="flex justify-between">
              <span>Hardware Decoding:</span>
              <Badge variant={deviceInfo.hardwareDecoding ? "default" : "secondary"}>
                {deviceInfo.hardwareDecoding ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span>Low Power Mode:</span>
              <Badge variant={deviceInfo.isLowPowerMode ? "destructive" : "default"}>
                {deviceInfo.isLowPowerMode ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>{Math.round(deviceInfo.memoryLimit / 1024 / 1024)}MB</span>
            </div>
            
            {deviceInfo.batteryLevel && (
              <div className="flex justify-between">
                <span>Battery:</span>
                <span>{Math.round(deviceInfo.batteryLevel * 100)}%</span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );

  const renderTestResults = () => {
    if (!testResults) return null;

    return (
      <Card className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <TestTube2 className="w-4 h-4" />
          <span className="font-medium">Test Results</span>
          <Badge 
            variant={
              testResults.overall === 'pass' ? 'default' : 
              testResults.overall === 'warning' ? 'secondary' : 
              'destructive'
            }
          >
            {testResults.overall.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{testResults.warnings}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {testResults.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Recommendations:</h4>
            <div className="space-y-1">
              {testResults.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Video Infrastructure Demo</h1>
        <p className="text-gray-600">
          Comprehensive video system for the 4-page lab experience
        </p>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="assets">Video Assets</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Lab Experience Flow</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(['hypothesis', 'chat', 'labEntrance', 'labHub'] as LabPhase[]).map((phase) => (
                    <Button
                      key={phase}
                      variant={currentPhase === phase ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePhaseChange(phase)}
                      className="justify-start"
                    >
                      {phase.charAt(0).toUpperCase() + phase.slice(1)}
                    </Button>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Current Phase: {currentPhase}</h4>
                  <p className="text-sm text-gray-600">
                    {getPhaseDescription(currentPhase)}
                  </p>
                  
                  <div className="mt-3 space-y-1">
                    {Object.entries(getPhaseVideos(currentPhase)).map(([type, config]) => (
                      <div key={type} className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{type}:</span>
                        <code className="text-xs bg-gray-200 px-1 rounded">
                          {config?.path.split('/').pop()}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Launch Video Experience
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreloader(!showPreloader)}
                    >
                      {showPreloader ? 'Hide' : 'Show'} Preloader
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTransition(true)}
                    >
                      Test Transition
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {renderDeviceInfo()}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(LAB_EXPERIENCE_VIDEOS).map(([phase, phaseVideos]) => (
              <Card key={phase} className="p-6">
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {phase} Phase
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(phaseVideos).map(([type, config]) => (
                    <div key={type} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{type}</span>
                        <Badge variant="outline" className="text-xs">
                          {config?.preload ? 'Preload' : 'On-Demand'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 font-mono">
                        {config?.path}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        {config?.autoplay && (
                          <Badge variant="secondary">Autoplay</Badge>
                        )}
                        {config?.loop && (
                          <Badge variant="secondary">Loop</Badge>
                        )}
                        {config?.muted && (
                          <Badge variant="secondary">Muted</Badge>
                        )}
                        {config?.fallback && (
                          <Badge variant="outline">Has Fallback</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderDeviceInfo()}
            {testResults && renderTestResults()}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Performance Testing</h3>
              <Button
                onClick={runPerformanceTests}
                disabled={isRunningTests}
                size="sm"
              >
                {isRunningTests ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube2 className="w-4 h-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>
            
            {testResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold">{testResults.totalTests}</div>
                    <div className="text-sm text-gray-600">Total Tests</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold text-yellow-600">{testResults.warnings}</div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {testResults.results.map((result, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                        {result.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {result.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {result.status === 'fail' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        
                        <div className="flex-1">
                          <div className="font-mono text-sm">{result.path.split('/').pop()}</div>
                          {result.loadTime > 0 && (
                            <div className="text-xs text-gray-500">
                              {Math.round(result.loadTime)}ms • {Math.round(result.fileSize / 1024)}KB
                            </div>
                          )}
                        </div>
                        
                        <Badge 
                          variant={
                            result.status === 'pass' ? 'default' : 
                            result.status === 'warning' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Video Lightbox */}
      {isLightboxOpen && (
        <EnhancedVideoLightbox
          level={DEMO_LEVEL}
          sessionId="demo-session"
          labPhase={currentPhase}
          onVideoEnd={() => console.log('Video ended')}
          onQuestionComplete={() => console.log('Questions complete')}
          onClose={() => setIsLightboxOpen(false)}
          isOpen={isLightboxOpen}
          visitorNumber={1234}
        />
      )}

      {/* Video Transition */}
      <VideoTransition
        fromPhase={transitionFrom}
        toPhase={transitionTo}
        isActive={showTransition}
        onComplete={handleTransitionComplete}
      />

      {/* Video Preloader */}
      <VideoPreloader
        currentPhase={currentPhase}
        visible={showPreloader}
        onPreloadComplete={(path) => console.log('Preloaded:', path)}
        onPreloadError={(path, error) => console.error('Preload error:', path, error)}
      />
    </div>
  );
}