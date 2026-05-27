// Crystal Ball — Shared chrome, data, and animations
// Exposes everything on window for per-page Babel scripts to consume.
const { useState, useRef, useEffect } = React;

// --- JSON-LD STRUCTURED DATA (injected into <head> on every page) ---
(function injectStructuredData() {
  if (document.querySelector('script[data-cb-schema]')) return;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://crystal-ball.ca/#organization",
        "name": "Crystal Ball Windows & Doors",
        "alternateName": "Crystal Ball",
        "url": "https://crystal-ball.ca/",
        "logo": "img/Crystal-Ball-Full-Color-Vertical-scaled.png",
        "description": "High-performance European windows, doors, and curtain wall systems supplied to the Canadian commercial, custom residential, and dealer markets.",
        "areaServed": { "@type": "Country", "name": "Canada" }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://crystal-ball.ca/#localbusiness",
        "name": "Crystal Ball Windows & Doors",
        "image": "img/Crystal-Ball-Hero-scaled.webp",
        "url": "https://crystal-ball.ca/",
        "email": "Ilan@crystal-ball.ca",
        "telephone": "+1-647-622-3226",
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "ON",
          "addressCountry": "CA"
        },
        "areaServed": [
          { "@type": "AdministrativeArea", "name": "Ontario" },
          { "@type": "AdministrativeArea", "name": "Quebec" },
          { "@type": "AdministrativeArea", "name": "Atlantic Canada" },
          { "@type": "AdministrativeArea", "name": "Prairie Provinces" },
          { "@type": "AdministrativeArea", "name": "British Columbia" }
        ],
        "knowsAbout": [
          "European Windows",
          "Tilt and Turn Windows",
          "Lift and Slide Doors",
          "Curtain Wall Systems",
          "Storefront Systems",
          "Passive House",
          "Net Zero Construction",
          "Building Envelope",
          "Facade Systems",
          "EnerPHit",
          "LEED"
        ]
      }
    ]
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-cb-schema', '');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
})();

// --- GLOBAL DATA ---
const propertyImages = [
  'img/unsplash-1600607687920-4e2a09cf159d.jpg',
  'img/unsplash-1600585154340-be6161a56a0c.jpg',
  'img/unsplash-1511818966892-d7d671e672a2.jpg',
  'img/unsplash-1494526585095-c41746248156.jpg',
  'img/unsplash-1505693416388-ac5ce068fe85.jpg',
  'img/unsplash-1600047509807-ba8f99d2cdde.jpg',
];

