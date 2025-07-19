'use client';

import { useState, useEffect } from 'react';
import { Message } from 'ai';
import ServiceLineModal from './ServiceLineModal';
import AddItemModal from './AddItemModal';
import Image from 'next/image';

interface CompanyProfile {
  companyName: string;
  description: string;
  serviceLines: string[];
  tier1Keywords: string[];
  tier2Keywords: string[];
  emails: string[];
  pointOfContact: string;
  logoBase64?: string;
}

interface ProfilePageProps {
  initialProfile: CompanyProfile;
  messages: Message[];
  onBack: () => void;
}

// Custom hook for async logo loading
function useAsyncLogo(companyName: string, websiteUrl?: string) {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [isLoadingLogo, setIsLoadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLogo = async () => {
      // First, try to load from localStorage
      try {
        const savedLogo = localStorage.getItem(`company_logo_${companyName}`);
        if (savedLogo && isMounted) {
          setLogoBase64(savedLogo);
          console.log('🔄 Logo loaded from localStorage for:', companyName);
          return;
        }
      } catch (error) {
        console.warn('⚠️ Failed to load logo from localStorage:', error);
      }

      // If no logo in localStorage and we have a website URL, try to fetch it
      if (websiteUrl && isMounted) {
        setIsLoadingLogo(true);
        setLogoError(null);
        
        try {
          console.log('🎨 Starting async logo fetch for:', companyName);
          
          // Get website content first
          const websiteResponse = await fetch('/api/logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: websiteUrl, companyName })
          });

          if (!websiteResponse.ok) {
            throw new Error(`HTTP ${websiteResponse.status}`);
          }

          const logoData = await websiteResponse.json();
          
          if (logoData.success && logoData.logoBase64 && isMounted) {
            setLogoBase64(logoData.logoBase64);
            
            // Save to localStorage for future use
            try {
              localStorage.setItem(`company_logo_${companyName}`, logoData.logoBase64);
              console.log('✅ Logo fetched and saved to localStorage for:', companyName);
            } catch (error) {
              console.warn('⚠️ Failed to save logo to localStorage:', error);
            }
          } else if (isMounted) {
            setLogoError(logoData.error || 'Failed to load logo');
            console.log('❌ Logo fetch failed:', logoData.error);
          }
        } catch (error) {
          if (isMounted) {
            setLogoError(error instanceof Error ? error.message : 'Unknown error');
            console.log('❌ Logo fetch error:', error);
          }
        } finally {
          if (isMounted) {
            setIsLoadingLogo(false);
          }
        }
      }
    };

    loadLogo();

    return () => {
      isMounted = false;
    };
  }, [companyName, websiteUrl]);

  return { logoBase64, isLoadingLogo, logoError };
}

