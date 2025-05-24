
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createProduct } from "@/services/productService";
import { toast } from "@/hooks/use-toast";

const ProductFormPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (productData: any) => {
    setIsLoading(true);
    try {
      // Transform category_id if it's "none"
      if (productData.category_id === "none") {
        productData.category_id = null;
      }
      
      const result = await createProduct(productData);
      if (result) {
        toast({
          title: "Product created successfully",
          description: "Your product has been added to the database",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error creating product",
        description: "There was an error creating the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-sage-800">Create New Product</h1>
      </div>
      
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ProductFormPage;
