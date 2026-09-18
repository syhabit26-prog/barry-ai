// Génère un slug à partir d'un texte
export function generateSlug(text: string): string {
  const base = text
    .toLowerCase()                    // tout en minuscules
    .normalize("NFD")                 // décompose les accents
    .replace(/[\u0300-\u036f]/g, "")  // enlève les accents
    .replace(/[^a-z0-9\s-]/g, "")     // garde lettres/chiffres/espaces/tirets
    .trim()                           // enlève les espaces début/fin
    .replace(/\s+/g, "-")             // espaces → tirets
    .replace(/-+/g, "-")              // tirets multiples → un seul
    .slice(0, 50);                    // limite à 50 caractères

  // Ajoute un suffixe aléatoire pour éviter les doublons
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base || "site"}-${suffix}`;
}