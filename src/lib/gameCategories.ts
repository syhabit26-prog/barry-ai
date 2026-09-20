// src/lib/gameCategories.ts
// ⭐ 120 JEUX JOUABLES ET MODERNES

export type GameCategory = {
  id: string;
  name: string;
  prompt: string;
  keywords: string[];
};

export const GAME_CATEGORIES: GameCategory[] = [
  // ═══ ARCADE CLASSIQUES (1-15) ═══
  { id: "snake", name: "Snake", prompt: "Snake classique : serpent qui grandit en mangeant des pommes, murs mortels, score, game over + restart.", keywords: ["snake", "serpent"] },
  { id: "tetris", name: "Tetris", prompt: "Tetris complet : pièces qui tombent, rotation, lignes à compléter, score, niveaux progressifs.", keywords: ["tetris"] },
  { id: "pong", name: "Pong", prompt: "Pong 2 joueurs : raquettes gauche/droite, balle qui rebondit, score à 5 points.", keywords: ["pong"] },
  { id: "breakout", name: "Casse-briques", prompt: "Brick Breaker : raquette en bas, balle qui casse des briques, niveaux progressifs, bonus.", keywords: ["casse briques", "breakout", "brick breaker"] },
  { id: "space-invaders", name: "Space Invaders", prompt: "Space Invaders : vaisseau en bas, aliens en formation qui descendent, tirs, score, vagues.", keywords: ["space invaders", "invaders"] },
  { id: "asteroids", name: "Astéroïdes", prompt: "Astéroïdes : vaisseau dans l'espace, rotation, tir, astéroïdes qui se cassent.", keywords: ["asteroides", "asteroids"] },
  { id: "pacman-simple", name: "Pac-Man simplifié", prompt: "Pac-Man : labyrinthe simple, pac-man, fantômes qui poursuivent, points.", keywords: ["pacman", "pac man"] },
  { id: "galaga", name: "Galaga", prompt: "Galaga : vaisseau spatial en bas, vagues d'ennemis, tirs, boss.", keywords: ["galaga"] },
  { id: "frogger", name: "Frogger", prompt: "Frogger : grenouille qui traverse route et rivière, voitures, troncs.", keywords: ["frogger", "grenouille"] },
  { id: "centipede", name: "Centipede", prompt: "Centipede : mille-pattes qui descend en zigzag, tirs, score.", keywords: ["centipede", "mille pattes"] },
  { id: "missile-command", name: "Missile Command", prompt: "Missile Command : villes à défendre, missiles ennemis, clic pour intercepter.", keywords: ["missile command"] },
  { id: "defender", name: "Defender", prompt: "Defender : vaisseau qui vole, ennemis à détruire, otages à sauver.", keywords: ["defender"] },
  { id: "dig-dug", name: "Dig Dug", prompt: "Dig Dug : creuser sous terre, gonfler les ennemis, score.", keywords: ["dig dug", "creuser"] },
  { id: "qbert", name: "Q*bert", prompt: "Q*bert : personnage qui saute sur des cubes en pyramide, change couleur.", keywords: ["qbert", "q bert"] },
  { id: "joust", name: "Joust", prompt: "Joust : chevalier sur autruche volante, ennemis en piqué.", keywords: ["joust"] },
{ id: "bomberman", name: "Bomberman", prompt: "Bomberman : poser bombes, exploser ennemis, casser murs, score.", keywords: ["bomberman"] },
{ id: "pierre-feuille-ciseaux", name: "Pierre-Feuille-Ciseaux", prompt: "PFC contre IA", keywords: ["pierre feuille ciseaux", "pfc", "chifoumi"] },
{ id: "devine-nombre", name: "Devine le Nombre", prompt: "Devine le nombre 1-100", keywords: ["devine nombre", "devine le nombre"] },
  // ═══ PUZZLE (16-30) ═══
  { id: "2048", name: "2048", prompt: "2048 : grille 4x4, fusionner tuiles identiques, atteindre 2048.", keywords: ["2048"] },
  { id: "memory", name: "Memory", prompt: "Memory : jeu de paires avec emojis, retourner cartes, compteur.", keywords: ["memory", "paires"] },
  { id: "sudoku", name: "Sudoku", prompt: "Sudoku 9x9 jouable : grille, chiffres, validation.", keywords: ["sudoku"] },
  { id: "minesweeper", name: "Démineur", prompt: "Démineur : grille, mines, drapeaux, chrono.", keywords: ["demineur", "minesweeper"] },
  { id: "2048-5x5", name: "2048 5x5", prompt: "2048 sur grille 5x5, atteindre 4096.", keywords: ["2048 5x5"] },
  { id: "match3", name: "Match-3", prompt: "Match-3 : grille de gemmes, aligner 3+, combos.", keywords: ["match 3", "match3", "candy"] },
  { id: "sliding", name: "Taquin", prompt: "Taquin 4x4 : réarranger tuiles numérotées.", keywords: ["taquin", "sliding puzzle"] },
  { id: "tower-hanoi", name: "Tours de Hanoï", prompt: "Tours de Hanoï : déplacer disques, règles.", keywords: ["hanoi", "tours hanoi"] },
  { id: "sudoku-6x6", name: "Sudoku 6x6", prompt: "Sudoku 6x6 facile.", keywords: ["sudoku 6"] },
  { id: "word-search", name: "Mots mêlés", prompt: "Mots mêlés : grille de lettres, mots cachés.", keywords: ["mots meles", "word search"] },
  { id: "maze", name: "Labyrinthe", prompt: "Labyrinthe généré, joueur avec flèches.", keywords: ["labyrinthe", "maze"] },
  { id: "simon", name: "Simon", prompt: "Simon : reproduire la séquence de couleurs.", keywords: ["simon", "sequence memoire"] },
  { id: "lights-out", name: "Lights Out", prompt: "Lights Out : éteindre toutes les lumières.", keywords: ["lights out", "lumiere"] },
  { id: "connect4", name: "Puissance 4", prompt: "Puissance 4 : grille 7x6, aligner 4, IA.", keywords: ["puissance 4", "connect 4"] },

  // ═══ CARTES & STRATÉGIE (31-45) ═══
  { id: "solitaire", name: "Solitaire", prompt: "Solitaire Klondike : cartes à ranger.", keywords: ["solitaire"] },
  { id: "blackjack", name: "Blackjack", prompt: "Blackjack : jouer contre la banque, score 21.", keywords: ["blackjack", "21"] },
  { id: "memory-cards", name: "Memory Cartes", prompt: "Memory avec cartes à jouer.", keywords: ["memory cartes"] },
  { id: "morpion", name: "Morpion", prompt: "Morpion 3x3 avec IA imbattable.", keywords: ["morpion", "tic tac toe", "tictactoe"] },
  { id: "echecs", name: "Échecs", prompt: "Échecs complets : plateau 8x8, IA basique.", keywords: ["echecs", "chess"] },
  { id: "dames", name: "Dames", prompt: "Jeu de dames : plateau 10x10, prises.", keywords: ["dames", "checkers"] },
  { id: "bataille-navale", name: "Bataille Navale", prompt: "Bataille navale : placer bateaux, tirer.", keywords: ["bataille navale", "naval"] },
  { id: "morpion-ultime", name: "Morpion Ultime", prompt: "Morpion ultime : 9 morpions imbriqués.", keywords: ["morpion ultime"] },
  { id: "reversi", name: "Reversi", prompt: "Reversi : plateau 8x8, retourner pièces.", keywords: ["reversi", "othello"] },
  { id: "yam", name: "Yam's", prompt: "Yam's : 5 dés, combinaisons, score.", keywords: ["yams", "yahtzee"] },
  { id: "uno-simple", name: "Uno simplifié", prompt: "Uno simplifié : cartes couleurs/chiffres.", keywords: ["uno"] },
  { id: "poker-simple", name: "Poker simplifié", prompt: "Poker simplifié : 5 cartes, combinaisons.", keywords: ["poker"] },
  { id: "memory-animaux", name: "Memory Animaux", prompt: "Memory avec emojis animaux.", keywords: ["memory animaux"] },
  { id: "snake-vs-ia", name: "Snake vs IA", prompt: "Snake contre serpent IA.", keywords: ["snake ia"] },
  { id: "go-simple", name: "Go simplifié", prompt: "Go : plateau, territoires.", keywords: ["go jeu"] },

  // ═══ RUNNERS & PLATEFORMES (46-60) ═══
  { id: "endless-runner", name: "Endless Runner", prompt: "Endless Runner : courir, sauter obstacles.", keywords: ["endless runner", "runner"] },
  { id: "doodle-jump", name: "Doodle Jump", prompt: "Doodle Jump : rebondir de plateforme en plateforme.", keywords: ["doodle jump", "jump"] },
  { id: "flappy", name: "Flappy Bird", prompt: "Flappy Bird : oiseau, tuyaux, score.", keywords: ["flappy"] },
  { id: "jetpack", name: "Jetpack Joyride", prompt: "Jetpack : voler, éviter obstacles, pièces.", keywords: ["jetpack"] },
  { id: "temple-run", name: "Temple Run", prompt: "Temple Run : coureur 3 voies, swipe.", keywords: ["temple run"] },
  { id: "platformer-simple", name: "Platformer", prompt: "Platformer 2D : plateformes, sauts, ennemis.", keywords: ["platformer", "plates-formes"] },
  { id: "mario-clone", name: "Mario Clone", prompt: "Mario-like : plateforme 2D, sauter ennemis.", keywords: ["mario", "mario clone"] },
  { id: "gravity-runner", name: "Gravity Runner", prompt: "Runner avec gravité inversable.", keywords: ["gravity runner", "gravite"] },
  { id: "wall-runner", name: "Wall Runner", prompt: "Wall Runner : courir sur les murs.", keywords: ["wall runner"] },
  { id: "cave-run", name: "Cave Run", prompt: "Cave Run : coureur dans grotte.", keywords: ["cave run"] },
  { id: "sky-jump", name: "Sky Jump", prompt: "Sky Jump : sauter de nuage en nuage.", keywords: ["sky jump"] },
  { id: "ninja-jump", name: "Ninja Jump", prompt: "Ninja Jump : ninja grimpe murs.", keywords: ["ninja jump"] },
  { id: "bounce", name: "Bounce", prompt: "Bounce : balle qui rebondit, contrôler direction.", keywords: ["bounce"] },
  { id: "geometry-dash", name: "Geometry Dash", prompt: "Geometry Dash-like : carré qui saute en rythme.", keywords: ["geometry dash"] },
  { id: "pixel-runner", name: "Pixel Runner", prompt: "Pixel Runner rétro.", keywords: ["pixel runner"] },

  // ═══ SHOOTERS & ESPACE (61-75) ═══
  { id: "space-shooter", name: "Space Shooter", prompt: "Space Shooter : vaisseau, ennemis en vagues, boss.", keywords: ["space shooter", "vaisseau"] },
  { id: "asteroids-shooter", name: "Astéroïdes Shooter", prompt: "Astéroïdes avec power-ups.", keywords: ["asteroides shooter"] },
  { id: "twin-stick", name: "Twin Stick Shooter", prompt: "Twin Stick : déplacer ET tirer, zombies.", keywords: ["twin stick"] },
  { id: "top-down-shooter", name: "Top-Down Shooter", prompt: "Top-Down Shooter : vue du dessus.", keywords: ["top down shooter"] },
  { id: "bullet-hell", name: "Bullet Hell", prompt: "Bullet Hell : esquiver rideaux de balles.", keywords: ["bullet hell", "danmaku"] },
  { id: "missiles-defense", name: "Missile Defense", prompt: "Missile Defense : détruire missiles en cliquant.", keywords: ["missile defense"] },
  { id: "tank-shooter", name: "Tank Shooter", prompt: "Tank Shooter : chars 2D, tirer sur ennemis.", keywords: ["tank shooter"] },
  { id: "plane-shooter", name: "Avion de Chasse", prompt: "Avion de chasse : scrolling vertical.", keywords: ["avion", "plane shooter"] },
  { id: "helicopter-game", name: "Hélicoptère", prompt: "Hélicoptère : éviter obstacles, tirer.", keywords: ["helicoptere"] },
  { id: "submarine-shooter", name: "Sous-Marin", prompt: "Sous-Marin : torpilles, ennemis, oxygène.", keywords: ["sous marin"] },
  { id: "zombie-shooter", name: "Zombie Shooter", prompt: "Zombie Shooter top-down : survivre vagues.", keywords: ["zombie shooter"] },
  { id: "defender-shooter", name: "Defender 2", prompt: "Defender-style : vaisseau sauve otages.", keywords: ["defender shooter"] },
  { id: "meteor-shower", name: "Pluie de Météores", prompt: "Pluie de Météores : esquiver météores.", keywords: ["meteor shower"] },
  { id: "crossy-road", name: "Crossy Road", prompt: "Crossy Road : poulet traverse routes.", keywords: ["crossy road"] },
  { id: "duck-hunt", name: "Chasse au Canard", prompt: "Chasse au Canard : cliquer pour tirer.", keywords: ["duck hunt", "canard"] },

  // ═══ RÉFLEXION & HASARD (76-90) ═══
  { id: "juste-prix", name: "Le Juste Prix", prompt: "Le Juste Prix : deviner prix d'objets.", keywords: ["juste prix"] },
  { id: "pendu", name: "Pendu", prompt: "Pendu : deviner mot caché, lettres, dessin.", keywords: ["pendu"] },
  { id: "sudoku-variants", name: "Sudoku Variantes", prompt: "Sudoku diagonal, killer, samurai.", keywords: ["sudoku variantes"] },
  { id: "mastermind", name: "Mastermind", prompt: "Mastermind : deviner combinaison couleurs.", keywords: ["mastermind"] },
  { id: "pendu-fruits", name: "Pendu Fruits", prompt: "Pendu avec fruits.", keywords: ["pendu fruits"] },
  { id: "hangman-english", name: "Hangman English", prompt: "Pendu en anglais.", keywords: ["hangman english"] },
  { id: "code-breaker", name: "Code Breaker", prompt: "Code Breaker : deviner code 4 chiffres.", keywords: ["code breaker"] },
  { id: "math-quiz", name: "Quiz Maths", prompt: "Quiz mathématiques rapides.", keywords: ["quiz maths"] },
  { id: "memory-numbers", name: "Memory Nombres", prompt: "Mémoire de nombres, séquence croissante.", keywords: ["memory nombres"] },
  { id: "typing-game", name: "Typing Game", prompt: "Dactylographie : écrire mots qui tombent.", keywords: ["typing game", "dactylographie"] },
  { id: "reaction-test", name: "Test de Réaction", prompt: "Test de réaction : cliquer dès couleur change.", keywords: ["reaction test"] },
  { id: "brain-training", name: "Brain Training", prompt: "Brain Training : mini-jeux variés.", keywords: ["brain training"] },
  { id: "iq-test", name: "Test QI", prompt: "Test QI : suites logiques, puzzles.", keywords: ["test qi", "iq test"] },
  { id: "chess-puzzle", name: "Puzzles d'Échecs", prompt: "Puzzles d'échecs, mats en 2-3 coups.", keywords: ["echecs puzzle"] },
  { id: "trivia", name: "Trivia Quiz", prompt: "Trivia : questions culture générale.", keywords: ["trivia", "quiz"] },

  // ═══ ACTION & AVENTURE (91-105) ═══
  { id: "tower-defense", name: "Tower Defense", prompt: "Tower Defense : placer tourelles sur chemin.", keywords: ["tower defense"] },
  { id: "survivors", name: "Vampire Survivors", prompt: "Survivre vagues monstres, collecter armes.", keywords: ["vampire survivors", "survivors"] },
  { id: "arena-fighter", name: "Arena Fighter", prompt: "Arène : affronter vagues d'ennemis.", keywords: ["arena fighter"] },
  { id: "dungeon-crawler", name: "Dungeon Crawler", prompt: "Dungeon Crawler : explorer donjon.", keywords: ["dungeon crawler"] },
  { id: "roguelike", name: "Roguelike", prompt: "Roguelike simple : donjon aléatoire.", keywords: ["roguelike"] },
  { id: "top-down-rpg", name: "RPG Top-Down", prompt: "RPG top-down : personnage, combat, XP.", keywords: ["rpg top down"] },
  { id: "ninja-game", name: "Jeu de Ninja", prompt: "Ninja : sauter, shurikens, ennemis.", keywords: ["ninja game"] },
  { id: "knight-fight", name: "Combat de Chevaliers", prompt: "Chevalier : combat à l'épée.", keywords: ["knight", "chevalier"] },
  { id: "samurai", name: "Samurai", prompt: "Samurai : combat katana, réflexes.", keywords: ["samurai"] },
  { id: "pirate", name: "Pirate Adventure", prompt: "Pirate : naviguer, combattre, trésors.", keywords: ["pirate"] },
  { id: "space-explorer", name: "Explorateur Spatial", prompt: "Explorer l'espace, planètes.", keywords: ["space explorer"] },
  { id: "zombie-survival", name: "Survie Zombie", prompt: "Survie zombie : barricader, tuer.", keywords: ["zombie survival"] },
  { id: "cowboy", name: "Cowboy", prompt: "Cowboy : duels au pistolet.", keywords: ["cowboy"] },
  { id: "fighter", name: "Combat 2 Joueurs", prompt: "Combat 2 joueurs : coups, vie, KO.", keywords: ["fighter 2"] },
  { id: "brawler", name: "Beat'em Up", prompt: "Beat'em Up : frapper vagues d'ennemis.", keywords: ["beat em up", "brawler"] },

  // ═══ SIMULATION (106-120) ═══
  { id: "tycoon-clicker", name: "Clicker Tycoon", prompt: "Clicker : cliquer, usines automatiques.", keywords: ["clicker", "tycoon"] },
  { id: "idle-game", name: "Idle Game", prompt: "Idle : ressource qui s'accumule.", keywords: ["idle game"] },
  { id: "farm-sim", name: "Ferme", prompt: "Ferme : planter, arroser, récolter.", keywords: ["ferme", "farm"] },
  { id: "restaurant-sim", name: "Restaurant", prompt: "Restaurant : servir clients, agrandir.", keywords: ["restaurant sim"] },
  { id: "aquarium-sim", name: "Aquarium", prompt: "Aquarium : poissons, nourrir.", keywords: ["aquarium"] },
  { id: "city-builder", name: "Ville", prompt: "Mini City Builder : placer zones.", keywords: ["city builder", "ville"] },
  { id: "hospital-sim", name: "Hôpital", prompt: "Hôpital : soigner patients.", keywords: ["hospital sim"] },
  { id: "airport-sim", name: "Aéroport", prompt: "Aéroport : gérer pistes.", keywords: ["airport sim"] },
  { id: "stock-market", name: "Bourse", prompt: "Simulateur bourse : actions.", keywords: ["stock market", "bourse"] },
  { id: "startup-tycoon", name: "Startup Tycoon", prompt: "Startup : recruter, lever fonds.", keywords: ["startup tycoon"] },
  { id: "hotel-sim", name: "Hôtel", prompt: "Hôtel : gérer chambres, clients.", keywords: ["hotel sim"] },
  { id: "cooking-game", name: "Cuisine", prompt: "Cuisine : préparer plats en suivant recette.", keywords: ["cooking game", "cuisine"] },
  { id: "delivery-game", name: "Livreur", prompt: "Livreur : livrer colis, timer.", keywords: ["delivery game"] },
  { id: "flight-sim", name: "Simulateur de Vol", prompt: "Simulateur de vol simple.", keywords: ["flight sim"] },
  { id: "parking-game", name: "Parking", prompt: "Parking : garer voiture.", keywords: ["parking game"] },
  { id: "musique", name: "Piano", prompt: "Piano interactif avec touches musicales.", keywords: ["piano", "musique", "clavier musical"] },
{ id: "guitares", name: "Guitare", prompt: "Guitare avec cordes jouables.", keywords: ["guitare", "guitares"] },
{ id: "instruments", name: "Batterie", prompt: "Batterie avec pads frappables.", keywords: ["batterie", "drums", "percussion"] },
{ id: "music-memory", name: "Music Memory", prompt: "Simon musical : reproduire séquence de notes.", keywords: ["music memory", "memoire musicale"] },
{ id: "voyage", name: "Voyage", prompt: "Simulateur de voyage en avion.", keywords: ["voyage", "voyages"] },
{ id: "livres", name: "Bibliothèque", prompt: "Quiz sur les livres et auteurs.", keywords: ["livres", "livre", "bibliotheque"] },
{ id: "papeterie", name: "Papeterie", prompt: "Jeu de rapidité avec objets de papeterie.", keywords: ["papeterie", "bureau"] },
];

