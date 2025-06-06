
import { supabase } from "@/integrations/supabase/client";
import { OrderStatus } from "./orderService";

export interface SalesByDay {
  day: string; // Changed from 'name' to 'day' to match the chart expectations
  total: number; // Changed from 'sales' to 'total' to match the chart expectations
}

export interface CategorySales {
  name: string; // Category name
  total: number; // Changed from 'value' to 'total' to match the chart expectations
  color: string; // Color for chart
}

export const fetchSalesByDay = async (): Promise<SalesByDay[]> => {
  try {
    const days = 7; // Fixed to 7 days
    // Get start date (X days ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    // Get orders from the past X days
    const { data, error } = await supabase
      .from("orders")
      .select("created_at, total_amount")
      .gte("created_at", startDate.toISOString())
      .order("created_at");

    if (error) {
      console.error("Error fetching sales data:", error);
      return [];
    }

    // Group by day of week
    const salesByDay: Record<string, number> = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1) + i);
      const dayName = dayNames[date.getDay()];
      salesByDay[dayName] = 0;
    }
    
    // Sum sales for each day
    data?.forEach(order => {
      const orderDate = new Date(order.created_at);
      const dayName = dayNames[orderDate.getDay()];
      salesByDay[dayName] = (salesByDay[dayName] || 0) + Number(order.total_amount);
    });
    
    // Convert to array format for charts
    return Object.entries(salesByDay).map(([day, total]) => ({ day, total }));
  } catch (error) {
    console.error("Error in fetchSalesByDay:", error);
    return [];
  }
};

export const fetchSalesByCategory = async (): Promise<CategorySales[]> => {
  try {
    // For real implementation, you'd join orders, order_items, products, and categories
    // For this demo, we'll use a simpler approach with product categories
    
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("category_id, price, stock_quantity");

    if (productsError) {
      console.error("Error fetching products for category sales:", productsError);
      return [];
    }

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name");

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return [];
    }

    // Map category IDs to names
    const categoryMap: Record<string, string> = {};
    categories?.forEach(cat => {
      if (cat.id) categoryMap[cat.id] = cat.name;
    });

    // Calculate "sales" by category (using price * stock as proxy for actual sales)
    const salesByCategory: Record<string, number> = {};
    products?.forEach(product => {
      if (product.category_id && product.price && product.stock_quantity) {
        const categoryId = product.category_id;
        const amount = Number(product.price);
        salesByCategory[categoryId] = (salesByCategory[categoryId] || 0) + amount;
      }
    });

    // Color palette
    const colors = ['#8FBC8F', '#D2B48C', '#DDA0DD', '#F0E68C', '#ADD8E6', '#FFB6C1', '#98FB98'];
    
    // Convert to array format for charts
    return Object.entries(salesByCategory).map(([categoryId, total], index) => ({
      name: categoryMap[categoryId] || 'Unknown',
      total,
      color: colors[index % colors.length]
    }));
  } catch (error) {
    console.error("Error in fetchSalesByCategory:", error);
    return [];
  }
};

export const fetchOrderCountsByStatus = async (): Promise<Record<OrderStatus, number>> => {
  const defaultCounts: Record<OrderStatus, number> = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0
  };
  
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("status");
    
    if (error) {
      console.error("Error fetching order counts:", error);
      return defaultCounts;
    }
    
    // Count occurrences of each status
    const counts: Record<string, number> = {};
    data?.forEach(order => {
      if (order.status) {
        counts[order.status] = (counts[order.status] || 0) + 1;
      }
    });
    
    return { ...defaultCounts, ...counts };
  } catch (error) {
    console.error("Error in fetchOrderCountsByStatus:", error);
    return defaultCounts;
  }
};

export const fetchDashboardStats = async () => {
  try {
    // Total sales
    const { data: salesData, error: salesError } = await supabase
      .from("orders")
      .select("total_amount");
    
    if (salesError) {
      console.error("Error fetching sales data:", salesError);
      return null;
    }
    
    const totalSales = salesData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
    
    // Orders count
    const { count: ordersCount, error: ordersError } = await supabase
      .from("orders")
      .select("*", { count: 'exact', head: true });
    
    if (ordersError) {
      console.error("Error fetching orders count:", ordersError);
      return null;
    }
    
    // Products count
    const { count: productsCount, error: productsError } = await supabase
      .from("products")
      .select("*", { count: 'exact', head: true });
    
    if (productsError) {
      console.error("Error fetching products count:", productsError);
      return null;
    }
    
    // Active users (profiles)
    const { count: usersCount, error: usersError } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true });
    
    if (usersError) {
      console.error("Error fetching users count:", usersError);
      return null;
    }
    
    // Calculate new customers (created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: newCustomersCount, error: newCustomersError } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());
    
    if (newCustomersError) {
      console.error("Error fetching new customers count:", newCustomersError);
      return null;
    }
    
    return {
      totalSales,
      totalOrders: ordersCount || 0,
      totalProducts: productsCount || 0,
      newCustomers: newCustomersCount || 0
    };
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    return null;
  }
};
