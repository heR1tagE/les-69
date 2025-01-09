import mongoose, { Schema, Document } from 'mongoose';

// Створення схеми для завдань
const assignmentSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Опис моделі
const Assignment = mongoose.model<Assignment>('Assignment', assignmentSchema);

export interface Assignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
}

export default Assignment;
