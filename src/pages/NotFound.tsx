
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bitcoin } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="flex items-center mb-6">
        <Bitcoin className="h-12 w-12 text-primary mr-3" />
        <h1 className="text-4xl font-bold">CryptoTrack</h1>
      </div>
      
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-7xl font-bold mb-4">404</h1>
        <p className="text-xl text-white/70 mb-8">
          The page you are looking for doesn't exist or has been moved
        </p>
        <Link to="/">
          <Button className="animate-pulse-subtle">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <div className="absolute bottom-8 text-center text-white/40 text-sm">
        &copy; {new Date().getFullYear()} CryptoTrack. All rights reserved.
      </div>
    </div>
  );
};

export default NotFound;
