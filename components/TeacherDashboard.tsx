import React, { useState, useEffect } from 'react';

// BU YERGA O'SHA SCRIPT URLINGIZNI QAYTADAN QOYING (script.google.com/.../exec bo'lishi kerak)
const GOOGLE_SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbxVemjS0GzrxnSDPszrd5kBz83s4Ww2J0hiOHAH8m1puEDjCpUlOfPzmsiiHY_dfDw/exec"; 

interface TeacherDashboardProps {
  onBack: () => void;
}

interface StudentSubmission {
  "Date": string;
  "Student Name": string;
  "Project Title": string;
  "Project Link": string;
  "Quiz Link": string;
  "Reflection": string;
  "Action Plan": string;
  "Points": string;
  "Badge": string;
  "Submission ID": string;
  "Rubric Breakdown"?: string; // JSON String from Google Sheets
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Access denied.');
    }
  };

  const fetchSubmissions = async () => {
    if (GOOGLE_SCRIPT_URL === "INSERT_YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE") {
        setError("Google Script URL is not configured in the code yet.");
        return;
    }

    setLoading(true);
    setError(null);
    try {
      // Append a timestamp to avoid browser caching
      const separator = GOOGLE_SCRIPT_URL.includes('?') ? '&' : '?';
      const fetchUrl = `${GOOGLE_SCRIPT_URL}${separator}t=${new Date().getTime()}`;
      
      const response = await fetch(fetchUrl);
      const data = await response.json();
      
      // Check if data is array
      if (Array.isArray(data)) {
         // Reverse to show newest first
         setSubmissions(data.reverse());
      } else {
         console.warn("Received non-array data:", data);
         setSubmissions([]); // Fallback
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please check your Google Script URL (it should end in /exec) and ensure 'doGet' is deployed correctly.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for score colors (same as SubmissionForm)
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

  if (!isAuthenticated) {
    return (
      <div className="animate-slideIn max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-[20px] shadow-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-[#667eea] mb-6 text-center">🔒 Teacher Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-slate-600 font-bold mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#667eea]"
                placeholder="Enter password..."
                autoFocus
              />
            </div>
            {authError && <p className="text-red-500 text-sm mb-4 font-bold">{authError}</p>}
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onBack}
                className="flex-1 py-3 px-4 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-[#667eea] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#5a6fd6] transition-colors shadow-md"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Parse rubric breakdown for the selected submission
  let parsedBreakdown: any = null;
  if (selectedSubmission && selectedSubmission["Rubric Breakdown"]) {
    try {
      parsedBreakdown = JSON.parse(selectedSubmission["Rubric Breakdown"]);
    } catch (e) {
      console.warn("Could not parse rubric breakdown", e);
    }
  }

  return (
    <div className="animate-slideIn">
      <div className="sticky top-4 z-50 mb-5 flex justify-between items-center bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-200">
        <button 
          onClick={onBack}
          className="text-[#667eea] font-bold hover:underline"
        >
          ⬅ Back to Home
        </button>
        <h2 className="text-xl font-bold text-slate-800">📊 Teacher Dashboard</h2>
        <button 
          onClick={fetchSubmissions}
          className="bg-[#667eea] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#5a6fd6] transition-colors"
        >
          🔄 Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#667eea] border-t-transparent"></div>
          <p className="mt-4 text-slate-500">Loading submissions...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-600 text-sm">Date</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Student</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Project</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Score</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Badge</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Links</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No submissions found yet. (If you submitted but don't see it here, check your Google Script URL).
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                        {sub.Date ? new Date(sub.Date).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-4 font-medium text-slate-800">{sub["Student Name"]}</td>
                      <td className="p-4 text-slate-600 text-sm max-w-[200px] truncate" title={sub["Project Title"]}>
                        {sub["Project Title"]}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded font-bold text-xs ${parseInt(sub.Points || '0') >= 50 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {sub.Points}/60
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{sub.Badge}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {sub["Project Link"] && (
                              <a href={sub["Project Link"]} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs bg-blue-50 px-2 py-1 rounded">Guide</a>
                          )}
                          {sub["Quiz Link"] && (
                              <a href={sub["Quiz Link"]} target="_blank" rel="noreferrer" className="text-purple-500 hover:underline text-xs bg-purple-50 px-2 py-1 rounded">Quiz</a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-xs font-bold text-slate-500 hover:text-[#667eea] border border-slate-200 px-3 py-1.5 rounded bg-white shadow-sm transition-all hover:bg-slate-50"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED MODAL */}
      {selectedSubmission && (
        <div 
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedSubmission(null)}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slideIn relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-[#667eea] mb-1">{selectedSubmission["Student Name"]}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                           📅 Submitted: {selectedSubmission.Date ? new Date(selectedSubmission.Date).toLocaleString() : 'N/A'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setSelectedSubmission(null)}
                        className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xl transition-colors"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    
                    {/* Stats Card */}
                    <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-center md:text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Total Score</p>
                            <div className="text-4xl font-bold text-[#667eea]">
                                {selectedSubmission.Points}<span className="text-lg text-slate-400">/60</span>
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                        <div className="text-center md:text-left flex-1">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Badge Earned</p>
                             <div className="text-lg font-medium text-slate-700 flex items-center justify-center md:justify-start gap-2">
                                <span>{selectedSubmission.Badge.split(' ')[0]}</span>
                                <span>{selectedSubmission.Badge.split(' ').slice(1).join(' ')}</span>
                             </div>
                        </div>
                        <div className="text-right">
                             <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded">ID: {selectedSubmission["Submission ID"]}</span>
                        </div>
                    </div>

                    {/* DETAILED SCORE BREAKDOWN (New Section) */}
                    {parsedBreakdown && (
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
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
                                    const score = parsedBreakdown[item.key] || 0;
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
                    )}

                    {/* Project Links */}
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                            📂 Project Submission
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                             <p className="mb-4"><span className="font-bold text-slate-500">Project Title:</span> <span className="text-slate-800 text-lg ml-2">{selectedSubmission["Project Title"]}</span></p>
                             <div className="flex flex-wrap gap-3">
                                {selectedSubmission["Project Link"] ? (
                                    <a 
                                        href={selectedSubmission["Project Link"]} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="flex items-center gap-2 bg-[#667eea] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#5a6fd6] transition-all shadow-sm hover:-translate-y-0.5"
                                    >
                                        📄 View Digital Guide
                                    </a>
                                ) : (
                                    <span className="text-slate-400 italic px-3 py-2">No guide link provided</span>
                                )}

                                {selectedSubmission["Quiz Link"] ? (
                                    <a 
                                        href={selectedSubmission["Quiz Link"]} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="flex items-center gap-2 bg-purple-500 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-purple-600 transition-all shadow-sm hover:-translate-y-0.5"
                                    >
                                        ❓ View Quiz
                                    </a>
                                ) : (
                                    <span className="text-slate-400 italic px-3 py-2">No quiz link provided</span>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* Reflection Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg mb-3">💭 Student Reflection</h4>
                            <div className="bg-blue-50/50 p-5 rounded-xl text-slate-700 leading-relaxed border-l-4 border-[#667eea] h-full text-sm md:text-base italic">
                                "{selectedSubmission.Reflection}"
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg mb-3">🌍 Action Plan</h4>
                            <div className="bg-green-50/50 p-5 rounded-xl text-slate-700 leading-relaxed border-l-4 border-green-500 h-full text-sm md:text-base italic">
                                "{selectedSubmission["Action Plan"]}"
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
                    <button 
                        onClick={() => setSelectedSubmission(null)} 
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;