import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Evaluator = ({ userInput, task, onReset }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Analyzing your response...");

  useEffect(() => {
    // Attempt tracking to handle 429 errors
    let isMounted = true;

    const fetchFeedback = async (attempt = 0) => {
      const apiKey = localStorage.getItem("celwrite_gemini_key");

      if (!apiKey) {
        if (isMounted) {
          setFeedback("Error: No API Key found. Please add it in Settings.");
          setLoading(false);
        }
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: { temperature: 0.7 }
        });

        const prompt = `
          You are a CELPIP Writing Examiner. 
          Evaluate the following for Task: ${task?.title}
          
          Student Response: "${userInput}"
          
          Provide a 1-12 score and feedback on Content, Vocabulary, Readability, and Task Fulfillment.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (isMounted) {
          setFeedback(text);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gemini Error:", err);

        // Check if error is Rate Limit (429)
        if (err.message.includes("429") && attempt < 2) {
          const delay = (attempt + 1) * 3000; // Wait 3s then 6s
          if (isMounted) setStatusMessage(`Rate limited. Retrying in ${delay/1000}s...`);
          
          setTimeout(() => {
            if (isMounted) fetchFeedback(attempt + 1);
          }, delay);
        } else {
          if (isMounted) {
            setFeedback(err.message.includes("429") 
              ? "The AI is currently busy. Please wait 30 seconds and try again." 
              : `AI Evaluation failed: ${err.message}`);
            setLoading(false);
          }
        }
      }
    };

    if (userInput && task) {
      fetchFeedback();
    }

    return () => { isMounted = false; }; // Cleanup to prevent memory leaks
  }, [userInput, task]);

  return (
    <div className="min-h-screen bg-[#020617] p-10 text-white font-sans">
      <div className="max-w-4xl mx-auto glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <h2 className="text-4xl font-black italic mb-8 tracking-tighter">
          Grading <span className="text-indigo-500">Report.</span>
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-6">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="animate-pulse text-slate-400 font-mono text-xs uppercase tracking-widest text-center">
              {statusMessage}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="bg-black/30 p-8 rounded-3xl border border-white/5 leading-relaxed text-slate-300 whitespace-pre-wrap text-lg">
              {feedback}
            </div>
            <button 
              onClick={onReset} 
              className="mt-12 bg-indigo-600 px-10 py-4 rounded-full font-black text-sm hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              BACK TO DASHBOARD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluator;