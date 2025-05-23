
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    toast({
      title: "Error fetching categories",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const createCategory = async (category: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([category])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Category created",
      description: `${category.name} has been created successfully`,
    });

    return data;
  } catch (error: any) {
    console.error("Error creating category:", error);
    toast({
      title: "Error creating category",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({
        ...category,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Category updated",
      description: `${category.name || "Category"} has been updated successfully`,
    });

    return data;
  } catch (error: any) {
    console.error("Error updating category:", error);
    toast({
      title: "Error updating category",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Category deleted",
      description: "Category has been deleted successfully",
    });

    return true;
  } catch (error: any) {
    console.error("Error deleting category:", error);
    toast({
      title: "Error deleting category",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};
