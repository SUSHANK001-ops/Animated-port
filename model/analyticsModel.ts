import mongoose from "mongoose";

/**
 * Per-path view counters + a daily unique-visitor set (by hashed visitor id).
 * One document per URL path.
 */
interface IAnalytics {
  path: string;
  views: number;
  // Map of "YYYY-MM" -> array of hashed visitor ids seen that month.
  monthlyVisitors: Map<string, string[]>;
}

const AnalyticsSchema = new mongoose.Schema<IAnalytics>(
  {
    path: { type: String, required: true, unique: true, index: true },
    views: { type: Number, required: true, default: 0 },
    monthlyVisitors: {
      type: Map,
      of: [String],
      default: {},
    },
  },
  { timestamps: true }
);

const AnalyticsModel =
  mongoose.models.Analytics ||
  mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);

export default AnalyticsModel;
