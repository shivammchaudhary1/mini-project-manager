import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // project owner
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
