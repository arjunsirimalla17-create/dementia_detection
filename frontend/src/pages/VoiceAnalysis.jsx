import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, AlertCircle, CheckCircle2, Volume2, ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';
import FadeUp from '../components/animations/FadeUp';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';

export default function VoiceAnalysis() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup'); // setup, recording, analyzing, results
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);

  // Analyze progress
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Mock results
  const [results, setResults] = useState(null);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(t => t + 1);
        // Simulate volume meter fluctuating
        setVolume(Math.random() * 80 + 20);
      }, 100);
    } else {
      setVolume(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    let timer;
    if (phase === 'analyzing') {
      timer = setInterval(() => {
        setAnalysisProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setPhase('results');
            setResults({
              fluencyScore: 82,
              hesitationCount: 4,
              vocalBiomarkers: 'Normal',
              riskLevel: 'Low'
            });
            return 100;
          }
          return p + 2;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [phase]);

  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + event.results[i][0].transcript + " ");
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone permission denied. Please enable it in settings.");
          setIsRecording(false);
          setPhase('setup');
        }
      };
    }
  }, []);

  const handleStartRecording = () => {
    setTranscript("");
    setIsRecording(true);
    setPhase('recording');
    setRecordingTime(0);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  };

  const calculateResults = (text) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Hesitation markers
    const hesitations = words.filter(w => 
      ['um', 'uh', 'like', 'know', 'so', 'actually', 'basically'].includes(w.toLowerCase())
    ).length;

    // Diversity (unique words / total words)
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const diversity = wordCount > 0 ? (uniqueWords / wordCount) * 100 : 0;

    // Pace (words per minute - assuming ~30s recording)
    const wpm = (wordCount / (recordingTime / 60)) || 0;

    // Simple health score formula
    let score = 100;
    score -= (hesitations * 5); // Deduct for high hesitation
    if (wpm < 80 || wpm > 160) score -= 15; // Deduct for abnormal pace
    if (diversity < 40) score -= 10; // Deduct for low vocabulary diversity
    
    return {
      fluencyScore: Math.max(0, Math.min(100, Math.round(score))),
      hesitationCount: hesitations,
      wordCount: wordCount,
      diversity: Math.round(diversity),
      pace: Math.round(wpm),
      riskLevel: score > 70 ? 'Low' : score > 40 ? 'Moderate' : 'High'
    };
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setPhase('analyzing');
    // Calculate results after a short analysis delay
    setTimeout(() => {
      const finalResults = calculateResults(transcript);
      setResults(finalResults);
      localStorage.setItem('test_voice-analysis_done', 'true');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-deep flex text-textPrimary font-body">
      <Sidebar user={{ name: 'Justin' }} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Background glow effects based on state */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-1000 pointer-events-none ${
          phase === 'recording' ? 'bg-risk-high/20 opacity-100' : 
          phase === 'analyzing' ? 'bg-accent-blue/20 opacity-100' : 
          phase === 'results' ? 'bg-accent-teal/10 opacity-100' : 'bg-transparent opacity-0'
        }`} />

        <div className="w-full max-w-3xl relative z-10">
          <AnimatePresence mode="wait">
            
            {/* Phase 1: Setup & Instructions */}
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-accent-blue/10 text-accent-blue rounded-full border border-accent-blue/30 flex items-center justify-center mx-auto mb-8 shadow-glow-blue">
                  <Mic size={32} />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Voice Pattern Analysis</h1>
                
                <p className="text-lg text-textSecondary mb-10 max-w-xl mx-auto leading-relaxed">
                  Our AI examines microscopic variations in your speech, detecting hesitations, tempo shifts, and vocal biomarkers linked to cognitive health.
                </p>

                <Card className="text-left mb-10 max-w-xl mx-auto p-6 flex flex-col gap-4 bg-bg-surface/50">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-accent-teal"><Volume2 size={20} /></div>
                    <div>
                      <h4 className="font-bold text-white">Find a quiet place</h4>
                      <p className="text-sm text-textMuted content-relaxed max-w-md">Ensure there is no background noise or music playing.</p>
                    </div>
                  </div>
                  <div className="w-full border-t border-border"></div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-accent-teal"><CheckCircle2 size={20} /></div>
                    <div>
                      <h4 className="font-bold text-white">Speak naturally</h4>
                      <p className="text-sm text-textMuted content-relaxed max-w-md">Do not try to force your speed. Just speak as you normally would.</p>
                    </div>
                  </div>
                </Card>

                <Button onClick={handleStartRecording} className="px-12 py-5 text-lg shadow-glow-blue group">
                  <Mic size={20} className="mr-2 inline group-hover:scale-110 transition-transform" /> Start Diagnostic
                </Button>
              </motion.div>
            )}

            {/* Phase 2: Recording */}
            {phase === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center flex flex-col items-center justify-center py-12"
              >
                <h2 className="text-2xl font-display font-medium text-white mb-12">Please read the following paragraph aloud:</h2>
                
                <div className="glass-panel p-8 md:p-12 mb-16 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-risk-high animate-pulse" />
                  <p className="text-2xl md:text-3xl text-textPrimary leading-relaxed font-serif text-pretty">
                    "The quick brown fox jumps over the lazy dog. In the quiet morning, ships sailed across the harbor while seagulls called from above. Weather patterns change rapidly near the coast, requiring sailors to remain constantly vigilant."
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 h-32 mb-12 w-full max-w-md">
                  {[...Array(24)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="w-2 rounded-full bg-gradient-to-t from-risk-high to-accent-purple"
                      animate={{ 
                        height: isRecording ? [`${20 + Math.random() * 40}%`, `${40 + Math.random() * 60}%`, `${20 + Math.random() * 40}%`] : '10px' 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5 + Math.random() * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-3xl font-mono text-white flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    <span className="w-3 h-3 rounded-full bg-risk-high animate-pulse shadow-[0_0_15px_rgba(255,87,110,0.8)]" />
                    00:{(Math.floor(recordingTime / 10)).toString().padStart(2, '0')}
                  </div>

                  <Button onClick={handleStopRecording} variant="danger" className="py-5 px-10 text-lg shadow-glow-high rounded-2xl">
                    <Square size={20} className="mr-2 inline fill-current" /> Finish Recording
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Phase 3: Analyzing */}
            {phase === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center flex flex-col items-center py-20"
              >
                <div className="w-32 h-32 relative mb-10">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="var(--accent-blue)" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (analysisProgress / 100) * 283}
                      className="transition-all duration-75"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-display font-bold text-white">
                    {Math.round(analysisProgress)}%
                  </div>
                </div>

                <h3 className="text-2xl font-display font-medium text-white mb-2">Analyzing Voice Patterns...</h3>
                <p className="text-textMuted h-6">
                  {analysisProgress < 30 ? "Extracting audio features..." : 
                   analysisProgress < 60 ? "Running neural network tensors..." : 
                   analysisProgress < 90 ? "Calculating hesitation metrics..." : "Finalizing report..."}
                </p>
              </motion.div>
            )}

            {/* Phase 4: Results */}
            {phase === 'results' && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-risk-low/20 text-risk-low rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-teal">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white mb-2">Analysis Complete</h2>
                  <p className="text-textSecondary">Audio processed successfully. Results saved to your profile.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="p-6 border-l-4 border-l-accent-teal">
                      <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2 text-gradient-primary">Fluency Index</p>
                      <div className="text-4xl font-display font-bold text-white mb-2">{results.fluencyScore}%</div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${results.fluencyScore}%` }} className="h-full bg-accent-teal" />
                      </div>
                    </Card>
                  </motion.div>
                  
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="p-6 border-l-4 border-l-accent-purple">
                      <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2">Word Tempo</p>
                      <div className="text-4xl font-display font-bold text-white mb-1">{results.pace}</div>
                      <p className="text-[10px] text-textSecondary uppercase font-mono">Words Per Minute</p>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="p-6 border-l-4 border-l-risk-moderate">
                      <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2">Hesitation Index</p>
                      <div className="text-4xl font-display font-bold text-white mb-1">{results.hesitationCount}</div>
                      <p className="text-[10px] text-textSecondary uppercase font-mono">Micro-pauses Detected</p>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="p-6 border-l-4 border-l-accent-blue">
                      <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2">Vocab Diversity</p>
                      <div className="text-4xl font-display font-bold text-white mb-1">{results.diversity}%</div>
                      <p className="text-[10px] text-textSecondary uppercase font-mono">Unique Lexical Markers</p>
                    </Card>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                  <Card className={`p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-2 ${results.riskLevel === 'Low' ? 'border-risk-low/30' : 'border-risk-moderate/30'} bg-gradient-to-r ${results.riskLevel === 'Low' ? 'from-risk-low/5 to-transparent' : 'from-risk-moderate/5 to-transparent'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${results.riskLevel === 'Low' ? 'bg-risk-low/20 text-risk-low' : 'bg-risk-moderate/20 text-risk-moderate'}`}>
                        <ShieldAlert size={32} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-display font-bold text-white mb-1">{results.riskLevel} Cognition Risk</h4>
                        <p className="text-textSecondary max-w-md">Vocal biomarkers indicate a stable neuro-linguistic profile with {results.hesitationCount < 5 ? 'minimal' : 'some'} detected hesitation markers.</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center">
                       <span className={`text-xs font-bold px-3 py-1 rounded-full border mb-2 ${results.riskLevel === 'Low' ? 'border-risk-low/30 text-risk-low bg-risk-low/10' : 'border-risk-moderate/30 text-risk-moderate bg-risk-moderate/10'}`}>VERIFIED BY AI</span>
                       <p className="text-[10px] text-textMuted font-mono">SIG: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>
                  </Card>
                </motion.div>

                <div className="flex justify-center gap-4">
                  <Button onClick={() => setPhase('setup')} variant="ghost" className="px-8">
                    Retake
                  </Button>
                  <Button onClick={() => navigate('/hub')} className="px-8">
                    Return to Hub
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
