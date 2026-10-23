import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  AlertTriangle, 
  Users, 
  Calendar, 
  Send, 
  CheckCircle,
  FileSpreadsheet,
  Search,
  RefreshCw,
  Award,
  Clock,
  Sparkles,
  Flame,
  Phone,
  Mail
} from 'lucide-react';
import { BATCH_SQUADS } from '../data/squads';
import { fetchAllStudentsFromCloud, type CloudStudent } from '../services/cloudDb';

export const TutorDashboardView: React.FC = () => {
  const [announcement, setAnnouncement] = useState<string>('');
  const [announcementSent, setAnnouncementSent] = useState<boolean>(false);
  const [students, setStudents] = useState<CloudStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(true);
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [selectedSquadFilter, setSelectedSquadFilter] = useState<string>('all');

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const data = await fetchAllStudentsFromCloud();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phoneNumber.includes(studentSearch) ||
      (s.email && s.email.toLowerCase().includes(studentSearch.toLowerCase()));
    const matchesSquad = selectedSquadFilter === 'all' || s.squadId === selectedSquadFilter;
    return matchesSearch && matchesSquad;
  });

  const stuckAlerts = [
    { id: '1', student: 'Tunde Bakare', squad: 'Eko AI Transformers', lesson: 'W02D03 Conditionals', step: 'Step 5: Break It (WAEC Grade Overlap Bug)', time: '18m ago' },
    { id: '2', student: 'Somtochukwu Obi', squad: 'Confluence Data Miners', lesson: 'W02D01 Variables', step: 'Step 4: Try It (Type Casting)', time: '42m ago' },
  ];

  const weakConcepts = [
    { concept: 'String Multiplication vs Numeric Math', failureRate: 38, itf: 'D.1.1' },
    { concept: 'If-Elif Evaluation Order', failureRate: 29, itf: 'D.1.3' },
    { concept: 'Ergonomic 20-20-20 Habit Compliance', failureRate: 14, itf: 'A.1.2' },
  ];

  const handleSendAnnouncement = () => {
    if (!announcement.trim()) return;
    setAnnouncementSent(true);
    setTimeout(() => {
      setAnnouncementSent(false);
      setAnnouncement('');
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Tutor Overview Banner */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(10, 31, 20, 0.95))',
          border: '1px solid var(--border-bright)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span 
              style={{ 
                background: 'rgba(0, 230, 118, 0.2)', 
                color: 'var(--accent-green)', 
                fontSize: '11px', 
                fontWeight: 800, 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-pill)' 
              }}
            >
              Tutor & Facilitator Hub
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginTop: '6px' }}>
              Batch 30 Cohort Oversight
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              ITF SUPA AI Specialist • {students.length} Learners Enrolled in Database
            </div>
          </div>
          <BarChart3 size={26} color="var(--accent-green)" />
        </div>

        {/* Quick Batch Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Registered</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-green)' }}>{students.length}</div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>20/80 Compliant</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {students.filter(s => s.practicalRatioPercent >= 80).length}
            </div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Stuck Queue</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-crimson)' }}>2</div>
          </div>
        </div>
      </div>

      {/* Live Registered Students Directory (Postgres Connected) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="var(--accent-green)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700 }}>
              Registered Students ({filteredStudents.length})
            </h2>
          </div>
          <button
            onClick={loadStudents}
            disabled={isLoadingStudents}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '4px 8px',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RefreshCw size={12} className={isLoadingStudents ? 'spin' : ''} />
            Refresh DB
          </button>
        </div>

        {/* Search & Squad Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search by student name or phone..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px 10px 6px 30px',
                fontSize: '12px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--text-muted)' }} />
          </div>

          <select
            value={selectedSquadFilter}
            onChange={(e) => setSelectedSquadFilter(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 8px',
              fontSize: '11px',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          >
            <option value="all">All Squads</option>
            {BATCH_SQUADS.map((sq) => (
              <option key={sq.id} value={sq.id}>{sq.name.split(' ')[0]}</option>
            ))}
          </select>
        </div>

        {/* Students List */}
        {isLoadingStudents ? (
          <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Loading students from Postgres database...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            No registered students match this search.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredStudents.map((s) => (
              <div 
                key={s.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{ 
                        width: 38, 
                        height: 38, 
                        borderRadius: '50%', 
                        background: 'rgba(0, 230, 118, 0.15)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '18px',
                        border: '1px solid var(--border-medium)',
                        flexShrink: 0
                      }}
                    >
                      {s.avatar || '👨🏾‍💻'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {s.fullName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span><Phone size={10} style={{ display: 'inline', marginRight: 2 }} />{s.phoneNumber}</span>
                        {s.email && <span><Mail size={10} style={{ display: 'inline', marginRight: 2 }} />{s.email.split('@')[0]}</span>}
                      </div>
                    </div>
                  </div>

                  <span 
                    style={{ 
                      fontSize: '10px', 
                      background: s.practicalRatioPercent >= 80 ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 158, 27, 0.2)',
                      color: s.practicalRatioPercent >= 80 ? 'var(--accent-green)' : 'var(--accent-gold)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 800,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {s.practicalRatioPercent}% Practical
                  </span>
                </div>

                {/* Badges / Metrics Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                  <span style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sparkles size={11} /> {s.xp} XP
                  </span>
                  <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Flame size={11} /> {s.streakDays}d Streak
                  </span>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} /> {s.totalPracticalMinutes}m Hands-on
                  </span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Zone {s.currentZone} • {s.criteriaCount} Standards
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Stuck Alert Feed */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} color="var(--accent-gold)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700 }}>
              Live Stuck Queue (Needs Facilitator Intervention)
            </h2>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 800 }}>
            {stuckAlerts.length} Flagged
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stuckAlerts.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid rgba(255, 158, 27, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.student} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({item.squad})</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '2px' }}>
                  {item.lesson} • {item.step}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Flagged {item.time}
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert(`Opening peer mentor review thread for ${item.student}`)}
              >
                Assist
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic Failure Item Analysis */}
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
          Concept Confusion Matrix (Weakest Topics)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weakConcepts.map((item) => (
            <div key={item.concept} style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600 }}>{item.concept}</span>
                <span style={{ color: 'var(--accent-crimson)', fontWeight: 700 }}>{item.failureRate}% Fail</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${item.failureRate}%`, height: '100%', background: 'var(--accent-crimson)' }} />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Standard {item.itf} • Recommendation: Post an audio voice note in Squad chat.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Announcement to Batch 30 */}
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
          Broadcast Announcement / Schedule Adjustment
        </h2>
        <textarea
          rows={3}
          placeholder="E.g., Reminder: Friday Boss Battle unlocks at 2 PM. In case of NEPA outage, your Grace Tokens protect your streak!"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '10px',
            color: 'var(--text-primary)',
            fontSize: '12px',
            resize: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', color: announcementSent ? 'var(--accent-green)' : 'var(--text-muted)' }}>
            {announcementSent ? '✓ Announcement dispatched to all 30 phones via Service Worker!' : 'Pushed to offline cache'}
          </span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleSendAnnouncement}
          >
            <Send size={13} />
            Broadcast
          </button>
        </div>
      </div>
    </div>
  );
};
