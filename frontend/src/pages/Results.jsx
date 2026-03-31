import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import RiskMeter from '../components/ui/RiskMeter';
import FadeUp from '../components/animations/FadeUp';
import Button from '../components/ui/Button';
import { Download, Share2, Printer, AlertTriangle, Info, CheckCircle2, ChevronRight, Activity, Brain, FileText, Copy, Check } from 'lucide-react';

export default function Results() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({ name: "User" });
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const getResult = (id) => {
    const raw = localStorage.getItem(`result_${id.replace("-", "")}`);
    return raw ? JSON.parse(raw) : null;
  };

  const results = {
    wordRecall: getResult("word-recall"),
    patternRecognition: getResult("pattern-recognition"),
    numberSequence: getResult("number-sequence"),
    mathReasoning: getResult("math-reasoning"),
    reactionTime: getResult("reaction-time"),
    videoTest: getResult("video-test"),
    voiceAnalysis: getResult("voice-analysis") || { score: 75 }
  };

  const scores = Object.values(results).filter(r => r).map(r => r.score);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const overallRisk = Math.max(0, 100 - Math.round(avgScore));
  const riskCategory = overallRisk > 55 ? t("results.highRisk") : overallRisk > 25 ? t("results.moderateRisk") : t("results.lowRisk");
  const riskColor = overallRisk > 55 ? 'text-risk-high' : overallRisk > 25 ? 'text-risk-moderate' : 'text-risk-low';

  const reportData = {
    date: new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'te-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    patientId: 'PT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    overallRisk,
    riskCategory,
    color: riskColor,
    modules: [
      { name: t("tests.wordRecall.title"), score: results.wordRecall ? `${results.wordRecall.score}%` : 'N/A', status: results.wordRecall?.score > 80 ? 'good' : results.wordRecall?.score > 50 ? 'warning' : 'critical', detail: results.wordRecall ? t("hub.modules.wordRecall.desc") : 'Not completed' },
      { name: t("tests.patternRecognition.title"), score: results.patternRecognition ? `${results.patternRecognition.score}%` : 'N/A', status: results.patternRecognition?.score > 80 ? 'good' : results.patternRecognition?.score > 50 ? 'warning' : 'critical', detail: results.patternRecognition ? t("hub.modules.patternRecognition.desc") : 'Not completed' },
      { name: t("tests.numberSequence.title"), score: results.numberSequence ? `${results.numberSequence.score}%` : 'N/A', status: results.numberSequence?.score > 80 ? 'good' : results.numberSequence?.score > 50 ? 'warning' : 'critical', detail: results.numberSequence ? t("hub.modules.numberSequence.desc") : 'Not completed' },
      { name: t("tests.mathReasoning.title"), score: results.mathReasoning ? `${results.mathReasoning.score}%` : 'N/A', status: results.mathReasoning?.score > 80 ? 'good' : results.mathReasoning?.score > 50 ? 'warning' : 'critical', detail: results.mathReasoning ? t("hub.modules.mathReasoning.desc") : 'Not completed' },
      { name: t("tests.reactionTime.title"), score: results.reactionTime ? `${results.reactionTime.score}%` : 'N/A', status: results.reactionTime?.score > 80 ? 'good' : results.reactionTime?.score > 50 ? 'warning' : 'critical', detail: results.reactionTime ? t("hub.modules.reactionTime.desc") : 'Not completed' },
      { name: t("tests.videoComprehension.title"), score: results.videoTest ? `${results.videoTest.score}%` : 'N/A', status: results.videoTest?.score > 80 ? 'good' : results.videoTest?.score > 50 ? 'warning' : 'critical', detail: results.videoTest ? t("hub.modules.videoComprehension.desc") : 'Not completed' },
    ]
  };

  // ✅ PRINT FUNCTION
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NeuroLoop Clinical Report - ${user.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
          h1 { font-size: 28px; margin-bottom: 4px; }
          h2 { font-size: 20px; margin-top: 32px; border-bottom: 2px solid #000; padding-bottom: 8px; }
          p { font-size: 14px; color: #444; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #f0f0f0; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; }
          td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
          .risk { font-size: 48px; font-weight: bold; color: ${overallRisk > 55 ? '#EF4444' : overallRisk > 25 ? '#F59E0B' : '#10B981'}; }
          .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${overallRisk > 55 ? '#FEE2E2' : overallRisk > 25 ? '#FEF3C7' : '#D1FAE5'}; color: ${overallRisk > 55 ? '#EF4444' : overallRisk > 25 ? '#F59E0B' : '#10B981'}; }
          .footer { margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>NeuroLoop Clinical Report</h1>
            <p>Patient: <strong>${user.name}</strong> &nbsp;|&nbsp; Date: ${reportData.date} &nbsp;|&nbsp; ID: ${reportData.patientId}</p>
          </div>
          <div>
            <span class="badge">${reportData.riskCategory}</span>
          </div>
        </div>

        <h2>Overall Risk Score</h2>
        <div class="risk">${reportData.overallRisk}/100</div>
        <p>${t("results.riskDescription")}</p>

        <h2>AI Diagnostic Summary</h2>
        <p>${t("results.summaryText", { risk: reportData.riskCategory })}</p>
        <p><strong>${t("results.dimension1.title")}:</strong> ${t("results.dimension1.desc")}</p>
        <p><strong>${t("results.dimension2.title")}:</strong> ${t("results.dimension2.desc")}</p>
        <p><em>${t("results.recommendation")}</em></p>

        <h2>Assessment Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Score</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.modules.map(m => `
              <tr>
                <td>${m.name}</td>
                <td><strong>${m.score}</strong></td>
                <td>${m.status === 'good' ? '✅ Good' : m.status === 'warning' ? '⚠️ Warning' : '❌ Critical'}</td>
                <td>${m.detail}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Generated by NeuroLoop Insight | neuroloop.ai | This report is for informational purposes only. Consult a neurologist for medical advice.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // ✅ SHARE FUNCTION
  const handleShare = async () => {
    const shareText = `
NeuroLoop Clinical Report
Patient: ${user.name}
Date: ${reportData.date}
Risk Score: ${reportData.overallRisk}/100 (${reportData.riskCategory})

Assessment Results:
${reportData.modules.map(m => `• ${m.name}: ${m.score}`).join('\n')}

Generated by NeuroLoop Insight
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NeuroLoop Clinical Report',
          text: shareText,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        // Fallback to copy
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // ✅ EXPORT PDF FUNCTION
  const handleExport = () => {
    const exportContent = `
NEUROLOOP CLINICAL REPORT
==========================
Patient Name: ${user.name}
Report Date: ${reportData.date}
Patient ID: ${reportData.patientId}

OVERALL RISK SCORE: ${reportData.overallRisk}/100
Risk Category: ${reportData.riskCategory}

ASSESSMENT BREAKDOWN:
${reportData.modules.map(m => `
  ${m.name}
  Score: ${m.score}
  Status: ${m.status === 'good' ? 'Good' : m.status === 'warning' ? 'Warning' : 'Critical'}
  Details: ${m.detail}
`).join('\n')}

AI DIAGNOSTIC SUMMARY:
${t("results.summaryText", { risk: reportData.riskCategory })}

CLINICAL RECOMMENDATION:
${t("results.recommendation")}

==========================
Generated by NeuroLoop Insight
This report is for informational purposes only.
Consult a qualified neurologist for medical diagnosis.
    `.trim();

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NeuroLoop_Report_${user.name}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-risk-low bg-risk-low/10 border-risk-low/20';
      case 'warning': return 'text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20';
      case 'critical': return 'text-risk-high bg-risk-high/10 border-risk-high/20';
      default: return 'text-textMuted bg-bg-surface';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle2 size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'critical': return <AlertTriangle size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050714] flex text-textPrimary font-body">
      <Sidebar user={user} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-screen overflow-y-auto w-full relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10 pb-24">

          {/* Header Actions */}
          <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div>
              <div className="text-[10px] font-black tracking-[0.3em] text-accent-teal uppercase mb-3">
                {t("results.eyebrow")}
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-black text-white leading-tight">
                {t("results.title")}
              </h1>
              <p className="text-textSecondary font-medium mt-1">
                {t("results.date", { date: reportData.date })} • {t("results.patientId", { id: reportData.patientId })}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* ✅ PRINT BUTTON */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                <Printer size={16} /> {t("results.print")}
              </button>

              {/* ✅ SHARE BUTTON */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-risk-low" /> : <Share2 size={16} />}
                {copied ? 'Copied!' : shareSuccess ? 'Shared!' : t("results.share")}
              </button>

              {/* ✅ EXPORT BUTTON */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold hover:opacity-90 transition-all text-sm shadow-glow-teal"
              >
                <Download size={16} /> {t("results.export")}
              </button>
            </div>
          </FadeUp>

          {/* Copied notification */}
          {copied && (
            <div className="fixed bottom-6 right-6 bg-risk-low text-white px-6 py-3 rounded-xl font-medium shadow-lg z-50 flex items-center gap-2">
              <Check size={18} /> Report copied to clipboard!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FadeUp delay={0.1} className="lg:col-span-1">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-bg-surface to-bg-elevated border border-risk-high/30 shadow-glow-teal relative overflow-hidden h-full flex flex-col items-center text-center">
                <div className="absolute top-0 left-0 w-full h-2 bg-risk-high" />
                <h2 className="text-xl font-display font-semibold text-white mb-8">{t("results.unifiedRisk")}</h2>
                <div className="scale-125 my-4">
                  <RiskMeter score={reportData.overallRisk} animate={false} />
                </div>
                <p className="mt-12 text-sm text-textSecondary leading-relaxed border-t border-border pt-6">
                  {t("results.riskDescription")}
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.2} className="lg:col-span-2">
              <Card className="h-full p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                    <Brain size={20} />
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-white">{t("results.summaryTitle")}</h3>
                </div>
                <div className="space-y-6 text-textPrimary leading-relaxed text-[15px]">
                  <p>{t("results.summaryText", { risk: reportData.riskCategory })}</p>
                  <div className="bg-risk-high/5 border border-risk-high/10 rounded-xl p-4 my-2">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 text-risk-high"><AlertTriangle size={16} /></div>
                        <span><strong>{t("results.dimension1.title")}:</strong> {t("results.dimension1.desc")}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 text-risk-high"><AlertTriangle size={16} /></div>
                        <span><strong>{t("results.dimension2.title")}:</strong> {t("results.dimension2.desc")}</span>
                      </li>
                    </ul>
                  </div>
                  <p className="font-medium text-white italic pt-4">
                    {t("results.recommendation")}
                  </p>
                </div>
              </Card>
            </FadeUp>
          </div>

          {/* Module Breakdown */}
          <FadeUp delay={0.3}>
            <div className="flex items-center justify-between mb-8 mt-4">
              <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                <Activity size={24} className="text-accent-teal" />
                {t("results.biometricBreakdown")}
              </h3>
            </div>
            <div className="liquid-glass rounded-[2rem] overflow-hidden border border-white/5 shadow-liquid">
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 bg-white/2 text-[10px] font-black text-textMuted uppercase tracking-widest">
                <div className="col-span-12 md:col-span-3">{t("results.coreDimension")}</div>
                <div className="col-span-12 md:col-span-2">{t("results.clinicalScore")}</div>
                <div className="col-span-12 md:col-span-7">{t("results.observation")}</div>
              </div>
              <div className="divide-y divide-white/5">
                {reportData.modules.map((mod, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-bg-elevated/20 transition-colors">
                    <div className="col-span-12 md:col-span-3 font-medium text-white flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(mod.status).split(' ')[0].replace('text-', 'bg-')}`} />
                      {mod.name}
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(mod.status)}`}>
                        {getStatusIcon(mod.status)} {mod.score}
                      </span>
                    </div>
                    <div className="col-span-12 md:col-span-7 text-sm text-textSecondary">
                      {mod.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Next Steps CTA */}
          <FadeUp delay={0.4} className="mt-12">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-bg-elevated to-bg-surface border border-border flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-display font-bold text-white mb-2">{t("results.shareDoctor")}</h4>
                <p className="text-textSecondary max-w-xl">{t("results.shareDoctorDesc")}</p>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold hover:opacity-90 transition-all shadow-glow-teal shrink-0"
              >
                {t("results.generateLink")} <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </FadeUp>

        </div>
      </main>
    </div>
  );
}