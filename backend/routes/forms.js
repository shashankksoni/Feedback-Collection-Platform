const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const auth = require('../middleware/auth');
const { nanoid } = require('nanoid');

// Create a new form (Admin only)
router.post('/', auth, async (req, res) => {
  const { title, questions } = req.body;
  if (!title || !questions || !Array.isArray(questions) || questions.length < 3 || questions.length > 5) {
    return res.status(400).json({ message: 'Invalid form data' });
  }

  try {
    const publicId = nanoid(10); // generate unique public id for URL
    const form = new Form({
      title,
      questions,
      createdBy: req.user.id,
      publicId,
    });

    await form.save();
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get form by publicId (public access)
router.get('/:publicId', async (req, res) => {
  try {
    const form = await Form.findOne({ publicId: req.params.publicId });
    if (!form) return res.status(404).json({ message: 'Form not found' });

    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all forms by admin user
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user.id });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
