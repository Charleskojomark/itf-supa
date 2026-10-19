import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Award, Shield, Sparkles, HeartHandshake, Flame } from 'lucide-react';
import { BATCH_SQUADS } from '../data/squads';

export const SquadView: React.FC = () => {
  const { profile } = useApp();
  const currentSquad = BATCH_SQUADS[0]; // Eko AI Transformers

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Squad Header Card */}
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
                background: 'rgba(255, 158, 27, 0.2)', 
                color: 'var(--accent-gold)', 
                fontSize: '11px', 
                fontWeight: 800, 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-pill)' 
              }}
            >
              Batch {currentSquad.batchNumber} • Squad 1
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>
              {currentSquad.name}
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
              "{currentSquad.motto}"
            </div>
          </div>
          <div style={{ fontSize: '28px' }}>🚀</div>
        </div>

        {/* Weekly Team Quest */}
        <div 
          style={{
            marginTop: '14px',
            background: 'var(--bg-primary)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)' }}>
              🎯 Weekly Squad Quest: {currentSquad.weeklyQuest.title}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 800 }}>
              +{currentSquad.weeklyQuest.rewardXp} Squad XP
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {currentSquad.weeklyQuest.description}
          </p>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${(currentSquad.weeklyQuest.current / currentSquad.weeklyQuest.goal) * 100}%`, 
                  height: '100%', 
                  background: 'var(--accent-green)' 
                }} 
              />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-green)' }}>
              {currentSquad.weeklyQuest.current}/{currentSquad.weeklyQuest.goal}
            </span>
          </div>
        </div>
      </div>

      {/* Squad Members Leaderboard */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700 }}>
            Squadmates & Helpfulness Points
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Mission C.1.1
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentSquad.members.map((member, index) => {
            const isMe = member.isCurrentUser;
            return (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isMe ? 'rgba(0, 230, 118, 0.12)' : 'var(--bg-surface)',
                  border: isMe ? '1px solid var(--border-bright)' : '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isMe ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                      {member.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Flame size={11} color="var(--accent-green)" /> {member.streak}d streak
                      </span>
                      <span>•</span>
                      <span style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <HeartHandshake size={11} /> {member.helpfulPoints} peer pts
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {isMe ? profile?.xp : member.xp} XP
                  </div>
                  {!isMe && (
                    <button
                      onClick={() => alert(`Sent peer cheer & grace notification to ${member.name}!`)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: 'var(--accent-green)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        cursor: 'pointer',
                        marginTop: '4px',
                      }}
                    >
                      Cheer 👏
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
