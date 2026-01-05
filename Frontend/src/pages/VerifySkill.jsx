import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { addSkill, getSkills } from "../services/skillService";

export default function VerifySkill() {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);
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
        setSkills(res.data);
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
    // NEXT STEP: quiz generation API
    navigate(`/quiz/${skillName}`);
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
            {skills.map((s, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white p-4 rounded shadow-sm"
              >
                <span className="font-medium">
                  {s}
                </span>

                <button
                  onClick={() => startVerification(s)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                >
                  Verify
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">
          No skills added yet.
        </p>
      )}
    </div>
  );
}
