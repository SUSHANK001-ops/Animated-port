import mongoose from "mongoose";

interface IRateLimit {
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new mongoose.Schema<IRateLimit>({
  // Composite key: `${scope}:${identifier}` e.g. "otp-send:1.2.3.4:user@example.com"
  key: { type: String, required: true, unique: true, index: true },
  count: { type: Number, required: true, default: 0 },
  // TTL index: MongoDB automatically deletes the document once expiresAt passes.
  expiresAt: { type: Date, required: true },
});

// Auto-remove expired windows so the collection never grows unbounded.
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimitModel =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

export default RateLimitModel;
