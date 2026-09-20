type ProductDef = [string, number];

const CATEGORIES: Record<string, ProductDef[]> = {
  sneakers: [["Nike Air Max",159.99],["Adidas Ultraboost",189.99],["New Balance 574",119.99],["Puma RS-X",139.99],["Jordan 1 Retro",229.99],["Vans Old Skool",79.99],["Converse Chuck",69.99],["Yeezy Boost",279.99]],
  chaussures_homme: [["Derby Cuir",189.99],["Mocassins Suedine",149.99],["Bottines Chelsea",179.99],["Richelieu Noir",199.99],["Bateau Nautique",99.99],["Loafer Velours",129.99]],
  chaussures_sport: [["Trail Running",149.99],["Basket Ball Pro",179.99],["Chaussure Fitness",99.99],["Crossfit Trainer",129.99],["Randonnee",159.99],["Velo",139.99]],
  chaussures_femme: [["Escarpins Cuir",119.99],["Ballerines",79.99],["Bottines Talon",159.99],["Sandales Femme",89.99],["Mules Elegantes",99.99],["Derby Femme",129.99]],
  bottes: [["Bottes Cuir",199.99],["Bottes Motard",249.99],["Bottes Rando",179.99],["Bottes Pluie",89.99],["Bottes Neige",149.99],["Bottes Cowboy",219.99]],
  sandales: [["Sandales Cuir",89.99],["Sandales Sport",59.99],["Tongs Plage",29.99],["Sandales Rando",119.99],["Mules Cuir",79.99],["Nu-pieds Sport",69.99]],
  montres: [["Rolex Submariner",899.99],["Omega Speedmaster",1299.99],["Seiko Diver",449.99],["Casio G-Shock",149.99],["Tissot Le Locle",549.99],["Fossil Chrono",199.99],["Daniel Wellington",179.99],["Citizen Eco",349.99]],
  montres_luxe: [["Montre Automatique Or",1499.99],["Chronographe Acier",899.99],["Montre Squelette",749.99],["Tourbillon",2499.99],["Pilot Watch",599.99],["Montre Cuir",449.99]],
  montres_connectees: [["Apple Watch Style",799.99],["Samsung Galaxy Watch",349.99],["Garmin Fenix",599.99],["Fitbit Sense",249.99],["Amazfit GTR",179.99],["Huawei Watch",229.99]],
  bijoux: [["Bracelet Cuir",49.99],["Chaine Argent 925",89.99],["Bague Acier",69.99],["Pendentif Croix Or",129.99],["Bracelet Perles",39.99],["Chevaliere Argent",99.99],["Collier Acier",79.99],["Boucles Oreilles Acier",29.99],["Montre Gousset",149.99],["Gourmette Or",349.99]],
  bracelets: [["Bracelet Cuir",39.99],["Bracelet Perles",29.99],["Bracelet Acier",49.99],["Bracelet Or Rose",199.99],["Bracelet Paracorde",19.99],["Bracelet Magnetique",34.99]],
  colliers: [["Collier Chaine Argent",79.99],["Collier Acier",49.99],["Collier Perles",59.99],["Collier Bois",39.99],["Collier Pendentif",89.99],["Collier Or",299.99]],
  bagues: [["Bague Titan",79.99],["Bague Acier Noir",49.99],["Bague Argent",89.99],["Chevaliere Homme",129.99],["Bague Bois",39.99],["Bague Or",499.99]],
  boucles_oreilles: [["Boucles Acier",29.99],["Boucles Argent",49.99],["Boucles Or",149.99],["Boucles Perle",59.99],["Creoles",39.99],["Puces Diamant",199.99]],
  sacs: [["Sacoche Cuir",129.99],["Sac a Dos",89.99],["Sac Ordinateur",99.99],["Sac Week-end",149.99],["Sac Bandouliere",79.99],["Sac Sport",59.99],["Sac Voyage",179.99],["Sac Randonnee",119.99]],
  sacs_dos: [["Sac a Dos Urbain",79.99],["Sac a Dos Rando",99.99],["Sac a Dos Ordinateur",119.99],["Sac a Dos Ecole",49.99],["Sac a Dos Sport",69.99],["Sac a Dos Cuir",159.99]],
  sacs_femme: [["Sac a Main Cuir",149.99],["Sac Epaule",119.99],["Pochette Soiree",89.99],["Cabas Toile",99.99],["Sac Bandouliere",129.99],["Mini Sac",79.99]],
  portefeuilles: [["Portefeuille Cuir",49.99],["Portefeuille RFID",69.99],["Porte-cartes",29.99],["Portefeuille Zip",59.99],["Portefeuille Compact",39.99],["Portefeuille Vintage",79.99]],
  valises: [["Valise Cabine",149.99],["Valise Rigide",199.99],["Valise Souple",129.99],["Set 3 Valises",349.99],["Bagage Main",99.99],["Valise Enfant",79.99]],
  ceintures: [["Ceinture Cuir",49.99],["Ceinture Boucle",59.99],["Ceinture Tressee",39.99],["Ceinture Automatique",69.99],["Ceinture Sport",29.99],["Ceinture Reversible",44.99]],
  lunettes_soleil: [["Lunettes Aviator Or",149.99],["Lunettes Wayfarer Noir",99.99],["Lunettes Ronde Ecaille",119.99],["Lunettes Sport Polarized",129.99],["Lunettes Pilote Miroir",89.99],["Lunettes Oversize",79.99]],
  lunettes_vue: [["Monture Acetate",89.99],["Monture Metal",79.99],["Monture Ronde",69.99],["Monture Carree",99.99]],
  casquettes: [["Casquette NY",39.99],["Casquette Snapback",29.99],["Casquette Baseball",34.99],["Casquette Trucker",27.99],["Casquette Sport",24.99],["Casquette Premium",49.99]],
  chapeaux: [["Fedora",79.99],["Chapeau Panama",89.99],["Beret",39.99],["Chapeau Paille",49.99],["Trilby",69.99],["Bob",29.99]],
  bonnets: [["Bonnet Laine",24.99],["Bonnet Coton",19.99],["Bonnet Pompon",22.99],["Bonnet Revers",27.99],["Cagoule",34.99],["Bonnet Sport",21.99]],
  gants: [["Gants Cuir",49.99],["Gants Laine",24.99],["Gants Tactiles",19.99],["Gants Motard",89.99],["Gants Ski",44.99],["Gants Chauffants",79.99]],
  echarpes: [["Echarpe Cachemire",89.99],["Echarpe Laine",49.99],["Echarpe Coton",29.99],["Echarpe Tartan",39.99],["Snood",34.99],["Echarpe Fine",59.99]],
  cravates: [["Cravate Soie",49.99],["Cravate Slim",34.99],["Noeud Papillon",29.99],["Cravate Ecossaise",39.99],["Cravate Unie",24.99],["Set Cravate",79.99]],
  porte_cles: [["Porte-cles Cuir",19.99],["Porte-cles Metal",14.99],["Porte-cles Moto",24.99],["Porte-cles LED",12.99],["Porte-cles Photo",17.99],["Porte-cles Luxe",29.99]],
  t_shirts_homme: [["T-Shirt Coton Bio",29.99],["T-Shirt Oversize",34.99],["T-Shirt Col V",24.99],["T-Shirt Manches Longues",32.99],["T-Shirt Graphique",29.99],["Pack 3 T-Shirts",69.99]],
  polos: [["Polo Pique",49.99],["Polo Sport",39.99],["Polo Manches Longues",59.99],["Polo Slim",44.99],["Polo Brode",54.99],["Polo Raye",49.99]],
  chemises: [["Chemise Oxford",59.99],["Chemise Lin",79.99],["Chemise Carreaux",49.99],["Chemise Blanche",54.99],["Chemise Slim",64.99],["Chemise Manches Courtes",44.99]],
  pulls: [["Pull Cachemire",179.99],["Pull Laine",89.99],["Pull Col Roule",79.99],["Pull Capuche",69.99],["Pull Zip",99.99],["Pull Motif",74.99]],
  sweats: [["Sweat Oversize",79.99],["Hoodie Premium",89.99],["Sweat Zip",99.99],["Sweat Crewneck",69.99],["Sweat Brode",84.99],["Sweat Vintage",74.99]],
  vestes: [["Veste Cuir",299.99],["Veste Jean",129.99],["Blouson Bomber",149.99],["Veste Cargo",119.99],["Veste Sport",89.99],["Veste Impermeable",179.99]],
  manteaux: [["Manteau Laine",249.99],["Doudoune",299.99],["Trench-coat",219.99],["Parka",189.99],["Manteau Long",279.99],["Manteau Court",199.99]],
  jeans: [["Jean Slim Brut",89.99],["Jean Skinny",79.99],["Jean Droit",94.99],["Jean Mom",99.99],["Jean Noir",84.99],["Jean Trous",89.99]],
  pantalons: [["Chino Beige",79.99],["Pantalon Cargo",89.99],["Pantalon Costume",129.99],["Jogger",59.99],["Pantalon Sport",69.99],["Pantalon Lin",84.99]],
  shorts: [["Short Cargo",49.99],["Short Sport",39.99],["Short Jean",59.99],["Short Plage",34.99],["Short Chino",49.99],["Short Running",44.99]],
  maillots_bain: [["Maillot Boxer Sport",39.99],["Short de Bain",49.99],["Maillot Plage",44.99],["Maillot Competition",59.99]],
  chaussettes: [["Chaussettes Sport",24.99],["Chaussettes Coton",34.99],["Chaussettes Fantaisie",19.99],["Chaussettes Randonnee",29.99],["Chaussettes Invisibles",21.99],["Chaussettes Laine",32.99]],
  sous_vetements_homme: [["Boxer Coton",34.99],["Boxer Sport",29.99],["Calecon Coton",24.99],["Slip Coton",29.99],["Boxer Bambou",44.99],["Boxer Microfibre",39.99]],
  slips: [["Slip Coton (x3)",24.99],["Slip Microfibre",19.99],["Slip Sport",22.99],["Slip Bambou",29.99],["Slip Raye",21.99],["Slip Premium (x2)",34.99]],
  pyjamas: [["Pyjama Coton",59.99],["Pyjama Flanelle",69.99],["Pyjama Satin",79.99],["Ensemble Pyjama",89.99]],
  robes: [["Robe Soiree",129.99],["Robe Casual",79.99],["Robe Ete",59.99],["Robe Cocktail",149.99],["Robe Plage",49.99],["Robe Longue",99.99]],
  jupes: [["Jupe Plissee",69.99],["Jupe Cuir",99.99],["Jupe Longue",79.99],["Jupe Courte",49.99],["Jupe Taille Haute",59.99],["Jupe Plage",39.99]],
  smartphones: [["iPhone 15 Pro Style",999.99],["Samsung S24 Ultra Style",1099.99],["Google Pixel 8",699.99],["Xiaomi 14",599.99],["OnePlus 12",749.99],["iPhone SE",449.99]],
  tablettes: [["iPad Pro",1099.99],["iPad Air",649.99],["Samsung Tab S9",799.99],["Lenovo Tab P12",349.99],["Xiaomi Pad 6",299.99],["Surface Pro",1199.99]],
  ordinateurs: [["MacBook Pro M3",2299.99],["MacBook Air M2",1299.99],["Dell XPS 13",1499.99],["HP Spectre",1399.99],["Lenovo ThinkPad",1199.99],["Asus Zenbook",999.99]],
  claviers: [["Clavier Mecanique RGB",149.99],["Clavier Sans Fil",79.99],["Clavier Gamer",129.99],["Clavier Compact 60",99.99],["Clavier Ergonomique",119.99],["Clavier Apple Magic",99.99]],
  souris: [["Souris Gaming RGB",79.99],["Souris Sans Fil",49.99],["Souris Ergonomique",59.99],["Souris Verticale",69.99],["Souris Bluetooth",39.99],["Souris Pro",129.99]],
  casques_audio: [["Casque Sony",349.99],["Casque Bose",379.99],["Casque AirPods Max Style",499.99],["Casque Sennheiser",329.99],["Casque JBL Tune",89.99],["Casque Beats Studio",279.99]],
  ecouteurs: [["Ecouteurs AirPods Pro Style",249.99],["Ecouteurs Samsung Buds",149.99],["Ecouteurs Sony WF",279.99],["Ecouteurs JBL",79.99],["Ecouteurs Sport",69.99],["Ecouteurs Filaire",29.99]],
  enceintes: [["Enceinte JBL Flip",129.99],["Enceinte Bose SoundLink",199.99],["Enceinte Marshall",249.99],["Enceinte Sonos Roam",179.99],["Enceinte PC",89.99],["Enceinte Connectee",79.99]],
  microphones: [["Micro USB Studio",99.99],["Micro Streaming",149.99],["Micro Podcast",129.99],["Micro Cravate",49.99],["Micro Reflexion",199.99],["Micro Fifine",79.99]],
  webcams: [["Webcam 4K",149.99],["Webcam Full HD",79.99],["Webcam Streaming",129.99],["Webcam AutoFocus",99.99]],
  drones: [["Drone Camera 4K",449.99],["Drone Mini",299.99],["Drone FPV Racing",899.99],["Drone Enfant",99.99],["Drone Pliable",349.99],["Drone GPS",599.99]],
  cameras: [["Appareil Photo Canon",899.99],["Appareil Photo Nikon",749.99],["Appareil Photo Sony",1299.99],["Camera GoPro",399.99],["Camera Action 4K",249.99],["Camera Video",599.99]],
  imprimantes: [["Imprimante Laser",199.99],["Imprimante Jet Encre",99.99],["Imprimante Photo",149.99],["Imprimante 3D",349.99],["Imprimante Multifonction",179.99],["Imprimante Portable",129.99]],
  ecrans: [["Ecran 4K 27 pouces",399.99],["Ecran Gaming 144Hz",349.99],["Ecran UltraWide",599.99],["Ecran Portable",199.99],["Ecran 24 pouces",179.99],["Ecran OLED",899.99]],
  chargeurs: [["Chargeur 65W USB-C",39.99],["Chargeur Sans Fil",49.99],["Chargeur Multiple",59.99],["Chargeur Voiture",24.99],["Chargeur GaN",54.99],["Station Charge",79.99]],
  cables: [["Cable USB-C 2m",14.99],["Cable Lightning",19.99],["Cable HDMI 4K",24.99],["Cable DisplayPort",19.99],["Cable Ethernet",12.99],["Cable USB-C Tresse",17.99]],
  batteries_externes: [["Batterie 20000mAh",49.99],["Batterie 10000mAh",29.99],["Batterie Solaire",59.99],["Batterie Sans Fil",44.99],["Batterie Slim",34.99],["Station Portable",149.99]],
  coques_tel: [["Coque iPhone Silicone",19.99],["Coque Samsung Armor",24.99],["Coque Transparente",14.99],["Coque Cuir",34.99],["Coque Antichoc",29.99],["Etui Folio",27.99]],
  accessoires_pc: [["Tapis Souris RGB",29.99],["Support Ecran",89.99],["Repose-poignet",34.99],["Hub USB-C",49.99],["Webcam Ring Light",79.99],["Support PC Portable",54.99]],
  meubles: [["Canape 3 Places",899.99],["Table Basse",299.99],["Chaise Ergonomique",449.99],["Lit King Size",1299.99],["Armoire 3 Portes",699.99],["Buffet Vintage",549.99]],
  canapes: [["Canape Angle",1299.99],["Canape Convertible",899.99],["Canape 2 Places",699.99],["Canape Cuir",1499.99],["Canape Velours",999.99],["Meridienne",599.99]],
  chaises: [["Chaise Bureau",179.99],["Chaise Gaming",349.99],["Chaise Salle a Manger",89.99],["Chaise Bar",119.99],["Chaise Design",199.99],["Fauteuil Lounge",449.99]],
  tables: [["Table Salle a Manger",599.99],["Table Basse Verre",249.99],["Table Bureau",329.99],["Table Extensible",899.99],["Table Ronde",399.99],["Table Console",279.99]],
  lits: [["Lit 160x200",799.99],["Lit Coffre",999.99],["Lit Enfant",399.99],["Lit Superpose",649.99],["Sommier",449.99],["Tete de Lit",299.99]],
  armoires: [["Armoire 2 Portes",449.99],["Penderie Ouverte",199.99],["Dressing",1299.99],["Commode 6 Tiroirs",349.99],["Bibliotheque",399.99],["Vitrine",599.99]],
  eclairage: [["Lampe de Chevet",49.99],["Suspension Moderne",149.99],["Lampadaire",179.99],["Applique Murale",79.99],["Guirlande LED",29.99],["Lampe Bureau",69.99]],
  tapis: [["Tapis Salon Moderne",249.99],["Tapis Berbere",349.99],["Tapis Salle a Manger",199.99],["Tapis Entree",79.99],["Tapis Enfant",149.99],["Tapis Exterieur",99.99]],
  decoration: [["Vase Ceramique",49.99],["Miroir Mural",129.99],["Cadre Photo",29.99],["Horloge Murale",59.99],["Bougie Parfumee",34.99],["Objet Deco",39.99]],
  rideaux: [["Rideaux Occultants",79.99],["Rideaux Voilage",49.99],["Rideaux Lin",99.99],["Rideaux Doubles",129.99]],
  coussins: [["Coussin Decoratif",29.99],["Coussin Velours",39.99],["Coussin Lin",34.99],["Coussin Exterieur",24.99],["Set 4 Coussins",89.99],["Coussin Long",44.99]],
  couvertures: [["Couverture Polaire",49.99],["Plaid Laine",79.99],["Couverture Cachemire",199.99],["Couverture Chauffante",129.99],["Plaid Exterieur",39.99],["Couverture Piquee",89.99]],
  draps: [["Parure de Lit",89.99],["Draps Housse",49.99],["Drap Plat",39.99],["Taie Oreiller",19.99],["Set Complet",129.99],["Drap Coton Egyptien",149.99]],
  sdb: [["Set Serviettes",49.99],["Peignoir Bain",59.99],["Tapis de Bain",24.99],["Porte-savon",14.99],["Distributeur Savon",19.99],["Miroir SDB",79.99]],
  rangement: [["Boite Rangement",19.99],["Panier Osier",34.99],["Organisateur Placard",29.99],["Boite Chaussures",24.99],["Porte-manteaux",39.99],["Set Rangement",49.99]],
  menage: [["Aspirateur Balai",149.99],["Balai Serpilliere",29.99],["Seau Menage",19.99],["Chiffon Microfibre",12.99],["Produits Menage",24.99],["Nettoyeur Vapeur",89.99]],
  cuisine: [["Casserole Inox",39.99],["Poele Antiadhesive",49.99],["Couteau Chef",89.99],["Planche Decouper",24.99],["Set 5 Couteaux",129.99],["Balance Cuisine",29.99]],
  robots_cuisine: [["Robot Patissier",249.99],["Blender Puissant",149.99],["Cafetiere Expresso",199.99],["Air Fryer",129.99],["Multi Cooker",179.99],["Bouilloire Electrique",49.99]],
  vaisselle: [["Set 16 Assiettes",89.99],["Verres a Vin",49.99],["Mugs Cafe",39.99],["Couverts Inox",99.99],["Bol Ceramique",24.99],["Set Complet Vaisselle",199.99]],
  fromages: [["Camembert Normandie",12.99],["Roquefort AOP",15.99],["Comte 24 mois",19.99],["Brie de Meaux",14.99],["Chevre Frais",8.99],["Tomme Savoie",16.99],["Reblochon",13.99],["Munster",11.99]],
  chocolat: [["Tablette Noir 85%",8.99],["Coffret 24 Truffes",29.99],["Chocolat Lait Bio",6.99],["Pralines Belges",24.99],["Chocolat Blanc",7.99],["Chocolat Rubis",12.99]],
  cafe: [["Cafe Arabica Bio",19.99],["Cafe Robusta",15.99],["Capsules Cafe",29.99],["Moulin a Cafe",49.99],["Cafetiere Italienne",39.99],["Cafe Grains 1kg",24.99]],
  the: [["The Vert Sencha",19.99],["The Noir Earl Grey",15.99],["The Blanc",24.99],["The Oolong",29.99],["Rooibos Vanille",12.99],["Matcha Ceremonie",39.99]],
  vins: [["Bordeaux Rouge",24.99],["Bourgogne Blanc",29.99],["Champagne",59.99],["Cotes du Rhone",19.99],["Loire",22.99],["Alsace Riesling",26.99]],
  biere: [["Biere Artisanale IPA",6.99],["Biere Blonde",5.99],["Biere Brune",6.49],["Coffret 6 Bieres",24.99],["Biere Triple",7.99],["Pack 12 Bieres",39.99]],
  epicerie: [["Huile Olive Bio",19.99],["Vinaigre Balsamique",14.99],["Sel de Guerande",8.99],["Poivre Noir",12.99],["Miel Bio",15.99],["Confiture Maison",9.99]],
  snacks: [["Amandes Grillees",12.99],["Noix Melange",14.99],["Fruits Secs Bio",11.99],["Chips Artisanales",6.99],["Barres Cereales",9.99],["Popcorn Bio",5.99]],
  patisserie: [["Moule Patisserie",24.99],["Poche Douille",19.99],["Emporte-piece Set",14.99],["Rouleau Patisserie",17.99],["Thermometre Cuisson",12.99],["Balance Precision",34.99]],
  glaces: [["Sorbetiere Machine",89.99],["Moules Glace",19.99],["Cuillere Glace",12.99],["Cornets Gaufres",9.99],["Sirop Glace",14.99],["Coffret Glaces",29.99]],
  outils: [["Perceuse Sans Fil",149.99],["Set Tournevis",49.99],["Marteau Pro",34.99],["Scie Circulaire",199.99],["Caisse a Outils",89.99],["Metre Laser",69.99]],
  perceuses: [["Perceuse Visseuse",129.99],["Perceuse Percussion",179.99],["Perceuse Colonne",249.99],["Mini Perceuse",79.99]],
  jardin: [["Arrosoir",29.99],["Tondeuse Pelouse",249.99],["Secateur",34.99],["Pelle Beche",39.99],["Tuyau Arrosage",49.99],["Serre",199.99]],
  plantes: [["Monstera Deliciosa",39.99],["Ficus Lyrata",59.99],["Cactus Geant",49.99],["Pothos Dore",19.99],["Orchidee",34.99],["Aloe Vera",14.99]],
  sport: [["Tapis Yoga",39.99],["Halteres 10kg",79.99],["Corde a Sauter",19.99],["Elastiques Fitness",24.99],["Velo Appartement",399.99],["Banc Musculation",249.99]],
  fitness: [["Barre de Traction",49.99],["Kettlebell 16kg",89.99],["Roue Abdo",34.99],["Gants Fitness",24.99],["Ceinture Lombaire",39.99],["Balance Connectee",79.99]],
  velos: [["VTT 27.5 pouces",449.99],["Velo Route",1499.99],["Velo Ville",599.99],["Velo Electrique",1299.99],["BMX Freestyle",349.99],["Velo Enfant",199.99]],
  auto: [["Support Telephone Voiture",29.99],["Chargeur Voiture",24.99],["Camera Dashcam",149.99],["Aspirateur Voiture",49.99],["Housse Siege",89.99],["Nettoyeur Haute Pression",199.99]],
  bebe: [["Poussette",399.99],["Siege Auto Bebe",249.99],["Lit Bebe",299.99],["Biberon Bebe",29.99],["Body Bebe",19.99],["Jouet Eveil",34.99]],
  cosmetiques: [["Creme Visage Bio",39.99],["Serum Vitamine C",59.99],["Rouge a Levres",29.99],["Palette Maquillage",79.99],["Mascara Volume",24.99],["Fond de Teint",39.99],["Eyeliner Noir",19.99],["Blush Rose",29.99]],
  parfums: [["Parfum Homme Boise",129.99],["Eau de Toilette Frais",89.99],["Parfum Oriental",149.99],["Coffret 3x30ml",79.99],["Parfum Sport",99.99],["After-Shave",49.99]],
  ongles: [["Vernis a Ongles",14.99],["Kit Manucure",39.99],["Lime Ongles",9.99],["Top Coat",12.99],["Base Coat",11.99],["Set Ongles Gel",49.99]],
  soins_cheveux: [["Shampooing Bio",24.99],["Apres-Shampooing",21.99],["Masque Cheveux",29.99],["Huile Argan",34.99],["Seche-cheveux",79.99],["Lisseur Cheveux",89.99]],
  soins_visage: [["Nettoyant Visage",29.99],["Masque Argile",24.99],["Hydratant Jour",39.99],["Contour Yeux",34.99],["Gommage Visage",27.99],["Kit Soin Complet",89.99]],
  barbe: [["Tondeuse Barbe",89.99],["Rasoir Electrique",129.99],["Huile Barbe",24.99],["Baume Barbe",19.99],["Kit Rasage",79.99],["Brosse Barbe",14.99]],
  animaux: [["Panier Chien",79.99],["Croquettes 15kg",49.99],["Jouet Chat",19.99],["Laisse Chien",29.99],["Fontaine Eau Chat",59.99],["Arbre a Chat",129.99]],
  jouets: [["Set LEGO",89.99],["Puzzle 1000 Pieces",24.99],["Poupee",39.99],["Voiture Telecommandee",79.99],["Figurine",29.99],["Jeu de Societe",44.99]],
  jeux_societe: [["Monopoly",39.99],["Echecs",49.99],["Poker Set",59.99],["Uno",19.99],["Scrabble",34.99],["Dames",24.99]],
  musique: [["Guitare Acoustique",299.99],["Guitare Electrique",799.99],["Clavier Piano",249.99],["Batterie Electronique",599.99],["Ukulele",79.99],["Harmonica",29.99]],
  guitares: [["Fender Acoustique",349.99],["Stratocaster",899.99],["Guitare Classique Yamaha",199.99],["Basse Ibanez",449.99],["Epiphone Folk",349.99],["Guitare 12 Cordes",899.99]],
  instruments: [["Violon Debutant",149.99],["Flute Traversiere",129.99],["Saxophone",899.99],["Trompette",449.99],["Accordeon",799.99],["Djembe",149.99]],
  voyage: [["Oreiller Voyage",24.99],["Masque Sommeil",19.99],["Adaptateur Universel",29.99],["Cadenas TSA",14.99],["Organisateur Bagage",34.99],["Trousse Toilette",29.99]],
  livres: [["Roman Best-Seller",19.99],["Livre Dev Perso",24.99],["BD Enfant",14.99],["Guide Pratique",29.99],["Carnet Notes",19.99],["Agenda 2026",24.99]],
  papeterie: [["Cahier A4",9.99],["Stylos Luxe",19.99],["Agenda Cuir",34.99],["Trousse Ecole",24.99],["Carnet Cuir",29.99],["Set Bureau",49.99]],
  natation: [["Lunettes Natation",24.99],["Bonnet de Bain",19.99],["Palmes",39.99],["Tuba",34.99],["Combinaison Natation",89.99],["Pince Nez",9.99]],
  camping: [["Tente 2 Places",149.99],["Sac de Couchage",79.99],["Rechaud Camping",49.99],["Lampe Torche",39.99],["Sac a Dos Rando",99.99],["Gourde Inox",29.99]],
  peche: [["Canne a Peche",89.99],["Moulinet",59.99],["Leurres Peche",39.99],["Boite Peche",49.99],["Filet Epuisette",29.99],["Chaise Peche",79.99]],
  moto: [["Casque Moto",249.99],["Gants Moto",89.99],["Blouson Moto",299.99],["Antivol Moto",79.99],["Intercom Moto",179.99],["Sacoche Moto",129.99]],
  aquarium: [["Aquarium 100L",299.99],["Pompe Filtre",88.99],["Eclairage LED Aquarium",59.99],["Chauffage Aquarium",44.99],["Nourriture Poisson",19.99],["Plantes Aquatiques",24.99]],
};

const SYNONYMS: Record<string, string> = {
  beaute: "cosmetiques", beauté: "cosmetiques", beautes: "cosmetiques", maquillage: "cosmetiques",
  cosmetique: "cosmetiques", cosmetiques: "cosmetiques", makeup: "cosmetiques",
  soin: "cosmetiques", soins: "cosmetiques",
  mode: "jeans", vetements: "jeans", vêtements: "jeans", habit: "jeans", habits: "jeans", fringues: "jeans", fashion: "jeans",
  chaussure: "sneakers", chaussures: "chaussures_homme", basket: "sneakers", baskets: "sneakers", shoe: "sneakers", shoes: "sneakers",
  tech: "smartphones", technologie: "smartphones", informatique: "ordinateurs", ordinateur: "ordinateurs", ordi: "ordinateurs", pc: "ordinateurs",
  telephone: "smartphones", phone: "smartphones", portable: "smartphones", gadget: "smartphones", high_tech: "smartphones",
  maison: "meubles", deco: "decoration", decoration: "decoration", déco: "decoration", interieur: "decoration", home: "meubles",
  cuisine: "cuisine", bouffe: "fromages", nourriture: "fromages", food: "fromages", manger: "fromages", alimentaire: "fromages",
  boisson: "vins", boissons: "vins", alcool: "vins",
  sport: "sport", fitness: "fitness", muscu: "fitness", musculation: "fitness", gym: "fitness", workout: "fitness",
  velo: "velos", velos: "velos", vélo: "velos", vélos: "velos", bicyclette: "velos",
  auto: "auto", voiture: "auto", voitures: "auto", automobile: "auto", bagnole: "auto",
  enfant: "bebe", enfants: "bebe", bébé: "bebe", bebe: "bebe", gosse: "bebe",
  musique: "musique", music: "musique", guitare: "guitares",
  voyage: "voyage", voyages: "voyage", valise: "valises", valises: "valises",
  livre: "livres", livres: "livres", lecture: "livres",
  parfum: "parfums", parfums: "parfums",
  cheveux: "soins_cheveux", visage: "soins_visage", peau: "soins_visage",
  barbe: "barbe", barbier: "barbe", rasage: "barbe",
  bijou: "bijoux", bijoux: "bijoux", joyaux: "bijoux", joaillerie: "bijoux",
  sac: "sacs", sacs: "sacs", bagagerie: "sacs",
  fleur: "plantes", fleurs: "plantes", plante: "plantes", plantes: "plantes",
  outil: "outils", outils: "outils", bricolage: "outils",
  nage: "natation", natation: "natation", piscine: "natation", swim: "natation",
  peche: "peche", pêche: "peche", camping: "camping", rando: "camping", randonnee: "camping",
  animaux: "animaux", animal: "animaux", chien: "animaux", chat: "animaux",
  slip: "slips", slips: "slips", calecon: "sous_vetements_homme", boxer: "sous_vetements_homme",
  ongles: "ongles", manucure: "ongles",
  sous_vetements: "sous_vetements_homme", "sous vetements": "sous_vetements_homme",
  robe: "robes", robes: "robes", jupe: "jupes", jupes: "jupes",
};

