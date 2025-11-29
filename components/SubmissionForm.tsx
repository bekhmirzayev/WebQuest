import React, { useState } from 'react';

/* 
  =========================================================================================
  🚨 INSTRUCTION FOR TEACHER (O'QITUVCHI UCHUN QO'LLANMA):
  
  To make the Google Sheets submission work with DETAILED SCORES, you must update your Google Apps Script.
  (Google Sheetsga barcha ballar detallari bilan tushishi uchun kodingizni yangilang):

  1. Open your Sheet: https://docs.google.com/spreadsheets/d/1_MWJyCVX4qL2dxhMyQsSbEenn1fvEWQpltmIXAFyK-Q/edit
  2. Go to: Extensions > Apps Script
  3. Delete any code there and paste this NEW code:

     function doPost(e) {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var params = e.parameter;
       
       // Create headers if new sheet
       if (sheet.getLastRow() === 0) {
         sheet.appendRow(["Timestamp", "Student Name", "Project Title", "Project Link", "Quiz Link", "Reflection", "Action Plan", "Points", "Badge", "Submission ID", "Rubric Breakdown"]);
       }
       
       sheet.appendRow([
         new Date(),
         params.studentName,
         params.projectTitle,
         params.projectLink,
         params.quizLink,
         params.reflection,
         params.actionPlan,
         params.points,
         params.badge,
         params.submissionId,
         params.rubricBreakdown // New column for detailed scores
       ]);
       
       return ContentService.createTextOutput("Success");
     }

     function doGet(e) {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var data = sheet.getDataRange().getValues();
       
       if (data.length <= 1) {
         return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
       }

       var headers = data[0];
       var jsonData = [];
       
       for (var i = 1; i < data.length; i++) {
         var row = {};
         for (var j = 0; j < headers.length; j++) {
           row[headers[j]] = data[i][j];
         }
         jsonData.push(row);
       }
       
       return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
     }

  4. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > New Version > Deploy.
  =========================================================================================
*/

// PASTE YOUR WEB APP URL HERE ↓
const GOOGLE_SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbxVemjS0GzrxnSDPszrd5kBz83s4Ww2J0hiOHAH8m1puEDjCpUlOfPzmsiiHY_dfDw/exec"; 

interface SubmissionData {
  studentName: string;
  projectTitle: string;
  projectLink: string;
  quizLink: string;
  reflection: string;
  actionPlan: string;
}

interface RubricScores {
  research: number;
  diagram: number;
  games: number;
  guide: number;
  quiz: number;
  collaboration: number;
}

const SubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState<SubmissionData>({
    studentName: '',
    projectTitle: '',
    projectLink: '',
    quizLink: '',
    reflection: '',
    actionPlan: ''
  });

  // State now holds numbers (0, 4, 6, 8, 10) instead of booleans
  const [rubricScores, setRubricScores] = useState<RubricScores>({
    research: 0,
    diagram: 0,
    games: 0,
    guide: 0,
    quiz: 0,
    collaboration: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [submittedResult, setSubmittedResult] = useState<{
    data: SubmissionData;
    badge: string;
    points: number;
    submissionId: string;
    breakdown: RubricScores;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRubricScores(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Grading Logic based on Rubric Self-Assessment
    // Summing up the selected scores
    let points = 
      rubricScores.research + 
      rubricScores.diagram + 
      rubricScores.games + 
      rubricScores.guide + 
      rubricScores.quiz + 
      rubricScores.collaboration;

    // Determine Badge
    let badge = "🌱 Junior Investigator";
    if (points === 60) {
      badge = "🏆 Ultimate Eco-Guardian";
    } else if (points >= 50) {
      badge = "🌟 Gold Star Researcher";
    } else if (points >= 40) {
      badge = "🌍 Dedicated Environmentalist";
    } else if (points >= 30) {
      badge = "🔎 Active Researcher";
    }

    const submissionId = "WQ-" + Math.floor(Math.random() * 10000);

    try {
      // Logic to send data to Google Sheets
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "INSERT_YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE") {
        const formBody = new FormData();
        formBody.append("studentName", formData.studentName);
        formBody.append("projectTitle", formData.projectTitle);
        formBody.append("projectLink", formData.projectLink);
        formBody.append("quizLink", formData.quizLink);
        formBody.append("reflection", formData.reflection);
        formBody.append("actionPlan", formData.actionPlan);
        formBody.append("points", points.toString());
        formBody.append("badge", badge);
        formBody.append("submissionId", submissionId);
        // Send the detailed breakdown as a JSON string
        formBody.append("rubricBreakdown", JSON.stringify(rubricScores));

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: formBody,
          mode: 'no-cors' // 'no-cors' is required for Google Apps Script Web Apps to work from browser
        });
      } else {
        console.warn("Google Script URL not configured. Data is not saved to the cloud.");
        // Simulate network delay for better UX if URL is missing
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setSubmittedResult({
        data: formData,
        badge: badge,
        points: points,
        submissionId: submissionId,
        breakdown: rubricScores
      });

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("There was an issue saving your data to the cloud, but your local certificate is ready.");
      // Still show the result certificate even if network fails
      setSubmittedResult({
        data: formData,
        badge: badge,
        points: points,
        submissionId: submissionId,
        breakdown: rubricScores
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 10) return 'text-green-600'; // Excellent
    if (score === 8) return 'text-lime-600';   // Good
    if (score === 6) return 'text-yellow-600'; // Satisfactory
    return 'text-red-500'; // Needs Improvement or 0
  };

  const getScoreLabel = (score: number) => {
    if (score === 10) return 'Excellent';
    if (score === 8) return 'Good';
    if (score === 6) return 'Satisfactory';
    if (score === 4) return 'Needs Improv.';
    return 'Not Graded';
  };

  if (submittedResult) {
    return (
      <div className="animate-slideIn">
        {submitError && (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4 border border-yellow-200">
             ⚠️ {submitError}
          </div>
        )}
        <div className="bg-[#d4edda] text-[#155724] p-6 rounded-xl border-2 border-[#c3e6cb] mt-5 mb-6 text-center">
          <h3 className="mt-0 text-2xl font-bold">🎉 Submission Successful!</h3>
          <p className="mt-2 text-lg">Great job, Air Quality Investigator! Here is your official scorecard.</p>
        </div>

        <div className="bg-white rounded-[20px] shadow-2xl overflow-hidden border-4 border-[#667eea] relative p-8 max-w-3xl mx-auto">
          {/* Certificate Style Header */}
          <div className="text-center border-b-2 border-[#e0e0e0] pb-6 mb-6">
            <span className="text-6xl mb-4 block">🎓</span>
            <h2 className="text-3xl font-bold text-[#667eea] uppercase tracking-wider mb-2">Certificate of Completion</h2>
            <p className="text-[#666]">WebQuest: Exploring Air Pollution</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-[#999] uppercase font-bold">Investigator</p>
              <p className="text-xl font-bold text-[#333] mb-4">{submittedResult.data.studentName}</p>
              
              <p className="text-sm text-[#999] uppercase font-bold">Project Title</p>
              <p className="text-lg text-[#333] mb-4 italic">"{submittedResult.data.projectTitle}"</p>

              <p className="text-sm text-[#999] uppercase font-bold">Submission ID</p>
              <p className="text-mono text-[#666] bg-[#f0f0f0] inline-block px-2 py-1 rounded">{submittedResult.submissionId}</p>
            </div>

            <div className="bg-[#f8f9fa] p-5 rounded-xl text-center border-2 border-dashed border-[#667eea]">
              <p className="text-sm text-[#667eea] font-bold uppercase mb-2">Rubric Score</p>
              <div className="mb-3">
                <span className="text-4xl block mb-1">🏅</span>
                <span className="font-bold text-[#333]">{submittedResult.badge}</span>
              </div>
              <div className="bg-[#667eea] text-white rounded-full py-2 px-6 inline-block font-bold text-xl">
                {submittedResult.points} / 60
              </div>
            </div>
          </div>

          {/* Detailed Score Breakdown Section */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
            <h4 className="text-[#667eea] font-bold border-b border-slate-200 pb-2 mb-3">📊 Detailed Score Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                { key: 'research', label: '🔍 Quality of Research' },
                { key: 'diagram', label: '📊 Digital Diagram' },
                { key: 'games', label: '🎮 Online Game/Activity' },
                { key: 'guide', label: '📖 Final Guide Design' },
                { key: 'quiz', label: '❓ Quiz Creation' },
                { key: 'collaboration', label: '🤝 Collaboration & Action' }
              ].map((item) => {
                const score = submittedResult.breakdown[item.key as keyof RubricScores];
                return (
                  <div key={item.key} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-slate-100">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {getScoreLabel(score)}: {score}/10 pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e0e0e0]">
            <h4 className="text-[#667eea] font-bold mb-2">Your Commitment to Change:</h4>
            <p className="italic text-[#555] bg-[#fff3cd] p-4 rounded-lg border-l-4 border-[#ffc107]">
              "{submittedResult.data.actionPlan}"
            </p>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setSubmittedResult(null);
                setFormData({
                  studentName: '',
                  projectTitle: '',
                  projectLink: '',
                  quizLink: '',
                  reflection: '',
                  actionPlan: ''
                });
                setRubricScores({
                    research: 0,
                    diagram: 0,
                    games: 0,
                    guide: 0,
                    quiz: 0,
                    collaboration: 0
                });
              }}
              className="bg-gray-500 text-white py-2 px-6 rounded-full font-bold hover:bg-gray-600 transition-all"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[15px] shadow-lg mt-5">
      <h3 className="text-[#667eea] text-xl font-bold mb-4 border-b pb-2">1. Student Information</h3>
      <FormGroup 
        label="Student Name(s) *" 
        id="studentName" 
        type="text" 
        value={formData.studentName}
        onChange={handleChange}
        placeholder="Enter your name or group names" 
        required 
      />
      <FormGroup 
        label="Project Title *" 
        id="projectTitle" 
        type="text" 
        value={formData.projectTitle}
        onChange={handleChange}
        placeholder="Title of your Air Quality Awareness Guide" 
        required 
      />
      
      <FormGroup 
        label="Link to Your Guide *" 
        id="projectLink" 
        type="url" 
        value={formData.projectLink}
        onChange={handleChange}
        placeholder="https://..." 
        required 
        helpText="Share your Google Slides, Canva, Genially, or other presentation link"
      />
      
      <FormGroup 
        label="Link to Your Quiz *" 
        id="quizLink" 
        type="url" 
        value={formData.quizLink}
        onChange={handleChange}
        placeholder="https://..." 
        required
        helpText="Share your Google Forms, Kahoot, or Blooket quiz link"
      />

      {/* RUBRIC SELF-ASSESSMENT */}
      <h3 className="text-[#667eea] text-xl font-bold mb-4 mt-8 border-b pb-2">2. Rubric Self-Assessment</h3>
      <p className="mb-4 text-sm text-[#666]">Please rate your own work honestly based on the rubric criteria above.</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ScoreSelect 
            name="research" 
            label="🔍 Quality of Research" 
            value={rubricScores.research} 
            onChange={handleScoreChange} 
        />
        <ScoreSelect 
            name="diagram" 
            label="📊 Digital Diagram" 
            value={rubricScores.diagram} 
            onChange={handleScoreChange} 
        />
        <ScoreSelect 
            name="games" 
            label="🎮 Online Game/Activity" 
            value={rubricScores.games} 
            onChange={handleScoreChange} 
        />
        <ScoreSelect 
            name="guide" 
            label="📖 Final Guide Design" 
            value={rubricScores.guide} 
            onChange={handleScoreChange} 
        />
        <ScoreSelect 
            name="quiz" 
            label="❓ Quiz Creation" 
            value={rubricScores.quiz} 
            onChange={handleScoreChange} 
        />
        <ScoreSelect 
            name="collaboration" 
            label="🤝 Collaboration & Action" 
            value={rubricScores.collaboration} 
            onChange={handleScoreChange} 
        />
      </div>
      
      <h3 className="text-[#667eea] text-xl font-bold mb-4 mt-8 border-b pb-2">3. Reflection & Action</h3>
      <div className="mb-5">
        <label htmlFor="reflection" className="block text-[#667eea] font-bold mb-2 text-lg">Reflection (What have I learned? What went well?) *</label>
        <textarea 
          id="reflection" 
          name="reflection" 
          value={formData.reflection}
          onChange={handleChange}
          required
          placeholder="Share your thoughts about this WebQuest..."
          className="w-full p-3 border-2 border-[#e0e0e0] rounded-lg text-base font-sans transition-colors focus:outline-none focus:border-[#667eea] min-h-[120px] bg-white text-gray-900 placeholder-gray-500 shadow-sm"
        ></textarea>
      </div>

      <div className="mb-5">
        <label htmlFor="actionPlan" className="block text-[#667eea] font-bold mb-2 text-lg">What will you do next to help the air we all share? 🌍 *</label>
        <textarea 
          id="actionPlan" 
          name="actionPlan" 
          value={formData.actionPlan}
          onChange={handleChange}
          required
          placeholder="Share your plans to make a difference..."
          className="w-full p-3 border-2 border-[#e0e0e0] rounded-lg text-base font-sans transition-colors focus:outline-none focus:border-[#667eea] min-h-[120px] bg-white text-gray-900 placeholder-gray-500 shadow-sm"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`bg-gradient-to-br from-[#28a745] to-[#20c997] text-white py-4 px-10 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-xl w-full md:w-auto flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            Sending...
          </>
        ) : (
          '✅ Submit My Work'
        )}
      </button>
      
      {/* Small teacher note */}
      <div className="text-center mt-3 text-sm text-gray-500">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
        Data will be sent to the teacher's gradebook.
      </div>
    </form>
  );
};

interface FormGroupProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  required?: boolean;
  helpText?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, id, type, placeholder, required, helpText, value, onChange }) => (
  <div className="mb-5">
    <label htmlFor={id} className="block text-[#667eea] font-bold mb-2 text-lg">{label}</label>
    <input 
      type="text" 
      id={id} 
      name={id} 
      required={required} 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border-2 border-[#e0e0e0] rounded-lg text-base font-sans transition-colors focus:outline-none focus:border-[#667eea] bg-white text-gray-900 placeholder-gray-500 shadow-sm"
    />
    {helpText && <small className="text-[#666] block mt-1.5">{helpText}</small>}
  </div>
);

const ScoreSelect: React.FC<{ name: string; label: string; value: number; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ name, label, value, onChange }) => (
    <div className="mb-2">
        <label className="block text-[#333] font-bold mb-1.5">{label}</label>
        <select 
            name={name} 
            value={value} 
            onChange={onChange}
            className="w-full p-3 border-2 border-[#e0e0e0] rounded-lg bg-white text-gray-900 focus:outline-none focus:border-[#667eea] cursor-pointer"
        >
            <option value="0">Select a score...</option>
            <option value="10">🌟 Excellent (10 pts)</option>
            <option value="8">✅ Good (8 pts)</option>
            <option value="6">🤔 Satisfactory (6 pts)</option>
            <option value="4">🔧 Needs Improvement (4 pts)</option>
        </select>
    </div>
);

export default SubmissionForm;