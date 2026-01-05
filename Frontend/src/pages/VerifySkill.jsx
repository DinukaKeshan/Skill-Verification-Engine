// pages/VerifySkill.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { addSkill, getSkills } from "../services/skillService";

export default function VerifySkill() {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Guard route
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // 📥 Load skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getSkills();
        setSkills(res.data.skills || []);
        setVerifiedSkills(res.data.verifiedSkills || []);
      } catch (err) {
        console.error("Failed to load skills");
      }
    };

    fetchSkills();
  }, []);

  // ➕ Add skill (save to MongoDB)
  const handleAddSkill = async () => {
    if (!skill.trim()) return;

    setLoading(true);
    try {
      const res = await addSkill(skill.trim());
      setSkills(res.data.skills);
      setSkill("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const startVerification = (skillName) => {
    navigate(`/quiz/${skillName}`);
  };

  // Check if skill is verified
  const getVerificationStatus = (skillName) => {
    return verifiedSkills.find(
      vs => vs.skill.toLowerCase() === skillName.toLowerCase()
    );
  };

  // Get badge color
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Platinum": return "bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900";
      case "Gold": return "bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900";
      case "Silver": return "bg-gradient-to-r from-gray-300 to-gray-100 text-gray-800";
      case "Bronze": return "bg-gradient-to-r from-orange-400 to-orange-200 text-orange-900";
      default: return "bg-gray-200 text-gray-700";
    }
  };

  // Get badge emoji
  const getBadgeEmoji = (badge) => {
    switch (badge) {
      case "Platinum": return "💎";
      case "Gold": return "🥇";
      case "Silver": return "🥈";
      case "Bronze": return "🥉";
      default: return "🏅";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">
        Skill Verification
      </h1>

      <p className="text-gray-600 mb-8">
        Add the skills you want to verify and start the assessment.
      </p>

      {/* ADD SKILL */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter skill (e.g. Java, React)"
          className="flex-1 border rounded px-4 py-2"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
        />

        <button
          onClick={handleAddSkill}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Skill"}
        </button>
      </div>

      {/* SKILLS LIST */}
      {skills.length > 0 ? (
        <div className="bg-gray-100 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">
            Your Skills
          </h2>

          <ul className="space-y-3">
            {skills.map((s, i) => {
              const verification = getVerificationStatus(s);
              const isVerified = !!verification;

              return (
                <li
                  key={i}
                  className="flex justify-between items-center bg-white p-4 rounded shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-lg">
                      {s}
                    </span>
                    
                    {/* ✅ VERIFICATION BADGE */}
                    {isVerified && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold shadow-md ${getBadgeColor(verification.badge)}`}>
                        <span>{getBadgeEmoji(verification.badge)}</span>
                        <span>{verification.badge}</span>
                        <span className="text-xs opacity-75">
                          {verification.percentage}%
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => startVerification(s)}
                    className={`px-4 py-1 rounded font-medium transition ${
                      isVerified
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isVerified ? "Re-verify" : "Verify"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">
          No skills added yet.
        </p>
      )}

      {/* VERIFIED SKILLS SECTION */}
      {verifiedSkills.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            🎓 Verified Skills ({verifiedSkills.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedSkills.map((vs, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 shadow-md border-2 border-green-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800">
                    {vs.skill}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getBadgeColor(vs.badge)}`}>
                    {getBadgeEmoji(vs.badge)} {vs.badge}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Score: <strong>{vs.score}/{vs.total}</strong> ({vs.percentage}%)</p>
                  <p className="text-xs">
                    Verified: {new Date(vs.verifiedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}