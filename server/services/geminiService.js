const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeBigO(code, staticMetrics) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const prompt = `
You are a computer science expert.

Analyze the following JavaScript code.

Static Metrics:
- Lines of Code: ${staticMetrics.linesOfCode}
- Cyclomatic Complexity: ${staticMetrics.cyclomaticComplexity}
- Total Functions: ${staticMetrics.totalFunctions}

Determine:

1. Best case time complexity
2. Average case time complexity
3. Worst case time complexity
4. Space complexity

Then explain clearly HOW the complexity was calculated:
- Identify loops
- Identify nested loops
- Identify recursion
- Identify memory usage
- Explain how each contributes to final Big-O

Then provide optimization suggestions:
- Suggest algorithm improvements
- Suggest data structure improvements
- Suggest memory optimization
- Suggest readability improvements

Return strictly in this JSON format:

{
  "bestTime": "",
  "averageTime": "",
  "worstTime": "",
  "spaceComplexity": "",
  "calculationExplanation": "",
  "optimizationSuggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}

Code:
${code}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
}

module.exports = { analyzeBigO };