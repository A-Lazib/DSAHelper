import { Router } from 'express';
import { ProblemController, DebugController, FeedbackController, HintController } from '../controllers/index.js';

const router = Router();

const problemController = new ProblemController();
const debugController = new DebugController();
const feedbackController = new FeedbackController();
const hintController = new HintController();

// Problem routes
router.get('/problems', (req, res) => problemController.getAllProblems(req, res));
router.get('/problems/:id', (req, res) => problemController.getProblem(req, res));

// Debug route
router.post('/debug', (req, res) => debugController.debug(req, res));

// Feedback route
router.post('/feedback', (req, res) => feedbackController.feedback(req, res));

// Hint route
router.post('/hint', (req, res) => hintController.hint(req, res));

export default router;
