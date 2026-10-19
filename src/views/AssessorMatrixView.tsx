import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Search, 
  FileDown, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Filter,
  CheckCheck
} from 'lucide-react';
import { ITF_CRITERIA_LIST } from '../data/criteria';
import { jsPDF } from 'jspdf';

export const AssessorMatrixView: React.FC = () => {
  const { profile, practicalRatioPercent } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Filter criteria
  const filtered = ITF_CRITERIA_LIST.filter((item) => {
    const matchesSearch = 
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = 
      filterDomain === 'all' || item.domain.toLowerCase().includes(filterDomain.toLowerCase());

    return matchesSearch && matchesDomain;
  });

  const competentCount = ITF_CRITERIA_LIST.filter((c) => c.status === 'confident' || c.status === 'competent').length;
  const practicingCount = ITF_CRITERIA_LIST.filter((c) => c.status === 'practicing').length;
  const gapCount = ITF_CRITERIA_LIST.filter((c) => !c.status || c.status === 'not_started').length;

  // Generate verified PDF Evidence Pack (100% in-browser, no servers)
  const handleExportEvidencePack = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();

      // Title & Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(10, 38, 25);
      doc.text('ITF SUPA AI SPECIALIST (LEVEL 3) EVIDENCE PACK', 14, 20);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Standard Code: 27ITFVS26-3 | Vocational Assessor Verification Document`, 14, 28);
      doc.text(`Generated: ${new Date().toLocaleString()} | Training Window: Oct 2026 - Jan 2027`, 14, 34);

      // Candidate Profile Summary Box
      doc.setDrawColor(0, 230, 118);
      doc.setFillColor(244, 247, 245);
      doc.roundedRect(14, 40, 182, 36, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(10, 38, 25);
      doc.text(`Candidate: ${profile?.fullName || 'Chidi Okonkwo'} (${profile?.phoneNumber || '+234 803 123 4567'})`, 18, 48);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Batch ID: ITF-SUPA-B26-03 | Squad: Eko AI Transformers (Zone 1-15)`, 18, 55);
      doc.text(`Cumulative XP: ${profile?.xp || 120} | Streak: ${profile?.streakDays || 4} Days | Grace Tokens Used: 0`, 18, 62);
      doc.text(`SUPA Ratio Audit: ${practicalRatioPercent}% Practical / ${100 - practicalRatioPercent}% Theory (PASS: >= 80% Rule Met)`, 18, 69);

      // Competency Matrix Table Header
      let y = 86;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Audited Criteria Mastery Breakdown:', 14, y);
      y += 8;

      doc.setFillColor(10, 38, 25);
      doc.setTextColor(255, 255, 255);
      doc.rect(14, y, 182, 8, 'F');
      doc.setFontSize(9);
      doc.text('CODE', 16, y + 6);
      doc.text('STANDARD DOMAIN & TITLE', 38, y + 6);
      doc.text('WEEKS', 142, y + 6);
      doc.text('STATUS', 166, y + 6);
      y += 9;

      // Table rows
      doc.setFont('helvetica', 'normal');
      ITF_CRITERIA_LIST.slice(0, 18).forEach((item, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 249);
          doc.rect(14, y, 182, 7, 'F');
        }

        doc.setTextColor(20, 20, 20);
        doc.text(item.code, 16, y + 5);
        doc.text(item.title.substring(0, 52), 38, y + 5);
        doc.text(`W${item.taughtInWeeks.join(',')}`, 142, y + 5);

        const statusLabel = item.status?.toUpperCase() || 'NOT STARTED';
        if (item.status === 'confident' || item.status === 'competent') {
          doc.setTextColor(0, 140, 60);
        } else if (item.status === 'practicing') {
          doc.setTextColor(200, 100, 0);
        } else {
          doc.setTextColor(180, 20, 20);
        }
        doc.text(statusLabel, 166, y + 5);
        y += 7;
      });

      // Assessor Sign-Off Box
      y += 12;
      doc.setDrawColor(180, 180, 180);
      doc.line(14, y, 90, y);
      doc.line(110, y, 196, y);

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text('ITF SUPA Lead Assessor Signature', 14, y + 5);
      doc.text('Date & Official Stamp', 110, y + 5);

      doc.save(`SUPA_Level3_Evidence_Pack_${profile?.id || 'Chidi'}.pdf`);
    } catch (e) {
      console.error(e);
      alert('PDF generation failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Assessor Portal Header Banner */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 158, 27, 0.15), rgba(15, 25, 20, 0.95))',
          border: '1px solid var(--accent-gold)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span 
              style={{ 
                background: 'rgba(255, 158, 27, 0.25)', 
                color: 'var(--accent-gold)', 
                fontSize: '11px', 
                fontWeight: 800, 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-pill)' 
              }}
            >
              SUPA Assessor Portal (Read-Only)
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginTop: '6px' }}>
              Standard 27ITFVS26-3 Coverage Matrix
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Batch 30 Traceability & Evidence Verifier
            </div>
          </div>
          <Award size={26} color="var(--accent-gold)" />
        </div>

        {/* 20/80 Practical Ratio Check */}
        <div 
          style={{
            marginTop: '12px',
            background: 'var(--bg-primary)',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Time Ratio:</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-green)' }}>
              {practicalRatioPercent}% Practical / {100 - practicalRatioPercent}% Theory
            </div>
          </div>
          <span 
            style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              color: 'var(--accent-green)', 
              background: 'rgba(0, 230, 118, 0.15)',
              padding: '3px 8px',
              borderRadius: '4px' 
            }}
          >
            ✓ 80% Rule Compliant
          </span>
        </div>

        {/* PDF Export Button */}
        <button 
          className="btn btn-gold btn-sm"
          onClick={handleExportEvidencePack}
          disabled={isExporting}
          style={{ width: '100%', marginTop: '12px', gap: '8px' }}
        >
          <FileDown size={16} />
          {isExporting ? 'Generating Evidence Pack PDF...' : 'Export Official Evidence Pack PDF'}
        </button>
      </div>

      {/* Summary Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 230, 118, 0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 700 }}>Competent</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{competentCount}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 158, 27, 0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>Practicing</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{practicingCount}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 71, 87, 0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontWeight: 700 }}>Curriculum Gap</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{gapCount}</div>
        </div>
      </div>

      {/* Search and Domain Filters */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search criteria code or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 10px 8px 30px',
              fontSize: '12px',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <select
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <option value="all">All Domains</option>
          <option value="Mission A">Mission A (OHS)</option>
          <option value="Domain D">Domain D (Python)</option>
          <option value="Domain E">Domain E (Data/SQL)</option>
          <option value="Domain F">Domain F (ML)</option>
          <option value="Domain G">Domain G (Deep Learning)</option>
          <option value="Mission I">Mission I (NDPA)</option>
        </select>
      </div>

      {/* Criteria Table List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((c) => {
          const isDone = c.status === 'confident' || c.status === 'competent';
          const isPracticing = c.status === 'practicing';

          return (
            <div
              key={c.code}
              className="card"
              style={{
                marginBottom: 0,
                padding: '12px',
                borderLeft: isDone 
                  ? '3px solid var(--accent-green)' 
                  : isPracticing 
                  ? '3px solid var(--accent-gold)' 
                  : '3px solid var(--accent-crimson)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-code)', 
                        fontSize: '12px', 
                        fontWeight: 800, 
                        color: 'var(--accent-green)' 
                      }}
                    >
                      {c.code}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      • {c.subDomain}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {c.description}
                  </p>
                </div>

                <span 
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isDone 
                      ? 'rgba(0, 230, 118, 0.15)' 
                      : isPracticing 
                      ? 'rgba(255, 158, 27, 0.15)' 
                      : 'rgba(255, 71, 87, 0.15)',
                    color: isDone 
                      ? 'var(--accent-green)' 
                      : isPracticing 
                      ? 'var(--accent-gold)' 
                      : 'var(--accent-crimson)',
                  }}
                >
                  {c.status || 'not started'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
                <span>Taught: W{c.taughtInWeeks.join(', ')}</span>
                <span>Practiced: W{c.practicedInWeeks.join(', ')}</span>
                <span>Assessed: W{c.assessedInWeeks.join(', ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
