// ═══════════════════════════════════════════════════════════════
// Pexels — Vraies photos + Vraies vidéos HD
// ═══════════════════════════════════════════════════════════════

export async function searchPhotos(query: string, count: number = 6): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    const data = await res.json();
    return (data.photos || []).map((p: any) => p.src.large2x || p.src.large);
  } catch {
    return [];
  }
}

export async function searchVideos(query: string, count: number = 3): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&size=medium`,
      { headers: { Authorization: apiKey } }
    );
    const data = await res.json();
    return (data.videos || [])
      .map((v: any) => {
        const files = v.video_files || [];
        const hd = files.find((f: any) => f.quality === "hd") || files.find((f: any) => f.width >= 1280) || files[0];
        return hd?.link;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// Requêtes optimisées par type de site
export function getQueriesForType(type: string): { photos: string; video: string } {
  const map: Record<string, { photos: string; video: string }> = {
    restaurant: { photos: "gourmet food restaurant", video: "restaurant cooking" },
    portfolio: { photos: "creative designer workspace", video: "creative studio" },
    startup: { photos: "modern startup office", video: "business team meeting" },
    agence: { photos: "marketing agency creative", video: "creative agency" },
    ecole: { photos: "university students campus", video: "students learning" },
    sante: { photos: "modern clinic doctor", video: "medical healthcare" },
    immobilier: { photos: "luxury modern house", video: "modern architecture" },
    voyage: { photos: "tropical beach paradise", video: "travel destination" },
    sport: { photos: "gym fitness training", video: "athlete workout" },
    tech: { photos: "technology innovation", video: "digital technology" },
    avocat: { photos: "law office legal", video: "lawyer courtroom" },
    hotel: { photos: "luxury hotel suite", video: "hotel lobby" },
    banque: { photos: "finance business meeting", video: "finance office" },
    association: { photos: "volunteers helping community", video: "community help" },
    vitrine: { photos: "modern business professional", video: "business city" },
  };
  return map[type] || map.vitrine;
}