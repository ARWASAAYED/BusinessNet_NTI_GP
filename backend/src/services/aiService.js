/**
 * AI Content Analysis Service
 * Simulates advanced sentiment, professionalism, and trust scoring.
 * In a real-world scenario, this would integrate with OpenAI, AWS Comprehend, or a custom NLP model.
 */

const analyzeContent = async (content) => {
  // Handle empty or undefined content (media-only posts)
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return {
      sentimentScore: 0,
      professionalismScore: 50,
      authenticityScore: 0.8,
      relevanceScore: 0,
      aiKeywords: [],
      detectedIndustry: "General",
    };
  }

  // 1. Sentiment Analysis (-1 to 1)
  const positiveWords = [
    "growth",
    "innovation",
    "success",
    "trust",
    "excellent",
    "achieve",
    "partnership",
  ];
  const negativeWords = [
    "fail",
    "crisis",
    "risk",
    "scam",
    "poor",
    "bad",
    "warning",
  ];

  let sentiment = 0;
  const words = content.toLowerCase().split(/\W+/);

  words.forEach((word) => {
    if (positiveWords.includes(word)) sentiment += 0.2;
    if (negativeWords.includes(word)) sentiment -= 0.3;
  });

  sentiment = Math.max(-1, Math.min(1, sentiment));

  // 2. Professionalism Score (0-100)
  // Penalize for excessive caps, slang, or emojis (slang is subjective, we'll use patterns)
  let professionalism = 80; // Baseline

  if (content === content.toUpperCase() && content.length > 10)
    professionalism -= 30;
  if ((content.match(/!/g) || []).length > 2) professionalism -= 10;
  if (/ (omg|lol|idk|btw) /i.test(content)) professionalism -= 20;
  if (content.length < 20) professionalism -= 10;

  professionalism = Math.max(0, Math.min(100, professionalism));

  // 3. Relevance & Keywords
  const industries = {
    Technology: ["ai", "software", "digital", "cloud", "devops", "tech"],
    Finance: ["investment", "capital", "market", "stock", "banking"],
    Healthcare: ["medical", "health", "wellness", "doctor", "clinic"],
  };

  let detectedIndustry = "General";
  let maxMatches = 0;
  let keywords = [];

  Object.entries(industries).forEach(([industry, list]) => {
    const matches = list.filter((keyword) => words.includes(keyword));
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      detectedIndustry = industry;
    }
    keywords = [...keywords, ...matches];
  });

  // 4. Authenticity Score (0-1)
  // Higher if it doesn't look like spam/copy-paste
  const authenticity = content.length > 100 ? 0.95 : 0.8;

  return {
    sentimentScore: sentiment,
    professionalismScore: professionalism,
    authenticityScore: authenticity,
    relevanceScore: Math.min(100, maxMatches * 25),
    aiKeywords: Array.from(new Set(keywords)),
    detectedIndustry,
  };
};

// Simple reply generator — in production integrate with real LLM
const generateReply = async (content, opts = {}) => {
  const analysis = await analyzeContent(content || "");
  const tone = opts.tone || "neutral";
  const keywords = (analysis.aiKeywords || []).slice(0, 3).join(", ");

  const suggestion = `Suggested (${tone}) reply: Thanks for sharing. I noticed keywords: ${
    keywords || "none"
  }; here's a constructive follow-up question: Can you elaborate on ${
    keywords || "your point"
  }?`;
  return { suggestion, analysis };
};

// Summarize recent messages (very lightweight extractive summary)
const summarizeMessages = async (messages) => {
  const combined = messages.map((m) => m.content || "").join(" \n");
  const analysis = await analyzeContent(combined);
  const summary = `Summary: ${messages.length} messages · Detected topics: ${
    analysis.aiKeywords.join(", ") || "general"
  } · Sentiment: ${analysis.sentimentScore}`;
  return { summary, analysis };
};

module.exports = {
  analyzeContent,
  generateReply,
  summarizeMessages,
};
