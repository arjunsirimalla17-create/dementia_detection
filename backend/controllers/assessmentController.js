const Assessment = require('../models/Assessment');

// @desc    Create or update an assessment session
// @route   POST /api/assessment
// @access  Private
const saveAssessment = async (req, res) => {
  const { scores, completionStatus, finalRiskScore, riskCategory, smartExplanation } = req.body;

  try {
    // Find if there's an active assessment for today, or create new
    // For simplicity, we create a new record on explicit submit or update the latest
    
    // In a real app we might want to attach this to a specific session ID
    const assessment = await Assessment.create({
      user: req.user._id,
      scores,
      completionStatus,
      finalRiskScore,
      riskCategory,
      smartExplanation
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user assessment history
// @route   GET /api/assessment
// @access  Private
const getAssessmentHistory = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveAssessment, getAssessmentHistory };
