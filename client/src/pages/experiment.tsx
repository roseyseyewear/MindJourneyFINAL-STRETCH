import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play } from "lucide-react";
import WelcomeScreen from "@/components/welcome-screen";
import EnhancedVideoLightbox from "@/components/enhanced-video-lightbox";
import ProgressTracker from "@/components/progress-tracker";
import LevelCompleteScreen from "@/components/level-complete-screen";
import { DELTA_COPY } from "@/lib/copy-constants";
import { LAB_EXPERIENCE_CONFIG } from "@/lib/content-config";

import { type ExperimentSession, type ExperimentLevel, type Experiment } from "@shared/schema";

type ExperimentState = 'welcome' | 'hypothesis' | 'chat' | 'labEntrance' | 'labHub' | 'completed';
type LabPhase = 'hypothesis' | 'chat' | 'labEntrance' | 'labHub';

export default function Experiment() {
  const [currentState, setCurrentState] = useState<ExperimentState>('welcome');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorNumber, setVisitorNumber] = useState<number | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLevelData, setCurrentLevelData] = useState<ExperimentLevel | null>(null);
  const [branchingPath, setBranchingPath] = useState('default');
  const [isVideoLightboxOpen, setIsVideoLightboxOpen] = useState(false);
  const [currentLabPhase, setCurrentLabPhase] = useState<LabPhase>('hypothesis');
  const [responses, setResponses] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<{email?: string; name?: string} | null>(null);
  const { toast } = useToast();

  // Fetch active experiment
  const { data: experiment, isLoading: experimentLoading } = useQuery({
    queryKey: ['/api/experiment'],
  }) as { data: Experiment | undefined; isLoading: boolean };

  // Fetch experiment levels
  const { data: levels = [] } = useQuery({
    queryKey: ['/api/experiment', experiment?.id, 'levels'],
    enabled: !!experiment?.id,
  }) as { data: ExperimentLevel[] };

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (experimentId: string) => {
      const response = await apiRequest('POST', '/api/session', {
        experimentId,
        currentLevel: 1,
        branchingPath: 'default',
      });
      return response.json();
    },
    onSuccess: (session: ExperimentSession) => {
      console.log('🔥 Session created:', session);
      console.log('🔥 Session visitorNumber field:', session.visitorNumber);
      console.log('🔥 Session full object:', JSON.stringify(session, null, 2));
      setSessionId(session.id);
      setVisitorNumber(session.visitorNumber || null);
      console.log('🔥 Visitor number set to:', session.visitorNumber);
      setCurrentState('welcome');
      setIsVideoLightboxOpen(true);
      // Load first level
      if (levels.length > 0) {
        setCurrentLevelData(levels[0]);
      }
      
      // Log visitor number assignment (no popup)
      if (session.visitorNumber) {
        console.log(`✅ Welcome, Visitor #${session.visitorNumber.toString().padStart(4, '0')}!`);
      } else {
        console.warn('⚠️ Session created without visitor number');
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start experiment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: Partial<ExperimentSession> }) => {
      const response = await apiRequest('PATCH', `/api/session/${sessionId}`, updates);
      return response.json();
    },
  });

  const handleStartExperiment = () => {
    if (!experiment?.id) return;
    // Start with hypothesis phase
    setCurrentState('hypothesis');
    setCurrentLabPhase('hypothesis');
    createSessionMutation.mutate(experiment.id);
  };

  const handleVideoEnd = () => {
    // Video ended, questions will appear in the same fullscreen container
  };

  const handleQuestionComplete = (questionResponses: any[]) => {
    if (!sessionId || !currentLevelData) return;
    
    // Store responses
    setResponses(prev => [...prev, ...questionResponses]);
    
    // Determine next phase based on current lab phase
    const phaseProgression: LabPhase[] = ['hypothesis', 'chat', 'labEntrance', 'labHub'];
    const currentIndex = phaseProgression.indexOf(currentLabPhase);
    
    if (currentIndex < phaseProgression.length - 1) {
      const nextPhase = phaseProgression[currentIndex + 1];
      const nextLevel = currentIndex + 2; // Levels are 1-indexed
      const nextLevelData = levels.find((l) => l.levelNumber === nextLevel);
      
      setTimeout(() => {
        setCurrentLabPhase(nextPhase);
        setCurrentState(nextPhase);
        setCurrentLevel(nextLevel);
        
        if (nextLevelData) {
          setCurrentLevelData(nextLevelData);
          setIsVideoLightboxOpen(true);
        }
        
        // Update session
        updateSessionMutation.mutate({
          sessionId,
          updates: { currentLevel: nextLevel }
        });
      }, 2000);
    } else {
      // Complete the experience
      setCurrentState('completed');
      setIsVideoLightboxOpen(false);
      updateSessionMutation.mutate({
        sessionId,
        updates: { isCompleted: true }
      });
    }
  };

  const handleContactCapture = (contact: {email?: string; name?: string}) => {
    setContactInfo(contact);
    // Proceed to next phase after contact capture
    handleQuestionComplete([]);
  };

  const handleCloseLightbox = () => {
    setIsVideoLightboxOpen(false);
    setCurrentState('welcome');
    setSessionId(null);
    setVisitorNumber(null);
    setCurrentLevel(1);
    setCurrentLevelData(null);
    setBranchingPath('default');
    setCurrentLabPhase('hypothesis');
    setResponses([]);
    setContactInfo(null);
  };

  const handleRestart = () => {
    setCurrentState('welcome');
    setSessionId(null);
    setVisitorNumber(null);
    setCurrentLevel(1);
    setCurrentLevelData(null);
    setBranchingPath('default');
    setIsVideoLightboxOpen(false);
    setCurrentLabPhase('hypothesis');
    setResponses([]);
    setContactInfo(null);
  };

  const handleSelectFrame = () => {
    // Handle "Select a Frame" button action
    console.log("Select a Frame clicked");
    // You can add specific logic here for frame selection
  };

  const handleFindTheLab = () => {
    // Handle "Find The Lab" button action
    console.log("Find The Lab clicked");
    // You can add specific logic here for lab finding
  };

  if (experimentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner rounded-full h-12 w-12 border-2 border-gray-600 border-t-white mx-auto mb-4"></div>
          <p className="experiment-text-primary text-lg">Initializing experiment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <ProgressTracker 
        currentLevel={currentLevel}
        totalLevels={experiment?.totalLevels || 5}
        progress={((currentLevel - 1) / (experiment?.totalLevels || 5)) * 100}
        onExit={handleRestart}
        visible={!!visitorNumber}
        visitorNumber={visitorNumber}
      />

      {currentState === 'welcome' && (
        <WelcomeScreen
          onStart={handleStartExperiment}
          isLoading={createSessionMutation.isPending}
          experimentTitle={DELTA_COPY.welcomeScreen.title}
          experimentDescription={DELTA_COPY.welcomeScreen.description || undefined}
          totalLevels={4}
        />
      )}

      {/* Enhanced Video Lightbox with Lab Phase Support */}
      {currentLevelData && sessionId && ['hypothesis', 'chat', 'labEntrance', 'labHub'].includes(currentState) && (
        <EnhancedVideoLightbox
          level={currentLevelData}
          sessionId={sessionId}
          onVideoEnd={handleVideoEnd}
          onQuestionComplete={handleQuestionComplete}
          onClose={handleCloseLightbox}
          isOpen={isVideoLightboxOpen}
          onSelectFrame={handleSelectFrame}
          onFindTheLab={handleFindTheLab}
          visitorNumber={visitorNumber}
          labPhase={currentLabPhase}
        />
      )}

      {/* Lab Entrance Contact Capture Screen */}
      {currentState === 'labEntrance' && !isVideoLightboxOpen && (
        <LevelCompleteScreen
          onContinue={handleContactCapture}
          visitorNumber={visitorNumber}
          level={currentLevel}
          phase="labEntrance"
        />
      )}



      {currentState === 'completed' && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-light tracking-wider mb-4 experiment-text-primary">
              Lab Experience Complete
            </h1>
            <p className="experiment-text-secondary text-lg mb-8">
              Thank you for participating in The Delta Final Stretch experience. Your responses have been recorded and will be used to personalize your results.
            </p>
            <div className="space-y-4">
              <p className="text-sm experiment-text-secondary">
                Check your email for your personalized lab results and early access benefits.
              </p>
              <button
                onClick={handleRestart}
                className="experiment-button-primary px-8 py-3 font-medium tracking-wide hover:bg-white transition-colors duration-300"
              >
                Start New Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
