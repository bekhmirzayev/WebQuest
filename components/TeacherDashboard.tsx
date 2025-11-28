import React, { useState, useEffect } from 'react';

// BU YERGA O'SHA SCRIPT URLINGIZNI QAYTADAN QOYING
const GOOGLE_SCRIPT_URL: string = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjpe3DLG5N8qpT8J89WyiF1WE9LIFlTk0mIW48KcpBonyZoNmlRvebqMLBlGUpyA2ll1TtdHxj-W2YKRhbk8XfWHT2WWtwpsKFihnDl1G_QkPIzlXHU5uyuTofyXcJD67VxCCwvOkHbofxbwLAk0BaZV0F2mUThq-MuoygWmuicDcdyhfVOI8dXhXAf2rpX9UXpuJtztcznwG3hqfZkkqrzc8ajRXYVesPo5qVyREztfF7o1qYVCe_QMbDEzvnhOOoeHXhn9El_7I518GM8ohHGEVPwXA&lib=MhwF0F2USy7jJGOzT1hkgAQDqya1mVk0K"; 

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
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Oddiy parol (siz buni o'zgartirishingiz mumkin)
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchSubmissions();
    } else {
      alert('Incorrect password');
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
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      // Reverse to show newest first
      setSubmissions(data.reverse());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Make sure you updated the Apps Script with the 'doGet' function and redeployed it.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-slideIn">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border border-slate-200">
          <h2 className="text-2xl font-bold text-[#667eea] mb-6 text-center">🔒 Teacher Access</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (admin123)"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:border-[#667eea] text-gray-900"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#667eea] text-white py-3 rounded-lg font-bold hover:bg-[#5a6fd6] transition-colors shadow-md"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
                      No submissions found yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(sub.Date).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-medium text-slate-800">{sub["Student Name"]}</td>
                      <td className="p-4 text-slate-600 text-sm max-w-[200px] truncate" title={sub["Project Title"]}>
                        {sub["Project Title"]}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded font-bold text-xs ${parseInt(sub.Points) >= 50 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {sub.Points}/60
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{sub.Badge}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <a href={sub["Project Link"]} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs bg-blue-50 px-2 py-1 rounded">Guide</a>
                          <a href={sub["Quiz Link"]} target="_blank" rel="noreferrer" className="text-purple-500 hover:underline text-xs bg-purple-50 px-2 py-1 rounded">Quiz</a>
                        </div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => alert(`Full Reflection:\n\n${sub.Reflection}\n\nAction Plan:\n\n${sub["Action Plan"]}`)}
                          className="text-xs font-bold text-slate-500 hover:text-[#667eea] border border-slate-200 px-2 py-1 rounded bg-white"
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
    </div>
  );
};

export default TeacherDashboard;