const FR_TO_EN_IMG: Record<string, string> = {
  bijoux: "jewelry", bijou: "jewelry", bague: "ring", bracelets: "bracelet", colliers: "necklace",
  beaute: "cosmetics", beauté: "cosmetics", maquillage: "makeup", cosmetiques: "cosmetics",
  creme: "cosmetic-cream", serum: "serum", parfum: "perfume", parfums: "perfume",
  sacs: "handbag", sac: "bag", "sac a dos": "backpack", valises: "suitcase",
  sneakers: "sneakers", chaussures: "shoes", "chaussures homme": "shoes", bottes: "boots", sandales: "sandals",
  montres: "watch", montre: "watch", "montres connectees": "smartwatch",
  portefeuilles: "wallet", ceintures: "belt", lunettes: "sunglasses", "lunettes soleil": "sunglasses",
  casquettes: "cap", chapeaux: "hat", bonnets: "beanie", gants: "gloves", echarpes: "scarf", cravates: "tie",
  tshirts: "tshirt", polos: "polo", chemises: "shirt", pulls: "sweater", sweats: "hoodie",
  vestes: "jacket", manteaux: "coat", jeans: "jeans", pantalons: "pants", shorts: "shorts",
  chaussettes: "socks", "sous vetements": "underwear", slips: "underwear", boxer: "underwear",
  pyjamas: "pajamas", robes: "dress", jupes: "skirt",
  smartphones: "smartphone", telephone: "phone", tablettes: "tablet", ordinateurs: "laptop", ordinateur: "laptop",
  claviers: "keyboard", souris: "mouse", casques: "headphones", ecouteurs: "earbuds", enceintes: "speaker",
  microphones: "microphone", webcams: "webcam", drones: "drone", cameras: "camera",
  imprimantes: "printer", ecrans: "monitor", chargeurs: "charger", cables: "cable",
  "batteries externes": "powerbank", "coques tel": "phone-case",
  meubles: "furniture", canapes: "sofa", chaises: "chair", tables: "table", lits: "bed",
  armoires: "wardrobe", eclairage: "lamp", tapis: "carpet", decoration: "decoration",
  rideaux: "curtain", coussins: "cushion", couvertures: "blanket", draps: "bedding",
  sdb: "bathroom", rangement: "storage", menage: "cleaning",
  cuisine: "kitchen", "robots cuisine": "kitchen-appliance", vaisselle: "dishes",
  fromages: "cheese", chocolat: "chocolate", cafe: "coffee", the: "tea",
  vins: "wine", biere: "beer", epicerie: "grocery", snacks: "snack", patisserie: "pastry", glaces: "ice-cream",
  outils: "tools", perceuses: "drill", jardin: "garden", plantes: "plant",
  sport: "sport", fitness: "fitness", velos: "bicycle", velo: "bicycle",
  natation: "swimming", camping: "camping", peche: "fishing",
  auto: "car", moto: "motorcycle", bebe: "baby", jouets: "toys", "jeux societe": "board-game",
  animaux: "pet", ongles: "nail-polish", "soins cheveux": "haircare", "soins visage": "skincare",
  musique: "music", guitares: "guitar", instruments: "instrument",
  voyage: "travel", livres: "book", papeterie: "stationery", aquarium: "aquarium",
};

function getImageKeyword(name: string, category: string): string {
  const nameLower = name.toLowerCase();
  for (const [fr, en] of Object.entries(FR_TO_EN_IMG)) {
    if (nameLower.includes(fr)) return en;
  }
  const catLower = category.toLowerCase().trim();
  if (FR_TO_EN_IMG[catLower]) return FR_TO_EN_IMG[catLower];
  for (const [fr, en] of Object.entries(FR_TO_EN_IMG)) {
    if (catLower.includes(fr) || fr.includes(catLower)) return en;
  }
  return catLower.replace(/[^a-z]/g, "") || "product";
}

function findCategory(keyword: string): ProductDef[] | null {
  const lower = keyword.toLowerCase().trim();
  if (SYNONYMS[lower] && CATEGORIES[SYNONYMS[lower]]) return CATEGORIES[SYNONYMS[lower]];
  if (CATEGORIES[lower]) return CATEGORIES[lower];

  const synKeys = Object.keys(SYNONYMS);
  for (const syn of synKeys) {
    if (lower.includes(syn) || syn.includes(lower)) {
      const target = SYNONYMS[syn];
      if (CATEGORIES[target]) return CATEGORIES[target];
    }
  }

  const keys = Object.keys(CATEGORIES);
  for (const key of keys) {
    const keyClean = key.replace(/_/g, " ");
    if (lower.includes(keyClean) || keyClean.includes(lower)) return CATEGORIES[key];
  }

  const words = lower.split(/[\s,]+/);
  for (const w of words) {
    if (w.length < 3) continue;
    for (const syn of synKeys) {
      if (syn.includes(w) || w.includes(syn)) {
        const target = SYNONYMS[syn];
        if (CATEGORIES[target]) return CATEGORIES[target];
      }
    }
    for (const key of keys) {
      const keyClean = key.replace(/_/g, " ");
      if (keyClean.includes(w) || w.includes(keyClean)) return CATEGORIES[key];
    }
  }
  return null;
}

