import React, { useState } from 'react';
import Home from './components/Home';
import WebQuest from './components/WebQuest';
import AITools from './components/AITools';
import TeacherDashboard from './components/TeacherDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'webquest' | 'ai-tools' | 'teacher'>('home');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const navigateToWebQuest = (sectionId?: string) => {
    setCurrentView('webquest');
    if (sectionId) {
      setActiveSection(sectionId);
    }
  };

  const navigateToAITools = () => {
    setCurrentView('ai-tools');
  };

  const navigateToTeacher = () => {
    setCurrentView('teacher');
  };

  const navigateToHome = () => {
    setCurrentView('home');
    setActiveSection(null);
  };

  // Shared background image URL
  const bgImageUrl = "https://media.istockphoto.com/id/1022892932/photo/hand-holding-light-bulb-against-nature-on-green-leaf-with-icons-energy-sources-for-renewable.jpg?s=612x612&w=0&k=20&c=Z8Zwgtv5o2-umMAnMn_5H-ZE62GMSUzf7zG-gHE_3UM=";

  // Background styles based on view
  // Home: Green tint
  const homeBackground = `linear-gradient(135deg, rgba(52, 199, 89, 0.4) 0%, rgba(40, 167, 69, 0.4) 100%), url('${bgImageUrl}')`;
  
  // WebQuest/Tools: Clearer background with very light overlay (Tiniqroq fon)
  const newThemeBackground = `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%), url('${bgImageUrl}')`;

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat transition-all duration-500 ease-in-out"
      style={{ 
        background: currentView === 'home' ? homeBackground : newThemeBackground,
        backgroundBlendMode: 'normal',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Decorative Floating Clouds */}
      <div className="fixed top-[10%] right-[5%] text-[4rem] opacity-30 animate-float pointer-events-none z-0">
        ☁️
      </div>
      <div className="fixed bottom-[15%] left-[8%] text-[3rem] opacity-25 animate-float-reverse pointer-events-none z-0">
        ☁️
      </div>

      <div className="w-full max-w-[1200px] mx-auto p-5 md:p-10 relative z-10">
        {currentView === 'home' && (
          <Home onNavigate={navigateToWebQuest} onNavigateAI={navigateToAITools} onNavigateTeacher={navigateToTeacher} />
        )}
        {currentView === 'webquest' && (
          <WebQuest 
            onBack={navigateToHome} 
            activeSection={activeSection} 
            clearActiveSection={() => setActiveSection(null)}
          />
        )}
        {currentView === 'ai-tools' && (
          <AITools onBack={navigateToHome} />
        )}
        {currentView === 'teacher' && (
          <TeacherDashboard onBack={navigateToHome} />
        )}
      </div>
    </div>
  );
};

export default App;