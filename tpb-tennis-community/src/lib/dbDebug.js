/**
 * Debug utility to check the database structure and state
 */
import { supabase } from "../services/createClient";

/**
 * Function to check if the profiles table exists and has the expected columns
 */
export async function checkProfilesTable() {
  console.group("Database Structure Check - Profiles Table");

  try {
    // First, check if we can query the table at all
    const { data: test, error: testError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);

    if (testError) {
      console.error("Error accessing profiles table:", testError.message);
      console.groupEnd();
      return false;
    }

    console.log("Profiles table exists and is accessible");

    // Get table definition
    const { data, error } = await supabase.rpc("get_table_definition", {
      table_name: "profiles",
    });

    if (error) {
      console.error("Could not get table definition:", error.message);
      console.groupEnd();
      return false;
    }

    if (data && data.length > 0) {
      console.log("Table structure for 'profiles':", data);

      // Check for specific columns we care about
      const hasIsProfileComplete = data.some(
        (col) => col.column_name === "isProfileComplete"
      );

      if (!hasIsProfileComplete) {
        console.error("Missing critical column: isProfileComplete");
      } else {
        console.log("✅ isProfileComplete column exists");
      }
    }
  } catch (err) {
    console.error("Unexpected error checking database structure:", err);
  }

  console.groupEnd();
}

/**
 * Function to check a specific user's profile status
 */
export async function checkUserProfile(userId) {
  console.group(`Checking profile for user: ${userId}`);

  try {
    // Check auth user
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError) {
      console.error("Error getting auth user:", userError.message);
    } else {
      console.log("Auth user exists:", !!userData.user);
    }

    // Check profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error getting profile:", profileError.message);
    } else {
      console.log("Profile data:", profileData);
      console.log("isProfileComplete:", profileData?.isProfileComplete);
    }
  } catch (err) {
    console.error("Unexpected error checking user profile:", err);
  }

  console.groupEnd();
}

/**
 * Function to force update the isProfileComplete field
 */
export async function forceUpdateProfileCompletion(userId, isComplete) {
  console.group(`Forcing profile completion status for user: ${userId}`);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ isProfileComplete: isComplete })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error updating profile completion:", error.message);
    } else {
      console.log("Profile updated successfully:", data);
    }
  } catch (err) {
    console.error("Unexpected error updating profile:", err);
  }

  console.groupEnd();
}
