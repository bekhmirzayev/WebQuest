import React from 'react';

const RubricTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse my-5 bg-white shadow-sm rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-bold bg-[#667eea] text-white">Category</th>
            <th className="p-4 text-left text-sm font-bold bg-[#28a745] text-white">Excellent (10)</th>
            <th className="p-4 text-left text-sm font-bold bg-[#5cb85c] text-white">Good (8)</th>
            <th className="p-4 text-left text-sm font-bold bg-[#ffc107] text-[#333]">Satisfactory (6)</th>
            <th className="p-4 text-left text-sm font-bold bg-[#f093fb] text-[#333]">Needs Improvement (4)</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-900">
          {[
            {
              cat: "🔍 Quality of Research",
              exc: "Includes a clear, accurate definition of air pollution in own words. Identifies 3+ causes and 3+ effects correctly. All information is relevant.",
              good: "Definition is accurate but may be quoted directly. Identifies 2-3 causes and effects. Most information is correct.",
              sat: "Definition is vague or missing key parts. Identifies 1-2 causes/effects. Some inaccuracies.",
              needs: "Definition is missing or incorrect. Causes/effects are missing or wrong. Little research shown."
            },
            {
              cat: "📊 Digital Diagram",
              exc: "Created a custom digital chart/diagram (not a pasted image). Clearly labels natural vs human sources. Visually appealing and easy to understand.",
              good: "Created a digital chart. Labels are mostly correct. Good visual quality but simple design.",
              sat: "Chart is simple or lacks some labels. May be a template with little customization.",
              needs: "No chart created or just a random image from Google. Irrelevant data."
            },
            {
              cat: "🎮 Online Game/Activity",
              exc: "Completed at least 2 games/activities. Uploaded clear screenshots as proof. Can explain what was learned from the games.",
              good: "Completed 1-2 games. Screenshots are present but may be blurry or incomplete.",
              sat: "Says they did games but provided no screenshots or proof.",
              needs: "Did not attempt games or provide evidence."
            },
            {
              cat: "📖 Final Guide Design",
              exc: "The guide (slides/poster) is visually stunning. Uses colors, fonts, and images effectively to teach classmates. Well organized and creative.",
              good: "The guide is neat and organized. Uses some images. Good effort in design.",
              sat: "The guide is plain text or very basic. Hard to follow or messy layout.",
              needs: "The guide is incomplete, unorganized, or very difficult to read."
            },
            {
              cat: "❓ Quiz Creation",
              exc: "Created a working link to a quiz (Kahoot/Forms) with at least 5 relevant questions about air pollution. Questions are challenging and correct.",
              good: "Created a quiz with 3-4 questions. Link works. Questions are basic.",
              sat: "Created a quiz but link is broken or questions are too simple/irrelevant.",
              needs: "No quiz created."
            },
            {
              cat: "🤝 Collaboration & Action",
              exc: "Detailed reflection on learning. Clear, realistic action plan for the future. Evidence of helping others or sharing ideas.",
              good: "Good reflection. Simple action plan. Participated in the process.",
              sat: "Short reflection (1 sentence). Vague action plan. Limited participation.",
              needs: "No reflection or action plan. Worked alone without sharing."
            }
          ].map((row, i) => (
            <tr key={i} className="border-b border-[#e0e0e0] last:border-0 hover:bg-slate-50 transition-colors">
              <td className="p-3 align-top font-bold text-[#667eea] bg-[#f8f9fa]">{row.cat}</td>
              <td className="p-3 align-top">{row.exc}</td>
              <td className="p-3 align-top">{row.good}</td>
              <td className="p-3 align-top">{row.sat}</td>
              <td className="p-3 align-top">{row.needs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-5 text-center text-xl rounded-xl mt-5 font-bold shadow-md">
        Total Points Possible: 60
      </div>
    </div>
  );
};

export default RubricTable;