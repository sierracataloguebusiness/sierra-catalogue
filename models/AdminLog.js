import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  ip: String,
  location: String,
}, { timestamps: true });

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

export default AdminLog;