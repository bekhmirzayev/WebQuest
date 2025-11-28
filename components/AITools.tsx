import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface AIToolsProps {
  onBack: () => void;
}

// Mermaid global definition
declare global {
  interface Window {
    mermaid: any;
  }
}

const readingMaterials = [
  {
    id: 'intro',
    title: 'The Basics of Air Pollution',
    text: "Air pollution is a mix of particles and gases that can reach harmful concentrations both outside and indoors. Its effects can range from higher disease risks to rising temperatures. Soot, smoke, mold, pollen, methane, and carbon dioxide are a just few examples of common pollutants. Some air pollution comes from natural sources like volcanic eruptions and wildfires. But most air pollution results from human activities, such as burning fossil fuels like coal and oil."
  },
  {
    id: 'health',
    title: 'Impact on Human Health',
    text: "Air pollution is considered the world's largest environmental health threat. It causes 7 million premature deaths around the world each year. Air pollution is associated with increased risk of heart disease and stroke. It causes lung diseases like asthma and chronic obstructive pulmonary disease (COPD). It also increases the risk of lung cancer and acute respiratory infections. Children and the elderly are particularly vulnerable to these effects."
  },
  {
    id: 'solutions',
    title: 'Solutions & Prevention',
    text: "There are many ways to reduce air pollution. We can use less energy by turning off lights and using energy-efficient appliances. We can drive less by walking, biking, or taking public transportation. We can also choose cleaner energy sources like wind and solar power. Planting trees helps too, because trees filter pollutants from the air. Governments can also pass laws to limit how much pollution factories can release."
  }
];

const readingSkills = [
  { id: 'main_idea', label: 'Main Idea' },
  { id: 'inference', label: 'Inference' },
  { id: 'vocabulary', label: 'Vocabulary in Context' }
];

