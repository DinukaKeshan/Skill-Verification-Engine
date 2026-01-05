import { isAuthenticated } from "../utils/auth";

export default function Home() {
  const loggedIn = isAuthenticated();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-4xl font-bold mb-4">
        Skill Verification Engine
      </h1>

      <p className="text-gray-600 mb-6">
        Verify your skills. Earn your badge.
      </p>

      {loggedIn && (
        <div className="bg-green-100 px-6 py-3 rounded">
          ✅ You are logged in
        </div>
      )}
    </div>
  );
}
