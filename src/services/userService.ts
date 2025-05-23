
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile;
  created_at: string;
  last_sign_in_at: string | null;
}

export const fetchUsers = async (): Promise<UserWithProfile[]> => {
  try {
    // Get all profiles first
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");

    if (profilesError) {
      toast({
        title: "Error fetching user profiles",
        description: profilesError.message,
        variant: "destructive",
      });
      return [];
    }

    // Then get user details from auth.users via admin API
    // Note: This would require server-side processing in a real app
    // For this demo, we'll simulate by just using the profiles data
    
    const users: UserWithProfile[] = profiles?.map(profile => ({
      id: profile.id,
      email: `user-${profile.id.substring(0, 8)}@example.com`, // Simulated email
      profile,
      created_at: profile.created_at,
      last_sign_in_at: null
    })) || [];

    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    toast({
      title: "Error fetching users",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, profile: Partial<Profile>): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Profile updated",
      description: "User profile has been updated successfully",
    });

    return data;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    toast({
      title: "Error updating profile",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};
