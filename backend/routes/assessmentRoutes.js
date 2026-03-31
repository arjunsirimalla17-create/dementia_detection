const express = require('express');
const router = express.Router();
const { saveAssessment, getAssessmentHistory } = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.route('/')
  .post(protect, saveAssessment)
  .get(protect, getAssessmentHistory);

router.post('/generate-video-questions', async (req, res) => {
  const { videoTitle, videoDescription } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are helping assess episodic memory for dementia detection.

A patient just watched a short video titled: "${videoTitle}"
Video description: "${videoDescription}"

Generate exactly 5 multiple choice questions that test what they remember.
Questions should test: visual details, setting, mood, characters/objects, sequence of events.
Keep options simple and clear — suitable for elderly patients.

Return ONLY a JSON array, no extra text, no markdown:
[
  { "q": "...", "options": ["A", "B", "C", "D"], "answer": "A" },
  ...
]`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, '').trim();
    const questions = JSON.parse(raw);
    res.json({ questions });
  } catch (err) {
    console.error('Video questions error:', err);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

module.exports = router;