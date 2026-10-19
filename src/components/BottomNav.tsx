import React from 'react';
import { useApp, type ActiveTab } from '../context/AppContext';
import { 
  Compass, 
  MapPin, 
  Cpu, 
  Users, 
  FileCheck2, 
  BarChart3, 
  ClipboardList 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, role } = useApp();

  // If in assessor or tutor mode, adapt bottom nav tabs
  if (role === 'assessor') {
    return (
      <nav className="bottom-nav" aria-label="Assessor Navigation">
        <button 
          className={`nav-item ${activeTab === 'assessor_matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessor_matrix')}
        >
          <div className="nav-icon-wrapper">
            <ClipboardList size={20} />
          </div>
          <span className="nav-label">Matrix (210)</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <div className="nav-icon-wrapper">
            <FileCheck2 size={20} />
          </div>
          <span className="nav-label">Evidence Pack</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'zones' ? 'active' : ''}`}
          onClick={() => setActiveTab('zones')}
        >
          <div className="nav-icon-wrapper">
            <MapPin size={20} />
          </div>
          <span className="nav-label">Milestones</span>
        </button>
      </nav>
    );
  }

  if (role === 'tutor') {
    return (
      <nav className="bottom-nav" aria-label="Tutor Navigation">
        <button 
          className={`nav-item ${activeTab === 'tutor_dash' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutor_dash')}
        >
          <div className="nav-icon-wrapper">
            <BarChart3 size={20} />
          </div>
          <span className="nav-label">Batch 30 Hub</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'squad' ? 'active' : ''}`}
          onClick={() => setActiveTab('squad')}
        >
          <div className="nav-icon-wrapper">
            <Users size={20} />
          </div>
          <span className="nav-label">Squad Alerts</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'assessor_matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessor_matrix')}
        >
          <div className="nav-icon-wrapper">
            <ClipboardList size={20} />
          </div>
          <span className="nav-label">Criteria Gap</span>
        </button>
      </nav>
    );
  }

  // Learner Default Bottom Nav (5 key tabs)
  return (
    <nav className="bottom-nav" aria-label="Learner Navigation">
      <button 
        className={`nav-item ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => setActiveTab('today')}
      >
        <div className="nav-icon-wrapper">
          <Compass size={20} />
        </div>
        <span className="nav-label">Mission</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'zones' ? 'active' : ''}`}
        onClick={() => setActiveTab('zones')}
      >
        <div className="nav-icon-wrapper">
          <MapPin size={20} />
        </div>
        <span className="nav-label">Naija Map</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'lab' ? 'active' : ''}`}
        onClick={() => setActiveTab('lab')}
      >
        <div className="nav-icon-wrapper">
          <Cpu size={20} />
        </div>
        <span className="nav-label">Visual Lab</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'squad' ? 'active' : ''}`}
        onClick={() => setActiveTab('squad')}
      >
        <div className="nav-icon-wrapper">
          <Users size={20} />
        </div>
        <span className="nav-label">Squad</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
        onClick={() => setActiveTab('portfolio')}
      >
        <div className="nav-icon-wrapper">
          <FileCheck2 size={20} />
        </div>
        <span className="nav-label">Portfolio</span>
      </button>
    </nav>
  );
};
