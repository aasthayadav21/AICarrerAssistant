const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function analyzeResume(resumeText) {
  // Optional: Truncate very large resume text (Gemini has token limits)
  const truncatedResumeText = resumeText.slice(0, 7000); // Safe limit

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // or 'gemini-pro'

  const prompt = `
You are a professional AI career advisor. Analyze the resume text below and respond ONLY with a JSON object structured like this:

{
  "suggested_roles": [
    { "title": "Frontend Developer", "reason": "Strong experience with HTML, CSS, and React" }
  ],
  "skills_found": {
    "technical": ["JavaScript", "Python"],
    "soft": ["Teamwork", "Communication"]
  },
  "missing_skills": [
    "Cloud computing", "Docker"
  ],
  "career_advice": "Provide 3-5 sentences of personalized career guidance based on the resume."
}

Resume text:
${truncatedResumeText}

Respond only with the JSON object. Do NOT include markdown like \`\`\`, or any explanation.
`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      let responseText = await result.response.text();

      // Clean response from markdown if present
      responseText = responseText.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(responseText);
      return parsed;
    } catch (err) {
      console.warn(`⚠️ Gemini API attempt ${attempt} failed: ${err.message}`);

      // Retry on transient error
      if (attempt < 3) {
        await sleep(1500);
      } else {
        console.error('❌ Final Gemini API failure after 3 attempts.');
        return {
          suggested_roles: [],
          skills_found: { technical: [], soft: [] },
          missing_skills: [],
          career_advice: 'Gemini AI is currently overloaded. Please try again later.',
        };
      }
    }
  }
}

module.exports = analyzeResume;
