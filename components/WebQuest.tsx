import React, { useEffect, useRef } from 'react';
import SubmissionForm from './SubmissionForm';
import RubricTable from './RubricTable';

interface WebQuestProps {
  onBack: () => void;
  activeSection: string | null;
  clearActiveSection: () => void;
}

const WebQuest: React.FC<WebQuestProps> = ({ onBack, activeSection, clearActiveSection }) => {
  const introRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const rubricRef = useRef<HTMLDivElement>(null);
  const conclusionRef = useRef<HTMLDivElement>(null);
  const submissionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSection) {
      const refs: Record<string, React.RefObject<HTMLDivElement>> = {
        introduction: introRef,
        mission: missionRef,
        process: processRef,
        rubric: rubricRef,
        conclusion: conclusionRef,
        submission: submissionRef,
      };

      const ref = refs[activeSection];
      if (ref && ref.current) {
        setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          clearActiveSection();
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const Section: React.FC<{ 
    id: string; 
    title: string; 
    icon?: string; 
    bgImage?: string; 
    children: React.ReactNode; 
    innerRef: React.RefObject<HTMLDivElement>;
    extraClasses?: string;
  }> = ({ title, bgImage, children, innerRef, extraClasses = "" }) => (
    <div 
      ref={innerRef}
      id={title.toLowerCase().replace(/\s+/g, '-')}
      className={`glass-card p-8 md:p-10 rounded-[15px] mb-8 shadow-lg relative border-t-0 ${extraClasses}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] animate-shimmer rounded-t-[15px] bg-[length:200%_100%]"></div>
      <h2 className="text-[#667eea] text-3xl md:text-4xl border-b-[3px] border-[#667eea]/30 pb-3 mb-6 font-bold mt-0 drop-shadow-sm">
        {title}
      </h2>
      <div className="text-gray-700 font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-slideIn">
      {/* Sticky Back Button */}
      <div className="sticky top-4 z-50 mb-5">
        <button 
          onClick={onBack}
          className="inline-block bg-white/95 backdrop-blur-sm text-[#667eea] py-3 px-8 rounded-full text-base font-bold cursor-pointer border-2 border-[#667eea] shadow-lg hover:bg-[#667eea] hover:text-white hover:-translate-x-1 transition-all duration-300"
        >
          ⬅ Back to Home
        </button>
      </div>

      {/* INTRODUCTION */}
      <Section 
        id="introduction" 
        title="📖 Introduction" 
        innerRef={introRef}
      >
        <p className="text-lg leading-loose mb-4">
          Every day, we breathe in air, but how clean is it? Around the world, air pollution harms people, animals, and the environment. Some sources are natural, but many come from human activities.
        </p>
        <p className="text-lg leading-loose">
          In this WebQuest, you will explore what air pollution is, where it comes from, how it affects us, and what we can do to help. Through online games, videos, and digital tasks, you will become an <strong>Air Quality Investigator</strong> working to protect your community! 🔍
        </p>
      </Section>

      {/* MISSION */}
      <Section 
        id="mission" 
        title="🎯 Your Mission" 
        innerRef={missionRef}
      >
        <div className="bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white p-6 rounded-xl my-5 text-lg leading-relaxed shadow-[0_8px_20px_rgba(245,87,108,0.3)] relative overflow-hidden">
          <div className="relative z-10">
            <strong>By the end of this WebQuest</strong>, you will create a digital <strong>Air Quality Awareness Guide</strong> for your classmates!
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] text-[5em] opacity-20 pointer-events-none">🎯</div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl mt-5 border border-slate-200">
          <h3 className="text-[#667eea] text-xl font-bold mt-0 mb-3">Your guide will include:</h3>
          <ul className="list-none pl-6 space-y-2 text-gray-700">
            {[
              '✅ A definition of air pollution in your own words',
              '✅ Major causes of air pollution',
              '✅ Health and environmental effects',
              '✅ Solutions and actions pupils can take',
              '✅ A digital poster or slideshow',
              '✅ A short online quiz you create for your classmates'
            ].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      {/* PROCESS */}
      <Section 
        id="process" 
        title="📋 Process: Follow These Steps" 
        innerRef={processRef}
      >
        {[
          {
            step: 1,
            title: "Explore What Air Pollution Is",
            content: (
              <>
                <p className="mb-2 text-gray-700"><strong>Watch these videos:</strong></p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <ResourceLink href="https://www.youtube.com/watch?v=Yjtgu2CxtEk">🎥 Air Pollution for Kids (Causes & Effects)</ResourceLink>
                  <ResourceLink href="https://www.youtube.com/watch?v=KKyRRSFKkCc">🎥 What is Air Pollution (Science for Kids)</ResourceLink>
                </div>
                <p className="mb-2 text-sm italic text-gray-500">Tip: Check out the <strong>Reading Coach</strong> in the AI Assistant menu to practice reading more about this topic!</p>
                <TaskBox><strong>Task:</strong> Write your definition of air pollution in the Padlet below.</TaskBox>
                
                {/* Embedded Padlet */}
                <div className="mt-4 padlet-embed" style={{border:'1px solid rgba(0,0,0,0.1)', borderRadius:'2px', boxSizing:'border-box', overflow:'hidden', position:'relative', width:'100%', background:'#F4F4F4'}}>
                  <p style={{padding:0, margin:0}}>
                    <iframe src="https://padlet.com/embed/ba9z5sjvw375ljsj" frameBorder="0" allow="camera;microphone;geolocation;display-capture;clipboard-write" style={{width:'100%', height:'608px', display:'block', padding:0, margin:0}}></iframe>
                  </p>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'end', margin:0, height:'28px'}}>
                    <a href="https://padlet.com?ref=embed" style={{display:'block', flexGrow:0, margin:0, border:'none', padding:0, textDecoration:'none'}} target="_blank" rel="noreferrer">
                      <div style={{display:'flex', alignItems:'center'}}>
                        <img src="https://padlet.net/embeds/made_with_padlet_2022.png" width="114" height="28" style={{padding:0, margin:0, background:'transparent', border:'none', boxShadow:'none'}} alt="Made with Padlet" />
                      </div>
                    </a>
                  </div>
                </div>
              </>
            )
          },
          {
            step: 2,
            title: "Identify Causes of Air Pollution",
            content: (
              <>
                <p className="mb-2 text-gray-700"><strong>Interactive games and resources:</strong></p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <ResourceLink href="https://climatekids.nasa.gov/pollution/">🚀 NASA Climate Kids – Pollutants Sorting Game</ResourceLink>
                  <ResourceLink href="https://ecokids.ca">🌱 EcoKids – Air Pollution Activities</ResourceLink>
                </div>
                <TaskBox><strong>Task:</strong> Make a pie chart showing natural and human-made sources of air pollution.</TaskBox>
              </>
            )
          },
          {
            step: 3,
            title: "Learn the Effects of Air Pollution",
            content: (
              <>
                <p className="mb-2 text-gray-700"><strong>Explore these tools:</strong></p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <ResourceLink href="https://www.iqair.com/uzbekistan">🌡️ IQAir – Check Your City's Air Quality!</ResourceLink>
                  <ResourceLink href="https://www.ducksters.com/science/environment/air_pollution.php">🦆 Ducksters – Air Pollution Facts</ResourceLink>
                </div>
                <TaskBox><strong>Task:</strong> Use <a href="https://wordwall.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#667eea]">Wordwall</a> or <a href="https://quizlet.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#667eea]">Quizlet</a> to create a matching game connecting pollutants to effects on humans and nature.</TaskBox>
              </>
            )
          },
          {
            step: 4,
            title: "Solutions and How You Can Help",
            content: (
              <>
                <p className="mb-2 text-gray-700"><strong>Research using these sources:</strong></p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <ResourceLink href="https://www.epa.gov/students">🌪️ EPA for Kids – Clean Air</ResourceLink>
                  <ResourceLink href="https://www.unep.org/youth">🌐 UN Environment for Youth</ResourceLink>
                </div>
                <TaskBox><strong>Task:</strong> Use Canva, Google Slides, or Genially to design a digital poster with at least 5 actions kids can take to reduce air pollution.</TaskBox>
              </>
            )
          }
        ].map((item) => (
          <div key={item.step} className="bg-white p-6 rounded-xl my-6 border-l-[5px] border-[#667eea] shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group border border-slate-100">
            <h3 className="text-[#667eea] text-xl font-bold mt-0 mb-3">Step {item.step}: {item.title}</h3>
            <div className="absolute right-5 top-5 text-[2em] opacity-15 pointer-events-none group-hover:scale-110 transition-transform">🌿</div>
            {item.content}
          </div>
        ))}

        {/* Step 5 - Final Project */}
        <div className="bg-gradient-to-br from-[#fa709a] to-[#fee140] text-white p-8 rounded-[15px] my-6 shadow-lg relative overflow-hidden">
          <div className="absolute right-5 top-5 text-[3em] opacity-30 animate-flutter">🦋</div>
          <h3 className="text-2xl font-bold mt-0 mb-4 text-white drop-shadow-md">🏆 Step 5: Create Your Air Quality Awareness Guide</h3>
          <p className="text-lg leading-relaxed mb-4">This is your final project! Your guide must include:</p>
          <ul className="list-disc pl-6 leading-loose">
            <li>📝 Definitions</li>
            <li>🏭 Causes</li>
            <li>😷 Effects</li>
            <li>💡 Solutions</li>
            <li>🖼️ Related images</li>
            <li>❓ A quick online quiz using Google Forms, Kahoot, or Blooket</li>
          </ul>
        </div>

        {/* Step 6 - Bonus */}
        <div className="bg-white p-6 rounded-xl my-6 border-l-[5px] border-[#667eea] shadow-md relative group border border-slate-100">
          <h3 className="text-[#667eea] text-xl font-bold mt-0 mb-3">
            Step 6: Play Air Pollution Games 
            <span className="inline-block bg-[#28a745] text-white py-1 px-3 rounded-full text-sm font-bold ml-2 align-middle border border-white">BONUS</span>
          </h3>
          <p className="mb-4 text-gray-700"><strong>Complete at least two of these interactive games:</strong></p>
          
          <div className="space-y-4">
            <GameCard title="🎮 Air Pollution Simulator" link="https://www.purposegames.com/game/air-pollution-simulator" />
            <GameCard title="🏙️ Smog City 2 (Create Your Own Pollution Scenario!)" link="https://www.smogcity2.org" />
            <GameCard title="🔬 Air Quality Virtual Lab" link="https://aqicu.com/virtual-lab" />
          </div>
          
          <div className="mt-4">
            <TaskBox><strong>Task:</strong> Take screenshots of your results and post them to a Padlet.</TaskBox>
          </div>
        </div>
      </Section>

      {/* GRADIENT DIVIDER */}
      <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white p-8 rounded-[15px] mb-8 shadow-lg relative border-[3px] border-transparent">
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] animate-shimmer rounded-t-[15px] bg-[length:200%_100%]"></div>
        <h2 className="text-white text-2xl md:text-3xl border-b-[3px] border-white/40 pb-2 mb-5 font-bold mt-0 drop-shadow-md">
          🎓 Ready to Become an Air Quality Investigator?
        </h2>
        <p className="text-lg leading-loose">
          Follow each step carefully, complete all tasks, and create an amazing Air Quality Awareness Guide that will help educate your classmates about this important environmental issue. Good luck, investigators! 🌟
        </p>
      </div>

      {/* RUBRIC */}
      <Section 
        id="rubric" 
        title="📊 Rubric: How You'll Be Graded" 
        innerRef={rubricRef}
      >
        <RubricTable />
      </Section>

      {/* CONCLUSION */}
      <div 
        ref={conclusionRef}
        id="conclusion"
        className="glass-card p-8 md:p-10 rounded-[15px] mb-8 shadow-lg relative border-t-0"
        style={{
          background: "linear-gradient(135deg, rgba(230, 255, 254, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] animate-shimmer rounded-t-[15px] bg-[length:200%_100%]"></div>
        <h2 className="text-[#667eea] text-2xl md:text-3xl border-b-[3px] border-[#667eea]/30 pb-2 mb-5 font-bold mt-0">
          🌟 Conclusion: Reflect on Your Journey
        </h2>
        
        <div className="bg-white/80 p-8 rounded-[15px] shadow-sm border border-white">
          <p className="text-lg leading-loose mb-5 text-gray-700"><strong>Congratulations!</strong> 🎉 You are now an <strong>Air Quality Investigator</strong>!</p>
          <p className="text-lg leading-loose mb-5 text-gray-700">
            You have learned where air pollution comes from, how it affects our planet, and how you can help improve air quality in your community. Remember: <strong>every choice makes a difference</strong>.
          </p>
          
          <div className="bg-white p-6 rounded-xl border-l-[5px] border-[#667eea] shadow-sm">
            <h3 className="text-[#667eea] text-xl font-bold mb-4 mt-0">💭 Time to Reflect:</h3>
            <ul className="list-none pl-0 space-y-3 text-gray-700">
              <li className="text-lg">✨ What have I learned?</li>
              <li className="text-lg">✨ What went well?</li>
              <li className="text-lg">✨ Where did I struggle?</li>
            </ul>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xl font-bold text-[#667eea]">What will YOU do next to help the air we all share? 🌍💚</p>
          </div>
        </div>
      </div>

      {/* SUBMISSION */}
      <Section 
        id="submission" 
        title="📤 Submit Your Air Quality Awareness Guide" 
        innerRef={submissionRef}
      >
        <p className="text-gray-700 text-lg text-center mb-8">
          Congratulations on completing your investigation! Submit your work here.
        </p>
        <SubmissionForm />
      </Section>
    </div>
  );
};

// Helper components for local styling
const ResourceLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="inline-block bg-[#667eea] text-white py-2 px-5 rounded-full no-underline text-sm font-medium transition-all duration-300 hover:bg-[#764ba2] hover:-translate-y-0.5 hover:shadow-lg border border-transparent shadow-sm"
  >
    {children}
  </a>
);

const TaskBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-[#fff3cd] border-2 border-[#ffc107] p-4 rounded-lg shadow-sm">
    <span className="text-[#856404] font-bold">{children}</span>
  </div>
);

const GameCard: React.FC<{ title: string; link: string }> = ({ title, link }) => (
  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm hover:scale-[1.02] hover:shadow-md hover:border-[#667eea] transition-all duration-300 relative group">
    <h4 className="text-[#667eea] mt-0 text-lg font-bold mb-2">{title}</h4>
    <div className="absolute right-4 top-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">🎮</div>
    <ResourceLink href={link}>Play Now</ResourceLink>
  </div>
);

export default WebQuest;