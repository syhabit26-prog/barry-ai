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
  // ═══ NOUVEAUX JEUX (PACK SPORT & FUN) ═══
  { id: "penalty", name: "Penalty", prompt: "Penalty : tirer au but avec direction", keywords: ["penalty", "penaltys", "peno"] },
  { id: "basket", name: "Basket", prompt: "Basket : lancer ballon dans panier", keywords: ["basket", "basketball"] },
  { id: "kart", name: "Karting", prompt: "Karting : course voiture, éviter", keywords: ["kart", "karting", "racing", "course voiture"] },
  { id: "burger", name: "Burger Time", prompt: "Burger Time : marcher sur ingrédients", keywords: ["burger", "burger time"] },
  { id: "bomber", name: "Bomber", prompt: "Bomber : poser bombes", keywords: ["bomber", "bomberman2"] },
  { id: "snake-vs-ia", name: "Snake vs IA", prompt: "Snake contre IA", keywords: ["snake vs ia", "snake ia"] },
  { id: "maze", name: "Labyrinthe", prompt: "Labyrinthe aléatoire", keywords: ["labyrinthe", "maze"] },
  { id: "memory-emoji", name: "Memory Emoji", prompt: "Memory emojis animaux", keywords: ["memory emoji", "memory animaux"] },
  { id: "pinball", name: "Pinball", prompt: "Flipper : bille, bumpers", keywords: ["pinball", "flipper"] },
  { id: "cowboy", name: "Cowboy Duel", prompt: "Duel au pistolet, réflexes", keywords: ["cowboy", "duel"] },
  { id: "soccer", name: "Foot", prompt: "Match de foot simplifié", keywords: ["foot", "soccer", "match foot"] },
  { id: "poker", name: "Poker", prompt: "Poker simplifié 5 cartes", keywords: ["poker"] },
  { id: "galaxian", name: "Galaxian", prompt: "Galaxian : shooter spatial", keywords: ["galaxian"] },
  { id: "word-search", name: "Mots Mêlés", prompt: "Mots mêlés à trouver", keywords: ["mots meles", "word search"] },
  { id: "fruit", name: "Panier de Fruits", prompt: "Attraper fruits qui tombent", keywords: ["fruit", "fruits", "panier fruits"] },
  { id: "temporel", name: "Temporel", prompt: "Cliquer orbes avant disparition", keywords: ["temporel", "orbes"] },
  { id: "combat", name: "Combat", prompt: "Combat RPG au tour par tour", keywords: ["combat rpg", "combat tour"] },
  { id: "rpg-adventure", name: "RPG Adventure", prompt: "RPG top-down simple", keywords: ["rpg adventure"] },
  { id: "jetpack2", name: "Jetpack Pro", prompt: "Jetpack avec pièces", keywords: ["jetpack pro"] },
  { id: "platformer2", name: "Platformer 2", prompt: "Platformer 2D avancé", keywords: ["platformer 2", "plateforme 2"] },
  { id: "tower2", name: "Tower Defense 2", prompt: "Tower defense avec chemin", keywords: ["tower 2", "tower defense 2"] },
  { id: "vampire", name: "Vampire", prompt: "Survivre vagues créatures", keywords: ["vampire", "survivre"] },
    // ═══ PACK 10 ═══
  { id: "asteroids2", name: "Astéroïdes+", prompt: "Astéroïdes améliorés", keywords: ["asteroides 2"] },
  { id: "tank2", name: "Tank 2", prompt: "Tank avancé", keywords: ["tank 2"] },
  { id: "tigerheli", name: "Tiger Heli", prompt: "Hélicoptère de combat", keywords: ["tiger heli", "helico combat"] },
  { id: "ivan", name: "Ivan", prompt: "Combat", keywords: ["ivan"] },
  { id: "firefighter", name: "Pompier", prompt: "Sauver personnes du feu", keywords: ["pompier", "firefighter"] },
  { id: "pirate", name: "Pirate", prompt: "Navire pirate", keywords: ["pirate game"] },
  { id: "space-explorer", name: "Explorateur", prompt: "Explorer l'espace", keywords: ["space explorer"] },
  { id: "zombie-survival", name: "Survie Zombie", prompt: "Survivre zombies", keywords: ["survie zombie"] },
  { id: "snakes-ladders", name: "Serpents & Échelles", prompt: "Jeu de plateau", keywords: ["serpents echelles"] },
  { id: "uno2", name: "Uno Pro", prompt: "Uno avancé", keywords: ["uno pro"] },
  { id: "yatzy", name: "Yatzy", prompt: "Yatzy dés", keywords: ["yatzy"] },
  { id: "memory-colors", name: "Memory Couleurs", prompt: "Memory couleurs", keywords: ["memory couleurs"] },
  { id: "speed-click", name: "Speed Click", prompt: "Cliquer vite", keywords: ["speed click"] },
  { id: "color-match", name: "Color Match", prompt: "Trouver la couleur", keywords: ["color match"] },
  { id: "whack-a-mole", name: "Taupe", prompt: "Whack a mole", keywords: ["taupe", "whack"] },
  { id: "simon-colors", name: "Simon Colors", prompt: "Simon couleurs", keywords: ["simon colors"] },
  { id: "bingo", name: "Bingo", prompt: "Bingo 5x5", keywords: ["bingo"] },
  { id: "slot", name: "Machine à Sous", prompt: "Slots casino", keywords: ["machine sous", "slot"] },
  { id: "dice-roll", name: "Bataille de Dés", prompt: "Duel dés", keywords: ["des bataille"] },
  { id: "target-shoot", name: "Tir Cible", prompt: "Tir sur cible", keywords: ["tir cible"] },
  { id: "escape-room", name: "Escape Room", prompt: "Énigmes évasion", keywords: ["escape room", "evasion"] },
  { id: "riddles", name: "Énigmes", prompt: "Devinettes", keywords: ["enigmes", "riddles"] },
  { id: "simon-sound", name: "Simon Sonore", prompt: "Simon avec sons", keywords: ["simon son"] },
  { id: "reaction-colors", name: "Réaction Couleurs", prompt: "Test réaction", keywords: ["reaction couleurs"] },
  { id: "memory-icons", name: "Memory Icônes", prompt: "Memory icônes", keywords: ["memory icones"] },
  { id: "find-diff", name: "Différences", prompt: "Trouve les différences", keywords: ["trouve differences"] },
  { id: "simon6", name: "Simon 6", prompt: "Simon 6 couleurs", keywords: ["simon 6"] },
  { id: "simon-fast", name: "Simon Rapide", prompt: "Simon rapide", keywords: ["simon rapide"] },
  { id: "memory-fast", name: "Memory Rapide", prompt: "Memory chronométré", keywords: ["memory rapide"] },
  { id: "memory-animals2", name: "Memory Animaux 2", prompt: "Memory animaux", keywords: ["memory animaux 2"] },
  { id: "typing-fast", name: "Dactylo Rapide", prompt: "Écrire vite", keywords: ["dactylo rapide"] },
    // ═══ PACK 11 ═══
  { id: "crystal", name: "Crystal", prompt: "Match 3 cristaux", keywords: ["crystal"] },
  { id: "blocs", name: "Blocs", prompt: "Tetris-like blocs", keywords: ["blocs"] },
  { id: "simon-pro", name: "Simon Pro", prompt: "Simon 9 cases", keywords: ["simon pro"] },
  { id: "quadruple", name: "Puissance+", prompt: "Puissance 4 large", keywords: ["puissance plus"] },
  { id: "mots-croises", name: "Mots Croisés", prompt: "Mots croisés", keywords: ["mots croises"] },
  { id: "hangman-fr", name: "Pendu FR", prompt: "Pendu français", keywords: ["pendu fr"] },
  { id: "simon-big", name: "Simon Big", prompt: "Simon 16 cases", keywords: ["simon big"] },
  { id: "quiz-science", name: "Quiz Science", prompt: "Questions science", keywords: ["quiz science"] },
  { id: "quiz-geo", name: "Quiz Géographie", prompt: "Questions géo", keywords: ["quiz geo"] },
  { id: "quiz-histoire", name: "Quiz Histoire", prompt: "Questions histoire", keywords: ["quiz histoire"] },
  { id: "quiz-sport", name: "Quiz Sport", prompt: "Questions sport", keywords: ["quiz sport"] },
  { id: "quiz-cinema", name: "Quiz Cinéma", prompt: "Questions cinéma", keywords: ["quiz cinema"] },
  { id: "quiz-musique", name: "Quiz Musique", prompt: "Questions musique", keywords: ["quiz musique"] },
  { id: "quiz-animaux", name: "Quiz Animaux", prompt: "Questions animaux", keywords: ["quiz animaux"] },
  { id: "quiz-bizarre", name: "Quiz Bizarre", prompt: "Devinettes bizarres", keywords: ["quiz bizarre"] },
  { id: "quiz-math2", name: "Quiz Math+", prompt: "Maths rapides", keywords: ["quiz math2"] },
  { id: "find-pair", name: "Trouve la Paire", prompt: "Trouver paires", keywords: ["trouve paire"] },
  { id: "count-clicks", name: "Compte les Clics", prompt: "Cliquer vite", keywords: ["compte clics"] },
  { id: "stop-chrono", name: "Stop Chrono", prompt: "Arrêter le chrono", keywords: ["stop chrono"] },
  { id: "click-battle", name: "Bataille Clics", prompt: "Cliquer contre IA", keywords: ["bataille clics"] },
  { id: "cricket", name: "Cricket", prompt: "Cricket", keywords: ["cricket"] },
  { id: "guess-color", name: "Devine Couleur", prompt: "Deviner couleur", keywords: ["devine couleur"] },
  { id: "simon-speed", name: "Simon Vitesse", prompt: "Simon rapide", keywords: ["simon vitesse"] },
  { id: "memory-position", name: "Memory Position", prompt: "Mémoriser position", keywords: ["memory position"] },
  { id: "memory-sequence", name: "Memory Séquence", prompt: "Mémoriser séquence", keywords: ["memory sequence"] },
  { id: "find-letter", name: "Trouve Lettre", prompt: "Chercher lettre", keywords: ["trouve lettre"] },
  { id: "word-chain", name: "Chaîne de Mots", prompt: "Chaîner les mots", keywords: ["chaine mots"] },
  { id: "anagram", name: "Anagrammes", prompt: "Anagrammes", keywords: ["anagrammes"] },
  { id: "count-words", name: "Compte Mots", prompt: "Compter mots", keywords: ["compte mots"] },
  { id: "typing-words", name: "Mots Rapides", prompt: "Taper mots qui tombent", keywords: ["mots rapides"] },
  { id: "speed-math", name: "Math Speed", prompt: "Maths rapides", keywords: ["math speed"] },
    // ═══ PACK 12 ═══
  { id: "space-war", name: "Space War", prompt: "Guerre spatiale", keywords: ["space war"] },
  { id: "laser", name: "Laser", prompt: "Laser shooter", keywords: ["laser"] },
  { id: "bubbles", name: "Bulles", prompt: "Cliquer sur bulles", keywords: ["bulles"] },
  { id: "fruit-ninja", name: "Fruit Ninja", prompt: "Couper fruits", keywords: ["fruit ninja"] },
  { id: "minesweeper-plus", name: "Démineur+", prompt: "Démineur 10x10", keywords: ["demineur plus"] },
  { id: "tetris-plus", name: "Tetris+", prompt: "Tetris avancé", keywords: ["tetris plus"] },
  { id: "match4", name: "Match 4", prompt: "Aligner 4", keywords: ["match 4"] },
  { id: "bejeweled", name: "Bejeweled", prompt: "Bijoux match 3", keywords: ["bejeweled"] },
  { id: "lights-out", name: "Lights Out", prompt: "Éteindre lumières", keywords: ["lights out"] },
  { id: "pipe-dream", name: "Pipe Dream", prompt: "Tuyaux", keywords: ["pipe dream"] },
  { id: "hexagon", name: "Hexagones", prompt: "Match hexagones", keywords: ["hexagones"] },
  { id: "jigsaw", name: "Puzzle", prompt: "Puzzle 4x4", keywords: ["jigsaw", "puzzle"] },
  { id: "number-sort", name: "Tri Nombres", prompt: "Trier nombres", keywords: ["tri nombres"] },
  { id: "chess-puzzle2", name: "Échecs+", prompt: "Puzzle échecs", keywords: ["echecs plus"] },
  { id: "checkers2", name: "Dames+", prompt: "Dames 8x8", keywords: ["dames plus"] },
  { id: "go-simple", name: "Go", prompt: "Jeu de Go", keywords: ["go jeu"] },
  { id: "damier", name: "Damier", prompt: "Tout allumer pareil", keywords: ["damier"] },
  { id: "maze-escape", name: "Évasion", prompt: "Sortir du labyrinthe", keywords: ["evasion"] },
  { id: "tunnel", name: "Tunnel 3D", prompt: "Éviter obstacles tunnel", keywords: ["tunnel"] },
  { id: "neon-runner", name: "Neon Runner", prompt: "Runner néon", keywords: ["neon runner"] },
  { id: "zigzag", name: "Zigzag", prompt: "Rebondir zigzag", keywords: ["zigzag"] },
  { id: "stacking", name: "Empileur", prompt: "Empiler blocs", keywords: ["empileur"] },
  { id: "towers", name: "Tours", prompt: "Construire tours", keywords: ["tours"] },
  { id: "ball-bounce", name: "Ball Bounce", prompt: "Faire rebondir balle", keywords: ["ball bounce"] },
  { id: "arkanoid", name: "Arkanoid", prompt: "Arkanoid complet", keywords: ["arkanoid"] },
  { id: "pinball2", name: "Pinball 2", prompt: "Flipper", keywords: ["pinball2"] },
  { id: "bomb-defuse", name: "Désamorçage", prompt: "Deviner code bombe", keywords: ["desamorcage"] },
  { id: "safe-crack", name: "Coffre-Fort", prompt: "Ouvrir coffre", keywords: ["coffre fort"] },
  { id: "typing-race", name: "Course Dactylo", prompt: "Taper mots rapide", keywords: ["course dactylo"] },
  { id: "cryptarithm", name: "Cryptarithme", prompt: "Calcul rapide", keywords: ["cryptarithme"] },
  { id: "flash-card", name: "Flash Cards", prompt: "Cartes questions", keywords: ["flash cards"] },
  { id: "guess-word", name: "Devine Mot", prompt: "Deviner mot caché", keywords: ["devine mot"] },
  { id: "wordle", name: "Wordle FR", prompt: "Wordle en français", keywords: ["wordle fr"] },
    // ═══ PACK 13 ═══
  { id: "backgammon", name: "Backgammon", prompt: "Backgammon", keywords: ["backgammon"] },
  { id: "tennis", name: "Tennis", prompt: "Match de tennis", keywords: ["tennis"] },
  { id: "volleyball", name: "Volley", prompt: "Match de volley", keywords: ["volley", "volleyball"] },
  { id: "golf", name: "Golf", prompt: "Golf 3 trous", keywords: ["golf"] },
  { id: "hockey", name: "Hockey", prompt: "Hockey sur glace", keywords: ["hockey"] },
  { id: "bowling", name: "Bowling", prompt: "Bowling", keywords: ["bowling"] },
  { id: "dart", name: "Fléchettes", prompt: "Tir fléchettes", keywords: ["flechettes", "darts"] },
  { id: "air-hockey", name: "Air Hockey", prompt: "Air hockey", keywords: ["air hockey"] },
  { id: "sumo", name: "Sumo", prompt: "Combat sumo", keywords: ["sumo"] },
  { id: "boxing", name: "Boxe", prompt: "Combat boxe", keywords: ["boxe", "boxing"] },
  { id: "rally", name: "Rally", prompt: "Course rally", keywords: ["rally"] },
  { id: "drag-race", name: "Drag Race", prompt: "Course drag", keywords: ["drag race"] },
  { id: "monster-truck", name: "Monster Truck", prompt: "Monster truck", keywords: ["monster truck"] },
  { id: "f1-race", name: "F1 Race", prompt: "Course F1", keywords: ["f1", "formule 1"] },
  { id: "moto-race", name: "Moto Race", prompt: "Course moto", keywords: ["moto race"] },
  { id: "boat-race", name: "Boat Race", prompt: "Course bateau", keywords: ["boat race"] },
  { id: "submarine2", name: "Sous-Marin 2", prompt: "Sous-marin avancé", keywords: ["sous marin 2"] },
  { id: "helicopter-race", name: "Hélico Race", prompt: "Course hélico", keywords: ["helico race"] },
  { id: "moon-lander", name: "Moon Lander", prompt: "Alunissage", keywords: ["moon lander", "alunissage"] },
  { id: "space-dodge", name: "Space Dodge", prompt: "Esquiver astéroïdes", keywords: ["space dodge"] },
  { id: "cave-flight", name: "Cave Flight", prompt: "Vol dans grotte", keywords: ["cave flight"] },
  { id: "parkour", name: "Parkour", prompt: "Parkour urbain", keywords: ["parkour"] },
  { id: "dodgeball", name: "Dodgeball", prompt: "Esquiver balles", keywords: ["dodgeball"] },
  { id: "tank-battle2", name: "Tank 3", prompt: "Combat tank avancé", keywords: ["tank battle 2"] },
  { id: "snowboard", name: "Snowboard", prompt: "Descente snowboard", keywords: ["snowboard"] },
  { id: "skateboard", name: "Skateboard", prompt: "Skate", keywords: ["skateboard", "skate"] },
  { id: "bmx", name: "BMX", prompt: "BMX course", keywords: ["bmx"] },
  { id: "motocross", name: "Motocross", prompt: "Motocross", keywords: ["motocross"] },
  { id: "trampoline", name: "Trampoline", prompt: "Trampoline", keywords: ["trampoline"] },
  { id: "wall-climb", name: "Escalade", prompt: "Escalade mur", keywords: ["escalade", "grimpe"] },
  { id: "diving", name: "Plongeon", prompt: "Plongeon plongeoir", keywords: ["plongeon"] },
  { id: "surfing", name: "Surf", prompt: "Surf sur vagues", keywords: ["surf"] },
  { id: "parachute", name: "Parachute", prompt: "Saut parachute", keywords: ["parachute"] },
  { id: "zip-line", name: "Tyrolienne", prompt: "Tyrolienne", keywords: ["tyrolienne"] },
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