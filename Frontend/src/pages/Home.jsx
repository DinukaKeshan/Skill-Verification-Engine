import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function Home() {
  const loggedIn = isAuthenticated();

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Professional Skill Verification Platform
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Validate your technical skills with AI-powered assessments and earn
            industry-recognized badges.
          </p>

          {loggedIn ? (
            <Link
              to="/verify-skill"
              className="inline-block bg-green-500 hover:bg-green-600 px-8 py-3 rounded text-lg font-semibold"
            >
              Verify Your Skill
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded text-lg font-semibold"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Skill Verification Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Step
              title="1. Choose a Skill"
              desc="Select a technical skill you want to verify such as Java, React, or Python."
            />
            <Step
              title="2. Take AI-Based Assessment"
              desc="Answer 10 adaptive questions generated using AI and real-world scenarios."
            />
            <Step
              title="3. Earn Your Badge"
              desc="Pass the assessment and receive a verifiable digital badge."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              title="AI-Powered Questions"
              desc="Assessments generated using LLaMA models and real technical knowledge."
            />
            <Feature
              title="Secure & Verified"
              desc="JWT-based authentication and protected assessments."
            />
            <Feature
              title="Skill Badges"
              desc="Earn shareable badges to showcase your verified expertise."
            />
            <Feature
              title="Adaptive Difficulty"
              desc="Questions scale based on real skill complexity."
            />
            <Feature
              title="RAG Knowledge Base"
              desc="Assessments built from curated skill documentation."
            />
            <Feature
              title="Developer-Friendly"
              desc="Built with MERN stack, scalable and production-ready."
            />
          </div>
        </div>
      </section>

      {/* BADGES / TRUST */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Trusted Skill Validation
          </h2>
          <p className="text-gray-600 mb-8">
            Each badge represents a verified assessment backed by AI evaluation
            and technical benchmarks.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Badge label="Java Certified" />
            <Badge label="React Verified" />
            <Badge label="Node.js Expert" />
            <Badge label="Python Professional" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-black text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Start Verifying Your Skills Today
        </h2>
        <p className="text-gray-400 mb-8">
          Prove your expertise. Build credibility. Stand out.
        </p>

        {loggedIn ? (
          <Link
            to="/verify-skill"
            className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded text-lg font-semibold"
          >
            Verify a Skill
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded text-lg font-semibold"
          >
            Login to Continue
          </Link>
        )}
      </section>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function Step({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h3 className="font-semibold text-xl mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="border rounded p-6 hover:shadow-md transition">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function Badge({ label }) {
  return (
    <div className="px-6 py-3 bg-white rounded-full shadow text-sm font-semibold">
      🏅 {label}
    </div>
  );
}
