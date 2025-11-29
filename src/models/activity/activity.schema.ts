import mongoose from "mongoose";
const { Schema  , model} = mongoose;

const ActivityLogSchema = new Schema(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    actorType: {
      type: String,
      required: false,
      enum: ["User", "Admin", "System"],
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    actorName: {
      type: String,
      required: false,
    },
    targetType: {
      type: String,
      required: false,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },

    location: {
      ipAddress: { type: String },
      platform: { type: String },
    },
  },
  {
    timestamps: true, 
  }
);

const ActivityLog = model("ActivityLog", ActivityLogSchema);

export { ActivityLog };
