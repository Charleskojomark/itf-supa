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
import { RoleGuard } from './components/RoleGuard';
import { RoleAuthModal } from './components/RoleAuthModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import type { Zone } from './data/zones';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isStudentAuthModalOpen, 
    closeStudentAuthModal, 
    studentAuthMode 
  } = useApp();
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
      <RoleAuthModal />
      <StudentAuthModal 
        isOpen={isStudentAuthModalOpen} 
        onClose={closeStudentAuthModal} 
        defaultMode={studentAuthMode} 
      />

      <main className="main-content">
        {isPlayingLesson ? (
          <LessonPlayer onBack={() => setIsPlayingLesson(false)} />
        ) : (
          <>
            {activeTab === 'today' && (
              <RoleGuard allowedRoles={['learner', 'tutor']} screenName="Today's Mission">
                <TodayMissionView onStartLesson={() => setIsPlayingLesson(true)} />
              </RoleGuard>
            )}
            {activeTab === 'zones' && (
              <NaijaMapView onSelectZone={handleSelectZone} />
            )}
            {activeTab === 'lab' && (
              <RoleGuard allowedRoles={['learner', 'tutor']} screenName="Interactive Visual Lab">
                <VisualLabView />
              </RoleGuard>
            )}
            {activeTab === 'squad' && (
              <RoleGuard allowedRoles={['learner', 'tutor']} screenName="Squad Hub">
                <SquadView />
              </RoleGuard>
            )}
            {activeTab === 'portfolio' && <PortfolioView />}
            {activeTab === 'assessor_matrix' && (
              <RoleGuard allowedRoles={['assessor', 'tutor']} screenName="SUPA 210 Criteria Standard Matrix">
                <AssessorMatrixView />
              </RoleGuard>
            )}
            {activeTab === 'tutor_dash' && (
              <RoleGuard allowedRoles={['tutor']} screenName="Tutor Facilitator Oversight Hub">
                <TutorDashboardView />
              </RoleGuard>
            )}
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