// Each product carries a `mechanism` field — how the system operates —
// so the homepage accordion can group products by what they do, not
// just what they're made of. Six mechanism families cover the catalog:
// Tilt & Turn, Casement/Awning/Fixed, Lift & Slide, Sliding & Folding,
// Entry & Swing Doors, Curtain Wall.
// Each product carries two images:
//   `image`  -> the product shot (clean studio-style) — used as the
//               primary image everywhere the product is referenced
//               specifically (product detail page main, etc.)
//   `image2` -> a lifestyle / context shot, surfaced as the second
//               thumbnail on the detail-page gallery switcher.
// Manufacturer-sourced legacy paths (j-nadl-*, jedraszek-*, al_*,
// MDS-*, shutterstock_*, etc.) have been retired and replaced with
// the in-house lifestyle-*.webp set used for mega-menu featureImage,
// hero/section imagery, and product image2 fallbacks.
const compressedProductsBackup = [
  {
    id: 'imperial-aliplast', name: 'Imperial (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/imperial-aliplast-1.webp', image2: 'img/imperial-aliplast-2.webp',
    description: 'The Imperial IPi and IPi+ system delivers high thermal insulation for windows, doors and shopfronts, designed for use in residential and public buildings.',
    specs: [
      'Special thermal inserts between separators and glass pane',
      'Large profile range for appearance and structural strength',
      'Glazing strips in rectangular and circular variants',
      'Compatible with hidden hinges and PCV hardware',
      'Supports single, double cavity, acoustic and anti-burglary glazing',
      'Profile bending option available',
      'RAL palette, texture, Wood Color Effect and anodized finishes',
    ],
  },
  {
    id: 'genesis-aliplast', name: 'Genesis (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/genesis-aliplast-1.webp', image2: 'img/genesis-aliplast-2.webp',
    description: 'Genesis is a three-chamber aluminium window and door system engineered for increased thermal insulation, meeting the latest energy requirements with Uw values from 0.90 W/m²K.',
    specs: [
      'Thermal performance: Uw from 0.90 W/m²K',
      'Additional thermal gasket alongside the central gasket',
      'Superior air infiltration and water-tightness ratings',
      'Renovation profile options for custom finishes',
      'Genesis OUT variant for outward-opening windows',
      'RAL palette, texture, Wood Color Effect, anodized and bi-color finishes',
    ],
  },
  {
    id: 'mb-86-aluprof', name: 'MB-86 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/mb-86-aluprof-1.webp', image2: 'img/mb-86-aluprof-2.webp',
    description: "MB-86 is the world's first aluminium window and door system to use silica aerogel insulation, available in ST, SI and AERO variants for maximum energy conservation.",
    specs: [
      'Silica aerogel fill — world-first for aluminium window systems',
      'Three variants: ST, SI and AERO for varying thermal requirements',
      'Wide thermal breaks with additional insulation zone barrier',
      'Two-component central gasket for thermal and acoustic sealing',
      'Compatible with concealed hinges and multi-point locking',
      'Supports triple glazing, acoustic and security panes',
      'Anti-burglary rated to RC3 class (RC3i for windows)',
    ],
  },
  {
    id: 'mb-70-aluprof', name: 'MB-70 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/mb-70-aluprof-1.webp', image2: 'img/mb-70-aluprof-2.webp',
    description: 'MB-70 is a versatile aluminium system for windows, doors, vestibules and shopfronts, with enhanced thermal and acoustic performance through thermal breaks and optimised gaskets.',
    specs: [
      'Three-chamber profile, 70 mm frame depth',
      'Burglar-resistant up to RC4 class',
      'Concealed sash window variants: MB-70US and MB-70SG',
      'Historic building variant available: MB-70 Industrial',
      'Glass panel thickness 12–57 mm across all applications',
      'Base for MB-70CW cold-warm curtain wall',
      'Powder coat and anodized finish options',
    ],
  },
  {
    id: 'energeto-neo', name: 'energeto® neo (Aluplast)', tag: 'uPVC - T&T and Swing', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/energeto-neo-1.webp', image2: 'img/energeto-neo-2.webp',
    description: 'energeto® neo combines very slim profiles with a choice of recessed or flush-mounted configurations, offering leading thermal insulation and burglary protection in a contemporary cubic design.',
    specs: [
      'Recessed version: Uf = 1.00 W/m²K, Uw down to 0.73 W/m²K',
      'Flush version: Uf = 0.87 W/m²K, Uw down to 0.67 W/m²K',
      'Suitable for large properties and architect-designed homes',
      'Available in recessed and flush-mounted closed versions',
      'Highest-level thermal insulation and burglary protection',
      'Contemporary slim, cubic aesthetic',
    ],
  },
  {
    id: 'neo-casement', name: 'neo-casement (Aluplast)', tag: 'uPVC - Casement', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/neo-casement-1.webp', image2: 'img/neo-casement-2.webp',
    description: 'neo casement delivers German engineering precision adapted for North American requirements — a modern crank casement with outstanding energy efficiency and compatibility with standard North American fittings.',
    specs: [
      '85 mm construction depth for maximum efficiency and stability',
      'Extra-rigid 32 mm nailing fin, pre-drilled for quick installation',
      'Triple glazing up to 46 mm glass thickness',
      'U-value window up to 0.87 W/m²K (0.15 BTU/h·ft²·°F)',
      'Steel reinforcements and triple thermoplastic co-extruded seals',
      'Integrated fly screen channel for flexscreen®',
      'Compatible with standard North American casement, awning and picture windows',
    ],
  },
  {
    id: '300-casement', name: '300 series (Casement)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-casement-1.webp', image2: 'img/300-casement-2.webp',
    description: 'Fibertec 300 series fiberglass casement windows offer compression sealing, 90° opening for maximum ventilation, and superior air/water tightness — built to never warp, twist, rot, shrink or dent.',
    specs: [
      '3¼″ pultruded fiberglass closed-back frame with polystyrene fill',
      'Sizes from 16×18″ up to 36×72″',
      'Double or triple glazing with LowE, Argon and Super Spacer options',
      'Three-seal rain screen design with replaceable weather stripping',
      'Tested to AAMA/WDMA/CSA 101 NAFS 2022 standards',
      'Anti-corrosion interior insect screens',
    ],
  },
  {
    id: '300-awning', name: '300 series (Awning)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-awning-1.webp', image2: 'img/lifestyle-arched-window.webp',
    description: 'Fibertec 300 series fiberglass awning windows open outward for ventilation even in rain, with narrow sight lines for maximum glass area — built to never warp, twist, rot, shrink or dent.',
    specs: [
      '3¼″ pultruded fiberglass closed-back frame with polystyrene fill',
      'Sizes from 22×18″ up to 60×48″',
      'Double or triple glazing with LowE, Argon and Super Spacer options',
      'Three-seal rain screen design with replaceable weather stripping',
      'Truth Encore dual-arm roto-gear mechanism',
      'Tested to AAMA/WDMA/CSA 101 NAFS 2022 standards',
    ],
  },
  {
    id: '300-fixed', name: '300 series (Fix window)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-fixed-1.webp', image2: 'img/lifestyle-curtain-wall-interior.webp',
    description: 'Fibertec 300 series fiberglass fixed windows maximise light and views with narrow sight lines — stationary units built to never warp, twist, rot, shrink or dent.',
    specs: [
      '3¼″ pultruded fiberglass closed-back frame with polystyrene fill',
      'Sizes from 12×12″ up to 84×84″',
      'Double or triple glazing with LowE, Argon and Super Spacer options',
      'High-performance fiberglass glazing stop with Santoprene gasket',
      'Tested to AAMA/WDMA/CSA 101 NAFS 2022 standards',
      'Low-VOC Acrythane paint with UV protector',
    ],
  },
  {
    id: 'genesis-75mm', name: 'Genesis 75mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/genesis-75mm-1.webp', image2: 'img/genesis-75mm-2.webp',
    specs: ['High thermal insulation', 'Robust structural integrity'],
  },
  {
    id: 'imperial-65mm', name: 'Imperial 65mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/imperial-65mm-1.webp', image2: 'img/lifestyle-double-entry-doors.webp',
    specs: ['Durable frame construction', 'Commercial grade hardware'],
  },
  {
    id: 'energio-fortis', name: 'Energio Fortis', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/energio-fortis-1.jpg', image2: 'img/energio-fortis-2.webp',
    specs: ['Enhanced security multi-point locks', 'Superior weather sealing'],
  },
  {
    id: 'modern-slide', name: 'Modern Slide', tag: 'Aluminum', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/modern-slide-1.webp', image2: 'img/modern-slide-2.webp',
    description: 'The Modernslide range enables large openings with fine profiles and attractive hardware, offering a slim sliding aesthetic for contemporary residential and commercial projects.',
    specs: [
      'Profile: MODERNSLIDE Aliplast sliding system',
      '65 mm sleepers — ISO 120/140/160 — all installation types',
      'Uw ≥ 1.7 W/m²K',
      'Glazing thickness up to 28 mm',
      'Sarena & Confort Slide handle options',
    ],
  },
  {
    id: 'ultra-glide', name: 'Ultra Glide', tag: 'Aluminum - Lift and Slide', category: 'Doors', mechanism: 'Lift & Slide',
    image: 'img/ultra-glide-1.jpg', image2: 'img/lifestyle-sliding-bamboo.webp',
    description: 'Ultra Glide is a premium lift-and-slide system with Chicane 125 mm frame configuration, supporting panels up to 300 kg and heights up to 3.2 m for large-format openings.',
    specs: [
      'Profile: ULTRAGLIDE SLIM — premium product',
      'Maximum leaf weight: 300 kg',
      'Heights up to 3.2 m with Chicane 125 mm configuration',
      '153 mm sleepers — tunnel or rabbet installation',
      'Uw ≥ 0.8 W/m²K',
      'Glazing thickness up to 56 mm',
    ],
  },
  {
    id: 'panorama', name: 'PANORAMA', tag: 'Aluminum - Accordion/Bi-fold', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/panorama-1.webp', image2: 'img/panorama-2.webp',
    description: 'PANORAMA is an aluminium accordion/bi-fold door that seamlessly connects interior and exterior — functioning as a full opening in fine weather or an elegant partition in any conditions.',
    specs: [
      'Profile: PANORAMA Aliplast',
      '74.5 mm sleepers — ISO 120/140/160 — Reno 40/65 mm available',
      'Uw ≥ 1.3 W/m²K (double glazing); 0.95 W/m²K (triple glazing)',
      'Glazed thickness up to 40 mm',
      'Recessed threshold option for seamless floor transition',
    ],
  },
  {
    id: 'neo-smart-slide', name: 'neo smart-slide', tag: 'uPVC - Standard sliding', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/neo-smart-slide-1.webp', image2: 'img/neo-smart-slide-2.webp',
    description: 'neo smart-slide is a slim, cubic sliding door system supporting elements up to 6.0 × 2.5 m, built on the energeto® neo platform for large glass surfaces and seamless indoor-outdoor flow.',
    specs: [
      '78 mm or 154 mm installation depth',
      'Uf = 1.3 W/m²K',
      'Glass and panel thickness up to 54 mm (double to triple glazing)',
      'Built on the energeto® neo system platform',
      'Integrated hardware-neutral technology',
      'Multiple opening schemes (A + C)',
      'woodec, aludec and colour world decor variants',
    ],
  },
  {
    id: 'lift-slide', name: 'lift-slide (Aluplast)', tag: 'uPVC - Lift and slide', category: 'Doors', mechanism: 'Lift & Slide',
    image: 'img/lift-slide-1.webp', image2: 'img/lift-slide-2.webp',
    description: 'The Aluplast lift-and-slide door reaches maximum dimensions of 6.50 × 2.80 m with effortless operation and barrier-free transitions, tested under extreme weather conditions.',
    specs: [
      '85 mm construction depth',
      'Uf = 1.3 W/m²K; Uw = 0.87 W/m²K (standard triple glazing)',
      'Uw = 0.71 W/m²K best possible option',
      'Thermally-broken threshold with aluminium guide rail',
      'Up to RC2 burglar protection',
      'Maximum panel size 6.50 × 2.80 m',
    ],
  },
  {
    id: '200-entry', name: '200 series (entry doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/200-entry-1.webp', image2: 'img/200-entry-2.webp',
    description: 'Fibertec 200 series fiberglass entry doors combine steel-level security with corrosion resistance — foam-filled pultruded frames that will not bow, warp, crack, scratch, splinter, dent or rust.',
    specs: [
      '6½″ pultruded fiberglass frame with polyurethane foam fill',
      'Smooth or woodgrain fiberglass slab skins, flush or embossed',
      'Slab sizes 30–36″ wide × 80″ or 96″ height',
      'Thermally broken aluminium sill with drainage system',
      'Multi-point 3-deadbolt locking mechanism',
      'Tested and rated by AAMA and NFRC',
    ],
  },
  {
    id: '750-sliding', name: '750 series (Sliding doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/750-sliding-1.webp', image2: 'img/750-sliding-2.webp',
    description: 'Fibertec 750 series fiberglass sliding patio door features heavy-duty sashes, insulated closed-back frames and an authentic wood-like surface — in 2, 3 or 4-panel configurations.',
    specs: [
      '5¾″ pultruded fiberglass closed-back frame',
      '2, 3 or 4 panel configurations up to 189×96″',
      'Triple glazing and oak veneer laminate options',
      'Tempered glass standard; tempered triple glazing optional',
      'Tested to AAMA/WDMA/CSA 101 NAFS standards',
      'Spring-loaded sliding insect screen included',
    ],
  },
  {
    id: 'mc-wall', name: 'MC Wall (Aliplast)', tag: 'Aluminum', category: 'Curtain wall', mechanism: 'Curtain Wall',
    image: 'img/mc-wall-1.webp', image2: 'img/mc-wall-2.webp',
    description: "MC Wall is Aliplast's modular curtain wall platform for simple and complex facade structures, including MC Passive, MC Passive+, MC Glass and MC Fire configurations.",
    specs: [
      'Mullion-transom visual width: 55 mm',
      'Wide mullion and transom range for structural requirements',
      'Adjustable insulators to match any infill thickness',
      'Decorative cover cap range for varied visual effects',
      'Profile bending in both planes for complex geometries',
      'RAL palette, texture, Wood Color Effect and anodized finishes',
    ],
  },
];

const products = [
  {
    id: 'imperial-aliplast', name: 'Imperial (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/imperial-aliplast-1.webp', image2: 'img/imperial-aliplast-2.webp',
    description: 'The Imperial system is a solution with increased thermal insulation: IPi and IPi+. It is intended for the construction of windows, doors and shop windows with high thermal insulation parameters.',
    specs: [
      'A high thermal insulation power was achieved by applying special thermal inserts between thermal separators and around the glass pane',
      'Large number of shapes in the system guarantees the obtained desired appearance and structural strength',
      'Glazing strips available in a rectangular and circular variant',
      'The shapes of profiles are suitable for the installation of various peripheral hardware, including hidden hinges and PCV hardware',
      'A broad range of glazing allows using all types of single and double cavity, acoustic and anti-burglary glass panes',
      'The option of bending profiles',
      'The system is designed for use in residential and public buildings, and also allows designing modern window solutions in multiple variants',
      'The IPi and IPi+ systems are based on the proven, extensive and valued Imperial base system',
      'Wide range of colors: RAL palette, texture colors, Aliplast Wood Color Effect wood-like colors, or anodized color',
    ],
  },
  {
    id: 'genesis-aliplast', name: 'Genesis (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/genesis-aliplast-1.webp', image2: 'img/genesis-aliplast-2.webp',
    description: 'Genesis is a three-chamber, innovative window and door system designed for construction of doors and windows with increased thermal insulation.',
    specs: [
      'Thermal parameters meet the latest thermal insulation requirements: Uw from 0.90 W/m²K',
      'Genesis incorporates modern insulation materials; apart from a conventional central gasket, an additional thermal gasket has been developed',
      'The gasket solution helps achieve excellent window tightness for air infiltration and water-tightness, as well as innovative appearance and aesthetics',
      'The system allows customers to select various profile finish options so the window structure can be customized, including renovation profiles',
      'System options available: Genesis OUT for outward-opening windows',
      'Wide range of colors: RAL palette, texture colors, Aliplast Wood Color Effect wood-like colors, anodized color, or bi-color',
    ],
  },
  {
    id: 'mb-86-aluprof', name: 'MB-86 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/mb-86-aluprof-1.webp', image2: 'img/mb-86-aluprof-2.webp',
    description: 'The MB-86 window and door system meets requirements concerning energy conservation and environmental protection. The profile structure has three variants depending on thermal insulation requirements: ST, SI and AERO. MB-86 is the first aluminium window and door system in the world to use silica aerogel, a material with excellent thermal insulation. It also features exceptional profile inertia, allowing greater construction size and weight.',
    specs: [
      'With its new shape, wide thermal breaks allow the use of an additional barrier in the profiles insulation zone',
      'Two-component central gasket seals perfectly and thermally insulates the space between the casement and the frame',
      'Wide range of profiles guarantees the desired aesthetics and resistance',
      'Glazing strips with additional sealing come in three versions: Standard, Prestige and Style',
      'Profile shapes are well adapted to numerous multi-point locking systems, including concealed hinges',
      'A wide range of glazing allows the use of common triple glazing units, acoustic panes, and security panes',
      'Profile drainage functionality is available in two versions: traditional and concealed',
      'Possibility of making anti-burglary windows and doors up to RC3 class, with windows in RC3i class',
    ],
  },
  {
    id: 'mb-70-aluprof', name: 'MB-70 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/mb-70-aluprof-1.webp', image2: 'img/mb-70-aluprof-2.webp',
    description: 'MB-70 is a modern aluminium system intended for exterior architectural building elements requiring thermal and acoustic insulation, such as windows, doors, vestibules, display windows, or spatial structures. It features enhanced thermal qualities thanks to special insulating inserts inside the profiles and under the glass area. The system is characterized by a very low overall heat-transfer coefficient Uf thanks to thermal breaks and gaskets.',
    specs: [
      'MB-70 allows fabrication of burglar-resistant windows and doors up to class RC4',
      'Based on this system it is possible to create smoke exhaust windows and concealed sash windows, including MB-70US, MB-70US HI, and MB-70SG',
      'A version suitable for historic buildings is available: MB-70 Industrial',
      'The system is also a base for MB-70CW and MB-70CW HI-based cold-warm curtain wall',
      'Glass panel thickness ranges from 21 mm to 57 mm in window casements, and from 12 mm to 48 mm in fixed windows and door leafs',
      'The wide infill thickness range allows typical and untypical glass panels',
      'A wide choice of colors is available in the standard palette, with coatings made by powder coating or anodizing',
      'System profiles have a three-chamber structure',
      'Structural depth: window frame sections 70 mm, window casement 79 mm, doors 70 mm and 70 mm respectively',
    ],
  },
  {
    id: 'energeto-neo', name: 'energeto® neo (Aluplast)', tag: 'uPVC - T&T and Swing', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/energeto-neo-1.webp', image2: 'img/energeto-neo-2.webp',
    description: "energeto® neo is characterised by very slim profiles and picks up on current design trends. There is a recessed version that gives the window more spaciousness, and a flush-mounted, closed version that gives the room a uniform, closed look. Compatibility was at the forefront of the development, making energeto® neo suitable for large properties as well as an architect's house. Innovative aluplast technologies provide thermal insulation, burglary protection, and ease of use at the highest level.",
    specs: [
      'energeto® neo recessed version: Uf = 1.00 W/m²K',
      'energeto® neo recessed version: Uw = 0.73 W/m²K best possible option',
      'energeto® neo flush version: Uf = 0.87 W/m²K',
      'energeto® neo flush version: Uw = 0.67 W/m²K best possible option',
      'IDEAL neo recessed version: Uf = 1.2 W/m²K',
      'IDEAL neo recessed version: Uw = 0.79 W/m²K best possible option',
      'Footnote 1: with standard triple glazing Ug = 0.7 and Psi = 0.040 W/mK',
      'Footnote 2: with triple glazing with Ug = 0.5 and Psi = 0.030 W/mK',
      'Footnote 3: with foam inside',
    ],
  },
  {
    id: 'neo-casement', name: 'neo-casement (Aluplast)', tag: 'uPVC - Casement', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/neo-casement-1.webp', image2: 'img/neo-casement-2.webp',
    description: 'neo casement stands for German precision, adapted to North American requirements. The modern crank casement window impresses with its timeless design, outstanding energy efficiency, and innovative interior glazing for maximum security and ease of maintenance. With a construction depth of 85 mm, neo casement combines maximum energy efficiency, stability, and versatility. Modern profile technology, sophisticated sealing systems, and innovative details ensure reliable performance and optimum comfort in every climate zone.',
    specs: [
      'Extra sturdy nailing fin for lasting hold and easy installation',
      'Optimised for North American crank fittings',
      'Modern, cubic design for timeless architecture',
      'System depth: 85 mm (3 3/8 inches)',
      'Nailing fin: 32 mm (1 1/4 inches), recessed, extra rigid, and pre-drilled',
      'Triple glazing possible, with glass thicknesses up to 46 mm',
      'U-value frame up to 1.0 W/m²K (0.18 BTU/h·ft²·°F)',
      'U-value window up to 0.87 W/m²K (0.15 BTU/h·ft²·°F, with Ug = 0.6 W/m²K)',
      'Best-in-class wind load, air, and water resistance',
      'Steel reinforcements for high structural strength',
      'Flexible accessory channel for various add-on parts',
      'High-quality thermoplastically co-extruded seals: triple seal',
      'Integrated fly screen channel, optimised for flexscreen®',
      'Compatible with standard North American fittings',
      'Suitable for classic casement, awning, and picture windows',
    ],
  },
  {
    id: '300-casement', name: '300 series (Casement)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-casement-1.webp', image2: 'img/300-casement-2.webp',
    description: 'Fibertec fiberglass casement windows are compression sealing windows that open 90 degrees to provide maximum ventilation, easy cleaning, and superior air and water tightness. Fibertec carries extensive glass options for extreme weather climates. Anti-corrosion screens are on the inside of the window, allowing them to remain clean and protected from the elements. Fibertec has developed an advanced fiberglass window system that is environmentally friendly and used in sustainable building. Once installed, fiberglass windows will never warp, twist, rot, shrink, or dent.',
    specs: [
      'Standard series specification: 3¼″ pultruded fiberglass closed-back frame completely filled with laser die cut polystyrene',
      'Injection molded reinforced mitered corners with polyurethane foam fill, sealed with silicone sealant',
      'Sizes available: minimum width 16″, minimum height 18″, maximum width 36″, maximum height 72″',
      'Manufactured to specified sizes +/- 1/8″ (3.17 mm) industry tolerance',
      'Independently tested and rated in accordance with AAMA/WDMA/CSA 101/I.S.2/A440-11, NAFS, A440S1-17, AAMA/WDMA/CSA 101/I.S.2/A440-17, A440S1-19, AAMA/WDMA/CSA 101/I.S.2/A440-122, and NAFS 2022',
      'Double glazing: 7/8″ sealed units with 5/8″ air space',
      'Triple glazing option: 1 5/16″ sealed units, maximum operator width 36″',
      'Optional glazing available for climate condition or aesthetics, including LowE, Argon Gas, and Super Spacer',
      'Paint finish stock colors: White, Commercial Brown, Slate Grey, Black, and Sandalwood; co-colors also available',
      'Frames use Acrythane water-based paint with UV protector, rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Paint finish does not wrap around to the bottom edge of the frame when using nail fin application',
      'Attachments: three types of brickmold, jamb extensions, strap anchors, and nailing fin',
      'Weather stripping: three-seal design conforms to the rain screen principle',
      'Weather stripping combines flexible Santoprene bubble and saddle gasket on the main frame with pile fin on the sash',
      'Weather stripping is replaceable',
      'Hardware: Encore from Truth Hardware with interchangeable cover and folding handle design, available in white and black',
      'Insect screen: roll-formed aluminum screen bar with hidden spring-loaded corner key and anti-rot fiberglass mesh',
      'Glazing method: glass held by removable exterior glass stop with interior double-sided closed-cell foam tape and exterior Santoprene rubber gasket',
      'Glazing cavity is edge drained and edge vented to the exterior through concealed holes',
      'Installation to be performed by experienced installers in accordance with manufacturer instructions and CSA A440.4 standards',
      'Window must be plumb and square after installation and sealed to both interior and exterior wall with high quality sealant around the frame perimeter',
      'If perimeter cavity is foamed, additional anchorage may be required to prevent bowing',
      'Maintenance: occasional cleaning of glass and frame components with non-abrasive detergent; clean and lubricate hinge tracks as required',
    ],
  },
  {
    id: '300-awning', name: '300 series (Awning)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-awning-1.webp', image2: 'img/lifestyle-arched-window.webp',
    description: 'Fibertec fiberglass awning windows are compression sealing windows that open outwards to provide maximum ventilation even in rainy weather. They offer easy cleaning and superior air and water tightness. Fibertec windows provide one of the narrowest sight lines, giving more glass area. The awning window is more suitable for wider, shorter openings. Fibertec carries extensive glass options for extreme weather climates. Anti-corrosion screens are on the inside of the window, allowing them to remain clean and protected from the elements. Once installed, Fibertec windows will never warp, twist, rot, shrink, or dent.',
    specs: [
      'Standard series specification: 3 1/4″ pultruded fiberglass closed-back frame completely filled with laser die cut polystyrene',
      'Injection molded reinforced mitered corners with polyurethane foam fill, sealed with silicone sealant',
      'Sizes available: minimum width 22″, minimum height 18″, maximum width 60″, maximum height 48″',
      'Manufactured to specified sizes +/- 1/8″ (3.17 mm) industry tolerance',
      'Independently tested and rated in accordance with AAMA/WDMA/CSA 101/I.S.2/A440-11, NAFS, A440S1-17, AAMA/WDMA/CSA 101/I.S.2/A440-17, A440S1-19, AAMA/WDMA/CSA 101/I.S.2/A440-122, and NAFS 2022',
      'Double glazing: 7/8″ sealed units with 5/8″ air space',
      'Triple glazing option: 1 5/16″ sealed units, maximum operator width 36″',
      'Optional glazing available for climate condition or aesthetics, including LowE, Argon Gas, and Super Spacer',
      'Paint finish stock colors: White, Commercial Brown, Slate Grey, Black, and Sandalwood; co-colors also available',
      'Frames use Acrythane water-based paint with UV protector, rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Paint finish does not wrap around to the bottom edge of the frame when using nail fin application',
      'Attachments to frame: brickmould with or without nailing flange, three types; jamb extensions, strap anchors, and nailing fin',
      'Weather stripping: three-seal design conforms to the rain screen principle',
      'Weather stripping combines flexible Santoprene bubble and saddle gasket on the main frame with pile fin on the sash',
      'Weather stripping is replaceable',
      'Hardware: Truth Encore TM dual-arm roto-gear mechanism, available in white and black',
      'Insect screen: roll-formed aluminum screen bar with hidden spring-loaded corner key and anti-rot fiberglass mesh',
      'Glazing method: glass held by removable exterior glass stop with interior double-sided closed-cell foam tape and exterior Santoprene rubber gasket',
      'Glazing cavity is edge drained and edge vented to the exterior through concealed holes',
      'Installation to be performed by experienced installers in accordance with manufacturer instructions and CSA A440.4 standards',
      'Window must be plumb and square after installation and sealed to both interior and exterior wall with high quality sealant around the frame perimeter',
      'If perimeter cavity is foamed, additional anchorage may be required to prevent bowing',
      'Maintenance: occasional cleaning of glass and frame components with non-abrasive detergent is recommended',
    ],
  },
  {
    id: '300-fixed', name: '300 series (Fix window)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-fixed-1.webp', image2: 'img/lifestyle-curtain-wall-interior.webp',
    description: "Fibertec fiberglass fixed windows are stationary units that do not open. They're ideal for letting in light and exposing views, alone or in combination with other window styles such as casement or awning windows. Fibertec windows provide one of the narrowest sight lines, giving more glass area. Fibertec carries extensive glass options for extreme weather climates and has developed an advanced fiberglass window system that is environmentally friendly and used in sustainable building. Once installed, Fibertec windows will never warp, twist, rot, shrink, or dent.",
    specs: [
      'Specification: 3¼″ pultruded fiberglass closed-back frame completely filled with laser die cut polystyrene',
      'Injection molded reinforced mitered corners with polyurethane foam fill, sealed with silicone sealant',
      'Sizes available: minimum width 12″, minimum height 12″, maximum width 84″, maximum height 84″',
      'Manufactured to specified sizes +/- 1/8″ (3.17 mm) industry tolerance',
      'Independently tested and rated in accordance with AAMA/WDMA/CSA 101/I.S.2/A440-11, NAFS, A440S1-17, AAMA/WDMA/CSA 101/I.S.2/A440-17, A440S1-19, AAMA/WDMA/CSA 101/I.S.2/A440-122, and NAFS 2022',
      'Double glazing fiberglass glass stop: 7/8″ sealed unit with 5/8″ air space',
      'Triple glazing optional: 1 9/16″ sealed units',
      'Optional glazing available for climate condition or aesthetics, including LowE, Argon Gas, and Super Spacer',
      'Paint finish stock colors: White, Commercial Brown, Slate Grey, Black, and Sandalwood; co-colors also available',
      'Frames use Acrythane water-based paint with UV protector, rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Paint finish does not wrap around to the bottom edge of the frame when using nail fin application',
      'Attachments: brickmould with or without nailing flange, three types; jamb extensions, strap anchors, and nailing fin',
      'Glazing stop: high performance pultruded fiberglass glass stop with Santoprene gasket for a snug fit to the glazing',
      'Glazing tape is a closed cellular foam double adhesive-backed tape',
      'Installation to be performed by experienced installers in accordance with manufacturer instructions and CSA A440.4 standards',
      'Window must be plumb and square after installation and sealed to both interior and exterior wall with high quality sealant around the frame perimeter',
      'If perimeter cavity is foamed, additional anchorage may be required to prevent bowing',
      'Maintenance: occasional cleaning of glass and frame components with non-abrasive detergent is recommended',
    ],
  },
  {
    id: 'genesis-75mm', name: 'Genesis 75mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/genesis-75mm-1.webp', image2: 'img/genesis-75mm-2.webp',
    description: 'Source markdown notes that this product still needs a description from the referenced Energio tertiaires page.',
    specs: ['Description pending from source: https://www.energio-fenetres.com/portes/tertiaires/'],
  },
  {
    id: 'imperial-65mm', name: 'Imperial 65mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/imperial-65mm-1.webp', image2: 'img/lifestyle-double-entry-doors.webp',
    description: 'Source markdown notes that this product still needs a description from the referenced Energio tertiaires page.',
    specs: ['Description pending from source: https://www.energio-fenetres.com/portes/tertiaires/'],
  },
  {
    id: 'energio-fortis', name: 'Energio Fortis', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/energio-fortis-1.jpg', image2: 'img/energio-fortis-2.webp',
    description: 'Source markdown notes that this product still needs a description from the referenced Energio doors page.',
    specs: ['Description pending from source: https://www.energio-fenetres.com/portes-2/'],
  },
  {
    id: 'modern-slide', name: 'Modern Slide', tag: 'Aluminum', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/modern-slide-1.webp', image2: 'img/modern-slide-2.webp',
    description: 'Sliding and galandage system. The new Modernslide range allows you to make large openings with fine profiles and attractive handles from the Sarena and Confort Slide range. Material: ALU.',
    specs: [
      'Profile: MODERNSLIDE Aliplast Sliding & Stripping',
      'Sleepers: new 65 mm, ISO 120/140/160, Reno with taps, all types of installation',
      'Uw: ≥1.7 W/m²K',
      'Uf: >2.2 W/m²K',
      'Glazing thickness: ≤28 mm, wallet joint',
    ],
  },
  {
    id: 'ultra-glide', name: 'Ultra Glide', tag: 'Aluminum - Lift and Slide', category: 'Doors', mechanism: 'Lift & Slide',
    image: 'img/ultra-glide-1.jpg', image2: 'img/lifestyle-sliding-bamboo.webp',
    description: 'Sliding lift system for large dimensions, in max version with Chicane 125 mm. Designed to achieve heights up to 3.2 m. Material: ALU.',
    specs: [
      'Profile: ULTRAGLIDE SLIM Aliplast, premium product',
      'Chicane: 45 mm',
      'Maximum leaf weight: 300 kg',
      'Sleepers: nine 153 mm, installation in tunnel or rabbet',
      'Uw: ≥0.8 W/m²K',
      'Glazing thickness: ≤56 mm',
    ],
  },
  {
    id: 'panorama', name: 'PANORAMA', tag: 'Aluminum - Accordion/Bi-fold', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/panorama-1.webp', image2: 'img/panorama-2.webp',
    description: 'A Panorama accordion door is the ideal way to distinguish the interior from the outside or associate them. In good weather, Panorama allows you to enjoy the outdoor volume in an ideal way. In bad weather, Panorama is a perfect partition for a comfortable experience. Material: ALU.',
    specs: [
      'Profile: PANORAMA0 Aliplast',
      'Sleepers: new 74.5 mm, ISO 120/140/160, Reno 40/65 mm, possible with taps',
      'Uw: ≥1.3 W/m²K in double glazing and 0.95 W/m²K in triple glazing',
      'Uf: >1.3 W/m²K',
      'Glazed thickness: ≤40 mm',
      'Possible in the recessed threshold, which makes the product even more attractive',
    ],
  },
  {
    id: 'neo-smart-slide', name: 'neo smart-slide', tag: 'uPVC - Standard sliding', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/neo-smart-slide-1.webp', image2: 'img/neo-smart-slide-2.webp',
    description: 'The sliding solution in a slim, cubic design. neo smart-slide fits perfectly between the living room and the outside area. Large glass surfaces with element formats of up to 6.0 m x 2.5 m give you a fantastic view outside.',
    specs: [
      '78 mm or 154 mm installation depth',
      'Uf = 1.3 W/m²K',
      'Glass and panel thickness in the sash up to 54 mm, with double to triple glazing possible',
      'System platform: energeto® neo',
      'Integrated hardware technology: hardware-neutral',
      'Various opening mechanisms',
      'Scheme A + C',
      'Available in numerous decor variants: woodec, aludec, and colour world',
      'Optional bonding inside with adhesive technology',
    ],
  },
  {
    id: 'lift-slide', name: 'lift-slide (Aluplast)', tag: 'uPVC - Lift and slide', category: 'Doors', mechanism: 'Lift & Slide',
    image: 'img/lift-slide-1.webp', image2: 'img/lift-slide-2.webp',
    description: "Technology that stands out. The 85 mm lift-and-slide door from aluplast impresses with high energy efficiency and user-friendliness. Even at its maximum size of 6.50 m x 2.80 m, the door can be opened and closed without effort and ensures a smooth and barrier-free transition to the outside. It has been tested under extreme conditions including driving rain and storms.",
    specs: [
      '85 mm construction depth',
      'Uf = 1.3 W/m²K',
      'Uw = 0.87 W/m²K with standard triple glazing with Ug = 0.6 and Psi = 0.040 W/mK',
      'Uw = 0.71 W/m²K best possible option with triple glazing with Ug = 0.4 and Psi = 0.030 W/mK',
      'Thermally broken threshold',
      'Aluminium guide rail',
      'Up to RC2 burglar protection',
    ],
  },
  {
    id: '200-entry', name: '200 series (entry doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/200-entry-1.webp', image2: 'img/200-entry-2.webp',
    description: 'Fibertec fiberglass entry door frames mean quality and durability. The systems emphasize long-term performance and have achieved high air-tightness and energy ratings. The fiberglass foam-filled frame accommodates standard size fiberglass frames and doors. The tough resilient fiberglass frame affords security similar to steel, but will not corrode. With advanced technology and extensive testing, the doors will not bow, warp, crack, scratch, splinter, dent, or rust as with wood or steel doors.',
    specs: [
      'Door panel: 6 1/2″ pultruded fiberglass frame filled with wood reinforcement',
      'Injection molded reinforced mechanical welded corners with polyurethane foam fill, sealed with silicone sealant',
      'Optional 4 1/2″ pultruded fiberglass frame available for single doors only',
      'Door slabs are reinforced fiberglass skin, available in smooth skin off-white flush or embossed pattern, and woodgrain beige flush or embossed pattern',
      'Door slab stile rails use weather-resistant PVC composite material',
      'Doors are available with brickmould',
      'Products have been independently tested and rated by AAMA and NFRC',
      'Inswing door system uses a thermally broken aluminum sill with strategically placed drainage system for water',
      'Adjustable threshold height',
      'Outswing door system uses an aluminum sill with Q-Lon weather stripping to ensure a positive seal to the slab',
      'Nominal slab sizes: 30″ certain styles only, 32″, 34″, and 36″ wide by 80″ height and 96″ height',
      'Manufactured to specified sizes +/- 1/8″ (3.17 mm) industry tolerance',
      'Multi-point locking mechanism used for all fiberglass entry doors',
      'Latchbolts throw 20 mm and are secured to prevent them from being forced back',
      'Deadbolts are engaged by turning the key or knob; top and bottom latchbolts act as part of a three-deadbolt locking system',
    ],
  },
  {
    id: '750-sliding', name: '750 series (Sliding doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/750-sliding-1.webp', image2: 'img/750-sliding-2.webp',
    description: 'The upgraded fiberglass sliding patio door uses advanced technology with a new look and feel. Fibertec presents refined additions to its sturdy fiberglass windows and doors. The 750 Series Fiberglass Patio Sliding Door includes stronger insulated closed-back fiberglass frames, an enhanced sash surface to give the impression of an authentic wood door, and heavy-duty sashes for added durability. The 750 series fiberglass patio door offers an oak veneer laminate option and triple glazing for added energy efficiency.',
    specs: [
      'Standard series specification: 5 3/4″ pultruded fiberglass closed-back frame filled with laser die cut polystyrene and blocking',
      'Injection molded reinforced corners filled with polyurethane foam fill and sealed with silicone sealant',
      'Available in 2, 3, or 4 panel settings',
      'Minimum nominal size: 60″ x 80″',
      'Maximum nominal size: 189″ x 96″',
      'Custom sizes are also available',
      'Fiberglass doors are available in two, three-end-operator only, and four-panel center-operator configurations',
      'Manufactured to specified sizes +/- 1/8″ (3.17 mm) industry tolerance',
      'Three and four panel doors are shipped knocked down for site assembly',
      'Independently tested and rated in accordance with AAMA/WDMA/CSA 101/I.S.2/A440-11 Standard, NAFS, and A440S1-19 Canadian Supplement',
      'Glazing options: tempered in and out double glazing, 1″ sealed units with 11/16″ air space',
      'Tempered triple glazing optional: 1 3/8″ sealed units, maximum operator width 32″; middle glass unit is annealed',
      'Various other glazing options available to suit climate condition or aesthetics',
      'Paint finish stock colors: white, sandalwood, slate grey, commercial brown, and black; co-colors also available',
      'All standard frames come with a white interior or can be painted to any requested colour',
      'Frames use Acrythane water-based paint with UV protector, rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Hardware: attractive metal handle on operating panel in white or black, available with optional key lock',
      'Hardware upgrade: #9700 EURO Handle in Brushed Chrome',
      'Optional foot lock allows operating panel to be locked shut or slightly open',
      'Sliding insect screen: extruded aluminum frame with fiberglass mesh and spring-loaded rollers at top and bottom',
      'Thumb lock is a standard screen feature',
      'Installation to be performed by experienced installers in accordance with manufacturer instructions and CSA A440.4 standards',
      'Door must be plumb and square after installation and sealed to both interior and exterior wall with high quality sealant around the frame perimeter',
      'If perimeter cavity is foamed, additional anchorage may be required to prevent bowing',
      'Maintenance: occasional cleaning of glass and frame components with non-abrasive detergent; clean and lubricate hinge tracks as required',
    ],
  },
  {
    id: 'mc-wall', name: 'MC Wall (Aliplast)', tag: 'Aluminum', category: 'Curtain wall', mechanism: 'Curtain Wall',
    image: 'img/mc-wall-1.webp', image2: 'img/mc-wall-2.webp',
    description: 'The MC WALL system is used to design modern curtain walls of both simple and complex shapes. It is the basis for facade structures including MC Passive, MC Passive+, MC Glass, and MC Fire fire-protection solutions.',
    specs: [
      'System used to design modern curtain walls of simple and complex shapes',
      'Mullion-transom visual width: 55 mm',
      'A wide range of mullions and transoms suitable for static requirements',
      'The insulators can be built according to the infill thickness',
      'A wide range of decorative cover caps makes it possible to obtain varied visual effects on the curtain wall',
      'The option of bending profiles in both planes',
      'Wide range of colors: RAL palette, texture colors, Aliplast Wood Color Effect wood-like colors, or anodized color',
    ],
  },
];

// Mechanism families — how a system operates. Each product carries a
// `mechanism` field on `products` that matches one of these `name`s.
// Used by:
//  - the homepage MechanismAccordion (renders one row per mechanism)
//  - the products.html catalog (groups products under Category > Mechanism)
//  - the SYSTEMS mega menu (deep-link items)
const mechanisms = [
  { id: 'tilt-turn',                name: 'Tilt & Turn',              category: 'Windows',      tagline: 'The European default. Inward-opening, dual-operation, superior air sealing.',                                                          featureImage: 'img/lifestyle-arched-window.webp' },
  { id: 'casement-awning-fixed',    name: 'Casement, Awning & Fixed', category: 'Windows',      tagline: 'North American configurations at European performance levels. Side-hinged casements, top-hinged awnings, large-format fixed glazing.', featureImage: 'img/lifestyle-facade-sunset.webp' },
  { id: 'lift-slide',               name: 'Lift & Slide',             category: 'Doors',        tagline: 'Multi-panel glazed walls that operate at scale. Lift mechanism frees the rollers and drops a perfect weather seal in the closed position.', featureImage: 'img/lifestyle-sliding-bamboo.webp' },
  { id: 'sliding-folding',          name: 'Sliding & Folding',        category: 'Doors',        tagline: 'From minimal-frame patio doors to multi-panel accordion walls. Seamless indoor-outdoor flow at residential and light-commercial scale.',  featureImage: 'img/lifestyle-dining-glass.webp' },
  { id: 'entry-swing',              name: 'Entry & Swing Doors',      category: 'Doors',        tagline: 'Premium entrance systems with thermal continuity, multi-point hardware, and architectural integration.',                                  featureImage: 'img/lifestyle-modern-entry-door.webp' },
  { id: 'curtain-wall',             name: 'Curtain Wall',             category: 'Curtain wall', tagline: 'Stick-built and unitized commercial assemblies, storefront, and custom facade configurations.',                                            featureImage: 'img/lifestyle-curtain-wall-interior.webp' },
];

