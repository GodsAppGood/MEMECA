import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "./types";

export const useUserData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserData = async (authId: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const { data: userData, error } = await supabase
        .from('Users')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No user found, create new user record
          return await createUserRecord(authId);
        }
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
        });
        return null;
      }

      return userData as User;
    } catch (error) {
      console.error('Unexpected error fetching user data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while fetching user data.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createUserRecord = async (authId: string): Promise<User | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser(authId);
      
      if (!user) {
        throw new Error('No auth user found');
      }

      const { data: newUser, error: insertError } = await supabase
        .from('Users')
        .insert([{
          auth_id: user.id,
          email: user.email,
          name: user.user_metadata.name || user.email,
          profile_image: user.user_metadata.picture || null,
          is_admin: false,
          email_confirmed: true
        }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return newUser as User;
    } catch (error) {
      console.error('Error creating user record:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user profile. Please try again.",
      });
      return null;
    }
  };

  return {
    fetchUserData,
    isLoading
  };
};