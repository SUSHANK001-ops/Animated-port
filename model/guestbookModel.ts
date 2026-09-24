import mongoose from "mongoose";

interface IGuestbookEntry {
  name: string;
  message: string;
  avatar?: string;
  provider?: string;
  // Stable per-user id (from auth) to prevent duplicate spam per person.
  userId?: string;
  // Optional user-uploaded image attached to the message.
  image?: string;
}

const GuestbookSchema = new mongoose.Schema<IGuestbookEntry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    avatar: { type: String },
    provider: { type: String },
    userId: { type: String, index: true },
    image: { type: String },
  },
  { timestamps: true }
);

const GuestbookModel =
  mongoose.models.Guestbook ||
  mongoose.model<IGuestbookEntry>("Guestbook", GuestbookSchema);

export default GuestbookModel;