const showcaseProjects = [
  { id: '82-wilson-ave', title: '82 Wilson Ave.', description: 'Bespoke glazing solutions tailored for luxury custom homes.', image: 'img/82-Wilson-Ave.-Kitchener-Ontario-1.jpeg', location: 'Kitchener, Ontario', type: 'Custom Residential', year: '2025', scope: 'Windows, Doors', criteria: 'Passive House, OBC' },
  { id: 'lakefront-estates', title: 'Lakefront Estates', description: 'Maximizing the view and weather resistance for waterfront properties.', image: 'img/unsplash-1600585154340-be6161a56a0c.jpg', location: 'Muskoka, Ontario', type: 'Custom Residential', year: '2024', scope: 'Windows, Lift & Slide Doors', criteria: 'Net Zero, Cold Climate' },
  { id: '81-bay-st', title: '81 Bay St.', description: 'High-performance fenestration for multi-story residential developments.', image: 'img/81-Bay-St.-Toronto.jpg', location: 'Toronto, Ontario', type: 'Commercial', year: '2024', scope: 'Windows, Curtain Wall', criteria: 'LEED, Toronto Green Standard' },
  { id: 'forma', title: 'Forma (266 King St. W)', description: 'Engineering striking exteriors with advanced curtain wall assemblies.', image: 'img/Forma-1.jpg', location: 'Toronto, Ontario', type: 'Curtain Wall', year: '2024', scope: 'Unitized Curtain Wall, Storefront', criteria: 'OBC, NBCC, Toronto Green Standard' },
  { id: 'woodbine-casino-hotel', title: 'Woodbine Casino Hotel', description: 'Creating inviting and durable environments for hotels and resorts.', image: 'img/Woodbine-Casino-Resort-Toronto-1-.jpg', location: 'Toronto, Ontario', type: 'Commercial', year: '2023', scope: 'Windows, Doors, Storefront', criteria: 'OBC, LEED' }
];

