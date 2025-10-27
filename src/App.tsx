import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { worker } from './mocks/browser';
import { seedDatabase } from './seedData';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import JobsBoard from './pages/JobsBoard';
import JobDetail from './pages/JobDetail';
import CandidatesList from './pages/CandidatesList';
import CandidateDetail from './pages/CandidateDetail';
import AssessmentBuilder from './pages/AssessmentBuilder';
import KanbanBoard from './pages/KanbanBoard';

function App() {
  useEffect(() => {
    // Start MSW worker
    const startWorker = async () => {
      try {
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        console.log('MSW worker started successfully');
      } catch (error) {
        console.error('Failed to start MSW worker:', error);
      }
    };
    
    startWorker();
    
    // Test MSW
    setTimeout(async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        console.log('MSW test result:', data);
      } catch (error) {
        console.error('MSW test failed:', error);
      }
    }, 2000);
    
    // Seed database
    seedDatabase();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobsBoard />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/candidates" element={<CandidatesList />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/assessments/:jobId" element={<AssessmentBuilder />} />
          <Route path="/pipeline" element={<KanbanBoard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
