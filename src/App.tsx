import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NDPAConsentModal } from './components/NDPAConsentModal';
import { ErgonomicReminder } from './components/ErgonomicReminder';
import { TodayMissionView } from './views/TodayMissionView';
import { NaijaMapView } from './views/NaijaMapView';
import { VisualLabView } from './views/VisualLabView';
import { SquadView } from './views/SquadView';
import { PortfolioView } from './views/PortfolioView';
import { AssessorMatrixView } from './views/AssessorMatrixView';
import { TutorDashboardView } from './views/TutorDashboardView';
import { LessonPlayer } from './components/LessonPlayer';
import type { Zone } from './data/zones';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, setActiveLesson } = useApp();
  const [isPlayingLesson, setIsPlayingLesson] = useState<boolean>(false);

  const handleSelectZone = (zone: Zone) => {
    // Switch to Today's mission with relevant zone context
    setActiveTab('today');
  };

  return (
    <div className="app-container">
      <Header />
      <ErgonomicReminder />
      <NDPAConsentModal />

      <main className="main-content">
        {isPlayingLesson ? (
          <LessonPlayer onBack={() => setIsPlayingLesson(false)} />
        ) : (
          <>
            {activeTab === 'today' && (
              <TodayMissionView onStartLesson={() => setIsPlayingLesson(true)} />
            )}
            {activeTab === 'zones' && (
              <NaijaMapView onSelectZone={handleSelectZone} />
            )}
            {activeTab === 'lab' && <VisualLabView />}
            {activeTab === 'squad' && <SquadView />}
            {activeTab === 'portfolio' && <PortfolioView />}
            {activeTab === 'assessor_matrix' && <AssessorMatrixView />}
            {activeTab === 'tutor_dash' && <TutorDashboardView />}
          </>
        )}
      </main>

      {!isPlayingLesson && <BottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
};

export default App;
