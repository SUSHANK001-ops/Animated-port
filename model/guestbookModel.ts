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
  // Cloudinary public_id so we can destroy the asset if the post is deleted.
  imagePublicId?: string;
  // Admin moderation: hidden entries are kept in the DB but not shown publicly.
  isHidden?: boolean;
}

const GuestbookSchema = new mongoose.Schema<IGuestbookEntry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    avatar: { type: String },
    provider: { type: String },
    userId: { type: String, index: true },
    image: { type: String },
    imagePublicId: { type: String },
    isHidden: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const GuestbookModel =
  mongoose.models.Guestbook ||
  mongoose.model<IGuestbookEntry>("Guestbook", GuestbookSchema);

export default GuestbookModel;
