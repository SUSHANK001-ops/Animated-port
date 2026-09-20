import mongoose from "mongoose";

interface IGuestbookEntry {
  name: string;
  message: string;
}

const GuestbookSchema = new mongoose.Schema<IGuestbookEntry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const GuestbookModel =
  mongoose.models.Guestbook ||
  mongoose.model<IGuestbookEntry>("Guestbook", GuestbookSchema);

export default GuestbookModel;
