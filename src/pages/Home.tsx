import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Coding Test Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Practice coding problems and improve your skills
        </p>
        <div className="space-x-4">
          <Button size="large" onClick={() => navigate('/problems')}>
            Start Solving
          </Button>
          <Button variant="outline" size="large" onClick={() => navigate('/submissions')}>
            View Submissions
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 