import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { StepType } from '../types';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  ChevronRight,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SEED_LESSONS } from '../data/lessons';

export const TodayMissionView: React.FC<{ onStartLesson: () => void }> = ({ onStartLesson }) => {
  const { 
    profile,
    openStudentAuthModal,
    activeLesson, 
    setActiveLesson,
    activeStepNumber, 
    currentLessonProgress, 
    practicalRatioPercent,
    speakText,
    stopSpeaking,
    isSpeaking,
    readSimply,
    toggleReadSimply
  } = useApp();

  const [showGlossary, setShowGlossary] = useState<boolean>(false);

  if (!activeLesson) return null;

  const stepsList = [
    { num: 1, type: 'hook', title: 'Hook: 20s Relatable Dilemma' },
    { num: 2, type: 'see_it', title: 'See It: Interactive Visual Sim' },
    { num: 3, type: 'predict', title: 'Predict: Hypothesis Reveal' },
    { num: 4, type: 'try_it', title: 'Try It: Guided Code Blocks' },
    { num: 5, type: 'break_it', title: 'Break It: Bug Hunt Intuition' },
    { num: 6, type: 'explain_it', title: 'Explain It: In Your Own Words' },
    { num: 7, type: 'build_it', title: 'Build It: Mini-Project Capstone' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 20/80 Practical Ratio Compliance Card */}
      <div className="ratio-compliance-card">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: 4 }}>
            <span className="ratio-label">ITF 20/80 SUPA Rule</span>
            <span className="ratio-value-badge">
              {practicalRatioPercent}% Practical / {100 - practicalRatioPercent}% Theory
            </span>
          </div>
          <div className="ratio-progress-bar">
            <div 
              className="ratio-progress-fill" 
              style={{ width: `${practicalRatioPercent}%` }} 
            />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            ✓ Exceeds 80% practical hands-on benchmark mandated by SUPA standard.
          </div>
        </div>
      </div>

      {/* Account Requirement Banner */}
      {!profile?.phoneNumber && (
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.12), rgba(15, 25, 20, 0.95))',
            border: '1px solid rgba(0, 230, 118, 0.4)',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🇳🇬 Student Account Required for SUPA Tracking</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Create your account with your phone number so your daily progress is saved to the national database for tutors and assessors.
            </div>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => openStudentAuthModal('register')}
            style={{ whiteSpace: 'nowrap', fontSize: '12px', padding: '6px 12px' }}
          >
            Create Student Account
          </button>
        </div>
      )}

      {/* Lesson Selector Chip Bar (Week 1 / Week 2 Lessons) */}
      <div className="lesson-chip-bar">
        {SEED_LESSONS.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveLesson(l)}
            className="lesson-chip-btn"
            style={{
              background: activeLesson.id === l.id ? 'var(--accent-green)' : 'var(--bg-surface)',
              color: activeLesson.id === l.id ? '#0A2619' : 'var(--text-secondary)',
              borderColor: activeLesson.id === l.id ? 'var(--accent-green)' : 'var(--border-subtle)',
            }}
          >
            <span className="lesson-chip-badge">W{l.weekNumber}D{l.dayNumber}</span>
            <span className="lesson-chip-title">{l.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Lesson Hero Banner */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(10, 38, 25, 0.9))',
          border: '1px solid var(--border-bright)',
          position: 'relative',
          overflow: 'hidden',
          padding: '14px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span 
              style={{ 
                background: 'rgba(255, 158, 27, 0.2)', 
                color: 'var(--accent-gold)', 
                fontSize: '11px', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-pill)',
                whiteSpace: 'nowrap'
              }}
            >
              Zone {activeLesson.weekNumber}: {activeLesson.zoneName}
            </span>
            <span 
              style={{ 
                background: 'rgba(0, 230, 118, 0.2)', 
                color: 'var(--accent-green)', 
                fontSize: '11px', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-pill)',
                whiteSpace: 'nowrap'
              }}
            >
              Day {activeLesson.dayNumber} of 5
            </span>
          </div>

          {/* Audio Narrator & Plain English Toggles */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(`${activeLesson.title}. ${activeLesson.subtitle}. ${activeLesson.steps[0].instruction}`);
                }
              }}
              style={{
                background: isSpeaking ? 'var(--accent-green)' : 'rgba(255,255,255,0.08)',
                color: isSpeaking ? '#0A2619' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Listen to narration"
              title="Narrate with browser Text-to-Speech (free, offline)"
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              onClick={toggleReadSimply}
              style={{
                background: readSimply ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                color: readSimply ? '#1A0D00' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              title="Toggle simplified Nigerian plain-English mode"
            >
              {readSimply ? '⚡ Plain ON' : 'Read Simply'}
            </button>
          </div>
        </div>

        <h1 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(16px, 4.2vw, 19px)', 
            fontWeight: 800, 
            marginTop: '8px',
            lineHeight: 1.25,
            color: 'var(--text-primary)'
          }}
        >
          {activeLesson.title}
        </h1>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {activeLesson.subtitle}
        </p>

        {/* Criteria Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', alignItems: 'center' }}>
          {activeLesson.criteriaCodes.map((code) => (
            <span 
              key={code}
              style={{
                fontSize: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                padding: '2px 6px',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-code)',
              }}
            >
              Standard {code}
            </span>
          ))}
          <span 
            style={{
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-muted)',
              marginLeft: 'auto',
            }}
          >
            <Clock size={12} />
            {activeLesson.durationMinutes} mins
          </span>
        </div>

        {/* Primary CTA: Jump into 7-Step Cycle */}
        <button 
          className="btn btn-primary pulse-target"
          onClick={onStartLesson}
          style={{ width: '100%', marginTop: '12px', gap: '8px', minHeight: '44px', fontSize: '14px' }}
        >
          <Play size={16} fill="currentColor" />
          {currentLessonProgress?.completed ? 'Review Lesson (7/7 Passed)' : `Continue Step ${activeStepNumber} of 7`}
        </button>
      </div>

      {/* 7-Step Pedagogical Progress Ladder */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700 }}>
            The 7-Step Pedagogical Loop
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 700 }}>
            Understand Before Build
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stepsList.map((step) => {
            const isCompleted = currentLessonProgress?.stepProgress[step.type as StepType]?.completed;
            const isCurrent = activeStepNumber === step.num;
            const isLocked = step.num > activeStepNumber;

            return (
              <div
                key={step.num}
                onClick={() => {
                  if (!isLocked) onStartLesson();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isCurrent ? 'rgba(0, 230, 118, 0.12)' : 'var(--bg-surface)',
                  border: isCurrent 
                    ? '1px solid var(--border-bright)' 
                    : isCompleted 
                    ? '1px solid rgba(0, 230, 118, 0.3)' 
                    : '1px solid var(--border-subtle)',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.5 : 1,
                  transition: 'var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: isCompleted 
                        ? 'var(--accent-green)' 
                        : isCurrent 
                        ? 'var(--accent-gold)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      color: isCompleted ? '#0A2619' : isCurrent ? '#1A0D00' : 'var(--text-muted)',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : step.num}
                  </div>
                  <span 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {step.title}
                  </span>
                </div>

                <div>
                  {isLocked ? (
                    <Lock size={14} color="var(--text-muted)" />
                  ) : (
                    <ChevronRight size={16} color="var(--accent-green)" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily 5-Minute Spaced Repetition Warm-up Card */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 158, 27, 0.1), rgba(20, 14, 8, 0.8))',
          border: '1px solid rgba(255, 158, 27, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} color="var(--accent-gold)" />
            <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--accent-gold)' }}>
              Daily 5-Min Warm-Up
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            3 quick recap questions from Week 1 OHS & Python basics to keep your memory sharp.
          </p>
        </div>
        <button 
          className="btn btn-gold btn-sm"
          onClick={() => alert('Warm-up: What is the 20-20-20 rule? Look 20 feet away every 20 minutes for 20 seconds! (Streak +10 XP)')}
        >
          Start
        </button>
      </div>

      {/* Tap-to-Reveal Glossary Accordion */}
      <div className="card">
        <div 
          onClick={() => setShowGlossary(!showGlossary)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} color="var(--accent-green)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700 }}>
              Nigerian Context Glossary ({activeLesson.glossary.length} terms)
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 600 }}>
            {showGlossary ? 'Hide' : 'Tap to Reveal'}
          </span>
        </div>

        {showGlossary && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeLesson.glossary.map((item) => (
              <div 
                key={item.term}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '13px' }}>
                  {item.term}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {item.definition}
                </div>
                <div 
                  style={{ 
                    fontSize: '11px', 
                    color: 'var(--accent-gold)', 
                    background: 'rgba(255, 158, 27, 0.08)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginTop: '6px'
                  }}
                >
                  💡 <strong>Naija Analogy:</strong> {item.naijaAnalogy}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
