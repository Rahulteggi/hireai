const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const multer = require('multer');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/analyze
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ message: 'Job description required' });

    // Extract resume text from PDF if uploaded (lazy require to avoid startup crash)
    let resumeText = '';
    if (req.file) {
      const pdfParse = require('pdf-parse/lib/pdf-parse');
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    }

    // Run all AI tasks in parallel for speed
    const [coverLetter, keywords, bullets, interviewQs] = await Promise.all([
      generateCoverLetter(jobDescription, resumeText),
      analyzeKeywords(jobDescription, resumeText),
      rewriteBullets(jobDescription, resumeText),
      generateInterviewQuestions(jobDescription),
    ]);

    res.json({ coverLetter, keywords, bullets, interviewQs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Analysis failed', error: err.message });
  }
});

async function generateCoverLetter(jd, resume) {
  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert career coach. Write a compelling, personalized cover letter that matches the job description. Be specific, professional, and concise (3 paragraphs). Do not use generic filler phrases.',
      },
      {
        role: 'user',
        content: `JOB DESCRIPTION:\n${jd}\n\nMY RESUME:\n${resume || 'Not provided'}`,
      },
    ],
  });
  return choices[0].message.content;
}

async function analyzeKeywords(jd, resume) {
  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Analyze the job description and resume. Return JSON: { "matchScore": number (0-100), "presentKeywords": string[], "missingKeywords": string[], "topSkillsRequired": string[] }',
      },
      {
        role: 'user',
        content: `JD:\n${jd}\n\nRESUME:\n${resume || 'Not provided'}`,
      },
    ],
  });
  return JSON.parse(choices[0].message.content);
}

async function rewriteBullets(jd, resume) {
  if (!resume) return [];
  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Rewrite the resume bullet points to better match the job description. Use strong action verbs and quantify where possible. Return JSON: { "bullets": string[] }',
      },
      { role: 'user', content: `JD:\n${jd}\n\nRESUME:\n${resume}` },
    ],
  });
  return JSON.parse(choices[0].message.content).bullets;
}

async function generateInterviewQuestions(jd) {
  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Generate likely interview questions for this role. Return JSON: { "technical": string[], "behavioral": string[], "roleSpecific": string[] }',
      },
      { role: 'user', content: `JD:\n${jd}` },
    ],
  });
  return JSON.parse(choices[0].message.content);
}

module.exports = router;
