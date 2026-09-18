import { supabaseAdmin } from "./supabaseAdmin";

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  cj_product_id: string;
  product_name: string;
  product_image?: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant?: string;
};

export type Order = {
  id?: string;
  user_id?: string | null;
  project_id?: string | null;
  cj_order_id?: string | null;
  status?: OrderStatus;
  total_price: number;
  currency?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_zip: string;
  products: OrderItem[];
  tracking_number?: string;
  tracking_url?: string;
  notes?: string;
};

export async function createOrder(order: Order): Promise<{ ok: boolean; order?: any; error?: string }> {
  try {
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("cj_orders")
      .insert({
        user_id: order.user_id || null,
        project_id: order.project_id || null,
        status: order.status || "pending",
        total_price: order.total_price,
        currency: order.currency || "EUR",
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone || null,
        shipping_address: order.shipping_address,
        shipping_city: order.shipping_city,
        shipping_country: order.shipping_country,
        shipping_zip: order.shipping_zip,
        products: order.products,
        notes: order.notes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("❌ Erreur création commande :", orderError);
      return { ok: false, error: orderError.message };
    }

    if (order.products.length > 0) {
      const items = order.products.map((p) => ({
        order_id: orderData.id,
        cj_product_id: p.cj_product_id,
        product_name: p.product_name,
        product_image: p.product_image || null,
        sku: p.sku || null,
        quantity: p.quantity,
        unit_price: p.unit_price,
        total_price: p.total_price,
        variant: p.variant || null,
      }));

      const { error: itemsError } = await supabaseAdmin.from("cj_order_items").insert(items);

      if (itemsError) {
        console.error("❌ Erreur items :", itemsError);
      }
    }

    return { ok: true, order: orderData };
  } catch (err: any) {
    console.error("❌ Erreur createOrder :", err);
    return { ok: false, error: err.message };
  }
}

export async function getOrders(userId?: string | null): Promise<{ ok: boolean; orders?: any[]; error?: string }> {
  try {
    let query = supabaseAdmin
      .from("cj_orders")
      .select(`*, cj_order_items (*)`)
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, orders: data || [] };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function getOrderById(orderId: string): Promise<{ ok: boolean; order?: any; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("cj_orders")
      .select(`*, cj_order_items (*)`)
      .eq("id", orderId)
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, order: data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingInfo?: { tracking_number?: string; tracking_url?: string }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (trackingInfo?.tracking_number) updates.tracking_number = trackingInfo.tracking_number;
    if (trackingInfo?.tracking_url) updates.tracking_url = trackingInfo.tracking_url;

    const { error } = await supabaseAdmin
      .from("cj_orders")
      .update(updates)
      .eq("id", orderId);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function getOrderStats(userId?: string | null): Promise<{
  ok: boolean;
  stats?: { total: number; pending: number; shipped: number; delivered: number; revenue: number };
  error?: string;
}> {
  try {
    let query = supabaseAdmin.from("cj_orders").select("status, total_price");
    if (userId) query = query.eq("user_id", userId);

    const { data, error } = await query;

    if (error) return { ok: false, error: error.message };

    const orders = data || [];
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending" || o.status === "paid").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      revenue: orders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0),
    };

    return { ok: true, stats };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}