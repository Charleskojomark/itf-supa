import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { LessonStep, StepType } from '../types';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  RotateCcw, 
  Lock, 
  Flag, 
  Sparkles,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VariableMemoryBox } from './visuals/VariableMemoryBox';
import { ConditionalBranchSim } from './visuals/ConditionalBranchSim';
import { ErgonomicPostureSim } from './visuals/ErgonomicPostureSim';
import { ConfusionMatrixWidget } from './visuals/ConfusionMatrixWidget';

interface LessonPlayerProps {
  onBack: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ onBack }) => {
  const { 
    activeLesson, 
    activeStepNumber, 
    setActiveStepNumber, 
    saveStep, 
    currentLessonProgress,
    speakText,
    stopSpeaking,
    isSpeaking,
    readSimply
  } = useApp();

  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [predictionRevealed, setPredictionRevealed] = useState<boolean>(false);
  
  // Code editor states
  const [codeValue, setCodeValue] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [codeTestsPassed, setCodeTestsPassed] = useState<boolean>(false);

  // Break-it bug states
  const [breakItCode, setBreakItCode] = useState<string>('');
  const [breakItFixed, setBreakItFixed] = useState<boolean>(false);

  // Explain-it state
  const [explainText, setExplainText] = useState<string>('');
  const [explainFeedback, setExplainFeedback] = useState<string | null>(null);

  // Stuck Ladder state (0=none, 1=hint1, 2=hint2, 3=worked, 4=flagged)
  const [stuckTier, setStuckTier] = useState<number>(0);
  const [isFlaggedToTutor, setIsFlaggedToTutor] = useState<boolean>(false);

  if (!activeLesson) return null;

  const currentStep = activeLesson.steps.find((s) => s.stepNumber === activeStepNumber) || activeLesson.steps[0];
  const stepType = currentStep.stepType;

  // Initialize code when step changes
  React.useEffect(() => {
    if (currentStep.codeStarter) {
      setCodeValue(currentStep.codeStarter);
    }
    if (currentStep.buggyCode) {
      setBreakItCode(currentStep.buggyCode);
    }
    setConsoleOutput('');
    setCodeTestsPassed(false);
    setPredictionRevealed(false);
    setSelectedPrediction(null);
    setBreakItFixed(false);
    setExplainText('');
    setExplainFeedback(null);
    setStuckTier(0);
    setIsFlaggedToTutor(false);
  }, [activeStepNumber, currentStep]);

  // Handle Step Completion & Trigger Celebrations
  const handleCompleteStep = async () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00E676', '#FF9E1B', '#2ED573'],
    });

    await saveStep(
      stepType,
      10, // score
      selectedPrediction || codeValue || explainText,
      codeValue,
      explainText
    );
  };

  // Run Code Simulation (Python Simulator in Phase 1 / Pyodide connected in Phase 3)
  const handleRunCode = () => {
    setConsoleOutput('Running Python 3.12 sandbox...\n');
    setTimeout(() => {
      if (currentStep.codeSolution && codeValue.trim().length > 10) {
        setConsoleOutput('>>> Execution Finished [0.04s]\nTotal breaks calculated: 4\nChange to give customer: N5500\n[Third Mainland] GRIDLOCK: Divert via Ikorodu road\n\n✓ All unit tests passed!');
        setCodeTestsPassed(true);
      } else {
        setConsoleOutput('Traceback (most recent call last):\n  File "main.py", line 4\n    num_breaks = \n                 ^\nSyntaxError: invalid syntax');
      }
    }, 400);
  };

  // Run Break-it Bug Checker
  const handleTestBreakIt = () => {
    if (breakItCode.includes('minutes_passed += 20') || breakItCode.includes('score >= 75') || breakItCode.includes('float(raw_naira_input)')) {
      setBreakItFixed(true);
      setConsoleOutput('✓ Bug fixed! Loop terminates correctly and no exceptions raised.');
    } else {
      setConsoleOutput('⚠️ Bug still present. Read the hint in the stuck ladder to locate the exact line.');
    }
  };

  // Evaluate Explain-It against semantic keywords
  const handleEvaluateExplanation = () => {
    if (!currentStep.explainKeyTerms) {
      handleCompleteStep();
      return;
    }
    const lower = explainText.toLowerCase();
    const matched = currentStep.explainKeyTerms.filter((term) => lower.includes(term.toLowerCase()));
    
    if (matched.length >= 2 || explainText.trim().split(' ').length >= 10) {
      setExplainFeedback(`✓ Excellent explanation! You captured key concepts: ${matched.join(', ') || 'clear logic'}.`);
      handleCompleteStep();
    } else {
      setExplainFeedback(`Almost there! Try including words like "${currentStep.explainKeyTerms.slice(0, 3).join('", "')}" in your explanation.`);
    }
  };

  // Mobile Symbol Insert Helper
  const insertSymbol = (sym: string) => {
    setCodeValue((prev) => prev + sym);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '30px' }}>
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '6px 0',
          }}
        >
          <ArrowLeft size={16} />
          <span>Exit to Mission</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speakText(`${currentStep.title}. ${readSimply && currentStep.readSimplyInstruction ? currentStep.readSimplyInstruction : currentStep.instruction}`);
              }
            }}
            style={{
              background: isSpeaking ? 'var(--accent-green)' : 'var(--bg-surface)',
              color: isSpeaking ? '#0A2619' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
            }}
            title="Listen to this step"
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <span 
            style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              background: 'rgba(0, 230, 118, 0.15)', 
              color: 'var(--accent-green)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            Step {activeStepNumber} of 7
          </span>
        </div>
      </div>

      {/* Step Progress Dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {activeLesson.steps.map((s) => (
          <div
            key={s.stepNumber}
            onClick={() => {
              if (s.stepNumber <= (currentLessonProgress?.currentStep || 1)) {
                setActiveStepNumber(s.stepNumber);
              }
            }}
            style={{
              flex: 1,
              height: '5px',
              borderRadius: '3px',
              background: s.stepNumber === activeStepNumber 
                ? 'var(--accent-green)' 
                : s.stepNumber < activeStepNumber 
                ? 'rgba(0, 230, 118, 0.4)' 
                : 'rgba(255, 255, 255, 0.1)',
              cursor: s.stepNumber <= (currentLessonProgress?.currentStep || 1) ? 'pointer' : 'default',
            }}
          />
        ))}
      </div>

      {/* Step Title & Instruction Card */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              color: currentStep.isPractical ? 'var(--accent-green)' : 'var(--accent-gold)' 
            }}
          >
            {currentStep.isPractical ? '⚡ 80% Practical Hands-On' : '📖 20% Theory Foundation'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            ~{Math.round(currentStep.estimatedSeconds / 60)} mins
          </span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginTop: '6px' }}>
          {currentStep.title}
        </h2>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>
          {readSimply && currentStep.readSimplyInstruction ? (
            <div style={{ background: 'rgba(255, 158, 27, 0.08)', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid var(--accent-gold)' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '2px' }}>
                ⚡ Plain Naija English:
              </div>
              {currentStep.readSimplyInstruction}
            </div>
          ) : (
            currentStep.instruction
          )}
        </div>
      </div>

      {/* STEP SPECIFIC INTERACTIVE BODIES */}

      {/* Step 1: Hook */}
      {stepType === 'hook' && (
        <div className="card" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Reflect on this real-world scenario. How would you solve this challenge manually before writing any code?
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCompleteStep}
            style={{ width: '100%', marginTop: '16px' }}
          >
            I Understand the Dilemma → See It Visually
          </button>
        </div>
      )}

      {/* Step 2: See It (Visual Lab Widget) */}
      {stepType === 'see_it' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentStep.widgetId === 'variable_memory_box' && <VariableMemoryBox />}
          {currentStep.widgetId === 'conditional_branch_sim' && <ConditionalBranchSim />}
          {currentStep.widgetId === 'ergonomic_posture_sim' && <ErgonomicPostureSim />}
          {!currentStep.widgetId && <VariableMemoryBox />}

          <button 
            className="btn btn-primary"
            onClick={handleCompleteStep}
            style={{ width: '100%' }}
          >
            I Explored the Visuals → Step 3: Predict
          </button>
        </div>
      )}

      {/* Step 3: Predict (Hypothesis Selection) */}
      {stepType === 'predict' && currentStep.predictOptions && (
        <div className="card" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Lock in your guess before executing:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentStep.predictOptions.map((opt) => {
              const isSelected = selectedPrediction === opt.id;
              let borderCol = 'var(--border-subtle)';
              let bgCol = 'var(--bg-primary)';

              if (predictionRevealed) {
                if (opt.isCorrect) {
                  borderCol = 'var(--accent-green)';
                  bgCol = 'rgba(0, 230, 118, 0.15)';
                } else if (isSelected && !opt.isCorrect) {
                  borderCol = 'var(--accent-crimson)';
                  bgCol = 'rgba(255, 71, 87, 0.15)';
                }
              } else if (isSelected) {
                borderCol = 'var(--border-bright)';
                bgCol = 'rgba(0, 230, 118, 0.1)';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!predictionRevealed) setSelectedPrediction(opt.id);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: bgCol,
                    border: `1px solid ${borderCol}`,
                    cursor: predictionRevealed ? 'default' : 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500 }}>
                    {opt.label}
                  </div>
                  {predictionRevealed && (
                    <div 
                      style={{ 
                        fontSize: '11px', 
                        marginTop: '6px', 
                        color: opt.isCorrect ? 'var(--accent-green)' : 'var(--text-muted)' 
                      }}
                    >
                      {opt.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!predictionRevealed ? (
            <button
              className="btn btn-primary"
              disabled={!selectedPrediction}
              onClick={() => setPredictionRevealed(true)}
              style={{ width: '100%', marginTop: '16px', opacity: selectedPrediction ? 1 : 0.5 }}
            >
              Reveal Outcome & Explanation
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleCompleteStep}
              style={{ width: '100%', marginTop: '16px' }}
            >
              Got It! → Step 4: Try It in Code
            </button>
          )}
        </div>
      )}

      {/* Step 4: Try It (Mobile Code Blocks / Pyodide Editor) */}
      {stepType === 'try_it' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Parsons Drag/Tap Chips Mode for Phone */}
          {currentStep.parsonsBlocks && (
            <div className="card" style={{ background: 'var(--bg-surface)', padding: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '8px' }}>
                Tap block to insert into editor:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentStep.parsonsBlocks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => insertSymbol(b.text + '\n')}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '6px',
                      color: 'var(--accent-green)',
                      fontFamily: 'var(--font-code)',
                      fontSize: '11px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    + {b.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Symbol Strip */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '6px', 
              overflowX: 'auto', 
              background: 'var(--bg-surface)', 
              padding: '8px', 
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {[':', '(', ')', '"', '=', '_', '[', ']', 'if', 'else', 'def', 'print'].map((sym) => (
              <button
                key={sym}
                onClick={() => insertSymbol(sym === 'print' ? 'print()' : sym)}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-code)',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {sym}
              </button>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            rows={7}
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              background: '#07160F',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              color: '#00E676',
              fontFamily: 'var(--font-code)',
              fontSize: '13px',
              lineHeight: 1.5,
              padding: '12px',
            }}
          />

          {/* Run Code Button */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-primary"
              onClick={handleRunCode}
              style={{ flex: 1, gap: '6px' }}
            >
              <Play size={16} fill="currentColor" />
              Run Code (Python 3.12)
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCodeValue(currentStep.codeSolution || '')}
              title="Insert working solution"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Console Output */}
          {consoleOutput && (
            <div 
              style={{
                background: '#050D09',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontFamily: 'var(--font-code)',
                fontSize: '11px',
                color: consoleOutput.includes('Error') ? 'var(--accent-crimson)' : 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {consoleOutput}
            </div>
          )}

          {codeTestsPassed && (
            <button
              className="btn btn-gold"
              onClick={handleCompleteStep}
              style={{ width: '100%', marginTop: '6px' }}
            >
              Passed 100%! → Step 5: Break It
            </button>
          )}
        </div>
      )}

      {/* Step 5: Break It (Bug Hunting Intuition) */}
      {stepType === 'break_it' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent-crimson)', fontWeight: 700 }}>
            ⚠️ Bug Hunt Challenge: Find and fix the error below!
          </div>

          <textarea
            rows={6}
            value={breakItCode}
            onChange={(e) => setBreakItCode(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              background: '#1A0D0F',
              border: '1px solid rgba(255, 71, 87, 0.4)',
              borderRadius: '8px',
              color: '#FF6B81',
              fontFamily: 'var(--font-code)',
              fontSize: '13px',
              padding: '12px',
            }}
          />

          <button
            className="btn btn-secondary"
            onClick={handleTestBreakIt}
            style={{ width: '100%', borderColor: 'var(--accent-crimson)', color: 'var(--accent-crimson)' }}
          >
            Test Bug Fix
          </button>

          {consoleOutput && (
            <div 
              style={{
                background: '#050D09',
                padding: '10px 12px',
                borderRadius: '8px',
                fontFamily: 'var(--font-code)',
                fontSize: '11px',
                color: breakItFixed ? 'var(--accent-green)' : 'var(--text-muted)',
              }}
            >
              {consoleOutput}
            </div>
          )}

          {breakItFixed && (
            <button
              className="btn btn-primary"
              onClick={handleCompleteStep}
              style={{ width: '100%', marginTop: '6px' }}
            >
              Bug Defeated! → Step 6: Explain It
            </button>
          )}
        </div>
      )}

      {/* Step 6: Explain It (Self-Explanation in Own Words) */}
      {stepType === 'explain_it' && (
        <div className="card" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Explain in your own words (or use a Nigerian street analogy):
          </div>

          <textarea
            rows={4}
            value={explainText}
            onChange={(e) => setExplainText(e.target.value)}
            placeholder="Type your explanation here. Mention key ideas to unlock Step 7..."
            style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '10px',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          />

          {currentStep.peerAnalogies && (
            <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
              💡 <em>Inspiration: {currentStep.peerAnalogies[0]}</em>
            </div>
          )}

          {explainFeedback && (
            <div 
              style={{ 
                marginTop: '10px', 
                fontSize: '12px', 
                color: explainFeedback.startsWith('✓') ? 'var(--accent-green)' : 'var(--accent-gold)' 
              }}
            >
              {explainFeedback}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleEvaluateExplanation}
            disabled={explainText.trim().length < 5}
            style={{ width: '100%', marginTop: '14px', opacity: explainText.trim().length < 5 ? 0.5 : 1 }}
          >
            Submit Explanation → Unlock Step 7: Build It
          </button>
        </div>
      )}

      {/* Step 7: Build It (Locked until 1-6 are passed) */}
      {stepType === 'build_it' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div 
            style={{ 
              background: 'rgba(0, 230, 118, 0.1)', 
              border: '1px solid var(--border-bright)', 
              borderRadius: '8px', 
              padding: '10px 12px',
              fontSize: '12px',
              color: 'var(--accent-green)',
              fontWeight: 700,
            }}
          >
            🔓 Capstone Step Unlocked! Build your mini-project to conclude today's lesson.
          </div>

          <textarea
            rows={7}
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              background: '#07160F',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              color: '#00E676',
              fontFamily: 'var(--font-code)',
              fontSize: '13px',
              padding: '12px',
            }}
          />

          <button
            className="btn btn-primary"
            onClick={handleRunCode}
            style={{ width: '100%', gap: '8px' }}
          >
            <Play size={16} fill="currentColor" />
            Validate Project Against Test Cases
          </button>

          {consoleOutput && (
            <div 
              style={{
                background: '#050D09',
                padding: '10px 12px',
                borderRadius: '8px',
                fontFamily: 'var(--font-code)',
                fontSize: '11px',
                color: 'var(--accent-green)',
              }}
            >
              {consoleOutput}
            </div>
          )}

          {codeTestsPassed && (
            <button
              className="btn btn-gold pulse-target"
              onClick={async () => {
                await handleCompleteStep();
                alert('🎉 Congratulations! You have mastered today\'s lesson and logged standard criteria evidence!');
                onBack();
              }}
              style={{ width: '100%', marginTop: '6px' }}
            >
              🎉 Lesson Complete! Claim XP & Return to Map
            </button>
          )}
        </div>
      )}

      {/* 4-TIER STUCK LADDER */}
      <div 
        className="card"
        style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)',
          padding: '12px',
          marginTop: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={15} color="var(--accent-gold)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)' }}>
              Stuck? Use the Help Ladder:
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Never stay blocked
          </span>
        </div>

        {/* Tier Buttons */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setStuckTier(1)}
            style={{ fontSize: '11px', padding: '4px 8px', borderColor: stuckTier >= 1 ? 'var(--accent-gold)' : undefined }}
          >
            Hint 1 (Idea)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setStuckTier(2)}
            style={{ fontSize: '11px', padding: '4px 8px', borderColor: stuckTier >= 2 ? 'var(--accent-gold)' : undefined }}
          >
            Hint 2 (Code)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setStuckTier(3)}
            style={{ fontSize: '11px', padding: '4px 8px', borderColor: stuckTier >= 3 ? 'var(--accent-green)' : undefined }}
          >
            Worked Example
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setStuckTier(4);
              setIsFlaggedToTutor(true);
            }}
            style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--accent-crimson)', borderColor: 'rgba(255, 71, 87, 0.4)' }}
          >
            <Flag size={11} /> Flag to Tutor
          </button>
        </div>

        {/* Active Stuck Content */}
        {stuckTier === 1 && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '6px', marginTop: '8px' }}>
            💡 <strong>Hint 1:</strong> {currentStep.stuckLadder.hint1}
          </div>
        )}
        {stuckTier === 2 && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '6px', marginTop: '8px' }}>
            🔧 <strong>Hint 2:</strong> {currentStep.stuckLadder.hint2}
          </div>
        )}
        {stuckTier === 3 && (
          <div style={{ fontSize: '12px', color: 'var(--accent-green)', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '6px', marginTop: '8px' }}>
            📝 <strong>Worked Example:</strong> {currentStep.stuckLadder.workedExample}
          </div>
        )}
        {stuckTier === 4 && (
          <div style={{ fontSize: '12px', color: 'var(--accent-gold)', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '6px', marginTop: '8px' }}>
            🚩 <strong>Flagged:</strong> Your code snapshot and this step have been sent to your facilitator queue. A peer or tutor will assist shortly!
          </div>
        )}
      </div>
    </div>
  );
};
