import { Router } from 'express';
import Todo from '../models/Todo.js';
const router = Router();
// GET all todos (supports ?completed=true|false&q=search)
router.get('/', async (req, res) => {
    try {
        const { completed, q } = req.query;
        const query = Todo.find();
        if (completed === 'true' || completed === 'false') {
            query.where('completed').equals(completed === 'true');
        }
        if (typeof q === 'string' && q.trim()) {
            query.or([
                { text: { $regex: q.trim(), $options: 'i' } },
                { description: { $regex: q.trim(), $options: 'i' } }
            ]);
        }
        const todos = await query.sort({ createdAt: -1 });
        res.json(todos);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
// GET todo stats
router.get('/stats', async (_req, res) => {
    try {
        const [total, completed] = await Promise.all([
            Todo.countDocuments(),
            Todo.countDocuments({ completed: true })
        ]);
        res.json({
            total,
            completed,
            pending: total - completed
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Could not fetch stats' });
    }
});
// POST add new todo
router.post('/', async (req, res) => {
    try {
        const { text, description } = req.body;
        if (typeof text !== 'string' || !text.trim()) {
            res.status(400).json({ message: 'Text is required' });
            return;
        }
        const todo = new Todo({
            text: text.trim(),
            description: typeof description === 'string' ? description.trim() : undefined
        });
        await todo.save();
        res.status(201).json(todo);
    }
    catch (err) {
        res.status(400).json({ message: 'Could not add todo' });
    }
});
// PUT update todo fields
router.put('/:id', async (req, res) => {
    try {
        const { text, description, completed } = req.body;
        const updateData = {};
        if (typeof text === 'string' && text.trim()) {
            updateData.text = text.trim();
        }
        if (typeof description === 'string') {
            updateData.description = description.trim();
        }
        if (typeof completed === 'boolean') {
            updateData.completed = completed;
        }
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: 'No valid fields to update' });
            return;
        }
        const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        res.json(todo);
    }
    catch (err) {
        res.status(400).json({ message: 'Could not update todo' });
    }
});
// PATCH toggle complete state
router.patch('/:id/toggle', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    }
    catch (err) {
        res.status(400).json({ message: 'Could not toggle todo' });
    }
});
// DELETE todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        res.json({ message: 'Todo deleted ✅' });
    }
    catch (err) {
        res.status(500).json({ message: 'Could not delete todo' });
    }
});
export default router;
//# sourceMappingURL=todos.js.map