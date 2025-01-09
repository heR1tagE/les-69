import { Request, Response } from 'express';
import Assignment from './../models/assignment';

// Створення нових записів
export const createAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.insertMany([
      { name: 'John Doe', subject: 'Math', score: 95 },
      { name: 'Jane Smith', subject: 'Science', score: 85 },
      { name: 'Tom Brown', subject: 'History', score: 78 },
      { name: 'Lucy Green', subject: 'Math', score: 88 },
      { name: 'Mark White', subject: 'English', score: 80 },
    ]);
    res.status(201).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося додати записи', error });
  }
};

// Пошук за умовою score > 80
export const getAssignmentsByScore = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({ score: { $gt: 80 } });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося знайти записи', error });
  }
};

// Оновлення score на 5 для тих, у кого score < 85
export const updateAssignmentsScore = async (req: Request, res: Response) => {
  try {
    const updatedAssignment = await Assignment.updateOne(
      { score: { $lt: 85 } },
      { $inc: { score: 5 } }
    );
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося оновити запис', error });
  }
};

// Видалення запису з найменшим балом
export const deleteLowestScore = async (req: Request, res: Response) => {
  try {
    const lowestAssignment = await Assignment.find().sort({ score: 1 }).limit(1);
    await Assignment.deleteOne({ _id: lowestAssignment[0]._id });
    res.status(200).json({ message: 'Запис видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося видалити запис', error });
  }
};

// Виведення тільки імені та балу
export const getAssignmentsProjection = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({}, { name: 1, score: 1, _id: 0 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося отримати записи', error });
  }
};
