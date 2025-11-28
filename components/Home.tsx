import React from 'react';

interface HomeProps {
  onNavigate: (sectionId?: string) => void;
  onNavigateAI: () => void;
  onNavigateTeacher: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onNavigateAI, onNavigateTeacher }) => {
  return (
    <div className="animate-slideIn pb-10">
      <header className="bg-white p-10 rounded-[20px] shadow-2xl mb-10 text-center relative overflow-hidden group">
        {/* Animated background effect for header */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(102,126,234,0.1)_0%,transparent_70%)] animate-rotate pointer-events-none z-0"></div>
        
        {/* Visible Teacher Button Top Right */}
        <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={onNavigateTeacher}
              className="flex items-center gap-2 bg-slate-100 hover:bg-[#667eea] hover:text-white text-slate-600 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm border border-slate-200"
              title="Teacher Dashboard"
            >
              🔒 Teacher Only
            </button>
        </div>

        <div className="relative z-10">
          <h1 className="text-[#667eea] m-0 mb-2 text-3xl md:text-5xl font-bold">
            🌍 WebQuest: Exploring Air Pollution
          </h1>
          <p className="text-[#666] text-lg md:text-xl mt-2">
            EDIN 5461 Curriculum Creativity and Design
          </p>
          <p className="text-[#999] text-base mt-4">
            By Muslimaxon Abduxoliqova and Zulfizar Mansurova
          </p>
        </div>
      </header>

      <div className="bg-white p-8 rounded-[15px] mb-8 shadow-lg relative border-[3px] border-transparent bg-clip-padding">
        {/* Shimmer effect top border */}
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] animate-shimmer rounded-t-[15px]"></div>
        
        <h2 className="text-[#667eea] mt-0 text-2xl md:text-3xl border-b-[3px] border-[#667eea] pb-2 mb-5 font-bold">
          🎉 Welcome, Air Quality Investigators!
        </h2>
        <p className="text-[#333] text-lg text-center my-5 leading-relaxed">
          Get ready to explore the world of air pollution! Click on any section below to begin your journey or use our new AI tools to help your studies.
        </p>
        <div className="text-center">
          <button 
            onClick={() => onNavigate()}
            className="inline-block bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-4 px-10 rounded-full text-xl font-bold cursor-pointer border-none shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
          >
            🚀 Start Your Quest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {[
          { id: 'introduction', icon: '📖', title: 'Introduction', desc: 'Learn what air pollution is and why it matters to all of us' },
          { id: 'mission', icon: '🎯', title: 'Your Mission', desc: 'Discover your goal: Create an Air Quality Awareness Guide' },
          { id: 'process', icon: '📋', title: 'Process Steps', desc: 'Follow 6 exciting steps to complete your investigation' },
          { id: 'rubric', icon: '📊', title: 'Rubric', desc: 'See how your work will be graded' },
          { id: 'conclusion', icon: '🌟', title: 'Conclusion', desc: 'Reflect on what you\'ve learned and make a difference' },
          { id: 'submission', icon: '📤', title: 'Submit Your Work', desc: 'Ready to share your Air Quality Awareness Guide?' },
        ].map((item) => (
          <div 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="bg-white p-8 rounded-[15px] shadow-lg cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:shadow-2xl group"
          >
            {/* Hover top border effect */}
            <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all duration-300 group-hover:h-full group-hover:opacity-10"></div>
            
            <span className="text-[3em] mb-4 block">{item.icon}</span>
            <h3 className="text-[#667eea] m-0 text-2xl font-bold">{item.title}</h3>
            <p className="text-[#666] leading-relaxed my-2">{item.desc}</p>
          </div>
        ))}

        {/* AI Tools Card */}
        <div 
          onClick={onNavigateAI}
          className="bg-white p-8 rounded-[15px] shadow-lg cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:shadow-2xl group md:col-span-2 lg:col-span-3 border-2 border-blue-200"
        >
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#4facfe] to-[#00f2fe] transition-all duration-300 group-hover:h-full group-hover:opacity-10"></div>
          <div className="flex items-center gap-6">
            <span className="text-[4em]">🤖</span>
            <div>
              <h3 className="text-[#4facfe] m-0 text-3xl font-bold">AI Smart Assistant</h3>
              <p className="text-[#666] leading-relaxed my-2 text-lg">
                Use AI to grade your essays, practice reading comprehension, and turn your notes into diagrams and charts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;