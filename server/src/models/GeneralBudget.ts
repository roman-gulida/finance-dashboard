import mongoose, { Schema, type Document } from 'mongoose';

export interface IGeneralBudget extends Document {
  userId: mongoose.Types.ObjectId;
  totalLimit: number;
  month: string; // Format: "YYYY-MM"
  createdAt: Date;
  updatedAt: Date;
}

const generalBudgetSchema = new Schema<IGeneralBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    totalLimit: {
      type: Number,
      required: [true, 'Total limit is required'],
      min: [0, 'Total limit cannot be negative'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Ensure one general budget per month per user
generalBudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export const GeneralBudget = mongoose.model<IGeneralBudget>('GeneralBudget', generalBudgetSchema);