const AITools: React.FC<AIToolsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'essay' | 'reading' | 'synthesizer'>('essay');
  const [loading, setLoading] = useState(false);

  // Essay State
  const [essayText, setEssayText] = useState('');
  const [essayResult, setEssayResult] = useState<any>(null);

  // Reading State
  const [selectedMaterialId, setSelectedMaterialId] = useState(readingMaterials[0].id);
  const [selectedSkill, setSelectedSkill] = useState(readingSkills[0].id);
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [readingAnswer, setReadingAnswer] = useState('');
  const [readingFeedback, setReadingFeedback] = useState<any>(null);

  // Synthesizer State
  const [synText, setSynText] = useState('');
  const [synType, setSynType] = useState<'diagram' | 'chart' | 'slide' | 'definition'>('diagram');
  const [synResult, setSynResult] = useState<{ html?: string, mermaid?: string } | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (synResult?.mermaid && window.mermaid) {
      window.mermaid.initialize({ startOnLoad: true });
      window.mermaid.run({
        nodes: [mermaidRef.current]
      }).catch((e: any) => console.error("Mermaid error:", e));
    }
  }, [synResult]);

  const getAIClient = () => {
    // Safely access process.env.API_KEY
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    if (!apiKey) {
      alert("API Key is missing!");
      throw new Error("API Key missing");
    }
    return new GoogleGenAI({ apiKey });
  };

  const handleEssayAnalysis = async () => {
    if (!essayText.trim()) return;
    setLoading(true);
    try {
      const ai = getAIClient();
      const prompt = `Act as an encouraging but strict teacher. Analyze this student essay about environment/pollution:
      "${essayText}"
      
      Return a JSON object with these fields:
      - score (number 1-10)
      - strengths (array of strings)
      - areasForImprovement (array of strings, focusing on grammar, vocabulary, logic)
      - nextSteps (array of actionable tips)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      
      const result = JSON.parse(response.text || '{}');
      setEssayResult(result);
    } catch (error) {
      console.error(error);
      alert("Error analyzing essay. Please try again.");
    }
    setLoading(false);
  };

  const handleGenerateQuestion = async () => {
    setLoading(true);
    setGeneratedQuestion('');
    setReadingAnswer('');
    setReadingFeedback(null);
    try {
      const ai = getAIClient();
      const material = readingMaterials.find(m => m.id === selectedMaterialId);
      if (!material) return;

      const prompt = `Generate a single reading comprehension question based on the following text. 
      The question should specifically test the student's ability in: "${selectedSkill}".
      
      Text: "${material.text}"
      
      Return ONLY the question string. Do not include options or the answer.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setGeneratedQuestion(response.text || '');
    } catch (error) {
      console.error(error);
      alert("Error generating question.");
    }
    setLoading(false);
  };

  const handleReadingCheck = async () => {
    if (!readingAnswer.trim() || !generatedQuestion) return;
    setLoading(true);
    try {
      const ai = getAIClient();
      const material = readingMaterials.find(m => m.id === selectedMaterialId);
      
      const prompt = `Context Text: "${material?.text}"
      Question: "${generatedQuestion}"
      Student Answer: "${readingAnswer}"
      Skill being tested: "${selectedSkill}"
      
      Analyze the student's answer. 
      1. Is it correct based strictly on the text?
      2. Did they demonstrate the specific skill (Main Idea/Inference/Vocabulary)?
      3. Suggest a reading strategy suitable for this skill (e.g., for inference: "Read between the lines", for vocab: "Look at surrounding words").
      
      Return JSON:
      {
        "isCorrect": boolean,
        "feedback": "string explaining what was right/wrong",
        "strategy": "string suggestion for improvement"
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const result = JSON.parse(response.text || '{}');
      setReadingFeedback(result);
    } catch (error) {
      console.error(error);
      alert("Error checking answer.");
    }
    setLoading(false);
  };

  const handleSynthesize = async () => {
    if (!synText.trim()) return;
    setLoading(true);
    setSynResult(null);
    
    try {
      const ai = getAIClient();
      let prompt = "";
      let isMermaid = false;

      if (synType === 'diagram') {
        prompt = `Create a Mermaid.js diagram (flowchart or mindmap) based on these notes: "${synText}". Return ONLY the mermaid code string. Do not use markdown blocks. Start with 'graph TD' or 'mindmap'.`;
        isMermaid = true;
      } else if (synType === 'chart') {
        prompt = `Create a visual HTML representation (like a bar chart using simple div widths or a table) for these notes: "${synText}". Style it nicely with Tailwind CSS classes. Return only the raw HTML string inside a div.`;
      } else if (synType === 'slide') {
        prompt = `Create a presentation slide HTML card for these notes: "${synText}". Use a nice gradient background, bullet points, and a title. Return only the raw HTML string.`;
      } else if (synType === 'definition') {
        prompt = `Create a clean HTML dictionary definition list (<dl>) for the key terms in these notes: "${synText}". Style with Tailwind. Return only the raw HTML string.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let text = response.text || '';
      // Cleanup markdown if present
      text = text.replace(/```(html|mermaid)?/g, '').replace(/```/g, '').trim();

      if (isMermaid) {
        setSynResult({ mermaid: text });
      } else {
        setSynResult({ html: text });
      }

    } catch (error) {
      console.error(error);
      alert("Error synthesizing knowledge.");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!synResult) return;

    if (synResult.mermaid && mermaidRef.current) {
      const svg = mermaidRef.current.querySelector('svg');
      if (svg) {
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);
        
        // Ensure XML namespace for SVG if missing
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `webquest-diagram-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert("Diagram is rendering, please try again in a second.");
      }
    } else if (synResult.html) {
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebQuest AI Output</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-8">
  <div class="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
    ${synResult.html}
  </div>
</body>
</html>`;
      
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `webquest-visual-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="animate-slideIn">
      {/* Sticky Back Home Button */}
      <div className="sticky top-4 z-50 mb-5">
        <button 
          onClick={onBack}
          className="bg-white/95 backdrop-blur-sm text-[#4facfe] py-2 px-6 rounded-full font-bold border-2 border-[#4facfe] hover:bg-[#4facfe] hover:text-white transition-all shadow-md"
        >
          ⬅ Back Home
        </button>
      </div>

      <div className="glass-card rounded-[20px] shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row bg-white/80">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-200 p-4">
          <h2 className="text-xl font-bold text-slate-700 mb-6 px-2">🤖 AI Assistant</h2>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('essay')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeTab === 'essay' ? 'bg-[#4facfe] text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}
            >
              📝 Essay Doctor
            </button>
            <button 
              onClick={() => setActiveTab('reading')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeTab === 'reading' ? 'bg-[#4facfe] text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}
            >
              📖 Reading Coach
            </button>
            <button 
              onClick={() => setActiveTab('synthesizer')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeTab === 'synthesizer' ? 'bg-[#4facfe] text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}
            >
              🧠 Knowledge Synthesizer
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {/* ESSAY DOCTOR */}
          {activeTab === 'essay' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-[#4facfe] mb-4">Essay Doctor 📝</h2>
              <p className="mb-4 text-slate-600">Paste your essay draft below. The AI will grade it and suggest improvements.</p>
              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Write or paste your essay here..."
                className="w-full h-64 p-4 border-2 border-slate-200 rounded-xl focus:border-[#4facfe] focus:outline-none resize-none mb-4 bg-white/80 text-gray-900"
              />
              <button 
                onClick={handleEssayAnalysis}
                disabled={loading}
                className="bg-[#4facfe] text-white py-3 px-8 rounded-full font-bold hover:bg-[#00f2fe] transition-all disabled:opacity-50 shadow-md"
              >
                {loading ? 'Analyzing...' : 'Analyze My Essay'}
              </button>

              {essayResult && (
                <div className="mt-8 bg-white/90 rounded-xl p-6 border border-slate-200 animate-slideIn shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-700">Analysis Result</h3>
                    <span className={`text-2xl font-bold px-4 py-1 rounded-full ${essayResult.score >= 8 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      Score: {essayResult.score}/10
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h4 className="font-bold text-green-700 mb-2">✅ Strengths</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {essayResult.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h4 className="font-bold text-red-700 mb-2">🔧 Needs Improvement</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {essayResult.areasForImprovement?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-blue-700 mb-2">🚀 Next Steps</h4>
                    <ul className="list-decimal pl-5 space-y-2 text-slate-700">
                      {essayResult.nextSteps?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* READING COACH */}
          {activeTab === 'reading' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#4facfe] mb-4">Reading Coach 📖</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Left Column: Settings & Text */}
                <div className="flex flex-col gap-4">
                  <div className="bg-white/90 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-sm font-bold text-slate-600 mb-2">1. Choose a Text:</label>
                    <select 
                      value={selectedMaterialId}
                      onChange={(e) => {
                        setSelectedMaterialId(e.target.value);
                        setGeneratedQuestion('');
                        setReadingAnswer('');
                        setReadingFeedback(null);
                      }}
                      className="w-full p-2 border border-slate-300 rounded-md mb-4 text-gray-900"
                    >
                      {readingMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>

                    <label className="block text-sm font-bold text-slate-600 mb-2">2. Choose a Skill to Practice:</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {readingSkills.map(skill => (
                        <button
                          key={skill.id}
                          onClick={() => {
                            setSelectedSkill(skill.id);
                            setGeneratedQuestion('');
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-bold border transition-all ${selectedSkill === skill.id ? 'bg-[#4facfe] text-white border-[#4facfe]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                        >
                          {skill.label}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={handleGenerateQuestion}
                      disabled={loading}
                      className="w-full bg-[#4facfe] text-white py-2 rounded-lg font-bold hover:bg-[#00f2fe] transition-all disabled:opacity-50"
                    >
                      {loading && !generatedQuestion ? 'Generating...' : '✨ Generate Question'}
                    </button>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex-1">
                    <h3 className="font-bold text-slate-700 mb-2">Reading Text</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {readingMaterials.find(m => m.id === selectedMaterialId)?.text}
                    </p>
                  </div>
                </div>

                {/* Right Column: Q&A */}
                <div>
                  <h3 className="font-bold text-slate-700 mb-2">Question</h3>
                  
                  {generatedQuestion ? (
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 mb-4 border border-blue-100 animate-slideIn">
                      {generatedQuestion}
                    </div>
                  ) : (
                     <div className="bg-gray-100 p-4 rounded-xl text-gray-500 mb-4 border border-gray-200 text-center italic">
                       Click "Generate Question" to start!
                     </div>
                  )}

                  <textarea
                    value={readingAnswer}
                    onChange={(e) => setReadingAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={!generatedQuestion}
                    className="w-full h-32 p-3 border-2 border-slate-200 rounded-xl focus:border-[#4facfe] focus:outline-none resize-none mb-3 bg-white/80 disabled:bg-gray-100 text-gray-900"
                  />
                  <button 
                    onClick={handleReadingCheck}
                    disabled={loading || !generatedQuestion || !readingAnswer}
                    className="bg-[#4facfe] text-white py-2 px-6 rounded-full font-bold hover:bg-[#00f2fe] transition-all disabled:opacity-50 disabled:bg-gray-300"
                  >
                    {loading && generatedQuestion ? 'Checking...' : 'Check Answer'}
                  </button>

                  {readingFeedback && (
                    <div className={`mt-4 p-4 rounded-xl border ${readingFeedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} animate-slideIn shadow-md`}>
                      <h4 className={`font-bold ${readingFeedback.isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
                        {readingFeedback.isCorrect ? '🎉 Correct!' : '🤔 Needs Work'}
                      </h4>
                      <p className="text-slate-700 mt-2">{readingFeedback.feedback}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <span className="font-bold text-slate-600 text-sm block mb-1">Coach Tip ({selectedSkill}):</span>
                        <p className="text-[#4facfe] font-medium bg-white/50 p-2 rounded">{readingFeedback.strategy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* KNOWLEDGE SYNTHESIZER */}
          {activeTab === 'synthesizer' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-[#4facfe] mb-4">Knowledge Synthesizer 🧠</h2>
              <p className="text-slate-600 mb-4">Enter your notes, and I'll convert them into a visual format!</p>
              
              <textarea
                value={synText}
                onChange={(e) => setSynText(e.target.value)}
                placeholder="e.g., Causes of air pollution are factories, cars, and forest fires. Effects are breathing problems and global warming..."
                className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-[#4facfe] focus:outline-none resize-none mb-4 bg-white/80 text-gray-900"
              />

              <div className="flex flex-wrap gap-4 mb-6">
                {['diagram', 'chart', 'slide', 'definition'].map((type) => (
                  <label key={type} className={`cursor-pointer px-4 py-2 rounded-lg border-2 font-bold capitalize transition-all ${synType === type ? 'bg-blue-100 border-[#4facfe] text-[#4facfe]' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white/80'}`}>
                    <input 
                      type="radio" 
                      name="synType" 
                      value={type} 
                      checked={synType === type}
                      onChange={() => setSynType(type as any)}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>

              <button 
                onClick={handleSynthesize}
                disabled={loading}
                className="w-full bg-[#4facfe] text-white py-3 rounded-xl font-bold hover:bg-[#00f2fe] transition-all disabled:opacity-50 mb-8 shadow-md"
              >
                {loading ? 'Synthesizing...' : '✨ Generate Visual'}
              </button>

              {synResult && (
                <div className="animate-slideIn">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 min-h-[200px] flex items-center justify-center bg-white/90 overflow-hidden shadow-inner mb-4">
                    {synResult.mermaid ? (
                      <div className="mermaid w-full text-center" ref={mermaidRef}>
                        {synResult.mermaid}
                      </div>
                    ) : (
                      <div 
                        className="w-full"
                        dangerouslySetInnerHTML={{ __html: synResult.html || '' }} 
                      />
                    )}
                  </div>
                  <button 
                    onClick={handleDownload}
                    className="w-full bg-[#28a745] text-white py-3 rounded-xl font-bold hover:bg-[#218838] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>📥</span> Download {synResult.mermaid ? 'Diagram (SVG)' : 'Visual (HTML)'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITools;