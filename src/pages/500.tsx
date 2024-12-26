import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">500 - Server Error</h1>
      <p className="text-lg mb-8">Something went wrong on our end. Please try again later.</p>
      <Button
        onClick={() => navigate('/')}
        className="bg-primary hover:bg-primary/90"
      >
        Return Home
      </Button>
    </div>
  );
}