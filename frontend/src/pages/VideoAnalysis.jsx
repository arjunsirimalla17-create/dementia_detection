import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from 'face-api.js';
import {
  Video, Play, Eye, Activity, Smile, Layout, ShieldAlert, Cpu
} from 'lucide-react';
import Button from '../components/ui/Button';
import FadeUp from '../components/animations/FadeUp';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';

const getSignalCards = (t) => [
  { id: 'blinks', icon: <Eye size={18} />, title: t('tests.videoAnalysis.cards.blinks.title'), desc: t('tests.videoAnalysis.cards.blinks.desc') },
  { id: 'tremors', icon: <Activity size={18} />, title: t('tests.videoAnalysis.cards.tremors.title'), desc: t('tests.videoAnalysis.cards.tremors.desc') },
  { id: 'expressions', icon: <Smile size={18} />, title: t('tests.videoAnalysis.cards.expressions.title'), desc: t('tests.videoAnalysis.cards.expressions.desc') },
  { id: 'asymmetry', icon: <Layout size={18} />, title: t('tests.videoAnalysis.cards.asymmetry.title'), desc: t('tests.videoAnalysis.cards.asymmetry.desc') },
];

export default function VideoAnalysis() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const SIGNAL_CARDS = getSignalCards(t);
  const [phase, setPhase] = useState('setup');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showStimulus, setShowStimulus] = useState(false);
  const [results, setResults] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionInterval = useRef(null);
  const streamRef = useRef(null);

  const stats = useRef({
    blinks: 0,
    tremorValue: 0,
    expressions: {},
    asymmetry: 0,
    frames: 0,
    lastNoseX: null,
    lastNoseY: null,
    isBlinking: false,
  });

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
      }
    };
    loadModels();

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (recognitionInterval.current) clearInterval(recognitionInterval.current);
    };
  }, []);

  useEffect(() => {
    if (phase === 'recording') {
      const timer = setTimeout(() => {
        if (!streamRef.current || !videoRef.current) return;
        videoRef.current.play().catch(err => console.error("Video play error:", err));

        videoRef.current.onloadedmetadata = () => {
          recognitionInterval.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState !== 4) return;
            try {
              const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

              if (detections) {
                stats.current.frames++;
                const landmarks = detections.landmarks;
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();

                const calcEAR = (eye) => {
                  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
                  return (d(eye[1], eye[5]) + d(eye[2], eye[4])) / (2 * d(eye[0], eye[3]));
                };
                const ear = (calcEAR(leftEye) + calcEAR(rightEye)) / 2;
                if (ear < 0.22 && !stats.current.isBlinking) {
                  stats.current.isBlinking = true;
                  stats.current.blinks++;
                } else if (ear >= 0.22) {
                  stats.current.isBlinking = false;
                }

                const nose = landmarks.positions[30];
                const leX = Math.abs(landmarks.positions[36].x - nose.x);
                const reX = Math.abs(landmarks.positions[45].x - nose.x);
                const lmX = Math.abs(landmarks.positions[48].x - nose.x);
                const rmX = Math.abs(landmarks.positions[54].x - nose.x);
                const eyeAsym = Math.abs(leX - reX) / ((leX + reX) / 2 + 0.001);
                const mouthAsym = Math.abs(lmX - rmX) / ((lmX + rmX) / 2 + 0.001);
                stats.current.asymmetry += (eyeAsym + mouthAsym) / 2;

                if (stats.current.lastNoseX !== null) {
                  const dx = nose.x - stats.current.lastNoseX;
                  const dy = nose.y - stats.current.lastNoseY;
                  stats.current.tremorValue += Math.sqrt(dx * dx + dy * dy);
                }
                stats.current.lastNoseX = nose.x;
                stats.current.lastNoseY = nose.y;

                const exp = detections.expressions;
                Object.keys(exp).forEach(key => {
                  stats.current.expressions[key] = (stats.current.expressions[key] || 0) + exp[key];
                });
              }
            } catch (_) { }
          }, 200);
        };
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    let timer;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          const next = t - 1;
          if (next === 15) setShowStimulus(true);
          if (next === 13) setShowStimulus(false);
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      stats.current = {
        blinks: 0, tremorValue: 0, expressions: {}, asymmetry: 0,
        frames: 0, lastNoseX: null, lastNoseY: null, isBlinking: false,
      };
      setTimeLeft(30);
      setIsRecording(true);
      setPhase('recording');
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Please allow camera access to proceed.");
    }
  };

  const handleFinish = () => {
    setIsRecording(false);
    clearInterval(recognitionInterval.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setPhase('analyzing');

    setTimeout(() => {
      const frames = stats.current.frames || 1;

      const blinksPerMin = (stats.current.blinks / 30) * 60;
      let blinkScore;
      if (blinksPerMin >= 10 && blinksPerMin <= 22) blinkScore = 100;
      else if (blinksPerMin >= 6) blinkScore = 65;
      else if (blinksPerMin >= 3) blinkScore = 35;
      else blinkScore = 15;

      const avgTremor = stats.current.tremorValue / frames;
      const tremorScore = Math.max(0, Math.min(100, Math.round(100 - (avgTremor - 3) * 5)));

      const avgAsym = stats.current.asymmetry / frames;
      const asymmetryScore = Math.max(0, Math.min(100, Math.round(100 - avgAsym * 200)));

      const expEntries = Object.entries(stats.current.expressions);
      const dominantExp = expEntries.length > 0
        ? expEntries.sort((a, b) => b[1] - a[1])[0][0]
        : 'neutral';
      const posExp = (stats.current.expressions['happy'] || 0) + (stats.current.expressions['surprised'] || 0);
      const meanPos = posExp / frames;
      const flatAffectScore = Math.min(100, Math.round(meanPos * 300));

      const composite = Math.round(
        flatAffectScore * 0.25 + blinkScore * 0.25 +
        tremorScore * 0.25 + asymmetryScore * 0.25
      );
      const riskLevel = composite >= 70 ? 'Low' : composite >= 45 ? 'Moderate' : 'High';

      const resultData = {
        score: composite, rawScore: composite, outOf: 100, riskLevel,
        completedAt: new Date().toISOString(),
        signals: { flatAffect: flatAffectScore, blinkRate: blinkScore, headStability: tremorScore, facialSymmetry: asymmetryScore },
        details: {
          blinksPerMin: Math.round(blinksPerMin),
          tremorPx: Math.round(avgTremor * 10) / 10,
          avgAsymmetry: Math.round(avgAsym * 1000) / 1000,
          dominantExpression: dominantExp,
          framesAnalyzed: frames,
        },
      };

      localStorage.setItem('result_videoanalysis', JSON.stringify(resultData));
      localStorage.setItem('test_videoanalysis_done', 'true');
      setResults(resultData);
      setPhase('results');
    }, 2000);
  };

  const signalBadge = (score) =>
    score >= 70 ? { label: 'Normal', color: 'text-risk-low' }
      : score >= 45 ? { label: 'Mild concern', color: 'text-risk-moderate' }
        : { label: 'Flagged', color: 'text-risk-high' };

  return (
    <div className="min-h-screen bg-deep flex text-textPrimary font-body">
      <Sidebar user={{ name: 'User' }} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-4xl relative z-10">
          <AnimatePresence mode="wait">

            {/* Setup */}
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-accent-blue/10 text-accent-blue rounded-3xl border border-accent-blue/20 flex items-center justify-center mx-auto mb-8 shadow-glow-blue rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Video size={40} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-black text-white mb-4 tracking-tight">
                  {t('tests.videoAnalysis.title')}
                </h1>
                <p className="text-textSecondary text-lg max-w-2xl mx-auto mb-12">
                  {t('tests.videoAnalysis.setupDesc')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
                  {SIGNAL_CARDS.map(card => (
                    <Card key={card.id} className="p-5 flex items-start gap-4 bg-white/5 border-white/10 group hover:border-accent-blue/30 transition-colors">
                      <div className="p-3 bg-bg-surface rounded-xl text-accent-teal group-hover:text-accent-blue transition-colors">
                        {card.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">{card.title}</h4>
                        <p className="text-xs text-textMuted leading-relaxed">{card.desc}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  onClick={handleStart}
                  disabled={!modelsLoaded}
                  className="px-12 py-5 text-lg shadow-glow-blue rounded-2xl group"
                >
                  {modelsLoaded ? (
                    <><Play size={20} className="mr-2 inline group-hover:scale-110 transition-transform" />{t('tests.videoAnalysis.init')}</>
                  ) : (
                    <><Cpu size={20} className="mr-2 inline animate-spin" />{t('tests.videoAnalysis.loadingModels')}</>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Recording */}
            {phase === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-high opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-risk-high"></span>
                    </span>
                    <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">{t('tests.videoAnalysis.live')}</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white bg-bg-surface px-4 py-1 rounded-lg border border-white/10">
                    00:{timeLeft.toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      if (el && streamRef.current) {
                        el.srcObject = streamRef.current;
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute inset-0 pointer-events-none border-[1px] border-accent-blue/20 opacity-30">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-accent-blue/20" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-accent-blue/20" />
                  </div>
                  <AnimatePresence>
                    {showStimulus && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400 rounded-full shadow-[0_0_50px_rgba(250,204,21,0.6)] flex items-center justify-center"
                      >
                        <span className="text-black font-black text-xs uppercase tracking-widest text-center px-4">{t('tests.videoAnalysis.focus')}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-full mt-8">
                  <div className="flex justify-between text-xs font-bold text-textMuted uppercase mb-2">
                    <span>{t('tests.videoAnalysis.recordingProgress')}</span>
                    <span>{Math.round(((30 - timeLeft) / 30) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
                      className="h-full bg-gradient-to-r from-accent-blue to-accent-teal"
                    />
                  </div>
                </div>
                <p className="mt-8 text-textSecondary text-center max-w-lg italic font-medium">
                  {t('tests.videoAnalysis.instructions')}
                </p>
              </motion.div>
            )}

            {/* Analyzing */}
            {phase === 'analyzing' && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="w-32 h-32 border-4 border-t-accent-teal border-white/10 rounded-full animate-spin mx-auto mb-10 shadow-glow-teal" />
                <h2 className="text-3xl font-display font-bold text-white mb-4">{t('tests.videoAnalysis.analyzing')}</h2>
                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="h-full w-1/3 bg-accent-teal"
                    />
                  </div>
                  <p className="text-textMuted text-sm font-mono tracking-widest uppercase">{t('tests.videoAnalysis.processingTensors')}</p>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {phase === 'results' && results && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                  <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                      <motion.circle
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                        strokeLinecap="round" strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (results.score / 100) * 283 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="text-accent-teal"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-display font-black text-white">{results.score}</span>
                      <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">/ 100</span>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-display font-black text-white mb-2">{t('tests.videoAnalysis.diagnosticSummary')}</h2>
                    <p className="text-textSecondary text-lg max-w-xl">
                      {t('results.biometricBreakdown')} complete across {results.details.framesAnalyzed} frames. {t('common.score')}:{' '}
                      <span className={results.riskLevel === 'Low' ? 'text-risk-low font-bold' : results.riskLevel === 'Moderate' ? 'text-risk-moderate font-bold' : 'text-risk-high font-bold'}>
                        {results.riskLevel}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: t('tests.videoAnalysis.signals.flatAffect'), key: 'flatAffect', sub: 'Affect range' },
                    { label: t('hub.modules.reactionTime.title'), key: 'blinkRate', sub: `${results.details.blinksPerMin}/min` },
                    { label: t('tests.videoAnalysis.signals.headStability'), key: 'headStability', sub: `${results.details.tremorPx}px variance` },
                    { label: t('tests.videoAnalysis.signals.facialSymmetry'), key: 'facialSymmetry', sub: `Index: ${results.details.avgAsymmetry}` },
                  ].map(({ label, key, sub }) => {
                    const score = results.signals[key];
                    const badge = signalBadge(score);
                    return (
                      <Card key={key} className="p-6 bg-white/5 hover:bg-white/10 border-white/10 transition-colors">
                        <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-3 block">{label}</span>
                        <div className="text-3xl font-bold text-white mb-1">{score}</div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full rounded-full ${score >= 70 ? 'bg-risk-low' : score >= 45 ? 'bg-risk-moderate' : 'bg-risk-high'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>{badge.label}</p>
                        <p className="text-[10px] text-textMuted mt-0.5">{sub}</p>
                      </Card>
                    );
                  })}
                </div>

                <Card className="p-8 mb-10 bg-gradient-to-br from-risk-low/10 to-transparent border-risk-low/20">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-risk-low/20 text-risk-low rounded-2xl flex items-center justify-center">
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">
                        {results.riskLevel === 'Low' ? t('tests.videoAnalysis.riskLow') :
                          results.riskLevel === 'Moderate' ? t('tests.videoAnalysis.riskModerate') :
                            t('tests.videoAnalysis.riskHigh')}
                      </h4>
                      <p className="text-textSecondary text-sm max-w-2xl">
                        This is a cognitive screening tool only and does not constitute a medical diagnosis.
                        Please consult a neurologist for clinical assessment.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-center gap-4">
                  <Button onClick={() => setPhase('setup')} variant="ghost" className="px-10 border-white/10 hover:bg-white/5">
                    {t('tests.videoAnalysis.retake')}
                  </Button>
                  <Button onClick={() => navigate('/hub')} className="px-10 shadow-glow-teal">
                    {t('tests.videoAnalysis.complete')}
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