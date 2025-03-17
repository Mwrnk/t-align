import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import LandingHeader from '../components/layout/LandingHeader';

export default function Home() {
  const navigate = useNavigate();

  const goToTaskApp = () => {
    navigate('/tasks');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl mx-auto py-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            T-ALIGN
          </h1>
          <p className="text-lg md:text-lg text-muted-foreground mb-8">
            Tasks, realigned!
          </p>
          <Button
            size="lg"
            onClick={goToTaskApp}
            className="text-lg px-8 py-3 h-auto"
          >
            Get Started
          </Button>
        </div>
        <div className="mt-8 opacity-80"></div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} T-Align. Designed and developed by
          Mateus Werneck.
        </p>
      </footer>
    </div>
  );
}
