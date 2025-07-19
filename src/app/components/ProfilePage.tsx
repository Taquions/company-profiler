'use client';

import { useState, useEffect } from 'react';
import { Message } from 'ai';
import ServiceLineModal from './ServiceLineModal';
import AddItemModal from './AddItemModal';
import Image from 'next/image';
import { CompanyProfile } from '../agent/types';
import { useAsyncLogo } from '../hooks/useAsyncLogo';
import { useServiceLineGeneration } from '../hooks/useServiceLineGeneration';
import { LogoService } from '../agent/services/logo-service';



interface ProfilePageProps {
  initialProfile: CompanyProfile;
  messages?: Message[];
  onBack: () => void;
}



export default function ProfilePage({ initialProfile, onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showServiceLineModal, setShowServiceLineModal] = useState(false);
  const [agentMemory, setAgentMemory] = useState<Message[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    field: 'serviceLines' | 'tier1Keywords' | 'tier2Keywords' | 'emails';
    title: string;
    placeholder: string;
    type: 'text' | 'email';
  } | null>(null);

  const [websiteUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('current_website_url') || undefined;
    }
    return undefined;
  });

  const { logoBase64: asyncLogo, isLoadingLogo } = useAsyncLogo(
    initialProfile.companyName, 
    websiteUrl
  );
  
  const { generateServiceLines, isGenerating: isGeneratingServiceLines } = useServiceLineGeneration();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedConversation = sessionStorage.getItem('agent_conversation');
        if (savedConversation) {
          const conversation = JSON.parse(savedConversation);
          setAgentMemory([conversation.userMessage, conversation.assistantMessage]);
          console.log('🧠 Loaded agent conversation from sessionStorage:', conversation);
        }
      } catch (error) {
        console.warn('⚠️ Failed to load agent conversation:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (asyncLogo && !profile.logoBase64) {
      setProfile(prev => ({ ...prev, logoBase64: asyncLogo }));
    }
  }, [asyncLogo, profile.logoBase64]);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    return () => {
      setAgentMemory([]);
      LogoService.removeFromLocalStorage(profile.companyName);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('agent_conversation');
        sessionStorage.removeItem('original_user_prompt');
      }
      console.log('🧠 Agent memory and logo cleared on page exit for:', profile.companyName);
    };
  }, [profile.companyName]);

  const updateProfile = (field: keyof CompanyProfile, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field: 'serviceLines' | 'tier1Keywords' | 'tier2Keywords' | 'emails') => {
    if (field === 'serviceLines') {
      setShowServiceLineModal(true);
      return;
    }

    let config;
    
    switch (field) {
      case 'tier1Keywords':
        config = {
          field,
          title: 'Add Tier 1 Keyword',
          placeholder: 'Enter tier 1 keyword...',
          type: 'text' as const
        };
        break;
      case 'tier2Keywords':
        config = {
          field,
          title: 'Add Tier 2 Keyword',
          placeholder: 'Enter tier 2 keyword...',
          type: 'text' as const
        };
        break;
      case 'emails':
        config = {
          field,
          title: 'Add Email',
          placeholder: 'Enter email address...',
          type: 'email' as const
        };
        break;
    }
    
    setModalConfig(config);
    setModalOpen(true);
  };

  const handleModalSubmit = (value: string) => {
    if (modalConfig) {
      setProfile(prev => ({
        ...prev,
        [modalConfig.field]: [...(prev[modalConfig.field] as string[]), value]
      }));
    }
    setModalOpen(false);
    setModalConfig(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalConfig(null);
  };

  const addServiceLineManually = () => {
    const config = {
      field: 'serviceLines' as const,
      title: 'Add Service Line',
      placeholder: 'Enter new service line...',
      type: 'text' as const
    };
    
    setModalConfig(config);
    setModalOpen(true);
  };

  const handleGenerateServiceLines = async (additionalContext: string, quantity: number) => {
    console.log('🎯 ProfilePage received quantity:', quantity);
    try {
      const uniqueServiceLines = await generateServiceLines(profile, additionalContext, quantity, agentMemory);
      
      setProfile(prev => ({
        ...prev,
        serviceLines: [...prev.serviceLines, ...uniqueServiceLines]
      }));

      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Generate ${quantity} service lines with context: ${additionalContext}`
      };
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Generated ${uniqueServiceLines.length} new service lines: ${uniqueServiceLines.join(', ')}`
      };

      setAgentMemory(prev => [...prev, newUserMessage, assistantMessage]);
      setShowServiceLineModal(false);
      
      console.log('✅ Service lines added to profile:', uniqueServiceLines);
      console.log('🧠 Agent memory updated with new conversation');
    } catch (error) {
      console.error('Error generating service lines:', error);
      alert('Failed to generate service lines. Please try again.');
    }
  };

  const removeItem = (field: 'serviceLines' | 'tier1Keywords' | 'tier2Keywords' | 'emails', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const exportJson = () => {
    const jsonString = JSON.stringify(profile, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.companyName.toLowerCase().replace(/\s+/g, '-')}-profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ArrayField = ({ 
    label, 
    items, 
    field,
    tier1Style = false,
    tier2Style = false,
    listStyle = false
  }: { 
    label: string; 
    items: string[]; 
    field: 'serviceLines' | 'tier1Keywords' | 'tier2Keywords' | 'emails';
    tier1Style?: boolean;
    tier2Style?: boolean;
    listStyle?: boolean;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-semibold text-muted uppercase tracking-wider">{label}</h3>
        {isEditing && (
          <button
            onClick={() => addItem(field)}
            className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/30 hover:bg-primary/50 text-primary rounded-full flex items-center justify-center transition-all hover:scale-110"
            title={`Add ${label.toLowerCase()}`}
          >
            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
      {listStyle ? (
        <div className="space-y-1.5 sm:space-y-2 mb-1">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted rounded-full flex-shrink-0"></div>
              <span className="text-primary text-sm sm:text-base flex-1 break-words">{item}</span>
              {isEditing && (
                <button
                  onClick={() => removeItem(field, index)}
                  className="text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 text-sm sm:text-base"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1">
          {items.map((item, index) => (
            <span 
              key={index} 
              className={`inline-flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm lg:text-base font-medium text-center break-words ${
                tier1Style 
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : tier2Style
                  ? 'bg-warning/20 text-warning border border-warning/30'
                  : 'bg-neutral/50 text-secondary border border-neutral/30'
              }`}
            >
              <span className="text-center leading-tight break-all">{item}</span>
              {isEditing && (
                <button
                  onClick={() => removeItem(field, index)}
                  className="text-current hover:text-error ml-0.5 sm:ml-1 opacity-70 hover:opacity-100 flex-shrink-0 text-xs sm:text-sm"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)',
        backgroundSize: "400% 400%",
        animation: "gradientShift 8s ease infinite"
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--background)', opacity: 0.85 }}></div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 rounded-full opacity-20 filter blur-3xl" style={{ backgroundColor: 'var(--color-primary)' }}></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-20 filter blur-3xl" style={{ backgroundColor: 'var(--color-accent)' }}></div>
      
      {/* Additional overlay for depth */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--background)', opacity: 0.3 }}></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-secondary hover:text-primary hover:bg-surface/20 rounded-lg transition-all text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl">
            {/* Explanatory text above card */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-3 sm:mb-4">
                🚀 Your AI-Generated Company Profile Is Live!
              </h2>
              <p className="text-secondary text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                Discover tailored services, key insights & contacts to skyrocket your business.
              </p>
            </div>

            <div className="bg-surface border border-default rounded-xl sm:rounded-2xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 shadow-xl backdrop-blur-sm">
              
              {/* Header Section */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                {/* Company name with logo */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {/* Logo section with loading state */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                    {profile.logoBase64 && profile.logoBase64.trim() && profile.logoBase64.startsWith('data:image/') && showLogo ? (
                      <Image
                        src={profile.logoBase64}
                        width={48}
                        height={48}
                        alt={`${profile.companyName} logo`}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        onError={() => {
                          setShowLogo(false);
                        }}
                      />
                    ) : isLoadingLogo ? (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral/50 rounded-lg flex items-center justify-center animate-pulse">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-muted animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral/50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      className="text-xl sm:text-2xl lg:text-3xl font-bold bg-transparent text-primary border-none outline-none placeholder-muted min-w-0 flex-1"
                      value={profile.companyName}
                      onChange={(e) => updateProfile('companyName', e.target.value)}
                      placeholder="Company Name"
                    />
                  ) : (
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary truncate">{profile.companyName}</h1>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {/* Download/Export JSON Button */}
                  <button
                    onClick={exportJson}
                    className="p-2 rounded-lg transition-all text-muted hover:text-secondary hover:bg-neutral/10"
                    title="Export JSON"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  {/* Edit Icon Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-2 rounded-lg transition-all ${
                      isEditing 
                        ? 'text-success hover:text-success hover:bg-success/10' 
                        : 'text-primary hover:text-primary-dark hover:bg-primary/10'
                    }`}
                    title={isEditing ? 'Save Changes' : 'Edit Profile'}
                  >
                    {isEditing ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-4 sm:mb-6">
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[100px] sm:min-h-[120px] max-h-[200px] bg-neutral-light border border-default rounded-lg px-3 py-2 text-primary text-sm sm:text-base focus:border-primary focus:ring focus:ring-primary/20 resize-y"
                    placeholder="Company description..."
                    value={profile.description}
                    onChange={(e) => updateProfile('description', e.target.value)}
                    rows={6}
                  />
                ) : (
                  <p className="text-secondary text-sm sm:text-base leading-relaxed text-justify">{profile.description}</p>
                )}
              </div>

              {/* Two Column Layout - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-6">
                  <ArrayField label="Service Lines" items={profile.serviceLines} field="serviceLines" listStyle={true} />
                  
                  <ArrayField label="E-mails" items={profile.emails} field="emails" listStyle={true} />
                  
                  {/* Point of Contact */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted uppercase tracking-wider mb-2">Point of Contact (POC)</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full bg-neutral-light border border-default rounded-lg px-3 py-2 text-primary text-sm sm:text-base focus:border-primary focus:ring focus:ring-primary/20"
                        value={profile.pointOfContact}
                        onChange={(e) => updateProfile('pointOfContact', e.target.value)}
                        placeholder="Point of Contact"
                      />
                    ) : (
                      <p className="text-primary font-medium text-sm sm:text-base break-words">{profile.pointOfContact}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                  <ArrayField 
                    label="Tier 1 Keywords" 
                    items={profile.tier1Keywords} 
                    field="tier1Keywords" 
                    tier1Style={true}
                  />
                  
                  <ArrayField 
                    label="Tier 2 Keywords" 
                    items={profile.tier2Keywords} 
                    field="tier2Keywords" 
                    tier2Style={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Line Modal */}
      <ServiceLineModal
        isOpen={showServiceLineModal}
        onClose={() => setShowServiceLineModal(false)}
        onGenerate={handleGenerateServiceLines}
        onManualAdd={addServiceLineManually}
        isGenerating={isGeneratingServiceLines}
      />

      {/* Add Item Modal */}
      {modalConfig && (
        <AddItemModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          title={modalConfig.title}
          placeholder={modalConfig.placeholder}
          type={modalConfig.type}
        />
      )}

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
      `}</style>
    </div>
  );
} 