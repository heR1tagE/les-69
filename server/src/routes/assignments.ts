import express from 'express';
import Assignment from '../models/assignment';


const router = express.Router();

// Отримати всі завдання
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assignments', error: err });
  }
});

// Додати нове завдання
router.post('/', async (req, res) => {
  const { title, description, dueDate } = req.body;

  const newAssignment = new Assignment({
    title,
    description,
    dueDate,
  });

  try {
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (err) {
    res.status(400).json({ message: 'Error saving assignment', error: err });
  }
});

// Оновити завдання
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { title, description, dueDate },
      { new: true }
    );
    res.status(200).json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ message: 'Error updating assignment', error: err });
  }
});

// Видалити завдання
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    res.status(200).json(deletedAssignment);
  } catch (err) {
    res.status(400).json({ message: 'Error deleting assignment', error: err });
  }
});

export default router;
