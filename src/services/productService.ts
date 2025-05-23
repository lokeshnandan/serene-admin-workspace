
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: string | null;
  is_featured: boolean | null;
  dosha_type: Database["public"]["Enums"]["dosha_type"] | null;
  image_urls: string[] | null;
  sku: string | null;
  dimensions: string | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
}

export type ProductCreateInput = Omit<Product, "id" | "created_at" | "updated_at">;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching products:", error);
    toast({
      title: "Error fetching products",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchLowStockProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .lt("stock_quantity", 10) // Consider products with less than 10 items as low stock
      .order("stock_quantity", { ascending: true });

    if (error) {
      console.error("Error fetching low stock products:", error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching low stock products:", error);
    return [];
  }
};

export const createProduct = async (product: ProductCreateInput): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Product created",
      description: `${product.name} has been created successfully`,
    });

    return data;
  } catch (error: any) {
    console.error("Error creating product:", error);
    toast({
      title: "Error creating product",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<ProductCreateInput>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Product updated",
      description: `${product.name || "Product"} has been updated successfully`,
    });

    return data;
  } catch (error: any) {
    console.error("Error updating product:", error);
    toast({
      title: "Error updating product",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Product deleted",
      description: "Product has been deleted successfully",
    });

    return true;
  } catch (error: any) {
    console.error("Error deleting product:", error);
    toast({
      title: "Error deleting product",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};
