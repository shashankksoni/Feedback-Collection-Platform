const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');
const auth = require('../middleware/auth');
const { Parser } = require('json2csv');


router.post('/:publicId', async (req, res) => {
  const { answers } = req.body;

  try {
    const form = await Form.findOne({ publicId: req.params.publicId });
    if (!form) return res.status(404).json({ message: 'Form not found' });

    
    if (!answers || !Array.isArray(answers) || answers.length !== form.questions.length) {
      return res.status(400).json({ message: 'Invalid answers' });
    }

    const response = new Response({
      formId: form._id,
      answers,
    });

    await response.save();
    res.json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get responses for a form (admin only)
router.get('/:formId', auth, async (req, res) => {
  try {
    
    const form = await Form.findOne({ _id: req.params.formId, createdBy: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found or unauthorized' });

    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Export responses as CSV (admin only)
router.get('/export/:formId', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, createdBy: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found or unauthorized' });

    const responses = await Response.find({ formId: req.params.formId });

    // Prepare data for CSV
    const fields = ['submittedAt', ...form.questions.map(q => q.questionText)];
    const data = responses.map(resp => {
      const row = { submittedAt: resp.submittedAt.toISOString() };
      form.questions.forEach(q => {
        const ans = resp.answers.find(a => a.questionId.toString() === q._id.toString());
        row[q.questionText] = ans ? ans.answerText : '';
      });
      return row;
    });

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${form.title}_responses.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/summary/:formId', auth, async (req, res) => {
  try {
 
    const form = await Form.findOne({ _id: req.params.formId, createdBy: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found or unauthorized' });

    const responses = await Response.find({ formId: req.params.formId });

    const summary = form.questions.map(q => {
      if (q.questionType === 'multiple-choice') {
       
        const counts = {};
        (q.options || []).forEach(opt => { counts[opt] = 0; });

        responses.forEach(resp => {
          const ans = resp.answers.find(a => a.questionId.toString() === q._id.toString());
          if (ans && counts.hasOwnProperty(ans.answerText)) {
            counts[ans.answerText]++;
          }
        });

        return {
          questionText: q.questionText,
          questionType: q.questionType,
          summary: counts
        };
      } else {
       
        const answers = responses.map(resp => {
          const ans = resp.answers.find(a => a.questionId.toString() === q._id.toString());
          return ans ? ans.answerText : null;
        }).filter(x => x !== null);

        return {
          questionText: q.questionText,
          questionType: q.questionType,
          answers: answers
        };
      }
    });

    res.json({ questions: summary });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
