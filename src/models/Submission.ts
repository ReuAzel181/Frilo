import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  title: string;
  url: string;
  description: string;
  user: mongoose.Schema.Types.ObjectId;
  favorites: mongoose.Schema.Types.ObjectId[];
}

const SubmissionSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);