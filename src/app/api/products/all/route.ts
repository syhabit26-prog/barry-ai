import { NextResponse } from "next/server";
import { getProducts, searchProducts, getCategories } from "@/lib/productsDatabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const withCategories = searchParams.get("categories") === "true";

    if (withCategories) {
      return NextResponse.json({
        ok: true,
        categories: getCategories(),
        total: getProducts().length,
      });
    }

    const results = search
      ? searchProducts(search, limit * page)
      : getProducts().slice(0, limit * page);

    // Pagination
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    return NextResponse.json({
      ok: true,
      products: paginated,
      total: results.length,
      page,
      limit,
      hasMore: start + limit < results.length,
    });
  } catch (err: any) {
    console.error("❌ Erreur all products :", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}