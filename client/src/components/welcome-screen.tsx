import { Play } from "lucide-react";
import { DELTA_COPY } from "@/lib/copy-constants";
import { MOBILE_UTILS } from "@/lib/mobile-accessibility";

interface WelcomeScreenProps {
  onStart: () => void;
  isLoading: boolean;
  experimentTitle?: string;
  experimentDescription?: string;
  totalLevels?: number;
}

export default function WelcomeScreen({
  onStart,
  isLoading,
  experimentTitle = DELTA_COPY.welcomeScreen.title,
  experimentDescription = DELTA_COPY.welcomeScreen.description,
  totalLevels = 5,
}: WelcomeScreenProps) {
  const isMobile = MOBILE_UTILS.isMobile();
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 fade-in">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 
            className={`tracking-wider mb-8 font-bold ${isMobile ? 'text-[32px] leading-tight' : 'md:text-7xl text-[38px]'}`} 
            style={{ color: '#141414' }}
          >
            {isMobile ? DELTA_COPY.mobile.welcomeScreen.title : DELTA_COPY.welcomeScreen.title}
          </h1>
          {experimentDescription && !isMobile && (
            <p className="text-base tracking-wide mb-4" style={{ color: '#141414', opacity: 0.8 }}>
              {experimentDescription}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-center space-y-8">
          <button
            onClick={onStart}
            disabled={isLoading}
            className={`group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
              isLoading ? 'loading-spinner' : ''
            }`}
            style={{ backgroundColor: '#141414' }}
            aria-label={DELTA_COPY.accessibility.interactions.play_button}
          >
            <Play 
              className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform duration-300" 
              fill="#eeeeee" 
              style={{ color: '#eeeeee' }}
              aria-hidden="true"
            />
          </button>
          
          <div className="text-center space-y-1">
            <p className="text-lg font-bold tracking-wide uppercase" style={{ color: '#141414', marginTop: '-15px' }}>
              {isMobile ? DELTA_COPY.mobile.welcomeScreen.primaryCTA : DELTA_COPY.welcomeScreen.primaryCTA}
            </p>
            <div className="text-sm tracking-wide" style={{ color: '#141414', fontFamily: 'Magda Clean, sans-serif' }}>
              {isMobile ? DELTA_COPY.mobile.welcomeScreen.secondaryCTA : DELTA_COPY.welcomeScreen.secondaryCTA}
            </div>
          </div>
        </div>

        {/* Loading state messages */}
        {isLoading && (
          <div className="mt-8">
            <p className="text-sm" style={{ color: '#141414', opacity: 0.7 }}>
              {DELTA_COPY.systemMessages.loading.general}
            </p>
          </div>
        )}

        {/* Mobile-specific instructions */}
        {isMobile && (
          <div className="fixed bottom-4 left-4 right-4 text-center">
            <p className="text-xs" style={{ color: '#141414', opacity: 0.6 }}>
              {DELTA_COPY.mobile.welcomeScreen.instructions?.audio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
