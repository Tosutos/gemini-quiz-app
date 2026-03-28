import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Lightbulb, BookOpen, Sparkles, Loader2, MessageSquareText } from 'lucide-react';

const apiKey = ""; // Runtime provides the key

const QUESTIONS = [
  {
    id: 1,
    category: "수학의 가치",
    question: "수학의 가치 4가지는 무엇인가요?",
    keywords: ["실용적", "도야적", "문화적", "심미적"],
    answer: "실용적 가치, 도야적 가치, 문화적 가치, 심미적 가치",
    description: "실미도문화(청킹)로 외우세요! 실용적(일상 활용), 도야적(정신 훈련), 문화적(전통/유산), 심미적(아름다움)"
  },
  {
    id: 2,
    category: "수학적 사고",
    question: "귀납적 사고의 정의를 설명해보세요.",
    keywords: ["사례", "공통", "규칙", "일반", "원리", "법칙", "발견"],
    answer: "몇 가지 사례에서 찾은 공통 요소(규칙)로부터 일반적인 원리나 법칙 발견",
    description: "구체적 사례 -> 일반적 법칙 발견이 핵심입니다."
  },
  {
    id: 3,
    category: "수학적 사고",
    question: "연역적 사고의 정의를 설명해보세요.",
    keywords: ["일반", "원리", "법칙", "특수", "개별", "유도"],
    answer: "일반적인 원리나 법칙에서 특수하고 개별적인 원리나 법칙을 유도",
    description: "이미 알려진 일반적 사실에서 구체적 사실을 이끌어내는 과정입니다."
  },
  {
    id: 4,
    category: "수학적 사고",
    question: "유추적 사고의 정의를 설명해보세요.",
    keywords: ["유사점", "기초", "성질", "추론"],
    answer: "이미 확보된 성질의 유사점을 기초로 이와 유사한 다른 특수한 성질을 추론",
    description: "A와 B가 비슷하니 성질도 비슷할 것이라고 추측하는 것입니다."
  },
  {
    id: 5,
    category: "수학적 사고",
    question: "직관적 사고, 논리적 사고, 가역적 사고를 각각 짧게 설명해보세요.",
    keywords: ["전체", "한번에", "분석", "단계적", "연역", "되돌릴"],
    answer: "직관적 사고: 전체를 한 번에 감지. 논리적 사고: 분석적이고 단계적(연역 사용). 가역적 사고: 변화된 상태를 역으로 원래 상태로 되돌릴 수 있는 사고.",
    description: "직관(통찰), 논리(절차), 가역(가역성)이 포인트입니다."
  },
  {
    id: 6,
    category: "수학적 지식의 형태",
    question: "수학적 지식의 형태 3가지는 무엇인가요?",
    keywords: ["개념", "원리", "법칙"],
    answer: "개념, 원리, 법칙",
    description: "지식이 담기는 그릇의 종류입니다."
  },
  {
    id: 7,
    category: "수학적 개념의 종류",
    question: "수학적 개념의 종류 3가지를 설명해보세요.",
    keywords: ["개별", "관계", "조작"],
    answer: "개별 개념(개별 대상), 관계 개념(대상 사이의 관계), 조작 개념(두 가지 이상 대상으로 조작)",
    description: "예: 사과(개별), 크다(관계), 덧셈(조작)"
  },
  {
    id: 8,
    category: "수학적 지식의 특성",
    question: "수학적 지식 형성 과정의 특성(추상화, 형식화, 이상화)을 설명해보세요.",
    keywords: ["이질", "제거", "동질", "공통", "규칙성", "제약", "무시"],
    answer: "추상화: 이질적 요소 제거 후 동질적 요소 추출. 형식화: 공통적 규칙성을 만드는 과정. 이상화: 현실적 제약 무시 후 이상적 상황 가정.",
    description: "가장 헷갈리기 쉬운 부분이므로 확실히 구분하세요."
  },
  {
    id: 9,
    category: "수학적 지식의 특성",
    question: "수학적 지식 적용 및 발전 과정의 특성(일반화, 특수화)을 설명해보세요.",
    keywords: ["넓은", "범위", "확장", "특수", "개별", "적용"],
    answer: "일반화: 추상화된 개념을 넓은 범위로 확장 적용. 특수화: 일반적 개념을 특수한 개별 상황에 적용.",
    description: "일반화는 '귀납'과 비슷하고, 특수화는 '연역'과 비슷합니다."
  },
  {
    id: 10,
    category: "수학적 지식의 특성",
    question: "수학적 지식의 보존 및 정리 특성(계통성, 논리성)을 설명해보세요.",
    keywords: ["토대", "새로운", "누적", "연역", "논리"],
    answer: "계통성: 이미 학습한 내용 토대로 새로운 내용 쌓기. 논리성: 연역 논리에 따라 계통적으로 누적됨.",
    description: "수학은 계단처럼 차근차근 쌓아가는 학문입니다."
  }
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiExtraQuestion, setAiExtraQuestion] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  const currentQ = QUESTIONS[currentIndex];

  // Exponential backoff helper
  const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw err;
    }
  };

  const callGemini = async (prompt, systemPrompt = "") => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const result = await fetchWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 가져오지 못했습니다.";
  };

  const handleAiFeedback = async () => {
    if (!userInput.trim()) return;
    setIsAiLoading(true);
    try {
      const systemPrompt = "당신은 초등 임용고시 수학 교육학 전문가입니다. 사용자의 답변이 정답 예시 및 키워드와 얼마나 일치하는지 분석하고, 부족한 부분이나 오개념이 있다면 친절하게 설명해주세요. 판정은 [정답], [부분 점수], [오답] 중 하나로 시작하세요.";
      const prompt = `질문: ${currentQ.question}\n모범 답안: ${currentQ.answer}\n키워드: ${currentQ.keywords.join(", ")}\n\n사용자 답변: ${userInput}`;
      const analysis = await callGemini(prompt, systemPrompt);
      setAiAnalysis(analysis);
      
      // Basic state updates
      const matched = currentQ.keywords.filter(kw => userInput.includes(kw));
      setFeedback({ status: analysis.includes('[정답]') ? 'correct' : 'partial', matched });
      setShowAnswer(true);
    } catch (error) {
      setAiAnalysis("AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateAiExtraQuestion = async () => {
    setIsAiLoading(true);
    try {
      const systemPrompt = "당신은 초등 임용고시 출제위원입니다. 현재 학습 중인 개념과 관련하여 사용자의 이해도를 높일 수 있는 새로운 서술형 문제 1개를 만들어주세요.";
      const prompt = `현재 학습 주제: ${currentQ.category}\n관련 개념: ${currentQ.question}\n\n이와 유사하거나 조금 더 심화된 문제를 하나 출제해주세요.`;
      const question = await callGemini(prompt, systemPrompt);
      setAiExtraQuestion(question);
    } catch (error) {
      setAiExtraQuestion("질문을 생성하지 못했습니다.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateAiSummary = async () => {
    setIsAiLoading(true);
    try {
      const systemPrompt = "당신은 임용고시 수험생의 멘토입니다. 특정 카테고리의 핵심 내용을 3줄 이내의 불렛 포인트로 명확하게 요약해주세요.";
      const prompt = `카테고리: ${currentQ.category}\n관련 질문들: ${QUESTIONS.filter(q => q.category === currentQ.category).map(q => q.question).join(", ")}`;
      const summary = await callGemini(prompt, systemPrompt);
      setAiSummary(summary);
    } catch (error) {
      setAiSummary("요약 생성 실패");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCheck = () => {
    const matched = currentQ.keywords.filter(kw => userInput.includes(kw));
    const ratio = matched.length / currentQ.keywords.length;
    let status = ratio === 1 ? 'correct' : ratio >= 0.4 ? 'partial' : 'wrong';
    setFeedback({ status, matched });
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetState();
    }
  };

  const resetState = () => {
    setUserInput('');
    setFeedback(null);
    setShowAnswer(false);
    setAiAnalysis("");
    setAiExtraQuestion("");
    setAiSummary("");
  };

  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">임고트립 MATH AI</h1>
          </div>
          <p className="text-slate-500 text-sm">Gemini AI가 제공하는 스마트 피드백 학습</p>
          
          <button 
            onClick={generateAiSummary}
            className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Sparkles className="w-3 h-3" /> ✨ AI 테마 요약 보기
          </button>
        </header>

        {aiSummary && (
          <div className="mb-6 p-4 bg-blue-600 text-white rounded-2xl shadow-lg animate-in fade-in zoom-in duration-300">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 현재 카테고리 핵심 정리
            </h3>
            <div className="text-sm opacity-90 whitespace-pre-wrap leading-relaxed">
              {aiSummary}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between text-[10px] font-bold mb-1.5 text-slate-400 uppercase tracking-widest">
            <span>Progress {currentIndex + 1}/{QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentQ.category}
            </span>
          </div>
          
          <div className="p-8">
            <h2 className="text-xl font-bold mb-8 leading-tight text-slate-800">
              {currentQ.question}
            </h2>

            {!showAnswer ? (
              <div className="space-y-4">
                <textarea
                  className="w-full h-44 p-5 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none resize-none text-slate-700"
                  placeholder="답변을 서술해 보세요..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCheck}
                    disabled={!userInput.trim() || isAiLoading}
                    className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                    일반 채점
                  </button>
                  <button
                    onClick={handleAiFeedback}
                    disabled={!userInput.trim() || isAiLoading}
                    className="py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    ✨ AI 상세 채점
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-5 rounded-2xl border-2 ${
                  feedback.status === 'correct' ? 'bg-green-50 border-green-100 text-green-800' :
                  feedback.status === 'partial' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
                  'bg-red-50 border-red-100 text-red-800'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {feedback.status === 'correct' ? <CheckCircle2 className="w-6 h-6" /> : 
                     feedback.status === 'partial' ? <Lightbulb className="w-6 h-6" /> : 
                     <XCircle className="w-6 h-6" />}
                    <span className="font-black text-lg">
                      {feedback.status === 'correct' ? '정답입니다!' : 
                       feedback.status === 'partial' ? '부분 점수입니다.' : 
                       '더 보충이 필요해요.'}
                    </span>
                  </div>
                  
                  {aiAnalysis && (
                    <div className="mt-4 p-4 bg-white/50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border border-white">
                      <p className="font-bold mb-2 flex items-center gap-2 text-blue-700">
                        <MessageSquareText className="w-4 h-4" /> AI 피드백
                      </p>
                      {aiAnalysis}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Model Answer</h4>
                  <p className="font-bold text-slate-700 mb-4">{currentQ.answer}</p>
                  <p className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-100">
                    💡 {currentQ.description}
                  </p>
                </div>

                {aiExtraQuestion ? (
                  <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl animate-in zoom-in duration-300">
                    <h4 className="text-xs font-black text-purple-600 mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> ✨ AI 심화 질문
                    </h4>
                    <p className="text-sm text-purple-900 font-medium whitespace-pre-wrap">
                      {aiExtraQuestion}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={generateAiExtraQuestion}
                    disabled={isAiLoading}
                    className="w-full py-3 border-2 border-dashed border-purple-200 text-purple-600 rounded-2xl text-sm font-bold hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    ✨ AI에게 관련 질문 하나 더 받기
                  </button>
                )}

                <div className="flex gap-3 pt-4">
                  <button onClick={resetState} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                    다시 풀기
                  </button>
                  <button onClick={handleNext} className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                    다음 문제 <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 pb-8 text-center text-slate-400 text-[10px] font-bold tracking-widest uppercase">
          Imgotrip Checklist x Gemini AI
        </footer>
      </div>
    </div>
  );
};

export default App;