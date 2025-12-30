import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema(
  {
    roomId: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
  },
  { timestamps: true }
);

export default mongoose.model("PrivateMessage", privateMessageSchema);
