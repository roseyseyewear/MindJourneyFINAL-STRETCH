import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Video, Paperclip } from "lucide-react";
import theLabLogo from "../assets/the-lab_logo_white-2_3_1755515290363.png";
import { DELTA_COPY, COPY_UTILS } from "@/lib/copy-constants";

interface ChatMessage {
  id: string;
  sender: 'lab' | 'user';
  content: string;
  timestamp: Date;
}

interface LevelCompleteScreenProps {
  onContinue: (contact: {email?: string; name?: string}) => void;
  visitorNumber?: number | null;
  level: number;
  phase: string;
}

export default function LevelCompleteScreen({
  onContinue,
  visitorNumber,
  level,
  phase,
}: LevelCompleteScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sms, setSms] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'name' | 'email' | 'sms' | 'complete'>('name');
  const { toast } = useToast();

  // Format visitor number as 4-digit string using utility
  const formatVisitorNumber = COPY_UTILS.formatVisitorNumber;

  // Submit contact data to Firebase
  const submitContactMutation = useMutation({
    mutationFn: async ({ name, email, sms }: { name: string; email: string; sms: string }) => {
      const response = await apiRequest('POST', '/api/contact/submit', {
        name,
        email,
        sms,
        visitorNumber,
        submissionType: 'unlock_benefits'
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your contact information has been saved. Check your email and SMS for early access details.",
      });
      
      // Add final success message and trigger continuation
      setTimeout(() => {
        const successMessage: ChatMessage = {
          id: `success-${Date.now()}`,
          sender: 'lab',
          content: DELTA_COPY.labEntrance.contactForm.success,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, successMessage]);
        setCurrentStep('complete');
        
        // Notify parent component of successful contact capture
        onContinue({ name, email });
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    console.log('🔥 LevelCompleteScreen mounted with:', { visitorNumber, level, phase });
    
    const video = videoRef.current;
    if (!video) {
      console.log('🔥 No video ref, initializing chat immediately');
      setTimeout(() => {
        initializeChat();
      }, 1000);
      return;
    }

    // Setup video and initialize chat
    video.preload = 'auto';
    
    const handleLoadedData = () => {
      console.log('🔥 Level complete video loaded, playing immediately');
      video.play().catch(console.error);
      
      setTimeout(() => {
        initializeChat();
      }, 2000);
    };

    const handleError = (e: Event) => {
      console.error('🔥 Video error:', e);
      setTimeout(() => {
        initializeChat();
      }, 1000);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.load();
    
    if (video.readyState >= 3) {
      video.play().catch(console.error);
    }

    const fallbackTimer = setTimeout(() => {
      initializeChat();
    }, 3000);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      clearTimeout(fallbackTimer);
    };
  }, [phase]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = () => {
    console.log('🔥 initializeChat called');
    
    const unlockMessage: ChatMessage = {
      id: 'unlock-message',
      sender: 'lab',
      content: DELTA_COPY.labEntrance.unlock.title + ' ' + DELTA_COPY.labEntrance.unlock.description,
      timestamp: new Date(),
    };

    setMessages([unlockMessage]);

    setTimeout(() => {
      setIsTyping(true);
    }, 1500);

    setTimeout(() => {
      setIsTyping(false);
      const contactMessage: ChatMessage = {
        id: 'contact-request',
        sender: 'lab',
        content: DELTA_COPY.labEntrance.contactForm.introduction,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, contactMessage]);
      setShowContactForm(true);
    }, 3000);
  };

  const handleSubmitName = () => {
    if (!name.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-name-${Date.now()}`,
      sender: 'user',
      content: name,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentStep('email');
    
    setTimeout(() => {
      setIsTyping(true);
    }, 500);
    
    setTimeout(() => {
      setIsTyping(false);
      const emailMessage: ChatMessage = {
        id: 'email-request',
        sender: 'lab',
        content: 'Perfect! What is your email address for your early access benefits?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, emailMessage]);
    }, 1500);
  };

  const handleSubmitEmail = () => {
    if (!email.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-email-${Date.now()}`,
      sender: 'user',
      content: email,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentStep('sms');
    
    setTimeout(() => {
      setIsTyping(true);
    }, 500);
    
    setTimeout(() => {
      setIsTyping(false);
      const smsMessage: ChatMessage = {
        id: 'sms-request',
        sender: 'lab',
        content: DELTA_COPY.labEntrance.contactForm.fields.phone.description,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, smsMessage]);
    }, 1500);
  };

  const handleSubmitSms = () => {
    if (!sms.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-sms-${Date.now()}`,
      sender: 'user',
      content: sms,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Submit all data to Firebase
    submitContactMutation.mutate({ name, email, sms });
  };

  return (
    <div className="absolute inset-0 w-full h-full" style={{ fontFamily: 'Magda Clean, sans-serif' }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/level1-forest.mp4"
        muted
        loop
        playsInline
        autoPlay
      />

      {/* Chat Interface */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="rounded-xl" style={{ backgroundColor: 'transparent', border: '1px solid #eeeeee' }}>
            <div className="w-full rounded-xl" style={{ backgroundColor: 'transparent' }}>

              {/* Header */}
              <div className="relative z-10 rounded-t-xl overflow-hidden" style={{ backgroundColor: 'rgba(20, 20, 20, 0.7)', borderBottom: '1px solid #eeeeee' }}>
                <div className="flex items-center justify-between px-3 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 relative">
                      <img src={theLabLogo} alt="Lab Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xs tracking-wide" style={{ color: '#eeeeee', fontSize: '12px' }}>VISITOR #{formatVisitorNumber(visitorNumber)}</span>
                  </div>
                  <div className="flex items-center space-x-2 h-full">
                    <div className="w-px h-full" style={{ backgroundColor: '#eeeeee' }}></div>
                    <span className="font-bold text-xs" style={{ color: '#eeeeee', fontSize: '10px' }}>LEVEL {level}</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="relative z-10 max-h-48 overflow-y-auto p-4 space-y-3 custom-scrollbar" style={{ backgroundColor: 'rgba(20, 20, 20, 0.7)' }}>
                {messages.slice(-4).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`rounded-xl px-3 py-2`} style={{ 
                        backgroundColor: message.sender === 'user' ? 'rgba(20, 20, 20, 0.6)' : 'transparent', 
                        border: 'none',
                        color: '#eeeeee'
                      }}>
                        <p className="text-xs leading-relaxed" data-testid={`text-message-${message.id}`}>{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                  
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[85%]">
                      <div className="rounded-xl px-3 py-2" style={{ 
                        backgroundColor: 'transparent', 
                        border: 'none',
                        color: '#eeeeee'
                      }}>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                  
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="relative z-10 px-3 pb-3 rounded-b-xl" style={{ backgroundColor: 'rgba(20, 20, 20, 0.7)' }}>
                {showContactForm && currentStep !== 'complete' && (
                  <div className="flex items-center rounded-full p-2" style={{ backgroundColor: 'rgba(238, 238, 238, 0.2)' }}>
                    {/* Response Options */}
                    <button
                      className="p-2 transition-all flex items-center justify-center w-7 h-7 rounded-md"
                      style={{ 
                        color: '#eeeeee',
                        backgroundColor: 'transparent'
                      }}
                      disabled={true}
                      data-testid="button-record"
                    >
                      <Mic className="w-3 h-3" />
                    </button>

                    <div className="w-px mx-1" style={{ backgroundColor: '#eeeeee', height: '100%' }}></div>

                    <button
                      className="p-2 transition-all flex items-center justify-center w-7 h-7 rounded-md"
                      style={{ 
                        color: '#eeeeee',
                        backgroundColor: 'transparent'
                      }}
                      disabled={true}
                      data-testid="button-video-record"
                    >
                      <Video className="w-3 h-3" />
                    </button>

                    <div className="w-px mx-1" style={{ backgroundColor: '#eeeeee', height: '100%' }}></div>

                    <button
                      className="p-2 transition-all flex items-center justify-center w-7 h-7 rounded-md"
                      style={{ color: '#eeeeee' }}
                      disabled={true}
                      data-testid="button-file"
                    >
                      <Paperclip className="w-3 h-3" />
                    </button>

                    <div className="w-px mx-2" style={{ backgroundColor: '#eeeeee', height: '100%' }}></div>

                    {/* Text Input */}
                    <Input
                      value={currentStep === 'name' ? name : currentStep === 'email' ? email : sms}
                      onChange={(e) => {
                        if (currentStep === 'name') setName(e.target.value);
                        else if (currentStep === 'email') setEmail(e.target.value);
                        else setSms(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (currentStep === 'name') handleSubmitName();
                          else if (currentStep === 'email') handleSubmitEmail();
                          else handleSubmitSms();
                        }
                      }}
                      placeholder={
                        currentStep === 'name' ? DELTA_COPY.labEntrance.contactForm.fields.name.placeholder :
                        currentStep === 'email' ? DELTA_COPY.labEntrance.contactForm.fields.email.placeholder :
                        DELTA_COPY.labEntrance.contactForm.fields.phone.placeholder
                      }
                      type={currentStep === 'email' ? 'email' : currentStep === 'sms' ? 'tel' : 'text'}
                      className="flex-1 border-0 bg-transparent text-sm h-8 focus:ring-0 focus:outline-none px-2"
                      style={{ color: '#eeeeee', outline: 'none', boxShadow: 'none' }}
                      disabled={submitContactMutation.isPending}
                      data-testid="input-text-response"
                    />

                    <div className="w-px mx-2" style={{ backgroundColor: '#eeeeee', height: '100%' }}></div>

                    <Button
                      onClick={() => {
                        if (currentStep === 'name') handleSubmitName();
                        else if (currentStep === 'email') handleSubmitEmail();
                        else handleSubmitSms();
                      }}
                      disabled={
                        (currentStep === 'name' && !name.trim()) ||
                        (currentStep === 'email' && !email.trim()) ||
                        (currentStep === 'sms' && !sms.trim()) ||
                        submitContactMutation.isPending
                      }
                      className="px-2 py-1 border-0 bg-transparent h-8 rounded-md"
                      style={{ color: '#eeeeee' }}
                      data-testid="button-send"
                    >
                      {submitContactMutation.isPending ? (
                        <div className="w-3 h-3 border rounded-full animate-spin" style={{ borderColor: '#eeeeee', borderTopColor: 'transparent' }} />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                )}

                {/* Success Message */}
                {currentStep === 'complete' && (
                  <div className="px-4 pb-3" style={{ borderTop: '1px solid #eeeeee' }}>
                    <div className="pt-3 text-center">
                      <p className="text-xs text-center" style={{ color: 'rgba(238, 238, 238, 0.8)' }}>
                        Welcome to The Lab! You'll automatically be taken to the next phase.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}