export function findGameCategory(prompt: string): GameCategory | null {
  // ⭐ Nettoie : enlève les mots parasites
  const cleaned = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\b(jeu|jeux|game|games|de|du|des|un|une|le|la|les|pour|avec|sur|cree|créer|moi|fais|faire|génère|générer|veux|souhaite|voudrais|aimerais)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  // 1. Match exact par keyword (mot entier)
  const allKeywords: Array<{ kw: string; cat: GameCategory }> = [];
  for (const g of GAME_CATEGORIES) {
    for (const kw of g.keywords) {
      allKeywords.push({ kw: kw.toLowerCase(), cat: g });
    }
  }
  allKeywords.sort((a, b) => b.kw.length - a.kw.length);

  for (const { kw, cat } of allKeywords) {
    const regex = new RegExp(`(^|\\s)${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "i");
    if (regex.test(cleaned)) return cat;
  }

  // 2. Match par ID exact
  for (const g of GAME_CATEGORIES) {
    if (cleaned.includes(g.id.replace(/-/g, " "))) return g;
  }

  // 3. Match partiel sur keywords
  for (const { kw, cat } of allKeywords) {
    if (cleaned.includes(kw)) return cat;
  }

  // 4. Match par mots du nom
  const words = cleaned.split(" ").filter((w) => w.length > 3);
  for (const w of words) {
    for (const g of GAME_CATEGORIES) {
      if (g.name.toLowerCase().includes(w)) return g;
    }
  }

  return null;
}

export const TOTAL_GAMES = GAME_CATEGORIES.length;