export function getRandomProducts(keyword: string, count: number): any[] {
  const category = findCategory(keyword);

  if (!category) {
    console.warn("⚠️ Catégorie inconnue:", keyword);
    const allKeys = Object.keys(CATEGORIES);
    const result: any[] = [];
    for (let i = 0; i < count; i++) {
      const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
      const list = CATEGORIES[randomKey];
      const [name, price] = list[Math.floor(Math.random() * list.length)];
      result.push(buildProduct(name, price, i, keyword));
    }
    return result;
  }

  const shuffled = [...category].sort(() => Math.random() - 0.5);
  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    const [name, price] = shuffled[i % shuffled.length];
    result.push(buildProduct(name, price, i, keyword));
  }
  return result;
}

function buildProduct(name: string, price: number, i: number, keyword: string): any {
  const seed = Math.floor(Math.random() * 99999) + i;
  const imgKeyword = getImageKeyword(name, keyword);
  const imgUrl = "https://loremflickr.com/600/600/" + encodeURIComponent(imgKeyword) + "?lock=" + seed;

  const desc = name + " - produit premium de qualite superieure.";
  return {
    id: "local-" + seed + "-" + i,
    name: name,
    description: desc,
    price: price,
    oldPrice: Math.round(price * 1.3 * 100) / 100,
    image: imgUrl,
    rating: 4.5 + Math.random() * 0.4,
    reviews: 50 + Math.floor(Math.random() * 500),
    badge: ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"][i % 4],
    sku: "LOCAL-" + String(i + 1).padStart(3, "0"),
    category: keyword,
  };
}