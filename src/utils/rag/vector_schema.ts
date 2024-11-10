// models/Vector.js
import mongoose from "mongoose";

const VectorSchema = new mongoose.Schema({
  vector: {
    type: [Number],
    required: true,
  },
  metadata: {
    type: Object,
    required: true,
  },
});

export default mongoose.models.Vector || mongoose.model("Vector", VectorSchema);