// --- ANIMATION COMPONENTS ---
function TextReveal({ children, delay = 0, className = "" }) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(ref.current);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className={`pb-[0.2em] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

// GlassReveal: was a wiping-white-panel reveal; now a simple opacity
// fade so we no longer paint a white fog over images on entrance.
// Keeping the export name + signature so existing call sites don't change.
function GlassReveal({ children, delay = 0, className = "" }) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(ref.current);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <div
        className={`h-full w-full transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}

function CrystalLogo({ className = '', variant = 'dark' }) {
  // 'dark' variant  -> dark-navy text full-color lockup, used on the
  //                    white header bg (scrolled / non-hero pages).
  // 'light' variant -> white text lockup, used when the header is
  //                    transparent over a dark hero image (top of
  //                    home/about/products/etc).
  const src = variant === 'light'
    ? 'img/Crystal-Ball-Black-Horizontal.png'
    : 'img/Crystal_Ball_-_Full_Color_-_Horizontal_k5ahdw-scaled.png';
  return (
    <img src={src} alt="Crystal Ball" className={className} />
  );
}

// --- HEADER with mega menu (multi-page nav) ---
function Header({ currentPage }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [hoveredInfo, setHoveredInfo] = useState(null);

  const megaMenus = {
    systems: {
      label: 'SYSTEMS',
      defaultImage: 'img/lifestyle-arched-window.webp',
      defaultDesc: 'Window, door, and curtain wall systems grouped by how they operate.',
      // Three parent columns (Windows / Doors / Curtain Wall), each
      // listing its mechanism children. Mechanism links deep-link into
      // the products.html catalog at the corresponding section anchor.
      // Parent titles are themselves clickable — they jump to the
      // category section header on products.html.
      categories: ['Windows', 'Doors', 'Curtain wall'].map(catName => {
        const slug = catName.toLowerCase().replace(/\s+/g, '-');
        return {
          title: catName === 'Curtain wall' ? 'Curtain Wall' : catName,
          titleHref: `products.html#category-${slug}`,
          items: mechanisms.filter(m => m.category === catName).map(m => ({
            name: m.name,
            href: `products.html#mechanism-${m.id}`,
            image: m.featureImage,
            desc: m.tagline,
          })),
        };
      }),
    },
    markets: {
      label: 'MARKETS WE SERVE',
      defaultImage: 'img/Forma-1.jpg',
      defaultDesc: 'European-engineered facade systems tailored to commercial, custom residential, and regional dealer partners across Canada.',
      categories: [
        {
          title: 'Markets we serve',
          items: [
            { name: 'Overview', href: 'markets.html', image: 'img/Forma-1.jpg', desc: 'A main view of the markets Crystal Ball supports and how project delivery changes by audience.' },
            { name: 'Commercial Developers & GCs', href: 'commercial-developers.html', image: 'img/81-Bay-St.-Toronto.jpg', desc: 'Curtain wall, storefront, and high-performance windows for mid-rise, mixed-use, and Net Zero projects.' },
            { name: 'Architects & Custom Builders', href: 'architects-custom-builders.html', image: 'img/82-Wilson-Ave.-Kitchener-Ontario-1.jpeg', desc: 'Tilt & Turn, Lift & Slide, and large-format glazing for Passive House and modern homes.' },
            { name: 'Dealer Partnerships', href: 'dealer-partnerships.html', image: 'img/lifestyle-modern-facade.webp', desc: 'Premium European systems supplied to regional Canadian dealers with project-level technical support.' },
          ],
        },
      ],
    },
    about: {
      label: 'ABOUT',
      defaultImage: 'img/Forma-1.jpg',
      defaultDesc: "How Crystal Ball bridges European manufacturing capacity with Canadian construction discipline — built on more than two decades of envelope, curtain wall, and Passive House experience.",
      categories: [
        {
          title: 'About Crystal Ball',
          items: [
            { name: 'Our Vision', href: 'about.html#vision', image: 'img/Forma-1.jpg', desc: 'Closing the gap between European engineering and Canadian execution.' },
            { name: 'Our Foundation', href: 'about.html#foundation', image: 'img/Woodbine-Casino-Resort-Toronto-1-.jpg', desc: 'Led by construction. Informed by 20+ years of envelope and curtain wall experience.' },
            { name: 'Why Crystal Ball', href: 'about.html#why', image: 'img/lifestyle-arched-window.webp', desc: "More than a distributor — a construction partner who reads the drawings." },
          ],
        },
      ],
    },
  };

  // Only SYSTEMS uses the full-width mega menu panel below the header.
  // ABOUT and MARKETS WE SERVE render as compact dropdowns positioned
  // directly under their nav link (see inline JSX further down).
  const currentMenu = activeMenu === 'systems' ? megaMenus.systems : null;

  // Header theme:
  //   Hero pages at the top of the page -> transparent bg + white
  //                                        text/logo (floats over the
  //                                        dark hero image)
  //   Hero pages after scrolling         -> white bg + dark text/logo
  //   Any other page                     -> white bg + dark text/logo
  //                                        from the start
  //   Mega menu open / mobile menu open  -> always white-bg so the
  //                                        panel below anchors cleanly
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const heroPage = ['home', 'about', 'products', 'markets', 'project-support', 'portfolio', 'contact'].includes(currentPage);
  const isLight = scrolled || !!activeMenu || mobileMenuOpen || !heroPage;

  useEffect(() => {
    if (currentMenu) {
      setHoveredInfo({
        image: currentMenu.defaultImage,
        eyebrow: currentMenu.label,
        desc: currentMenu.defaultDesc
      });
    }
  }, [activeMenu]);

  // Nav typography stays the same; only colors flip with the bg.
  //   isLight=true  (white bar)        -> dark nav labels + dark underline
  //   isLight=false (transparent top)  -> white nav labels + white underline
  const navLinkBase = 'group relative py-1 outline-none text-[14px] font-semibold whitespace-nowrap transition-colors';
  const navUnderline = (active) => `absolute bottom-0 left-0 h-px transition-all duration-300 ease-out ${isLight ? 'bg-[#1A1A1A]' : 'bg-white'} ${active ? 'w-full' : 'w-0 group-hover:w-full'}`;
  const navText = (active) => isLight
    ? (active ? 'text-[#1A1A1A]' : 'text-[#4D4D4D] hover:text-[#1A1A1A]')
    : (active ? 'text-white' : 'text-white/75 hover:text-white');

  return (
    <header onMouseLeave={() => setActiveMenu(null)} className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isLight ? 'bg-white border-b border-black/10' : 'bg-transparent border-b border-transparent'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <a href="index.html" className="flex items-center gap-4 outline-none shrink-0">
          <CrystalLogo variant={isLight ? 'dark' : 'light'} className="h-[52px] w-auto object-contain" />
        </a>

        <nav className="hidden items-center gap-5 xl:gap-6 tracking-[0.1em] lg:flex">
          {(() => { const a = activeMenu === 'about' || currentPage === 'about'; return (
          <div className="relative" onMouseEnter={() => setActiveMenu('about')}>
            <a href="about.html" className={`${navLinkBase} ${navText(a)}`}>
              ABOUT <span className={navUnderline(a)}></span>
            </a>
            {/* Compact dropdown — invisible top padding (pt-3) bridges
                the gap between link and panel so hover isn't lost. */}
            <div className={`absolute left-0 top-full pt-3 min-w-[240px] z-50 transition-all duration-200 ${activeMenu === 'about' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'}`}>
              <div className="bg-white border border-black/10 shadow-lg py-2">
                {megaMenus.about.categories[0].items.map(item => (
                  <a key={item.name} href={item.href} className="block px-5 py-3 text-[14px] text-[#4D4D4D] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] transition-colors outline-none">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div> ); })()}
          {(() => { const a = currentPage === 'services'; return (
          <a href="services.html" onMouseEnter={() => setActiveMenu(null)} className={`${navLinkBase} ${navText(a)}`}>
            SERVICES <span className={navUnderline(a)}></span>
          </a> ); })()}
          {(() => { const a = activeMenu === 'systems' || currentPage === 'products'; return (
          <a href="products.html" onMouseEnter={() => setActiveMenu('systems')} className={`${navLinkBase} ${navText(a)}`}>
            SYSTEMS <span className={navUnderline(a)}></span>
          </a> ); })()}
          {(() => { const a = currentPage === 'portfolio'; return (
          <a href="portfolio.html" onMouseEnter={() => setActiveMenu(null)} className={`${navLinkBase} ${navText(a)}`}>
            PORTFOLIO <span className={navUnderline(a)}></span>
          </a> ); })()}
          {(() => { const a = activeMenu === 'markets' || currentPage === 'markets'; return (
          <div className="relative" onMouseEnter={() => setActiveMenu('markets')}>
            <a href="markets.html" className={`${navLinkBase} ${navText(a)}`}>
              MARKETS WE SERVE <span className={navUnderline(a)}></span>
            </a>
            {/* Compact dropdown — right-aligned because this is the
                last nav item, so a left-aligned panel would clip out
                of the viewport on narrower desktop widths. */}
            <div className={`absolute right-0 top-full pt-3 min-w-[280px] z-50 transition-all duration-200 ${activeMenu === 'markets' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'}`}>
              <div className="bg-white border border-black/10 shadow-lg py-2">
                {megaMenus.markets.categories[0].items.map(item => (
                  <a key={item.name} href={item.href} className="block px-5 py-3 text-[14px] text-[#4D4D4D] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] transition-colors outline-none">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div> ); })()}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`flex h-12 w-12 flex-col items-center justify-center gap-1.5 border lg:hidden ${isLight ? 'border-black/20' : 'border-white/30'}`}>
            <span className={`h-px w-5 transition ${isLight ? 'bg-[#1A1A1A]' : 'bg-white'} ${mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}></span>
            <span className={`h-px w-5 transition ${isLight ? 'bg-[#1A1A1A]' : 'bg-white'} ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-px w-5 transition ${isLight ? 'bg-[#1A1A1A]' : 'bg-white'} ${mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}></span>
          </button>
          {isLight ? (
            <a href="contact.html" className="group relative hidden lg:inline-flex items-center justify-center overflow-hidden border border-darkheading px-5 py-2.5 text-[14px] tracking-[0.15em] uppercase whitespace-nowrap outline-none">
              <span className="absolute inset-0 bg-darkheading -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 z-0"></span>
              <span className="relative z-10 text-darkheading group-hover:text-white transition-colors duration-500">CONTACT US</span>
            </a>
          ) : (
            <a href="contact.html" className="group relative hidden lg:inline-flex items-center justify-center overflow-hidden border border-white px-5 py-2.5 text-[14px] tracking-[0.15em] uppercase whitespace-nowrap outline-none">
              <span className="absolute inset-0 bg-white -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 z-0"></span>
              <span className="relative z-10 text-white group-hover:text-darkheading transition-colors duration-500">CONTACT US</span>
            </a>
          )}
        </div>
      </div>

      {/* Desktop Mega Menu — 6-col outer grid, both menus share the same
          image footprint (1 col wide, 2:3 portrait aspect ratio):
            - Multi-category menus (Systems): links span 3 cols (Windows /
              Doors / Curtain Wall) starting at col 2 + image at col 5.
              Cols 1 + 6 empty so the panel sits centered.
            - Single-category menus (Markets): links at col 3 + image at
              col 4. Cols 1, 2, 5, 6 empty (same centering, narrower
              footprint because there's only one link column to show).
          The image uses `aspect-[2/3]` in both cases so its size matches
          across menus and the proportion is slightly vertical. */}
      <div className={`overflow-hidden border-t border-black/10 bg-[#FBFBFB] transition-all duration-500 ${currentMenu ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {currentMenu && (() => {
          const compact = currentMenu.categories.length === 1;
          return (
            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-6">
              <div className={compact ? 'lg:col-start-3 lg:col-span-1' : 'lg:col-start-2 lg:col-span-3'}>
                <div className={compact ? '' : 'grid gap-8 lg:grid-cols-3'}>
                  {currentMenu.categories.map((category, ci) => (
                    <div key={category.title || `cat-${ci}`}>
                      {category.title && category.titleHref && (
                        <a href={category.titleHref} className="group/title flex items-center justify-between text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-4 pb-2 border-b border-black/10 hover:text-glass transition outline-none">
                          <span>{category.title}</span>
                          <span className="text-glass opacity-0 -translate-x-2 transition-all duration-300 group-hover/title:opacity-100 group-hover/title:translate-x-0">→</span>
                        </a>
                      )}
                      <ul className="space-y-3">
                        {category.items.map((item) => (
                          <li key={item.name}>
                            <a href={item.href} onMouseEnter={() => setHoveredInfo({ image: item.image, eyebrow: category.title || currentMenu.label, desc: item.desc })} className="group flex items-center text-[14px] text-[#4D4D4D]/80 hover:text-black transition-colors outline-none">
                              {item.name}
                              <span className="ml-2 text-glass opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`relative hidden w-full overflow-hidden lg:block aspect-[2/3] ${compact ? 'lg:col-start-4 lg:col-span-1' : 'lg:col-start-5 lg:col-span-1'}`}>
                <img src={hoveredInfo?.image || currentMenu.defaultImage} className="absolute inset-0 h-full w-full object-cover transition duration-700" alt="" />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Mobile Dropdown */}
      <div className={`border-t border-black/10 bg-[#FBFBFB] transition-all duration-500 lg:hidden ${mobileMenuOpen ? 'max-h-[calc(100vh-88px)] overflow-y-auto opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
        <div className="space-y-2 px-6 py-6 pb-20">
          <button onClick={() => setMobileDropdown(mobileDropdown === 'about' ? null : 'about')} className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]">
            ABOUT <span className={`transition ${mobileDropdown === 'about' ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${mobileDropdown === 'about' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-3 pt-4">
              <a href="about.html" className="block py-3 text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase hover:text-glass transition">About overview →</a>
              {megaMenus.about.categories.flatMap(cat => cat.items).map((item) => (
                <a key={item.name} href={item.href} className="block py-3 text-[14px] text-[#4D4D4D]/80 hover:text-black transition">{item.name}</a>
              ))}
            </div>
          </div>

          <a href="services.html" className="block w-full text-left border-b border-black/10 py-5 text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]">SERVICES</a>

          <button onClick={() => setMobileDropdown(mobileDropdown === 'systems' ? null : 'systems')} className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]">
            PRODUCTS <span className={`transition ${mobileDropdown === 'systems' ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${mobileDropdown === 'systems' ? 'max-h-[1200px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-6 pt-4">
              <a href="products.html" className="block text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-3 hover:text-glass transition">All Products →</a>
              {megaMenus.systems.categories.map((cat) => (
                <div key={cat.title}>
                  {/* Parent category — links to category section on products.html */}
                  <a href={cat.titleHref} className="block text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-3 hover:text-glass transition">{cat.title} →</a>
                  {/* Mechanism children */}
                  <div className="space-y-1 pl-3 border-l border-black/10">
                    {cat.items.map((item) => (
                      <a key={item.name} href={item.href} className="group flex w-full items-center justify-between text-left text-[14px] text-[#4D4D4D] hover:text-black transition-colors py-2">
                        <span>{item.name}</span>
                        <span className="text-glass opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a href="portfolio.html" className="block w-full text-left border-b border-black/10 py-5 text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]">PORTFOLIO</a>

          <button onClick={() => setMobileDropdown(mobileDropdown === 'markets' ? null : 'markets')} className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]">
            MARKETS WE SERVE <span className={`transition ${mobileDropdown === 'markets' ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${mobileDropdown === 'markets' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-3 pt-4">
              {megaMenus.markets.categories.flatMap(cat => cat.items).map((item) => (
                <a key={item.name} href={item.href} className="block py-3 text-[14px] text-[#4D4D4D]/80 hover:text-black transition">{item.name}</a>
              ))}
            </div>
          </div>

          <a href="contact.html" className="group relative mt-6 flex w-full items-center justify-center overflow-hidden border border-darkheading px-5 py-4 text-center text-[14px] font-bold tracking-[0.2em] uppercase outline-none">
            <span className="absolute inset-0 bg-darkheading -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 z-0"></span>
            <span className="relative z-10 text-darkheading group-hover:text-white transition-colors duration-500">CONTACT US</span>
          </a>
        </div>
      </div>
    </header>
  );
}

// --- FOOTER ---
function Footer() {
  return (
    <React.Fragment>
    <footer className="bg-darkheading pt-24 pb-12 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">

        <div className="md:col-span-5">
          <div className="flex justify-center md:justify-start mb-8">
            <a href="index.html" className="outline-none inline-block">
              <img src="img/Crystal-Ball-Black-Vertical.png" alt="Crystal Ball" className="w-[26rem] max-w-full md:w-[20.8rem] h-auto" />
            </a>
          </div>
          <p className="text-[14px] leading-7 text-white/70 max-w-sm mb-4">
            Premium window and door solutions for contemporary homes and commercial projects. Engineered for the envelope.
          </p>

          <div className="mt-8 border-l border-white/15 pl-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <span className="w-5 flex justify-center text-center text-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <a href="mailto:info@crystal-ball.ca" className="text-[14px] text-white/80 hover:text-white transition">info@crystal-ball.ca</a>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-5 flex justify-center text-center text-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <div className="flex flex-col gap-1 text-[14px] text-white/80">
                  <a href="tel:+14162275330" className="hover:text-white transition">416-227-5330</a>
                  <a href="tel:+16476223226" className="hover:text-white transition">647-622-3226</a>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-[14px] text-white/50 mt-10">Toronto, ON, Canada</p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[14px] tracking-[0.2em] text-white uppercase mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="about.html" className="text-[14px] text-white/70 hover:text-white transition">About</a></li>
            <li><a href="products.html" className="text-[14px] text-white/70 hover:text-white transition">Systems</a></li>
            <li><a href="portfolio.html" className="text-[14px] text-white/70 hover:text-white transition">Portfolio</a></li>
            <li><a href="project-support.html" className="text-[14px] text-white/70 hover:text-white transition">Project Support</a></li>
            <li><a href="contact.html" className="text-[14px] text-white/70 hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[14px] tracking-[0.2em] text-white uppercase mb-6">Markets We Serve</h4>
          <ul className="space-y-4">
            <li><a href="markets.html" className="text-[14px] text-white/70 hover:text-white transition">Overview</a></li>
            <li><a href="commercial-developers.html" className="text-[14px] text-white/70 hover:text-white transition">Commercial Developers & GCs</a></li>
            <li><a href="architects-custom-builders.html" className="text-[14px] text-white/70 hover:text-white transition">Architects & Custom Builders</a></li>
            <li><a href="dealer-partnerships.html" className="text-[14px] text-white/70 hover:text-white transition">Dealer Partnerships</a></li>
          </ul>

          <div className="flex gap-6 mt-10">
            <a href="#" className="text-[14px] tracking-[0.15em] text-[#9b8e68] uppercase hover:text-white transition">LinkedIn</a>
            <a href="#" className="text-[14px] tracking-[0.15em] text-[#9b8e68] uppercase hover:text-white transition">Instagram</a>
            <a href="#" className="text-[14px] tracking-[0.15em] text-[#9b8e68] uppercase hover:text-white transition">Facebook</a>
          </div>
        </div>

      </div>

      <div className="mx-auto max-w-7xl mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-white/50">
        <p>&copy; 2026 Crystal Ball Windows & Doors Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="privacy.html" className="hover:text-white transition">Privacy Policy</a>
          <a href="terms.html" className="hover:text-white transition">Terms of Service</a>
        </div>
      </div>
    </footer>

    <a
      href="https://talkerstein.com"
      target="_blank"
      rel="noopener"
      className="block bg-[#1A1A1A] py-5 text-center hover:bg-black transition group"
    >
      <span className="inline-flex items-center justify-center gap-2 md:gap-3 text-white tracking-wider md:tracking-[0.2em] text-[14px] md:text-[15px] font-bold uppercase whitespace-nowrap">
        <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-6 md:h-6 inline-block opacity-90 group-hover:rotate-12 transition-transform shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <ellipse cx="12" cy="12" rx="4" ry="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M3.5 7h17M3.5 17h17" />
        </svg>
        <span>Handcrafted by Talkerstein Consulting Group</span>
      </span>
    </a>
    </React.Fragment>
  );
}

// --- BOTTOM CTA (reusable across pillar/sub pages)
// Dark bg so it blends with the (now-dark) Footer below. Pages can hide
// either button when it would link back to themselves — pass hideContact
// on contact.html and hideBrowse on products.html.
function BottomCTA({ hideContact = false, hideBrowse = false } = {}) {
  return (
    <section className="bg-darkheading px-6 py-24 relative">
      <div className="mx-auto max-w-3xl text-center relative z-10">
        <TextReveal><h2 className="text-3xl font-light text-white md:text-5xl mb-6">Ready to discuss your project?</h2></TextReveal>
        <TextReveal delay={100}><p className="text-[16px] leading-7 text-white/75 mb-10">We bring European engineering and construction intelligence to every facade.</p></TextReveal>
        <TextReveal delay={200}>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!hideContact && (
              <a href="contact.html" className="group relative inline-flex items-center justify-center overflow-hidden border border-[#9b8e68] px-8 py-4 text-[14px] tracking-[0.2em] uppercase outline-none">
                <span className="absolute inset-0 bg-[#9b8e68] -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 z-0"></span>
                <span className="relative z-10 text-[#9b8e68] group-hover:text-white transition-colors duration-500">CONTACT US</span>
              </a>
            )}
            {!hideBrowse && (
              <a href="products.html" className="group relative inline-flex items-center justify-center overflow-hidden border border-white px-8 py-4 text-[14px] tracking-[0.2em] uppercase outline-none">
                <span className="absolute inset-0 bg-white -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 z-0"></span>
                <span className="relative z-10 text-white group-hover:text-darkheading transition-colors duration-500">BROWSE PRODUCTS</span>
              </a>
            )}
          </div>
        </TextReveal>
      </div>
    </section>
  );
}

// --- CONFIGURATOR MODAL (product-specific quote request) ---
// Used by individual product pages and by hover CTAs on product cards.
// Submits to window.CB_FORM_ENDPOINT (same Apps Script handler as the main
// contact form); falls back to a demo alert when the endpoint is unset.
function ConfiguratorModal({ isOpen, onClose, selectedProduct }) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (window.CB_FORM_ENDPOINT) {
      setSubmitting(true);
      fetch(window.CB_FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(form),
      }).then(() => {
        window.location.href = 'contact-thanks.html';
      }).catch(() => {
        setSubmitting(false);
        alert('Something went wrong submitting the form. Please email info@crystal-ball.ca instead.');
      });
    } else {
      alert(`Thanks! We'll be in touch about ${selectedProduct}.\n\n(Demo mode — window.CB_FORM_ENDPOINT not configured.)`);
      onClose();
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl overflow-hidden border border-black/10 p-8 shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-black/15 text-xl text-[#4D4D4D]/60 hover:border-glass hover:text-glass bg-white outline-none">×</button>
        <p className="text-[14px] font-bold tracking-[0.2em] text-glass uppercase">PRODUCT INQUIRY</p>
        <h2 className="mt-4 text-4xl font-light leading-tight text-[#1A1A1A] md:text-5xl">{selectedProduct}</h2>
        <p className="mt-5 max-w-xl text-[14px] leading-7 text-[#4D4D4D]/70">Tell us about your project requirements, preferred glass specifications, and dimensions.</p>
        <form onSubmit={handleSubmit} className="mt-10 grid gap-4">
          <input type="hidden" name="product" value={selectedProduct} readOnly />
          <input type="hidden" name="inquiry_type" value="Product Inquiry" readOnly />
          {/* honeypot — bots fill this, humans can't see it */}
          <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />

          <div className="grid gap-4 md:grid-cols-2">
            <input required name="name" placeholder="Full name" className="border border-black/15 bg-white px-5 py-4 text-[14px] text-[#4D4D4D] outline-none placeholder:text-[#4D4D4D]/50 focus:border-glass shadow-sm" />
            <input required type="email" name="email" placeholder="Email address" className="border border-black/15 bg-white px-5 py-4 text-[14px] text-[#4D4D4D] outline-none placeholder:text-[#4D4D4D]/50 focus:border-glass shadow-sm" />
          </div>
          <textarea required name="message" rows="6" placeholder="Describe your project..." className="border border-black/15 bg-white px-5 py-4 text-[14px] text-[#4D4D4D] outline-none placeholder:text-[#4D4D4D]/50 focus:border-glass shadow-sm resize-none"></textarea>
          <button type="submit" disabled={submitting} className="group relative mt-4 flex w-full items-center justify-center overflow-hidden border border-darkheading px-8 py-4 text-center text-[14px] font-bold tracking-[0.2em] uppercase outline-none disabled:opacity-60 disabled:cursor-not-allowed">
            <span className="absolute inset-0 bg-darkheading -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 z-0"></span>
            <span className="relative z-10 text-darkheading group-hover:text-white transition-colors duration-500">
              {submitting ? 'SENDING…' : 'REQUEST CONSULTATION'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

// Expose globals
window.TextReveal = TextReveal;
window.GlassReveal = GlassReveal;
window.CrystalLogo = CrystalLogo;
window.Header = Header;
window.Footer = Footer;
window.BottomCTA = BottomCTA;
window.ConfiguratorModal = ConfiguratorModal;
window.products = products;
window.propertyImages = propertyImages;
window.showcaseProjects = showcaseProjects;
window.mechanisms = mechanisms;
