import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import FadeUp from "../components/animations/FadeUp";

// 1. Word Recall Test
function WordRecallTest({ onComplete }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState("instructions");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userWords, setUserWords] = useState(() => Array(5).fill(""));

  const WORD_BANK = [
    "Apple", "Table", "Penny", "Elephant", "River",
    "Candle", "Forest", "Mirror", "Jacket", "Thunder",
    "Lemon", "Castle", "Pillow", "Garden", "Compass",
    "Anchor", "Feather", "Lantern", "Marble", "Tunnel",
    "Cactus", "Bridge", "Blanket", "Chimney", "Diamond",
    "Falcon", "Glacier", "Horizon", "Inkwell", "Jasmine",
    "Kettle", "Lighthouse", "Meadow", "Nectar", "Orchard",
    "Pebble", "Quartz", "Raindrop", "Sunset", "Tornado",
    "Umbrella", "Volcano", "Walnut", "Xylophone", "Yogurt",
    "Zebra", "Acorn", "Butter", "Coral", "Dagger"
  ];

  const [wordList] = useState(() => {
    return [...WORD_BANK].sort(() => Math.random() - 0.5).slice(0, 5);
  });

  useEffect(() => {
    let timer;
    if (phase === "memorization") {
      timer = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= wordList.length - 1) {
            clearInterval(timer);
            setPhase("distraction");
            setTimeLeft(15);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    } else if (phase === "distraction" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (phase === "distraction" && timeLeft === 0) {
      setPhase("recall");
    }
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUserWords = userWords.map((w) => w.trim().toLowerCase());
    let score = 0;
    const targets = [...wordList].map((w) => w.toLowerCase());
    cleanUserWords.forEach((word) => {
      const idx = targets.indexOf(word);
      if (idx !== -1) { score++; targets[idx] = null; }
    });
    onComplete(score, wordList.length, { userWords: cleanUserWords });
  };

  const handleWordChange = (index, value) => {
    const newWords = [...userWords];
    newWords[index] = value;
    setUserWords(newWords);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {phase === "instructions" && (
          <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="text-center">
            <div className="w-16 h-16 bg-accent-blue/20 text-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🧠</div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">{t("tests.wordRecall.title")}</h2>
            <p className="text-lg text-textSecondary mb-8 max-w-md mx-auto leading-relaxed">{t("tests.wordRecall.instructions")}<br /><br />{t("tests.wordRecall.recall_instr")}</p>
            <Button onClick={() => setPhase("memorization")} className="px-10 py-4 text-lg shadow-glow-blue">{t("tests.wordRecall.ready")}</Button>
          </motion.div>
        )}
        {phase === "memorization" && (
          <motion.div key={`word-${currentWordIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
            <p className="text-textMuted font-bold tracking-widest uppercase mb-4 text-sm">{t("tests.wordRecall.memorize")}</p>
            <h3 className="text-6xl md:text-8xl font-display font-black text-white tracking-tight">{wordList[currentWordIndex]}</h3>
            <div className="mt-12 flex gap-2 justify-center">
              {wordList.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-colors duration-500 ${i === currentWordIndex ? "bg-accent-blue" : "bg-bg-elevated"}`} />
              ))}
            </div>
          </motion.div>
        )}
        {phase === "distraction" && (
          <motion.div key="distraction" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <h3 className="text-2xl font-display font-bold text-white mb-6">{t("tests.wordRecall.distraction")}</h3>
            <div className="text-7xl font-mono font-bold text-accent-purple mb-8">{timeLeft}</div>
            <p className="text-textSecondary">{t("tests.wordRecall.distraction_note")}</p>
          </motion.div>
        )}
        {phase === "recall" && (
          <motion.div key="recall" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-display font-bold text-white mb-2">{t("tests.wordRecall.recall_title")}</h3>
              <p className="text-textSecondary">{t("tests.wordRecall.recall_instr")}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {userWords.map((word, i) => (
                <div key={i} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-textMuted font-mono">{i + 1}.</div>
                  <input type="text" required className="w-full pl-14 pr-6 py-5 bg-bg-surface border border-border rounded-xl focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all text-white text-lg placeholder-textMuted" placeholder={t("tests.wordRecall.placeholder")} value={word} onChange={(e) => handleWordChange(i, e.target.value)} />
                </div>
              ))}
              <div className="pt-6">
                <Button type="submit" className="w-full py-5 text-lg shadow-glow-blue">{t("tests.wordRecall.submit")}</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 2. Pattern Recognition Test
function PatternRecognitionTest({ onComplete }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('instructions');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);

  const PATTERN_BANK = [
    { sequence: ['🔺', '🟦', '🔺', '🟦', '🔺'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🟦' },
    { sequence: ['🔴', '🔴', '🟩', '🔴', '🔴'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🟩' },
    { sequence: ['🟦', '🟩', '🔺', '🟦', '🟩'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🔺' },
    { sequence: ['🔴', '🔺', '🔴', '🔺', '🔴'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🔺' },
    { sequence: ['🟩', '🟩', '🔴', '🟩', '🟩'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🔴' },
    { sequence: ['🔺', '🔺', '🔺', '🟦', '🔺'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🔺' },
    { sequence: ['🟦', '🔴', '🟦', '🔴', '🟦'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🔴' },
    { sequence: ['🟩', '🔺', '🟩', '🔺', '🟩'], options: ['🔺', '🟦', '🔴', '🟩'], answer: '🔺' },
  ];

  const [sequenceLevels] = useState(() => {
    return [...PATTERN_BANK].sort(() => Math.random() - 0.5).slice(0, 4);
  });

  const handleSelect = (choice) => {
    let currentScore = score;
    if (choice === sequenceLevels[level].answer) { currentScore += 1; setScore(currentScore); }
    if (level < sequenceLevels.length - 1) { setLevel(level + 1); }
    else { onComplete(currentScore, sequenceLevels.length, {}); }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {phase === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="w-16 h-16 bg-accent-teal/20 text-accent-teal rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">👁️</div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">{t("tests.patternRecognition.title")}</h2>
            <p className="text-lg text-textSecondary mb-8 max-w-md mx-auto leading-relaxed">{t("tests.patternRecognition.instructions")}</p>
            <Button onClick={() => setPhase('test')} className="px-10 py-4 text-lg shadow-glow-teal">{t("tests.patternRecognition.start")}</Button>
          </motion.div>
        )}
        {phase === 'test' && (
          <motion.div key={`level-${level}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full text-center">
            <div className="flex justify-between items-center mb-8 px-4">
              <span className="text-textMuted font-bold tracking-widest uppercase text-sm">{t("tests.patternRecognition.level", { current: level + 1, total: sequenceLevels.length })}</span>
              <div className="flex gap-1">{sequenceLevels.map((_, i) => <div key={i} className={`w-8 h-1.5 rounded-full ${i <= level ? 'bg-accent-teal' : 'bg-bg-elevated'}`} />)}</div>
            </div>
            <div className="glass-panel p-10 mb-10 flex items-center justify-center gap-4 text-6xl">
              {sequenceLevels[level].sequence.map((shape, i) => <span key={i} className="drop-shadow-lg">{shape}</span>)}
              <span className="w-16 h-16 border-4 border-dashed border-border rounded-xl flex items-center justify-center text-textMuted">?</span>
            </div>
            <h3 className="text-xl font-display font-medium text-white mb-6">{t("tests.patternRecognition.prompt")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sequenceLevels[level].options.map((opt, i) => (
                <button key={i} onClick={() => handleSelect(opt)} className="bg-bg-surface hover:bg-bg-elevated border border-border hover:border-accent-teal transition-all p-6 rounded-2xl text-5xl flex items-center justify-center hover:scale-105">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 3. Number Sequence Test
function NumberSequenceTest({ onComplete }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('instructions');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);

  const SEQUENCE_BANK = [
    { sequence: [2, 4, 6, 8, '?'], answer: 10 },
    { sequence: [3, 9, 27, 81, '?'], answer: 243 },
    { sequence: [1, 4, 9, 16, '?'], answer: 25 },
    { sequence: [1, 1, 2, 3, 5, '?'], answer: 8 },
    { sequence: [5, 10, 15, 20, '?'], answer: 25 },
    { sequence: [2, 6, 18, 54, '?'], answer: 162 },
    { sequence: [100, 90, 80, 70, '?'], answer: 60 },
    { sequence: [1, 2, 4, 8, '?'], answer: 16 },
  ];

  const [sequenceLevels] = useState(() => {
    return [...SEQUENCE_BANK].sort(() => Math.random() - 0.5).slice(0, 4);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer) return;
    let currentScore = score;
    if (parseInt(userAnswer) === sequenceLevels[level].answer) { currentScore += 1; setScore(currentScore); }
    else { setError(true); setTimeout(() => setError(false), 500); }
    setUserAnswer('');
    if (level < sequenceLevels.length - 1) { setLevel(level + 1); }
    else { onComplete(currentScore, sequenceLevels.length, {}); }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {phase === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="w-16 h-16 bg-accent-purple/20 text-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">📈</div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">{t("tests.numberSequence.title")}</h2>
            <p className="text-lg text-textSecondary mb-8 max-w-md mx-auto leading-relaxed">{t("tests.numberSequence.instructions")}</p>
            <Button onClick={() => setPhase('test')} className="px-10 py-4 text-lg">{t("tests.numberSequence.start")}</Button>
          </motion.div>
        )}
        {phase === 'test' && (
          <motion.div key={`level-${level}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full text-center">
            <div className="flex justify-between items-center mb-8 px-4">
              <span className="text-textMuted font-bold tracking-widest uppercase text-sm">{t("tests.numberSequence.level", { current: level + 1, total: sequenceLevels.length })}</span>
              <div className="flex gap-1">{sequenceLevels.map((_, i) => <div key={i} className={`w-8 h-1.5 rounded-full ${i <= level ? 'bg-accent-purple' : 'bg-bg-elevated'}`} />)}</div>
            </div>
            <div className="glass-panel p-10 mb-10 flex items-center justify-center gap-6 text-4xl md:text-5xl font-mono font-bold text-white flex-wrap">
              {sequenceLevels[level].sequence.map((num, i) => (
                <span key={i} className={num === '?' ? 'text-textMuted' : ''}>{num}{i < sequenceLevels[level].sequence.length - 1 && <span className="text-border mx-2">,</span>}</span>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-4">
              <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                <input type="number" required className="w-full px-6 py-5 bg-bg-surface border border-border rounded-xl focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all text-white text-2xl font-mono text-center placeholder-textMuted" placeholder={t("tests.numberSequence.placeholder")} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} autoFocus />
              </motion.div>
              <Button type="submit" className="w-full py-4 text-lg">{t("tests.numberSequence.submit")}</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 4. Math Reasoning Test
function MathReasoningTest({ onComplete }) {
  const { t, i18n } = useTranslation();
  const [phase, setPhase] = useState('instructions');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const MATH_BANK = {
    en: [
      { q: "If you buy 3 apples for $1.50 each and pay with a $10 bill, how much change do you receive?", answer: 5.5, format: "currency" },
      { q: "Subtract 7 from 100, then subtract 7 from that result. What is the final number?", answer: 86, format: "number" },
      { q: "A train leaves at 3:15 PM and travels for 2 hours and 45 minutes. What time does it arrive?", options: ["5:00 PM", "5:45 PM", "6:00 PM", "6:15 PM"], answer: "6:00 PM", format: "mcq" },
      { q: "If a shirt costs $45 and is on sale for 20% off, what is the sale price?", answer: 36, format: "currency" },
      { q: "A car travels 60 miles per hour. How many miles does it travel in 2.5 hours?", answer: 150, format: "number" },
      { q: "If you have $200 and spend $47.50, how much do you have left?", answer: 152.5, format: "currency" },
      { q: "What is 15% of 80?", answer: 12, format: "number" },
      { q: "A recipe needs 2.5 cups of flour per batch. How many cups for 4 batches?", answer: 10, format: "number" },
    ],
    hi: [
      { q: "यदि आप 3 सेब ₹15 प्रति सेब खरीदते हैं और ₹100 देते हैं, तो आपको कितना बचेगा?", answer: 55, format: "number" },
      { q: "100 में से 7 घटाएं, फिर उस परिणाम से 7 घटाएं। अंतिम संख्या क्या है?", answer: 86, format: "number" },
      { q: "एक ट्रेन दोपहर 3:15 बजे चलती है और 2 घंटे 45 मिनट यात्रा करती है। वह कितने बजे पहुंचेगी?", options: ["5:00 बजे", "5:45 बजे", "6:00 बजे", "6:15 बजे"], answer: "6:00 बजे", format: "mcq" },
      { q: "एक शर्ट की कीमत ₹450 है और 20% छूट है। बिक्री मूल्य क्या है?", answer: 360, format: "number" },
      { q: "एक कार 60 किमी प्रति घंटे की रफ्तार से चलती है। 2.5 घंटे में कितनी दूरी तय होगी?", answer: 150, format: "number" },
      { q: "यदि आपके पास ₹200 हैं और आप ₹47.50 खर्च करते हैं, तो कितना बचेगा?", answer: 152.5, format: "number" },
      { q: "80 का 15% क्या है?", answer: 12, format: "number" },
      { q: "एक रेसिपी में प्रति बैच 2.5 कप आटा चाहिए। 4 बैच के लिए कितने कप?", answer: 10, format: "number" },
    ],
    te: [
      { q: "మీరు 3 యాపిల్స్ ₹15 చొప్పున కొని ₹100 ఇస్తే, మీకు ఎంత చిల్లర వస్తుంది?", answer: 55, format: "number" },
      { q: "100 నుండి 7 తీసివేయండి, ఆపై ఆ ఫలితం నుండి 7 తీసివేయండి. చివరి సంఖ్య ఏమిటి?", answer: 86, format: "number" },
      { q: "ఒక రైలు మధ్యాహ్నం 3:15కి బయలుదేరి 2 గంటలు 45 నిమిషాలు ప్రయాణిస్తుంది. అది ఏ సమయానికి చేరుతుంది?", options: ["5:00 గంటలకు", "5:45 గంటలకు", "6:00 గంటలకు", "6:15 గంటలకు"], answer: "6:00 గంటలకు", format: "mcq" },
      { q: "ఒక చొక్కా ధర ₹450 మరియు 20% తగ్గింపు ఉంది. అమ్మకపు ధర ఎంత?", answer: 360, format: "number" },
      { q: "ఒక కారు గంటకు 60 కి.మీ వేగంతో వెళుతుంది. 2.5 గంటల్లో ఎంత దూరం వెళుతుంది?", answer: 150, format: "number" },
      { q: "మీ దగ్గర ₹200 ఉంటే మీరు ₹47.50 ఖర్చు చేశారు. మీ దగ్గర ఎంత మిగిలింది?", answer: 152.5, format: "number" },
      { q: "80లో 15% ఎంత?", answer: 12, format: "number" },
      { q: "ఒక వంటకానికి ప్రతి బ్యాచ్‌కు 2.5 కప్పుల పిండి కావాలి. 4 బ్యాచ్‌లకు ఎన్ని కప్పులు?", answer: 10, format: "number" },
    ],
  };

  const lang = i18n.language || 'en';
  const bankKey = ['hi', 'te'].includes(lang) ? lang : 'en';

  const [questions] = useState(() => {
    return [...MATH_BANK[bankKey]].sort(() => Math.random() - 0.5).slice(0, 3);
  });

  useEffect(() => {
    let timer;
    if (phase === 'test' && timeLeft > 0) { timer = setInterval(() => setTimeLeft((t) => t - 1), 1000); }
    else if (phase === 'test' && timeLeft === 0) { handleNext(false); }
    return () => clearInterval(timer);
  }, [phase, timeLeft, level]);

  const handleNext = (isCorrect = false) => {
    let currentScore = score;
    if (isCorrect) currentScore += 1;
    setScore(currentScore);
    setUserAnswer(''); setError(false);
    if (level < questions.length - 1) { setLevel(level + 1); setTimeLeft(30); }
    else { onComplete(currentScore, questions.length, {}); }
  };

  const handleSubmitNumber = (e) => {
    e.preventDefault();
    if (!userAnswer) return;
    const isCorrect = Math.abs(parseFloat(userAnswer) - questions[level].answer) < 0.01;
    if (isCorrect) { handleNext(true); }
    else { setError(true); setTimeout(() => setError(false), 500); setUserAnswer(''); }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {phase === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🧮</div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">{t("tests.mathReasoning.title")}</h2>
            <p className="text-lg text-textSecondary mb-8 max-w-md mx-auto leading-relaxed">{t("tests.mathReasoning.instructions")}</p>
            <Button onClick={() => setPhase('test')} className="px-10 py-4 text-lg">{t("tests.mathReasoning.start")}</Button>
          </motion.div>
        )}
        {phase === 'test' && (
          <motion.div key={`level-${level}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
            <div className="flex justify-between items-center mb-8">
              <span className="text-textMuted font-bold tracking-widest uppercase text-sm">{t("tests.mathReasoning.level", { current: level + 1, total: questions.length })}</span>
              <div className={`font-mono text-xl font-bold flex items-center gap-2 ${timeLeft <= 10 ? 'text-risk-high animate-pulse' : 'text-accent-teal'}`}>⏱ 00:{timeLeft.toString().padStart(2, '0')}</div>
            </div>
            <div className="glass-panel p-8 md:p-10 mb-10">
              <h3 className="text-2xl font-display font-medium text-white leading-relaxed">"{questions[level].q}"</h3>
            </div>
            {questions[level].format === 'mcq' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[level].options.map((opt, i) => (
                  <button key={i} onClick={() => handleNext(opt === questions[level].answer)} className="bg-bg-surface border border-border hover:border-white transition-all p-6 rounded-xl text-xl text-white font-medium hover:bg-bg-elevated">{opt}</button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmitNumber} className="max-w-xs mx-auto space-y-4">
                <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="relative">
                  <input type="number" step="any" required className="w-full py-5 px-6 bg-bg-surface border border-border rounded-xl focus:border-white transition-all text-white text-2xl font-mono text-center placeholder-textMuted" placeholder={t("tests.mathReasoning.placeholder")} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} autoFocus />
                </motion.div>
                <Button type="submit" className="w-full py-4 text-lg">{t("tests.mathReasoning.submit")}</Button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 5. Reaction Time Test
function ReactionTimeTest({ onComplete }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('instructions');
  const [attempt, setAttempt] = useState(0);
  const [times, setTimes] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);
  const TOTAL_ATTEMPTS = 5;

  useEffect(() => {
    let timeout;
    if (phase === 'waiting') {
      const delay = Math.floor(Math.random() * 4000) + 2000;
      timeout = setTimeout(() => { setPhase('ready'); setStartTime(Date.now()); }, delay);
    }
    return () => clearTimeout(timeout);
  }, [phase, attempt]);

  const handleClick = () => {
    if (phase === 'waiting') { setTooEarly(true); setPhase('results'); }
    else if (phase === 'ready') {
      const reactionTime = Date.now() - startTime;
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);
      setTooEarly(false);
      if (attempt < TOTAL_ATTEMPTS - 1) { setPhase('results'); }
      else {
        const avg = Math.round(newTimes.reduce((a, b) => a + b) / newTimes.length);
        onComplete(avg, 1000, { times: newTimes, average: avg });
      }
    } else if (phase === 'results') {
      if (!tooEarly) setAttempt(attempt + 1);
      setPhase('waiting'); setTooEarly(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] h-full">
      <AnimatePresence mode="wait">
        {phase === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="w-16 h-16 bg-risk-moderate/20 text-risk-moderate rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">⚡</div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">{t("tests.reactionTime.title")}</h2>
            <p className="text-lg text-textSecondary mb-8 max-w-md mx-auto leading-relaxed">{t("tests.reactionTime.instructions")}</p>
            <Button onClick={() => setPhase('waiting')} className="px-10 py-4 text-lg">{t("tests.reactionTime.start")}</Button>
          </motion.div>
        )}
        {phase !== 'instructions' && (
          <motion.div key="sandbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex-1 flex flex-col" style={{ minHeight: '50vh' }}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-textMuted font-bold tracking-widest uppercase text-sm">{t("tests.reactionTime.attempt", { current: Math.min(attempt + 1, 5), total: TOTAL_ATTEMPTS })}</span>
              <div className="text-sm font-mono text-textMuted">{t("tests.reactionTime.avg", { avg: times.length > 0 ? Math.round(times.reduce((a, b) => a + b) / times.length) : '--' })}</div>
            </div>
            <button onMouseDown={handleClick} className={`flex-1 w-full rounded-2xl flex flex-col items-center justify-center transition-colors duration-75 cursor-pointer shadow-2xl min-h-[300px] ${phase === 'waiting' ? 'bg-risk-high' : phase === 'ready' ? 'bg-risk-low' : tooEarly ? 'bg-accent-blue/20 border-2 border-accent-blue' : 'bg-bg-surface border-2 border-border'}`}>
              <h1 className={`text-4xl md:text-6xl font-display font-bold select-none ${phase === 'ready' ? 'text-deep' : 'text-white'}`}>
                {phase === 'ready' ? <span className="flex items-center gap-4"><AlertCircle size={48} /> {t("tests.reactionTime.click")}</span>
                  : phase === 'waiting' ? t("tests.reactionTime.wait")
                    : tooEarly ? t("tests.reactionTime.tooEarly") : `${times[times.length - 1]} ms`}
              </h1>
              {phase === 'results' && !tooEarly && times.length > 0 && (
                <p className="text-textMuted mt-4 select-none text-lg">{t("tests.reactionTime.continue")}</p>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 6. Video Comprehension Test — ✅ FIXED: Questions in EN/HI/TE
function VideoComprehensionTest({ onComplete }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [phase, setPhase] = useState('instructions');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [watchedEnough, setWatchedEnough] = useState(false);

  // ✅ All questions in EN, HI and TE
  const VIDEO_POOL = [
    {
      id: 'v1',
      url: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
      title: { en: 'Forest & Animals Scene', hi: 'जंगल और जानवर', te: 'అడవి మరియు జంతువులు' },
      questions: {
        en: [
          { q: "What animal is the main character in this video?", options: ["A fox", "A large rabbit", "A squirrel", "A bear"], answer: "A large rabbit" },
          { q: "Where does this scene take place?", options: ["A desert", "A city", "A lush green forest", "An ocean"], answer: "A lush green forest" },
          { q: "How do the smaller animals behave toward the main character?", options: ["They help", "They ignore", "They tease and bother", "They run away"], answer: "They tease and bother" },
          { q: "What is the overall mood of this video?", options: ["Dark and scary", "Sad and emotional", "Bright and playful", "Tense and serious"], answer: "Bright and playful" },
          { q: "What does the main character eventually do?", options: ["Befriends them", "Chases them playfully", "Leaves the forest", "Cries and hides"], answer: "Chases them playfully" },
        ],
        hi: [
          { q: "इस वीडियो में मुख्य पात्र कौन सा जानवर है?", options: ["एक लोमड़ी", "एक बड़ा खरगोश", "एक गिलहरी", "एक भालू"], answer: "एक बड़ा खरगोश" },
          { q: "यह दृश्य कहाँ होता है?", options: ["रेगिस्तान में", "शहर में", "हरे-भरे जंगल में", "समुद्र में"], answer: "हरे-भरे जंगल में" },
          { q: "छोटे जानवर मुख्य पात्र के साथ कैसा व्यवहार करते हैं?", options: ["वे मदद करते हैं", "वे अनदेखा करते हैं", "वे छेड़ते और परेशान करते हैं", "वे भाग जाते हैं"], answer: "वे छेड़ते और परेशान करते हैं" },
          { q: "इस वीडियो का समग्र मूड क्या है?", options: ["अंधेरा और डरावना", "दुखद और भावनात्मक", "उज्ज्वल और मजेदार", "तनावपूर्ण और गंभीर"], answer: "उज्ज्वल और मजेदार" },
          { q: "मुख्य पात्र अंततः क्या करता है?", options: ["उनसे दोस्ती करता है", "उन्हें चंचलता से भगाता है", "जंगल छोड़ देता है", "रोता और छुपता है"], answer: "उन्हें चंचलता से भगाता है" },
        ],
        te: [
          { q: "ఈ వీడియోలో ప్రధాన పాత్ర ఏ జంతువు?", options: ["ఒక నక్క", "ఒక పెద్ద కుందేలు", "ఒక다람쥐", "ఒక ఎలుగుబంటి"], answer: "ఒక పెద్ద కుందేలు" },
          { q: "ఈ దృశ్యం ఎక్కడ జరుగుతుంది?", options: ["ఎడారిలో", "నగరంలో", "పచ్చని అడవిలో", "సముద్రంలో"], answer: "పచ్చని అడవిలో" },
          { q: "చిన్న జంతువులు ప్రధాన పాత్రతో ఎలా ప్రవర్తిస్తాయి?", options: ["అవి సహాయం చేస్తాయి", "అవి పట్టించుకోవు", "అవి వేధిస్తాయి మరియు ఇబ్బంది పెడతాయి", "అవి పారిపోతాయి"], answer: "అవి వేధిస్తాయి మరియు ఇబ్బంది పెడతాయి" },
          { q: "ఈ వీడియో యొక్క మొత్తం మూడ్ ఏమిటి?", options: ["చీకటిగా మరియు భయంకరంగా", "దుఃఖంగా మరియు భావోద్వేగంగా", "ప్రకాశవంతంగా మరియు సరదాగా", "ఉద్విగ్నంగా మరియు తీవ్రంగా"], answer: "ప్రకాశవంతంగా మరియు సరదాగా" },
          { q: "ప్రధాన పాత్ర చివరికి ఏమి చేస్తుంది?", options: ["వాటితో స్నేహం చేస్తుంది", "వాటిని సరదాగా తరుముతుంది", "అడవి వదిలి వెళ్తుంది", "ఏడుస్తూ దాక్కుంటుంది"], answer: "వాటిని సరదాగా తరుముతుంది" },
        ],
      },
    },
    {
      id: 'v2',
      url: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
      title: { en: 'Mechanical World', hi: 'यांत्रिक दुनिया', te: 'యాంత్రిక ప్రపంచం' },
      questions: {
        en: [
          { q: "How many main characters are in this video?", options: ["One", "Two", "Three", "Four"], answer: "Two" },
          { q: "What kind of environment do the characters explore?", options: ["A natural forest", "A mechanical and surreal world", "A city street", "An underwater cave"], answer: "A mechanical and surreal world" },
          { q: "What is the dominant color tone of the video?", options: ["Warm orange and red", "Cool blue and green", "Bright yellow", "Dark black"], answer: "Cool blue and green" },
          { q: "How would you describe the pace of the video?", options: ["Very fast", "Slow and mysterious", "Funny and comedic", "Loud and energetic"], answer: "Slow and mysterious" },
          { q: "What are the most prominent visual elements?", options: ["Trees and rivers", "Machines, gears and structures", "Buildings and roads", "People and crowds"], answer: "Machines, gears and structures" },
        ],
        hi: [
          { q: "इस वीडियो में कितने मुख्य पात्र हैं?", options: ["एक", "दो", "तीन", "चार"], answer: "दो" },
          { q: "पात्र किस प्रकार के वातावरण की खोज करते हैं?", options: ["प्राकृतिक जंगल", "यांत्रिक और अवास्तविक दुनिया", "शहर की सड़क", "पानी के नीचे गुफा"], answer: "यांत्रिक और अवास्तविक दुनिया" },
          { q: "वीडियो में प्रमुख रंग कौन से हैं?", options: ["गर्म नारंगी और लाल", "ठंडा नीला और हरा", "चमकदार पीला", "गहरा काला"], answer: "ठंडा नीला और हरा" },
          { q: "वीडियो की गति कैसी है?", options: ["बहुत तेज़", "धीमी और रहस्यमय", "मज़ेदार", "ज़ोरदार"], answer: "धीमी और रहस्यमय" },
          { q: "सबसे प्रमुख दृश्य तत्व क्या हैं?", options: ["पेड़ और नदियाँ", "मशीनें, गियर और संरचनाएं", "इमारतें और सड़कें", "लोग और भीड़"], answer: "मशीनें, गियर और संरचनाएं" },
        ],
        te: [
          { q: "ఈ వీడియోలో ఎంత మంది ప్రధాన పాత్రలు ఉన్నారు?", options: ["ఒకరు", "ఇద్దరు", "ముగ్గురు", "నలుగురు"], answer: "ఇద్దరు" },
          { q: "పాత్రలు ఏ వాతావరణాన్ని అన్వేషిస్తాయి?", options: ["సహజ అడవి", "యాంత్రిక మరియు అసాధారణ ప్రపంచం", "నగర వీధి", "నీటి అడుగున గుహ"], answer: "యాంత్రిక మరియు అసాధారణ ప్రపంచం" },
          { q: "వీడియోలో ప్రధాన రంగు టోన్ ఏమిటి?", options: ["వెచ్చని నారింజ మరియు ఎరుపు", "చల్లని నీలం మరియు ఆకుపచ్చ", "ప్రకాశవంతమైన పసుపు", "చీకటి నల్లని"], answer: "చల్లని నీలం మరియు ఆకుపచ్చ" },
          { q: "వీడియో యొక్క వేగం ఎలా ఉంది?", options: ["చాలా వేగంగా", "నెమ్మదిగా మరియు రహస్యంగా", "హాస్యంగా", "శబ్దంగా"], answer: "నెమ్మదిగా మరియు రహస్యంగా" },
          { q: "అత్యంత ప్రముఖ దృశ్య అంశాలు ఏమిటి?", options: ["చెట్లు మరియు నదులు", "యంత్రాలు, గేర్లు మరియు నిర్మాణాలు", "భవనాలు మరియు రోడ్లు", "వ్యక్తులు మరియు గుంపులు"], answer: "యంత్రాలు, గేర్లు మరియు నిర్మాణాలు" },
        ],
      },
    },
    {
      id: 'v3',
      url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      title: { en: 'High Energy Action Scene', hi: 'उच्च ऊर्जा एक्शन दृश्य', te: 'అధిక శక్తి యాక్షన్ దృశ్యం' },
      questions: {
        en: [
          { q: "What is the overall energy level of this video?", options: ["Calm and peaceful", "Moderate", "Intense and high energy", "Sad and slow"], answer: "Intense and high energy" },
          { q: "What colors dominate this video?", options: ["Blue and white", "Green and brown", "Red and orange", "Purple and gold"], answer: "Red and orange" },
          { q: "When does this scene appear to take place?", options: ["At night", "Early morning", "During daytime", "At sunset"], answer: "During daytime" },
          { q: "What type of elements are most visible?", options: ["People dancing", "Vehicles and machinery", "Animals running", "Buildings"], answer: "Vehicles and machinery" },
          { q: "Where does this scene primarily take place?", options: ["Indoors", "Underground", "Outdoors", "Underwater"], answer: "Outdoors" },
        ],
        hi: [
          { q: "इस वीडियो का समग्र ऊर्जा स्तर क्या है?", options: ["शांत और शांतिपूर्ण", "मध्यम", "तीव्र और उच्च ऊर्जा", "दुखद और धीमा"], answer: "तीव्र और उच्च ऊर्जा" },
          { q: "इस वीडियो में कौन से रंग प्रमुख हैं?", options: ["नीला और सफेद", "हरा और भूरा", "लाल और नारंगी", "बैंगनी और सोना"], answer: "लाल और नारंगी" },
          { q: "यह दृश्य कब होता है?", options: ["रात में", "सुबह जल्दी", "दिन के दौरान", "सूर्यास्त पर"], answer: "दिन के दौरान" },
          { q: "सबसे अधिक दिखाई देने वाले तत्व कौन से हैं?", options: ["नाचते लोग", "वाहन और मशीनें", "दौड़ते जानवर", "इमारतें"], answer: "वाहन और मशीनें" },
          { q: "यह दृश्य मुख्यतः कहाँ होता है?", options: ["अंदर", "भूमिगत", "बाहर", "पानी के अंदर"], answer: "बाहर" },
        ],
        te: [
          { q: "ఈ వీడియో యొక్క మొత్తం శక్తి స్థాయి ఏమిటి?", options: ["ప్రశాంతంగా", "మధ్యస్తంగా", "తీవ్రంగా మరియు అధిక శక్తితో", "దుఃఖంగా"], answer: "తీవ్రంగా మరియు అధిక శక్తితో" },
          { q: "ఈ వీడియోలో ఏ రంగులు ఆధిపత్యం చెలాయిస్తున్నాయి?", options: ["నీలం మరియు తెలుపు", "ఆకుపచ్చ మరియు గోధుమ", "ఎరుపు మరియు నారింజ", "ఊదా మరియు బంగారం"], answer: "ఎరుపు మరియు నారింజ" },
          { q: "ఈ దృశ్యం ఏ సమయంలో జరుగుతోంది?", options: ["రాత్రిపూట", "తెల్లవారుజామున", "పగటిపూట", "సూర్యాస్తమయం వేళ"], answer: "పగటిపూట" },
          { q: "అత్యధికంగా కనిపించే అంశాలు ఏమిటి?", options: ["నృత్యం చేసే వ్యక్తులు", "వాహనాలు మరియు యంత్రాలు", "పరిగెత్తే జంతువులు", "భవనాలు"], answer: "వాహనాలు మరియు యంత్రాలు" },
          { q: "ఈ దృశ్యం ప్రధానంగా ఎక్కడ జరుగుతుంది?", options: ["లోపల", "భూగర్భంలో", "బయట", "నీటి అడుగున"], answer: "బయట" },
        ],
      },
    },
    {
      id: 'v4',
      url: 'https://archive.org/download/Route_66_-_an_American_badDream/Route_66_-_an_American_badDream_512kb.mp4',
      title: { en: 'Road & Off-Road Driving', hi: 'सड़क और ऑफ-रोड ड्राइविंग', te: 'రోడ్ మరియు ఆఫ్-రోడ్ డ్రైవింగ్' },
      questions: {
        en: [
          { q: "What is the primary subject of this video?", options: ["A person walking", "A vehicle driving", "A boat sailing", "An airplane"], answer: "A vehicle driving" },
          { q: "What types of terrain does the vehicle travel on?", options: ["Only paved roads", "Only dirt paths", "Both paved roads and dirt terrain", "Only sand dunes"], answer: "Both paved roads and dirt terrain" },
          { q: "How would you describe the landscape?", options: ["Urban and crowded", "Open and natural", "Dark and stormy", "Tropical"], answer: "Open and natural" },
          { q: "What is the weather like in this video?", options: ["Rainy and cloudy", "Snowy and cold", "Clear and bright", "Foggy and dark"], answer: "Clear and bright" },
          { q: "How would you describe the speed of the vehicle?", options: ["Stationary", "Very slow", "Moderate speed", "Extremely fast"], answer: "Moderate speed" },
        ],
        hi: [
          { q: "इस वीडियो का मुख्य विषय क्या है?", options: ["एक व्यक्ति चल रहा है", "एक वाहन चल रहा है", "एक नाव चल रही है", "एक हवाई जहाज"], answer: "एक वाहन चल रहा है" },
          { q: "वाहन किस प्रकार के भूभाग पर चलता है?", options: ["केवल पक्की सड़कें", "केवल कच्चे रास्ते", "पक्की सड़क और कच्चा रास्ता दोनों", "केवल रेत के टीले"], answer: "पक्की सड़क और कच्चा रास्ता दोनों" },
          { q: "परिदृश्य का वर्णन कैसे करेंगे?", options: ["शहरी और भीड़भाड़ वाला", "खुला और प्राकृतिक", "अंधेरा और तूफानी", "उष्णकटिबंधीय"], answer: "खुला और प्राकृतिक" },
          { q: "इस वीडियो में मौसम कैसा है?", options: ["बारिश और बादल", "बर्फ और ठंड", "साफ और उज्ज्वल", "कोहरे और अंधेरे"], answer: "साफ और उज्ज्वल" },
          { q: "वाहन की गति कैसी है?", options: ["रुका हुआ", "बहुत धीमा", "मध्यम गति", "अत्यंत तेज़"], answer: "मध्यम गति" },
        ],
        te: [
          { q: "ఈ వీడియో యొక్క ప్రధాన విషయం ఏమిటి?", options: ["ఒక వ్యక్తి నడుస్తున్నాడు", "ఒక వాహనం నడుస్తోంది", "ఒక పడవ సాగుతోంది", "విమానం"], answer: "ఒక వాహనం నడుస్తోంది" },
          { q: "వాహనం ఏ రకమైన భూభాగంపై ప్రయాణిస్తుంది?", options: ["కేవలం舗 చేయబడిన రోడ్లు", "కేవలం మట్టి దారులు", "舗 చేయబడిన రోడ్లు మరియు మట్టి రెండూ", "కేవలం ఇసుక తిన్నెలు"], answer: "舗 చేయబడిన రోడ్లు మరియు మట్టి రెండూ" },
          { q: "భూదృశ్యాన్ని ఎలా వర్ణిస్తారు?", options: ["పట్టణ మరియు రద్దీగా", "విశాలంగా మరియు సహజంగా", "చీకటిగా మరియు తుఫానుగా", "ఉష్ణమండల"], answer: "విశాలంగా మరియు సహజంగా" },
          { q: "ఈ వీడియోలో వాతావరణం ఎలా ఉంది?", options: ["వర్షం మరియు మేఘాలు", "మంచు మరియు చలి", "స్వచ్ఛంగా మరియు ప్రకాశవంతంగా", "పొగమంచు మరియు చీకటి"], answer: "స్వచ్ఛంగా మరియు ప్రకాశవంతంగా" },
          { q: "వాహనం వేగాన్ని ఎలా వర్ణిస్తారు?", options: ["ఆగి ఉంది", "చాలా నెమ్మదిగా", "మధ్యస్థ వేగం", "చాలా వేగంగా"], answer: "మధ్యస్థ వేగం" },
        ],
      },
    },
    {
      id: 'v5',
      url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      title: { en: 'Outdoor Crowd Event', hi: 'बाहरी भीड़ कार्यक्रम', te: 'బహిరంగ గుంపు కార్యక్రమం' },
      questions: {
        en: [
          { q: "What is happening in this video?", options: ["A quiet park scene", "A large outdoor public event", "A private indoor meeting", "A sports game indoors"], answer: "A large outdoor public event" },
          { q: "How would you describe the crowd?", options: ["Small and quiet", "Large and lively", "No people visible", "Seated and calm"], answer: "Large and lively" },
          { q: "What time of day does this appear to be?", options: ["Night", "Early morning", "Midday with bright sunlight", "Dusk"], answer: "Midday with bright sunlight" },
          { q: "What is the atmosphere of the event?", options: ["Boring and dull", "Tense and scary", "Exciting and energetic", "Sad and emotional"], answer: "Exciting and energetic" },
          { q: "Where does this event take place?", options: ["Inside a building", "Underwater", "Outdoors in an open area", "On a rooftop"], answer: "Outdoors in an open area" },
        ],
        hi: [
          { q: "इस वीडियो में क्या हो रहा है?", options: ["एक शांत पार्क दृश्य", "एक बड़ा बाहरी सार्वजनिक कार्यक्रम", "एक निजी अंदरूनी बैठक", "एक इनडोर खेल"], answer: "एक बड़ा बाहरी सार्वजनिक कार्यक्रम" },
          { q: "भीड़ का वर्णन कैसे करेंगे?", options: ["छोटी और शांत", "बड़ी और जीवंत", "कोई लोग नहीं", "बैठे और शांत"], answer: "बड़ी और जीवंत" },
          { q: "यह दिन का कौन सा समय लगता है?", options: ["रात", "सुबह जल्दी", "दोपहर तेज धूप में", "शाम"], answer: "दोपहर तेज धूप में" },
          { q: "कार्यक्रम का माहौल कैसा है?", options: ["उबाऊ और नीरस", "तनावपूर्ण और डरावना", "रोमांचक और ऊर्जावान", "दुखद और भावनात्मक"], answer: "रोमांचक और ऊर्जावान" },
          { q: "यह कार्यक्रम कहाँ होता है?", options: ["एक इमारत के अंदर", "पानी के नीचे", "एक खुले क्षेत्र में बाहर", "छत पर"], answer: "एक खुले क्षेत्र में बाहर" },
        ],
        te: [
          { q: "ఈ వీడియోలో ఏమి జరుగుతోంది?", options: ["ప్రశాంతమైన పార్కు దృశ్యం", "పెద్ద బహిరంగ సార్వజనిక కార్యక్రమం", "ప్రైవేట్ లోపలి సమావేశం", "లోపల క్రీడా ఆట"], answer: "పెద్ద బహిరంగ సార్వజనిక కార్యక్రమం" },
          { q: "గుంపును ఎలా వర్ణిస్తారు?", options: ["చిన్నదిగా మరియు నిశ్శబ్దంగా", "పెద్దదిగా మరియు సజీవంగా", "వ్యక్తులు కనిపించడం లేదు", "కూర్చొని ప్రశాంతంగా"], answer: "పెద్దదిగా మరియు సజీవంగా" },
          { q: "ఇది రోజులో ఏ సమయంగా కనిపిస్తోంది?", options: ["రాత్రి", "తెల్లవారుజామున", "మధ్యాహ్నం తీవ్రమైన సూర్యరశ్మిలో", "సంజె"], answer: "మధ్యాహ్నం తీవ్రమైన సూర్యరశ్మిలో" },
          { q: "కార్యక్రమం యొక్క వాతావరణం ఏమిటి?", options: ["విసుగుగా మరియు నిస్తేజంగా", "ఉద్విగ్నంగా మరియు భయంకరంగా", "ఉత్తేజకరంగా మరియు శక్తివంతంగా", "దుఃఖంగా మరియు భావోద్వేగంగా"], answer: "ఉత్తేజకరంగా మరియు శక్తివంతంగా" },
          { q: "ఈ కార్యక్రమం ఎక్కడ జరుగుతుంది?", options: ["భవనం లోపల", "నీటి అడుగున", "విశాల బహిరంగ ప్రాంతంలో", "పైకప్పుపై"], answer: "విశాల బహిరంగ ప్రాంతంలో" },
        ],
      },
    },
    {
      id: 'v6',
      url: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
      title: { en: 'Nature Adventure Scene', hi: 'प्रकृति साहसिक दृश्य', te: 'ప్రకృతి సాహస దృశ్యం' },
      questions: {
        en: [
          { q: "What type of scene is shown in this video?", options: ["A quiet library", "An adventurous outdoor nature scene", "A busy city street", "A hospital room"], answer: "An adventurous outdoor nature scene" },
          { q: "What natural element is prominently featured?", options: ["Fire and lava", "Snow and ice", "Water and landscape", "Sand and desert"], answer: "Water and landscape" },
          { q: "How would you describe the movement in this video?", options: ["No movement", "Very slow", "Fast and dynamic", "Backward and confusing"], answer: "Fast and dynamic" },
          { q: "What is the lighting like throughout the video?", options: ["Dark and dim", "Natural and bright", "Artificial indoor lighting", "Flickering"], answer: "Natural and bright" },
          { q: "What emotion does this video most strongly convey?", options: ["Fear and anxiety", "Sadness and grief", "Excitement and adventure", "Boredom"], answer: "Excitement and adventure" },
        ],
        hi: [
          { q: "इस वीडियो में किस प्रकार का दृश्य दिखाया गया है?", options: ["एक शांत पुस्तकालय", "एक साहसिक बाहरी प्रकृति दृश्य", "एक व्यस्त शहर की सड़क", "एक अस्पताल का कमरा"], answer: "एक साहसिक बाहरी प्रकृति दृश्य" },
          { q: "कौन सा प्राकृतिक तत्व प्रमुखता से दिखाया गया है?", options: ["आग और लावा", "बर्फ और बर्फ", "पानी और परिदृश्य", "रेत और रेगिस्तान"], answer: "पानी और परिदृश्य" },
          { q: "इस वीडियो में गति का वर्णन कैसे करेंगे?", options: ["कोई गति नहीं", "बहुत धीमी", "तेज़ और गतिशील", "उलटा और भ्रमित करने वाला"], answer: "तेज़ और गतिशील" },
          { q: "पूरे वीडियो में प्रकाश कैसा है?", options: ["अंधेरा और मद्धम", "प्राकृतिक और उज्ज्वल", "कृत्रिम इनडोर प्रकाश", "टिमटिमाता हुआ"], answer: "प्राकृतिक और उज्ज्वल" },
          { q: "यह वीडियो किस भावना को सबसे अधिक व्यक्त करता है?", options: ["भय और चिंता", "दुख और शोक", "उत्साह और साहस", "ऊब"], answer: "उत्साह और साहस" },
        ],
        te: [
          { q: "ఈ వీడియోలో ఏ రకమైన దృశ్యం చూపించబడింది?", options: ["ప్రశాంతమైన గ్రంథాలయం", "సాహసోపేతమైన బహిరంగ ప్రకృతి దృశ్యం", "రద్దీగా ఉన్న నగర వీధి", "ఆసుపత్రి గది"], answer: "సాహసోపేతమైన బహిరంగ ప్రకృతి దృశ్యం" },
          { q: "ఏ సహజ అంశం ప్రముఖంగా చూపించబడింది?", options: ["అగ్ని మరియు లావా", "మంచు మరియు మంచు", "నీరు మరియు భూదృశ్యం", "ఇసుక మరియు ఎడారి"], answer: "నీరు మరియు భూదృశ్యం" },
          { q: "ఈ వీడియోలో కదలికను ఎలా వర్ణిస్తారు?", options: ["కదలిక లేదు", "చాలా నెమ్మదిగా", "వేగంగా మరియు చలనశీలంగా", "వెనక్కు మరియు గందరగోళంగా"], answer: "వేగంగా మరియు చలనశీలంగా" },
          { q: "వీడియో అంతటా వెలుతురు ఎలా ఉంది?", options: ["చీకటిగా మరియు మసకగా", "సహజంగా మరియు ప్రకాశవంతంగా", "కృత్రిమ లోపలి వెలుతురు", "మినుకు మినుకు మంటూ"], answer: "సహజంగా మరియు ప్రకాశవంతంగా" },
          { q: "ఈ వీడియో ఏ భావాన్ని అత్యంత బలంగా వ్యక్తం చేస్తుంది?", options: ["భయం మరియు ఆందోళన", "దుఃఖం మరియు విషాదం", "ఉత్తేజం మరియు సాహసం", "విసుగు"], answer: "ఉత్తేజం మరియు సాహసం" },
        ],
      },
    },
  ];

  const [currentVideo] = useState(() =>
    VIDEO_POOL[Math.floor(Math.random() * VIDEO_POOL.length)]
  );

  // ✅ Get questions based on current language
  const getLangKey = () => {
    if (lang === 'hi') return 'hi';
    if (lang === 'te') return 'te';
    return 'en';
  };

  const currentQuestions = currentVideo.questions[getLangKey()];
  const currentTitle = currentVideo.title[getLangKey()];

  const handleTimeUpdate = (e) => {
    if (e.target.currentTime >= 10) setWatchedEnough(true);
  };

  const handleProceedToQuestions = () => setPhase('questions');

  const handleAnswer = (choice) => {
    let currentScore = score;
    if (choice === currentQuestions[currentQIndex].answer) {
      currentScore += 1;
      setScore(currentScore);
    }
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      onComplete(currentScore, currentQuestions.length, { videoId: currentVideo.id });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {phase === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="w-16 h-16 bg-risk-high/20 text-risk-high rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🎬</div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">{t("tests.videoComprehension.title")}</h2>
            <p className="text-lg text-textSecondary mb-8 max-w-xl mx-auto leading-relaxed">{t("tests.videoComprehension.instructions")}</p>
            <Button onClick={() => setPhase('video')} className="px-10 py-4 text-lg bg-risk-high text-white border-0">{t("tests.videoComprehension.start")}</Button>
          </motion.div>
        )}

        {phase === 'video' && (
          <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
            <div className="flex justify-between w-full mb-4 items-center">
              <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                <Eye size={18} className="text-risk-high" /> {currentTitle}
              </h3>
              {watchedEnough && (
                <Button onClick={handleProceedToQuestions} className="bg-white text-deep text-sm py-2 px-4">
                  {t("tests.videoComprehension.watchedBtn")}
                </Button>
              )}
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-2xl relative">
              {!videoReady && !videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#050714]">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-accent-teal rounded-full animate-spin mb-4" />
                  <p className="text-textSecondary text-sm font-mono">{t("tests.videoComprehension.loading")}</p>
                </div>
              )}
              {videoError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-bg-surface text-center">
                  <AlertCircle size={40} className="text-risk-moderate mb-4" />
                  <h4 className="text-xl font-bold text-white mb-3">{t("tests.videoComprehension.errorTitle") || "Video unavailable — you can still answer the questions"}</h4>
                  <Button onClick={handleProceedToQuestions} className="mt-8">{t("tests.videoComprehension.errorBtn") || "Answer Questions"}</Button>
                </div>
              ) : (
                <video key={currentVideo.url} className="w-full h-full object-cover" controls
                  onCanPlay={() => setVideoReady(true)}
                  onError={() => { setVideoError(true); setVideoReady(true); setWatchedEnough(true); }}
                  onTimeUpdate={handleTimeUpdate}>
                  <source src={currentVideo.url} type="video/mp4" />
                </video>
              )}
            </div>

            {!watchedEnough && !videoError && (
              <div className="w-full mt-4">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 10, ease: "linear" }}
                    className="h-full bg-risk-high" onAnimationComplete={() => setWatchedEnough(true)} />
                </div>
                <p className="text-textMuted text-xs mt-2 text-center uppercase tracking-widest">
                  {t("tests.videoComprehension.watchNote") || "Watch at least 30 seconds before proceeding"}
                </p>
              </div>
            )}

            {watchedEnough && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                <Button onClick={handleProceedToQuestions} className="px-10 py-4 text-lg bg-risk-high text-white border-0">
                  {t("tests.videoComprehension.proceedBtn")}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'questions' && (
          <motion.div key={`q-${currentQIndex}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full text-center">
            <div className="flex justify-between items-center mb-12 px-4 max-w-2xl mx-auto">
              <div>
                <span className="text-textMuted font-bold tracking-widest uppercase text-xs block mb-1">{currentTitle}</span>
                <span className="text-white font-display font-bold">
                  {t("tests.videoComprehension.level", { current: currentQIndex + 1, total: currentQuestions.length })}
                </span>
              </div>
              <div className="flex gap-1.5">
                {currentQuestions.map((_, i) => (
                  <div key={i} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${i <= currentQIndex ? 'bg-risk-high' : 'bg-bg-elevated'}`} />
                ))}
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-12 leading-tight max-w-3xl mx-auto">
              {currentQuestions[currentQIndex].q}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {currentQuestions[currentQIndex].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)}
                  className="bg-bg-surface hover:bg-bg-elevated border border-border hover:border-risk-high transition-all p-6 rounded-2xl text-lg text-white font-medium text-left flex items-center gap-4 group">
                  <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-risk-high font-mono text-sm group-hover:bg-risk-high group-hover:text-white transition-colors shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Wrapper ---
export default function AssessmentWrapper() {
  const { t } = useTranslation();
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);

  const moduleConfig = {
    "word-recall": { title: t("tests.wordRecall.title"), component: WordRecallTest },
    "pattern-recognition": { title: t("tests.patternRecognition.title"), component: PatternRecognitionTest },
    "number-sequence": { title: t("tests.numberSequence.title"), component: NumberSequenceTest },
    "math-reasoning": { title: t("tests.mathReasoning.title"), component: MathReasoningTest },
    "reaction-time": { title: t("tests.reactionTime.title"), component: ReactionTimeTest },
    "video-test": { title: t("tests.videoComprehension.title"), component: VideoComprehensionTest },
  };

  const TestComponent = moduleConfig[moduleId]?.component;

  const handleTestComplete = (score, outOf, details) => {
    setIsFinishing(true);
    const percentage = Math.round((score / outOf) * 100);
    const resultData = { score: percentage, rawScore: score, outOf, completedAt: Date.now(), details };
    localStorage.setItem(`result_${moduleId.replace(/-/g, "")}`, JSON.stringify(resultData));
    localStorage.setItem(`test_${moduleId}_done`, "true");
    setTimeout(() => navigate("/hub"), 2000);
  };

  const handleQuit = () => {
    if (window.confirm(t("nav.confirmQuit") || "Are you sure you want to quit?")) {
      navigate("/hub");
    }
  };

  if (!TestComponent) {
    return <div className="min-h-screen bg-deep text-white flex items-center justify-center">{t("tests.notFound") || "Test not found."}</div>;
  }

  return (
    <div className="min-h-screen bg-deep text-textPrimary flex flex-col font-body relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-bg-surface to-transparent opacity-50 pointer-events-none" />
      <header className="px-6 py-4 flex justify-between items-center border-b border-border bg-deep/80 backdrop-blur-md z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-risk-moderate animate-pulse" />
          <span className="font-semibold text-white tracking-wide">{moduleConfig[moduleId]?.title}</span>
        </div>
        <button onClick={handleQuit} className="p-2 text-textMuted hover:text-white hover:bg-bg-elevated rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
          <X size={18} /> {t("nav.quitTest")}
        </button>
      </header>
      <main className="flex-1 overflow-y-auto w-full relative z-10 p-6 md:p-12 flex items-center justify-center">
        {isFinishing ? (
          <FadeUp className="text-center">
            <div className="w-16 h-16 border-4 border-accent-teal/30 border-t-accent-teal rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold text-white mb-2">{t("hub.analyzing")}</h2>
            <p className="text-textSecondary">{t("hub.saving")}</p>
          </FadeUp>
        ) : (
          <TestComponent onComplete={handleTestComplete} />
        )}
      </main>
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="h-full bg-accent-teal w-1/3 shadow-glow-teal" />
      </div>
    </div>
  );
}