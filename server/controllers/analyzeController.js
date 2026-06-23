const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const { analyzeBigO } = require("../services/geminiService");
const Analysis = require("../models/analysisModel");
 
// Helper: strip markdown code fences Gemini sometimes wraps around JSON
function extractJSON(raw) {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return raw.trim();
}
 
const analyzeCode = async (req, res) => {
  console.log("Analyze endpoint hit");
  const { code, language = "js" } = req.body;
 
  if (!code) {
    return res.status(400).json({ success: false, message: "Code is required" });
  }
 
  const fileName = `temp_${Date.now()}.${language}`;
  const filePath = path.join(__dirname, fileName);
 
  fs.writeFileSync(filePath, code);
 
  exec(`lizard --xml ${filePath}`, async (error, stdout, stderr) => {
    // Always clean up the temp file first
    fs.unlinkSync(filePath);
 
    if (error) {
      return res.status(500).json({ success: false, error: stderr });
    }
 
    xml2js.parseString(stdout, async (err, result) => {
      if (error) {
        console.error("Exec error:", error);
        console.error("Stderr:", stderr);
        return res.status(500).json({ success: false, error: stderr || "Execution failed" });
      }
 
      try {
        // ── 1. Extract static metrics from lizard XML ──────────────────────
        const measures = result.cppncss.measure;
        const fileMeasure = measures.find((m) => m.$ && m.$.type === "File");
 
        if (!fileMeasure || !fileMeasure.sum) {
          return res.status(500).json({ success: false, error: "File summary not found" });
        }
 
        const ncss      = Number(fileMeasure.sum.find((s) => s.$.label === "NCSS")?.$.value      || 0);
        const ccn       = Number(fileMeasure.sum.find((s) => s.$.label === "CCN")?.$.value       || 0);
        const functions = Number(fileMeasure.sum.find((s) => s.$.label === "Functions")?.$.value || 0);
 
        const staticMetrics = {
          linesOfCode: ncss,
          cyclomaticComplexity: ccn,
          totalFunctions: functions,
        };
 
        // ── 2. Call Gemini ─────────────────────────────────────────────────
        let parsedBigO;
        try {
          const bigOResponse = await analyzeBigO(code, staticMetrics);
          parsedBigO = JSON.parse(extractJSON(bigOResponse));
        } catch (aiError) {
          console.error("Gemini Error:", aiError);
          parsedBigO = { error: "AI analysis failed" };
        }
 
        const {
          bestTime               = "",
          averageTime            = "",
          worstTime              = "",
          spaceComplexity        = "",
          calculationExplanation = "",
          optimizationSuggestions = [],
        } = parsedBigO;
 
        // ── 3. Send response to frontend IMMEDIATELY ───────────────────────
        res.status(200).json({
          success: true,
          data: {
            bestTime,
            averageTime,
            worstTime,
            spaceComplexity,
            calculationExplanation,
            optimizationSuggestions,
            staticMetrics,
          },
        });
 
        // ── 4. Save to DB in background (non-blocking) ─────────────────────
        // req.user is attached by authMiddleware; skip save for unauthenticated requests
        if (req.user && req.user._id) {
          Analysis.create({
            userId: req.user._id,
            code,
            language,
            bestTime,
            averageTime,
            worstTime,
            spaceComplexity,
            calculationExplanation,
            optimizationSuggestions,
          }).catch((dbErr) => {
            console.error("Background DB save failed:", dbErr.message);
          });
        }
 
      } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: "Failed to extract metrics safely" });
      }
    });
  });
};
 
module.exports = { analyzeCode };