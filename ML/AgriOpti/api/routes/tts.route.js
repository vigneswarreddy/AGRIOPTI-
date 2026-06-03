import express from 'express';
import { getAudio } from '../controllers/tts.controller.js';

const router = express.Router();

router.post('/', getAudio);

export default router;
