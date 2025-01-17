import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemeAIAnalysisProps {
  memeId: string;
}

interface AnalysisScores {
  humor: number;
  originality: number;
  cryptoRelevance: number;
  viralPotential: number;
}

interface AnalysisExplanations {
  humor: string;
  originality: string;
  cryptoRelevance: string;
  viralPotential: string;
}

interface Analysis {
  scores: AnalysisScores;
  explanations: AnalysisExplanations;
  overallAnalysis: string;
}

export const MemeAIAnalysis = ({ memeId }: MemeAIAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const { data: analysis, refetch, isError } = useQuery({
    queryKey: ["meme-analysis", memeId],
    queryFn: async () => {
      setIsAnalyzing(true);
      try {
        console.log('Starting meme analysis for ID:', memeId);
        const { data, error } = await supabase.functions.invoke("ai-analysis", {
          body: { type: "analyze_meme", data: { memeId } },
        });

        if (error) {
          console.error('Analysis error:', error);
          throw error;
        }

        if (!data?.analysis) {
          throw new Error('Invalid analysis response format');
        }

        console.log('Analysis results:', data);
        return data.analysis as Analysis;
      } catch (error) {
        console.error("Error analyzing meme:", error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze the meme. Please try again later.",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    enabled: false,
    retry: 1,
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    void refetch();
  };

  const renderScore = (score: number) => {
    const color = score >= 8 ? "text-green-500" : 
                 score >= 6 ? "text-yellow-500" : 
                 "text-red-500";
    return <span className={`font-bold ${color}`}>{score}/10</span>;
  };

  if (!analysis && !isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Analysis
          </CardTitle>
          <CardDescription>
            Get an AI-powered analysis of this meme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleAnalyze}
            className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
          >
            Analyze Meme
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" />
            Analyzing...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Brain className="w-5 h-5" />
            Analysis Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500 mb-4">
            Failed to analyze the meme. Please try again later.
          </p>
          <Button 
            onClick={handleAnalyze} 
            variant="outline" 
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold mb-2">Scores:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>Humor: {renderScore(analysis.scores.humor)}</div>
              <div>Originality: {renderScore(analysis.scores.originality)}</div>
              <div>Crypto Relevance: {renderScore(analysis.scores.cryptoRelevance)}</div>
              <div>Viral Potential: {renderScore(analysis.scores.viralPotential)}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Explanations:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Humor:</strong> {analysis.explanations.humor}</p>
              <p><strong>Originality:</strong> {analysis.explanations.originality}</p>
              <p><strong>Crypto Relevance:</strong> {analysis.explanations.cryptoRelevance}</p>
              <p><strong>Viral Potential:</strong> {analysis.explanations.viralPotential}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Overall Analysis:</h3>
            <p className="text-sm">{analysis.overallAnalysis}</p>
          </div>
        </div>

        <Button 
          onClick={handleAnalyze} 
          variant="outline" 
          className="w-full"
        >
          Analyze Again
        </Button>
      </CardContent>
    </Card>
  );
};