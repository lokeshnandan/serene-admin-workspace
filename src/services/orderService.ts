
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string;
  billing_address: string;
  payment_method: string | null;
  payment_status: boolean | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithCustomer extends Order {
  customer: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  created_at: string;
}

export const fetchOrders = async (): Promise<OrderWithCustomer[]> => {
  try {
    // First get orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // For each order, get the customer name from profiles
    const ordersWithCustomers: OrderWithCustomer[] = [];
    for (const order of orders || []) {
      let customerName = "Guest";
      
      if (order.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", order.user_id)
          .single();

        if (profile) {
          customerName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
        }
      }

      ordersWithCustomers.push({
        ...order,
        customer: customerName,
      });
    }

    return ordersWithCustomers;
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    toast({
      title: "Error fetching orders",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchOrderById = async (id: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return null;
  }
};

export const fetchOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (error) {
      console.error("Error fetching order items:", error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching order items:", error);
    return [];
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Order updated",
      description: `Order status changed to ${status}`,
    });

    return data;
  } catch (error: any) {
    console.error("Error updating order:", error);
    toast({
      title: "Error updating order",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const getOrdersCountByStatus = async (): Promise<Record<OrderStatus, number>> => {
  const result: Record<OrderStatus, number> = {
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
      .select('status');

    if (error) {
      console.error("Error fetching orders for counting:", error);
      return result;
    }

    // Count occurrences of each status
    data?.forEach(order => {
      if (order.status) {
        result[order.status] = (result[order.status] || 0) + 1;
      }
    });

    return result;
  } catch (error) {
    console.error("Error counting orders by status:", error);
    return result;
  }
};