export default function ProfilePage({ initialProfile, messages, onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showServiceLineModal, setShowServiceLineModal] = useState(false);
  const [isGeneratingServiceLines, setIsGeneratingServiceLines] = useState(false);
  const [agentMemory, setAgentMemory] = useState<Message[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    field: 'serviceLines' | 'tier1Keywords' | 'tier2Keywords' | 'emails';
    title: string;
    placeholder: string;
    type: 'text' | 'email';
  } | null>(null);

  // Get website URL from session storage if available
  const [websiteUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('current_website_url') || undefined;
    }
    return undefined;
  });

  // Use the async logo hook
  const { logoBase64: asyncLogo, isLoadingLogo, logoError } = useAsyncLogo(
    initialProfile.companyName, 
    websiteUrl
  );

  // Update profile when async logo is loaded
  useEffect(() => {
    if (asyncLogo && !profile.logoBase64) {
      setProfile(prev => ({ ...prev, logoBase64: asyncLogo }));
    }
  }, [asyncLogo, profile.logoBase64]);

  // Initialize profile
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Clear agent memory and localStorage when component unmounts
  useEffect(() => {
    return () => {
      // Clear agent memory
      setAgentMemory([]);
      
      // Clear company logo from localStorage
      try {
        const logoKey = `company_logo_${profile.companyName}`;
        localStorage.removeItem(logoKey);
        console.log('🧠 Agent memory and logo cleared on page exit for:', profile.companyName);
      } catch (error) {
        console.warn('⚠️ Failed to clear logo from localStorage:', error);
      }
    };
  }, [profile.companyName]);

  const updateProfile = (field: keyof CompanyProfile, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field: 'serviceLines' | 'tier1Keywords' | 'tier2Keywords' | 'emails') => {
    // Special handling for service lines - open modal
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

  const generateServiceLines = async (additionalContext: string, quantity: number) => {
    setIsGeneratingServiceLines(true);
    
    try {
      // Create detailed prompt for LLM
      const prompt = `I need you to generate ${quantity} new service lines for my company. Please analyze the company profile below and suggest relevant service lines that would complement our existing offerings.

**Company Information:**
- Company Name: ${profile.companyName}
- Description: ${profile.description}
- Current Service Lines: ${profile.serviceLines.join(', ')}
- Tier 1 Keywords: ${profile.tier1Keywords.join(', ')}
- Tier 2 Keywords: ${profile.tier2Keywords.join(', ')}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

**Requirements:**
- Generate exactly ${quantity} new service lines
- Avoid duplicating existing service lines
- Make them relevant to the company's business profile
- Focus on professional services that could realistically be offered
- Consider government contracting opportunities

Please respond with ONLY a JSON array of strings, no other text. Example format:
["Service Line 1", "Service Line 2", "Service Line 3"]`;

      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: prompt
      };

      // Filter agent memory to exclude any logo data to save tokens
      const cleanAgentMemory = agentMemory.map(msg => ({
        ...msg,
        content: typeof msg.content === 'string' 
          ? msg.content.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '[LOGO_REMOVED]')
          : msg.content
      }));

      const messagesWithContext = [...cleanAgentMemory, newUserMessage];

      console.log('🔧 Generating service lines with LLM:', {
        companyName: profile.companyName,
        quantity,
        hasAdditionalContext: !!additionalContext,
        memoryMessages: cleanAgentMemory.length
      });

      const response = await fetch('/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesWithContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate service lines');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }

      // Extract JSON from the LLM response
      try {
        // Try to find JSON array in the response
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('No JSON array found in response');
        }

        const generatedServiceLines = JSON.parse(jsonMatch[0]);
        
        if (!Array.isArray(generatedServiceLines) || generatedServiceLines.length === 0) {
          throw new Error('Invalid service lines format');
        }

        // Filter out any duplicates with existing service lines
        const uniqueServiceLines = generatedServiceLines.filter(line => 
          !profile.serviceLines.includes(line)
        );

        // Add the generated service lines to the profile
        setProfile(prev => ({
          ...prev,
          serviceLines: [...prev.serviceLines, ...uniqueServiceLines]
        }));

        // Add to agent memory
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Generated ${uniqueServiceLines.length} new service lines: ${uniqueServiceLines.join(', ')}`
        };

        setAgentMemory(prev => [...prev, newUserMessage, assistantMessage]);
        console.log('✅ Service lines generated successfully:', {
          total: uniqueServiceLines.length,
          serviceLines: uniqueServiceLines
        });

        setShowServiceLineModal(false);

      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        throw new Error('Failed to parse generated service lines');
      }

    } catch (error) {
      console.error('Error generating service lines:', error);
      alert('Failed to generate service lines. Please try again.');
    } finally {
      setIsGeneratingServiceLines(false);
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
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</h3>
        {isEditing && (
          <button
            onClick={() => addItem(field)}
            className="w-5 h-5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-full flex items-center justify-center transition-all hover:scale-110"
            title={`Add ${label.toLowerCase()}`}
          >
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
      {listStyle ? (
        <div className="space-y-2 mb-1">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-200 text-base flex-1">{item}</span>
              {isEditing && (
                <button
                  onClick={() => removeItem(field, index)}
                  className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-1">
          {items.map((item, index) => (
            <span 
              key={index} 
              className={`inline-flex items-center justify-center gap-1 px-4 py-2 rounded-full text-base font-medium text-center ${
                tier1Style 
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : tier2Style
                  ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-gray-700/50 text-gray-200 border border-gray-600/30'
              }`}
            >
              <span className="text-center leading-tight">{item}</span>
              {isEditing && (
                <button
                  onClick={() => removeItem(field, index)}
                  className="text-current hover:text-red-400 ml-1 opacity-70 hover:opacity-100 flex-shrink-0"
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
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
      style={{
        backgroundImage: "url('/contract.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Background overlay for transparency */}
      <div className="absolute inset-0 bg-slate-900/95"></div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600 rounded-full opacity-20 filter blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-slate-600 rounded-full opacity-20 filter blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-xl">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-8 py-6 shadow-2xl">
              
              {/* Header Section */}
              <div className="flex justify-between items-center mb-4">
                {/* Company name with logo */}
                <div className="flex items-center gap-4">
                  {/* Logo section with loading state */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    {profile.logoBase64 && profile.logoBase64.trim() && profile.logoBase64.startsWith('data:image/') && showLogo ? (
                      <Image
                        src={profile.logoBase64}
                        width={48}
                        height={48}
                        alt={`${profile.companyName} logo`}
                        className="w-12 h-12 object-contain"
                        onError={() => {
                          setShowLogo(false);
                        }}
                      />
                    ) : isLoadingLogo ? (
                      <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center animate-pulse">
                        <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      className="text-3xl font-bold bg-transparent text-white border-none outline-none placeholder-gray-400"
                      value={profile.companyName}
                      onChange={(e) => updateProfile('companyName', e.target.value)}
                      placeholder="Company Name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-white">{profile.companyName}</h1>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {/* Download/Export JSON Button */}
                  <button
                    onClick={exportJson}
                    className="p-2 rounded-lg transition-all text-gray-400 hover:text-gray-300 hover:bg-gray-400/10"
                    title="Export JSON"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  {/* Edit Icon Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-2 rounded-lg transition-all ${
                      isEditing 
                        ? 'text-green-400 hover:text-green-300 hover:bg-green-400/10' 
                        : 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
                    }`}
                    title={isEditing ? 'Save Changes' : 'Edit Profile'}
                  >
                    {isEditing ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-6">
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[120px] max-h-[200px] bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-gray-300 text-base focus:border-blue-500 focus:ring focus:ring-blue-500/20 resize-y"
                    placeholder="Company description..."
                    value={profile.description}
                    onChange={(e) => updateProfile('description', e.target.value)}
                    rows={6}
                  />
                ) : (
                  <p className="text-gray-300 text-base leading-relaxed text-justify">{profile.description}</p>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-4">
                  <ArrayField label="Service Lines" items={profile.serviceLines} field="serviceLines" listStyle={true} />
                  
                  <ArrayField label="E-mails" items={profile.emails} field="emails" listStyle={true} />
                  
                  {/* Point of Contact */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Ponto de Contato (POC)</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-base focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                        value={profile.pointOfContact}
                        onChange={(e) => updateProfile('pointOfContact', e.target.value)}
                        placeholder="Point of Contact"
                      />
                    ) : (
                      <p className="text-white font-medium text-base">{profile.pointOfContact}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
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
        onGenerate={generateServiceLines}
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
    </div>
  );
} 