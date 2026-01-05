import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },

    skills: [
      {
        type: String
      }
    ],

    verifiedSkills: [
      {
        skill: String,
        badge: String,
        verifiedAt: Date
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
