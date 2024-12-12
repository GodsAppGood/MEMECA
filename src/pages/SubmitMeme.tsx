import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { MemeForm } from "@/components/meme/MemeForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SubmitMeme = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          throw error;
        }

        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to submit memes.",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        // Verify user exists in Users table
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('User data error:', userError);
          throw userError;
        }

        // If user doesn't exist in Users table, create them
        if (!userData) {
          const { error: insertError } = await supabase
            .from('Users')
            .insert([
              {
                auth_id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata.name,
                profile_image: session.user.user_metadata.picture
              }
            ]);

          if (insertError) {
            console.error('User creation error:', insertError);
            throw insertError;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Error",
          description: "There was a problem verifying your authentication. Please try logging in again.",
          variant: "destructive"
        });
        navigate("/");
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-8">Submit Your Meme</h2>
            <MemeForm />
          </div>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default SubmitMeme;