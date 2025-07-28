import mongoose, { Document, Schema } from "mongoose";

export enum InviteStatus {
  INVITE_DONE = "invite_done",
  INVITE_REJECTED = "invite_rejected",
  INVITE_VIEWED = "invite_viewed",
}

export interface IInvite extends Document {
  employee: mongoose.Schema.Types.ObjectId;
  jobId: mongoose.Schema.Types.ObjectId;
  to: mongoose.Schema.Types.ObjectId;
  status: InviteStatus;
  viewed: Boolean;
}

const inviteSchema = new Schema<IInvite>({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    enum: Object.values(InviteStatus),
  },
  viewed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IInvite>("invites", inviteSchema);
