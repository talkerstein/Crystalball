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
const products = [
  {
    id: 'imperial-aliplast', name: 'Imperial (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/imperial-aliplast-1.webp', image2: 'img/imperial-aliplast-2.webp',
    description: 'Imperial is an aluminum platform offered in two thermally enhanced variants, IPi and IPi+, for window, door, and storefront assemblies where higher insulation values are required.',
    specs: [
      'Special thermal inserts are positioned between the separators and around the glazing edge to improve insulation performance',
      'Large profile selection supports varied architectural appearance and structural strength requirements',
      'Glazing strips are available in rectangular and circular profiles',
      'Profile shapes accept a range of peripheral hardware, including hidden hinges and PCV hardware',
      'Supports single, double-cavity, acoustic, and anti-burglary glass panes',
      'Profile bending option is available for non-standard forms',
      'Designed for residential and public-building use, with multiple modern window variants available',
      'IPi and IPi+ are built from the established Imperial base system',
      'Finish range includes RAL palette, texture colors, Aliplast Wood Color Effect wood-like colors, and anodized color',
    ],
  },
  {
    id: 'genesis-aliplast', name: 'Genesis (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/genesis-aliplast-1.webp', image2: 'img/genesis-aliplast-2.webp',
    description: 'Genesis is a three-chamber aluminum window and door system developed for stronger thermal insulation in contemporary residential and commercial openings.',
    specs: [
      'Thermal performance meets current requirements, with Uw values from 0.90 W/m²K',
      'Modern insulation materials pair a conventional central gasket with an added thermal gasket',
      'Gasket design supports strong air-infiltration and water-tightness performance while keeping a clean appearance',
      'Profile finish options allow customization of the window structure, including renovation profiles',
      'Genesis OUT option is available for outward-opening windows',
      'Color range includes RAL palette, texture colors, Aliplast Wood Color Effect wood-like colors, anodized color, and bi-color',
    ],
  },
  {
    id: 'mb-86-aluprof', name: 'MB-86 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/mb-86-aluprof-1.webp', image2: 'img/mb-86-aluprof-2.webp',
    description: "Aluprof's MB-86 is available in ST, SI, and AERO thermal variants for projects with different energy targets. The AERO version uses silica aerogel in the insulation zone, while the profile geometry supports larger and heavier aluminum window and door assemblies.",
    specs: [
      'Wide thermal breaks allow an additional barrier within the profile insulation zone',
      'Two-component central gasket improves sealing and thermal insulation between the casement and frame',
      'Broad profile range supports selected aesthetics and resistance requirements',
      'Glazing strips with added sealing are offered in Standard, Prestige, and Style versions',
      'Profile shapes work with numerous multi-point locking systems, including concealed hinges',
      'Glazing range supports common triple glazing units, acoustic panes, and security panes',
      'Profile drainage can be specified in traditional or concealed versions',
      'Anti-burglary windows and doors can be made up to RC3 class, with windows in RC3i class',
    ],
  },
  {
    id: 'mb-70-aluprof', name: 'MB-70 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/mb-70-aluprof-1.webp', image2: 'img/mb-70-aluprof-2.webp',
    description: 'MB-70 is an aluminum system for exterior architectural elements that need thermal and acoustic insulation, including windows, doors, vestibules, display glazing, and spatial structures.',
    specs: [
      'Burglar-resistant windows and doors can be fabricated up to class RC4',
      'System supports smoke-exhaust windows and concealed-sash windows, including MB-70US, MB-70US HI, and MB-70SG',
      'MB-70 Industrial variant is available for historic-building applications',
      'Serves as the base for MB-70CW and MB-70CW HI cold-warm curtain wall configurations',
      'Glass thickness range is 21 mm to 57 mm in window casements and 12 mm to 48 mm in fixed windows and door leafs',
      'Wide infill range accommodates typical and atypical glass panels',
      'Standard palette colors are available with powder-coated or anodized finishes',
      'Profiles use a three-chamber structure',
      'Structural depth: window frame sections 70 mm, window casement 79 mm, doors 70 mm and 70 mm respectively',
    ],
  },
  {
    id: 'energeto-neo', name: 'energeto® neo (Aluplast)', tag: 'uPVC - T&T and Swing', category: 'Windows', mechanism: 'Tilt & Turn',
    image: 'img/energeto-neo-1.webp', image2: 'img/energeto-neo-2.webp',
    description: 'energeto® neo uses slim uPVC profiles for a clean cubic appearance, with recessed and flush-mounted closed configurations available. The platform suits larger properties and architect-led homes while combining aluplast thermal insulation, burglary protection, and practical everyday operation.',
    specs: [
      'Recessed energeto® neo configuration: Uf = 1.00 W/m²K',
      'Recessed energeto® neo configuration: Uw = 0.73 W/m²K in the best available option',
      'Flush energeto® neo configuration: Uf = 0.87 W/m²K',
      'Flush energeto® neo configuration: Uw = 0.67 W/m²K in the best available option',
      'IDEAL neo recessed configuration: Uf = 1.2 W/m²K',
      'IDEAL neo recessed configuration: Uw = 0.79 W/m²K in the best available option',
      'Footnote 1 basis: standard triple glazing with Ug = 0.7 and Psi = 0.040 W/mK',
      'Footnote 2 basis: triple glazing with Ug = 0.5 and Psi = 0.030 W/mK',
      'Footnote 3 basis: foam inside',
    ],
  },
  {
    id: 'neo-casement', name: 'neo-casement (Aluplast)', tag: 'uPVC - Casement', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/neo-casement-1.webp', image2: 'img/neo-casement-2.webp',
    description: 'neo casement brings German profile engineering into a North American crank-window format. It combines a modern cubic profile, interior glazing for security and serviceability, and an 85 mm construction depth for stability, efficiency, and climate-zone versatility.',
    specs: [
      'Extra-sturdy nailing fin supports durable attachment and straightforward installation',
      'Optimized around North American crank fittings',
      'Modern cubic design supports timeless architectural applications',
      'System depth: 85 mm (3 3/8 inches)',
      'Nailing fin: 32 mm (1 1/4 inches), recessed, extra rigid, and pre-drilled',
      'Triple glazing is possible with glass thicknesses up to 46 mm',
      'U-value frame up to 1.0 W/m²K (0.18 BTU/h·ft²·°F)',
      'U-value window up to 0.87 W/m²K (0.15 BTU/h·ft²·°F, with Ug = 0.6 W/m²K)',
      'Wind load, air, and water resistance are positioned at the top of the class',
      'Steel reinforcements increase structural strength',
      'Flexible accessory channel accepts multiple add-on parts',
      'High-quality thermoplastically co-extruded triple-seal system',
      'Integrated fly-screen channel optimized for flexscreen®',
      'Compatible with standard North American fittings',
      'Suitable for classic casement, awning, and picture windows',
    ],
  },
  {
    id: '300-casement', name: '300 series (Casement)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-casement-1.webp', image2: 'img/300-casement-2.webp',
    description: 'Fibertec 300 series casement windows use a compression-seal format and open 90 degrees for ventilation, cleaning access, and strong air and water tightness. The fiberglass frame supports harsh-climate glass packages and long-term dimensional stability.',
    specs: [
      'Standard series uses a 3 1/4 inches pultruded fiberglass closed-back frame completely filled with laser die cut polystyrene',
      'Injection-molded reinforced mitered corners are polyurethane foam filled and sealed with silicone sealant',
      'Available size range: minimum width 16 inches, minimum height 18 inches, maximum width 36 inches, maximum height 72 inches',
      'Manufactured to specified dimensions within +/- 1/8 inches (3.17 mm) industry tolerance',
      'Independent testing and rating follows AAMA/WDMA/CSA 101/I.S.2/A440-11, NAFS, A440S1-17, AAMA/WDMA/CSA 101/I.S.2/A440-17, A440S1-19, AAMA/WDMA/CSA 101/I.S.2/A440-122, and NAFS 2022',
      'Double-glazed configuration uses 7/8 inches sealed units with 5/8 inches air space',
      'Triple-glazed option uses 1 5/16 inches sealed units, maximum operator width 36 inches',
      'Optional glazing packages address climate or aesthetic needs, including LowE, Argon Gas, and Super Spacer',
      'Stock paint colors include White, Commercial Brown, Slate Grey, Black, and Sandalwood; co-colors also available',
      'Acrythane water-based frame paint includes UV protector and is rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Paint finish does not wrap around to the bottom edge of the frame when using nail fin application',
      'Attachment options include three types of brickmold, jamb extensions, strap anchors, and nailing fin',
      'Three-seal weather-stripping design follows the rain screen principle',
      'Weather stripping combines Santoprene bubble and saddle gasket at the main frame with pile fin on the sash',
      'Replaceable weather stripping',
      'Encore hardware from Truth Hardware includes interchangeable cover and folding handle design, available in white and black',
      'Insect screen uses roll-formed aluminum screen bar with hidden spring-loaded corner key and anti-rot fiberglass mesh',
      'Glass is retained by removable exterior glass stop with interior double-sided closed-cell foam tape and exterior Santoprene rubber gasket',
      'Glazing cavity is edge-drained and edge-vented to the exterior through concealed holes',
      'Installation should be completed by experienced installers following manufacturer instructions and CSA A440.4 standards',
      'Window must finish plumb and square, with interior and exterior wall seals completed using high quality sealant around the frame perimeter',
      'Foamed perimeter cavities may require additional anchorage to prevent bowing',
      'Maintenance calls for occasional cleaning of glass and frame components with non-abrasive detergent plus hinge-track cleaning and lubrication as required',
    ],
  },
  {
    id: '300-awning', name: '300 series (Awning)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-awning-1.webp', image2: 'img/lifestyle-arched-window.webp',
    description: 'Fibertec 300 series awning windows open outward with a compression seal, allowing ventilation during wet weather while maintaining strong air and water tightness. Narrow sightlines increase glass area, and the format is suited to wider, shorter openings.',
    specs: [
      'Standard series uses a 3 1/4 inches pultruded fiberglass closed-back frame completely filled with laser die cut polystyrene',
      'Injection-molded reinforced mitered corners are polyurethane foam filled and sealed with silicone sealant',
      'Available size range: minimum width 22 inches, minimum height 18 inches, maximum width 60 inches, maximum height 48 inches',
      'Manufactured to specified dimensions within +/- 1/8 inches (3.17 mm) industry tolerance',
      'Independent testing and rating follows AAMA/WDMA/CSA 101/I.S.2/A440-11, NAFS, A440S1-17, AAMA/WDMA/CSA 101/I.S.2/A440-17, A440S1-19, AAMA/WDMA/CSA 101/I.S.2/A440-122, and NAFS 2022',
      'Double-glazed configuration uses 7/8 inches sealed units with 5/8 inches air space',
      'Triple-glazed option uses 1 5/16 inches sealed units, maximum operator width 36 inches',
      'Optional glazing packages address climate or aesthetic needs, including LowE, Argon Gas, and Super Spacer',
      'Stock paint colors include White, Commercial Brown, Slate Grey, Black, and Sandalwood; co-colors also available',
      'Acrythane water-based frame paint includes UV protector and is rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Paint finish does not wrap around to the bottom edge of the frame when using nail fin application',
      'Frame attachment options include brickmould with or without nailing flange, three types; jamb extensions, strap anchors, and nailing fin',
      'Three-seal weather-stripping design follows the rain screen principle',
      'Weather stripping combines Santoprene bubble and saddle gasket at the main frame with pile fin on the sash',
      'Replaceable weather stripping',
      'Truth Encore TM dual-arm roto-gear hardware is available in white and black',
      'Insect screen uses roll-formed aluminum screen bar with hidden spring-loaded corner key and anti-rot fiberglass mesh',
      'Glass is retained by removable exterior glass stop with interior double-sided closed-cell foam tape and exterior Santoprene rubber gasket',
      'Glazing cavity is edge-drained and edge-vented to the exterior through concealed holes',
      'Installation should be completed by experienced installers following manufacturer instructions and CSA A440.4 standards',
      'Window must finish plumb and square, with interior and exterior wall seals completed using high quality sealant around the frame perimeter',
      'Foamed perimeter cavities may require additional anchorage to prevent bowing',
      'Maintenance calls for occasional cleaning of glass and frame components with non-abrasive detergent',
    ],
  },
  {
    id: '300-fixed', name: '300 series (Fix window)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed',
    image: 'img/300-fixed-1.webp', image2: 'img/lifestyle-curtain-wall-interior.webp',
    description: 'Fibertec 300 series fixed windows are non-operable units for daylight, views, and high-performance combinations with casement or awning windows. Narrow sightlines increase visible glass area, while the fiberglass frame supports harsh-climate glazing options and long-term stability.',
    specs: [
      'Specification uses a 3 1/4 inches pultruded fiberglass closed-back frame completely filled with laser die cut polystyrene',
      'Injection-molded reinforced mitered corners are polyurethane foam filled and sealed with silicone sealant',
      'Available size range: minimum width 12 inches, minimum height 12 inches, maximum width 84 inches, maximum height 84 inches',
      'Manufactured to specified dimensions within +/- 1/8 inches (3.17 mm) industry tolerance',
      'Independent testing and rating follows AAMA/WDMA/CSA 101/I.S.2/A440-11, NAFS, A440S1-17, AAMA/WDMA/CSA 101/I.S.2/A440-17, A440S1-19, AAMA/WDMA/CSA 101/I.S.2/A440-122, and NAFS 2022',
      'Double-glazing fiberglass glass stop works with 7/8 inches sealed unit and 5/8 inches air space',
      'Triple-glazing option uses 1 9/16 inches sealed units',
      'Optional glazing packages address climate or aesthetic needs, including LowE, Argon Gas, and Super Spacer',
      'Stock paint colors include White, Commercial Brown, Slate Grey, Black, and Sandalwood; co-colors also available',
      'Acrythane water-based frame paint includes UV protector and is rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Paint finish does not wrap around to the bottom edge of the frame when using nail fin application',
      'Attachment options include brickmould with or without nailing flange, three types; jamb extensions, strap anchors, and nailing fin',
      'High-performance pultruded fiberglass glass stop uses Santoprene gasket for a tight fit to the glazing',
      'Glazing tape is closed-cellular foam with double adhesive backing',
      'Installation should be completed by experienced installers following manufacturer instructions and CSA A440.4 standards',
      'Window must finish plumb and square, with interior and exterior wall seals completed using high quality sealant around the frame perimeter',
      'Foamed perimeter cavities may require additional anchorage to prevent bowing',
      'Maintenance calls for occasional cleaning of glass and frame components with non-abrasive detergent',
    ],
  },
  {
    id: 'genesis-75mm', name: 'Genesis 75mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/genesis-75mm-1.webp', image2: 'img/genesis-75mm-2.webp',
    description: 'Genesis 75mm is a three-chamber aluminum window and door platform focused on stronger thermal insulation for current performance expectations. It is configured for post-2021 requirements and can reach a Uw value as low as 0.90.',
    specs: [
      'Three-chamber window and door system on 75 mm deep frame sections, suitable for public buildings and residential single- or multi-family properties',
      'Advanced insulation materials combine a classic central seal with a thermal seal for strong air-infiltration and water-tightness integrity',
      'Ergonomic operation with a clean modern profile design',
      'Wide colour range: RAL palette (Qualicoat 1518), structural finishes, Aliplast Wood Colour Effect (Qualideco PL-0001), anodized options, and bi-color combinations',
    ],
  },
  {
    id: 'imperial-65mm', name: 'Imperial 65mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/imperial-65mm-1.webp', image2: 'img/lifestyle-double-entry-doors.webp',
    description: 'Aliplast Imperial 65mm is a three-chamber aluminum system for fixed, turn, tilt-and-turn, tilt-and-slide, exterior door, and related assemblies. Thermal breaks provide strong insulation, with performance that can be improved further through added inserts in the profile and around the glass.',
    specs: [
      'Frame profile width 65 mm with Uf value = 1.57 W/m²K (Uf from 1.28 W/m²K using additional thermal inserts)',
      'Thermal break width: 24 mm',
      'Weather performance includes air permeability Class 4 (PN-EN 12207), wind-load resistance Class C4 (PN-EN 12210), and water tightness Class E1350 (PN-EN 12208)',
      'Standard double-glazing packages use Ug value = 1.1 W/m²K',
      'Triple glazing can be specified with Ug = 0.6 W/m²K',
      'Glass packages can be filled with argon noble gas',
      'Warm edge spacer option available: Chromatech Ultra',
      'Glazing range from 4 to 51 mm supports standard, safe laminated, tempered, and soundproof glass up to 53 dB',
      'Solar control glass can be specified with Lt = 39% and g = 23%',
      'GU Germany fittings are used, including hidden fitting options',
      'Door locks can be specified with a burglary class and up to 5 locking points',
      'Standard handles and door pull are stainless steel',
      'Door access control options include keyboard, fingerprint, and access card',
      'Profile bending allows non-standard window shapes',
      'Color selection includes RAL palette, structural colors, Aliplast Wood Color Effect, and bicolor',
    ],
  },
  {
    id: 'energio-fortis', name: 'Energio Fortis', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/energio-fortis-1.jpg', image2: 'img/energio-fortis-2.webp',
    description: 'Energio Fortis is listed as an aluminum entry and swing door option while final manufacturer-level descriptive copy is still being completed.',
    specs: ['Detailed door description is still pending from source reference: https://www.energio-fenetres.com/portes-2/'],
  },
  {
    id: 'modern-slide', name: 'Modern Slide', tag: 'Aluminum', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/modern-slide-1.webp', image2: 'img/modern-slide-2.webp',
    description: 'Modern Slide is an aluminum sliding and galandage system for broad openings with slim profile lines. It pairs large glass movement with Sarena and Confort Slide handle options for residential and commercial applications.',
    specs: [
      'Profile: MODERNSLIDE Aliplast sliding and stripping system',
      'Sleepers: new 65 mm, ISO 120/140/160, Reno with taps, all installation types',
      'Uw: >=1.7 W/m²K',
      'Uf: >2.2 W/m²K',
      'Glazing thickness: <=28 mm, wallet joint',
    ],
  },
  {
    id: 'ultra-glide', name: 'Ultra Glide', tag: 'Aluminum - Lift and Slide', category: 'Doors', mechanism: 'Lift & Slide',
    image: 'img/ultra-glide-1.jpg', image2: 'img/lifestyle-sliding-bamboo.webp',
    description: 'Ultra Glide is an aluminum lift-and-slide system for large-format openings, including max configurations with Chicane 125 mm. The platform is designed for tall sliding elements and can reach heights up to 3.2 m.',
    specs: [
      'Profile: ULTRAGLIDE SLIM Aliplast, premium product',
      'Chicane: 45 mm',
      'Maximum leaf weight: 300 kg',
      'Sleepers: nine 153 mm, installation in tunnel or rabbet',
      'Uw: >=0.8 W/m²K',
      'Glazing thickness: <=56 mm',
    ],
  },
  {
    id: 'panorama', name: 'PANORAMA', tag: 'Aluminum - Accordion/Bi-fold', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/panorama-1.webp', image2: 'img/panorama-2.webp',
    description: 'PANORAMA is an aluminum accordion door system that can open an interior to the exterior or close it down as a refined glazed partition. It is suited to projects that need indoor-outdoor flexibility without losing comfort in poor weather.',
    specs: [
      'Profile: PANORAMA0 Aliplast',
      'Sleepers: new 74.5 mm, ISO 120/140/160, Reno 40/65 mm, possible with taps',
      'Uw: >=1.3 W/m²K in double glazing and 0.95 W/m²K in triple glazing',
      'Uf: >1.3 W/m²K',
      'Glazed thickness: <=40 mm',
      'Recessed threshold option is available for a cleaner floor transition',
    ],
  },
  {
    id: 'neo-smart-slide', name: 'neo smart-slide', tag: 'uPVC - Standard sliding', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/neo-smart-slide-1.webp', image2: 'img/neo-smart-slide-2.webp',
    description: 'neo smart-slide is a slim cubic sliding door system based on the energeto® neo platform. It is intended for large glass surfaces between living areas and exterior space, with element formats up to 6.0 m x 2.5 m.',
    specs: [
      'Installation depth options: 78 mm or 154 mm',
      'Uf = 1.3 W/m²K',
      'Glass and panel thickness in the sash up to 54 mm, with double to triple glazing possible',
      'System platform: energeto® neo',
      'Integrated hardware technology is hardware-neutral',
      'Multiple opening mechanisms are available',
      'Scheme A + C',
      'Decor options include woodec, aludec, and colour world',
      'Optional bonding inside using adhesive technology',
    ],
  },
  {
    id: 'lift-slide', name: 'lift-slide (Aluplast)', tag: 'uPVC - Lift and slide', category: 'Doors', mechanism: 'Lift & Slide',
    image: 'img/lift-slide-1.webp', image2: 'img/lift-slide-2.webp',
    description: 'aluplast lift-slide is built around an 85 mm construction depth for energy efficiency, smooth operation, and large-format openings. Even at 6.50 m x 2.80 m, the system is configured for easy movement and a barrier-free transition, with testing under severe conditions including driving rain and storms.',
    specs: [
      'Construction depth: 85 mm',
      'Frame thermal value: Uf = 1.3 W/m²K',
      'Standard triple-glazed configuration: Uw = 0.87 W/m²K with Ug = 0.6 and Psi = 0.040 W/mK',
      'Best available triple-glazed configuration: Uw = 0.71 W/m²K with Ug = 0.4 and Psi = 0.030 W/mK',
      'Thermally broken threshold detail',
      'Aluminium guide rail system',
      'Burglar protection available up to RC2',
    ],
  },
  {
    id: '200-entry', name: '200 series (entry doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Entry & Swing Doors',
    image: 'img/200-entry-1.webp', image2: 'img/200-entry-2.webp',
    description: 'Fibertec 200 series entry doors use foam-filled pultruded fiberglass frames for durability, air tightness, and energy performance. The frame accepts standard fiberglass door sizes and delivers steel-like security without corrosion.',
    specs: [
      'Door panel uses a 6 1/2 inches pultruded fiberglass frame filled with wood reinforcement',
      'Injection-molded reinforced mechanically welded corners are polyurethane foam filled and sealed with silicone sealant',
      'Optional 4 1/2 inches pultruded fiberglass frame available for single doors only',
      'Door slabs use reinforced fiberglass skins, available in smooth skin off-white flush or embossed pattern, and woodgrain beige flush or embossed pattern',
      'Door slab stile rails use weather-resistant PVC composite material',
      'Brickmould available for door assemblies',
      'Products are independently tested and rated by AAMA and NFRC',
      'Inswing system uses a thermally broken aluminum sill with strategically placed drainage for water management',
      'Adjustable threshold height',
      'Outswing system uses an aluminum sill with Q-Lon weather stripping for a positive seal to the slab',
      'Nominal slab sizes: 30 inches in certain styles only, plus 32 inches, 34 inches, and 36 inches wide by 80 inches height and 96 inches height',
      'Manufactured to specified dimensions within +/- 1/8 inches (3.17 mm) industry tolerance',
      'All fiberglass entry doors use a multi-point locking mechanism',
      'Latchbolts throw 20 mm and are secured against forced retraction',
      'Deadbolts engage by key or knob; top and bottom latchbolts function as part of a three-deadbolt locking system',
    ],
  },
  {
    id: '750-sliding', name: '750 series (Sliding doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Sliding & Folding',
    image: 'img/750-sliding-1.webp', image2: 'img/750-sliding-2.webp',
    description: 'Fibertec 750 series sliding patio doors upgrade the fiberglass patio door format with insulated closed-back frames, heavy-duty sashes, and a refined sash surface that gives the impression of an authentic wood door. Oak veneer laminate and triple-glazing options support a more elevated appearance and stronger energy performance.',
    specs: [
      'Standard series uses a 5 3/4 inches pultruded fiberglass closed-back frame filled with laser die cut polystyrene and blocking',
      'Injection-molded reinforced corners are polyurethane foam filled and sealed with silicone sealant',
      'Available in 2, 3, or 4 panel configurations',
      'Minimum nominal size: 60 inches x 80 inches',
      'Maximum nominal size: 189 inches x 96 inches',
      'Custom sizes are also available',
      'Fiberglass doors are available as two-panel, three-panel end-operator only, and four-panel center-operator configurations',
      'Manufactured to specified dimensions within +/- 1/8 inches (3.17 mm) industry tolerance',
      'Three- and four-panel doors ship knocked down for site assembly',
      'Independent testing and rating follows AAMA/WDMA/CSA 101/I.S.2/A440-11 Standard, NAFS, and A440S1-19 Canadian Supplement',
      'Glazing options include tempered interior/exterior double glazing with 1 inch sealed units and 11/16 inches air space',
      'Optional tempered triple glazing uses 1 3/8 inches sealed units, maximum operator width 32 inches; middle glass unit is annealed',
      'Additional glazing options available for climate condition or aesthetic requirements',
      'Paint finish stock colors: white, sandalwood, slate grey, commercial brown, and black; co-colors also available',
      'Standard frames include a white interior or can be painted to any requested colour',
      'Acrythane water-based frame paint includes UV protector and is rated environmentally friendly due to low VOC',
      'Custom colors are available',
      'Operating panel hardware uses an attractive metal handle in white or black, available with optional key lock',
      'Hardware upgrade option: #9700 EURO Handle in Brushed Chrome',
      'Optional foot lock lets the operating panel lock fully shut or slightly open',
      'Sliding insect screen uses an extruded aluminum frame with fiberglass mesh and spring-loaded rollers at top and bottom',
      'Thumb lock is a standard screen feature',
      'Installation should be completed by experienced installers following manufacturer instructions and CSA A440.4 standards',
      'Door must finish plumb and square, with interior and exterior wall seals completed using high quality sealant around the frame perimeter',
      'Foamed perimeter cavities may require additional anchorage to prevent bowing',
      'Maintenance calls for occasional cleaning of glass and frame components with non-abrasive detergent plus hinge-track cleaning and lubrication as required',
    ],
  },
  {
    id: 'mc-wall', name: 'MC Wall (Aliplast)', tag: 'Aluminum', category: 'Curtain wall', mechanism: 'Curtain Wall',
    image: 'img/mc-wall-1.webp', image2: 'img/mc-wall-2.webp',
    description: 'MC Wall is an Aliplast curtain wall platform for modern facade structures in simple or complex geometries. The system serves as the base for MC Passive, MC Passive+, MC Glass, and MC Fire fire-protection configurations.',
    specs: [
      'Designed for modern curtain walls in simple and complex shapes',
      'Mullion-transom visual width: 55 mm',
      'Wide range of mullions and transoms supports static requirements',
      'Insulators can be built to match infill thickness',
      'Decorative cover cap range supports varied visual effects on the curtain wall',
      'Profiles can be bent in both planes',
      'Wide color range includes RAL palette, texture colors, Aliplast Wood Color Effect wood-like colors, and anodized color',
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
  { id: '1620-main-st-hamilton', title: '1620 Main St.', description: 'Passive House low-rise residential project delivered in cooperation with BESI.', image: 'img/project-1620-main-hamilton.jpg', location: 'Hamilton, Ontario', type: 'Low-Rise Residential', scope: 'In cooperation with BESI', criteria: 'Passive House' },
  { id: '82-wilson-ave', title: '82 Wilson Ave.', description: 'Low-rise residential envelope project delivered in cooperation with Trust Pro Build.', image: 'img/project-82-wilson-kitchener.jpeg', location: 'Kitchener, Ontario', type: 'Low-Rise Residential', scope: 'In cooperation with Trust Pro Build', criteria: 'Low-rise residential envelope' },
  { id: '216-murray-st-ottawa', title: '216 Murray St.', description: 'Low-rise residential project experience in Ottawa.', image: 'img/project-216-murray-ottawa.jpg', location: 'Ottawa, Ontario', type: 'Low-Rise Residential', scope: 'Low-rise residential envelope support', criteria: 'Low-rise residential envelope' },
  { id: 'woodbine-casino-hotel', title: 'Woodbine Casino Hotel', description: 'Commercial hospitality project management experience for Krisro Metal Industries.', image: 'img/project-woodbine-casino-hotel.jpg', location: 'Toronto, Ontario', type: 'Commercial', scope: 'PM for Krisro Metal Industries', criteria: 'Commercial envelope delivery' },
  { id: '81-bay-st', title: '81 Bay St.', description: 'Commercial high-rise project management experience for Tagg Industries.', image: 'img/project-81-bay-toronto.jpg', location: 'Toronto, Ontario', type: 'Commercial', scope: 'PM for Tagg Industries', criteria: 'Commercial facade delivery' },
  { id: '141-bay-st-toronto', title: '141 Bay St.', description: 'Commercial tower project management experience delivered for BESI.', image: 'img/project-141-bay-toronto.jpg', location: 'Toronto, Ontario', type: 'Commercial', scope: 'PM for BESI', criteria: 'Commercial facade delivery' },
  { id: 'forma-266-king-st-w', title: 'Forma (266 King St. W)', description: 'Commercial tower project management experience delivered for BESI.', image: 'img/project-forma-266-king.jpg', location: 'Toronto, Ontario', type: 'Commercial', scope: 'PM for BESI', criteria: 'Commercial facade delivery' },
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
      defaultImage: 'img/market-commercial-multires.webp',
      defaultDesc: 'European-engineered facade systems tailored to commercial, custom residential, and regional dealer partners across Canada.',
      categories: [
        {
          title: 'Markets We Serve',
          titleHref: 'markets.html',
          items: [
            { name: 'Commercial Developers & GCs', href: 'commercial-developers.html', image: 'img/market-commercial-multires.webp', desc: 'Curtain wall, storefront, and high-performance windows for mid-rise, mixed-use, and Net Zero projects.' },
            { name: 'Architects & Custom Builders', href: 'architects-custom-builders.html', image: 'img/market-custom-modern-home.webp', desc: 'Tilt & Turn, Lift & Slide, and large-format glazing for Passive House and modern homes.' },
            { name: 'Dealer Partnerships', href: 'dealer-partnerships.html', image: 'img/market-commercial-interior.webp', desc: 'Premium European systems supplied to regional Canadian dealers with project-level technical support.' },
          ],
        },
      ],
    },
    services: {
      label: 'SERVICES',
      defaultImage: 'img/300-casement-2.webp',
      defaultDesc: 'Support options for supply-only projects, turn-key delivery, facade coordination, and project advisory.',
      categories: [
        {
          title: 'Services',
          titleHref: 'services.html',
          items: [
            { name: 'Supply Only', href: 'services.html#supply-only', image: 'img/300-casement-2.webp', desc: 'Technical guidance to select, coordinate, and receive the right system package.' },
            { name: 'Supply & Installation', href: 'services.html#supply-installation', image: 'img/lift-slide-2.webp', desc: 'Full-scope turn-key delivery under Crystal Ball oversight and quality standards.' },
            { name: 'Facade Advisory & Coordination', href: 'services.html#facade-advisory', image: 'img/neo-smart-slide-2.webp', desc: 'Support for design intent, system requirements, sequencing, and install readiness.' },
            { name: 'Project Management & Advisory', href: 'services.html#project-management', image: 'img/energeto-neo-2.webp', desc: 'On-demand expertise without expanding permanent overhead.' },
          ],
        },
      ],
    },
    about: {
      label: 'ABOUT',
      // Images intentionally mirror the actual <img src> on about.html
      // for each section anchor so the mega menu preview matches what
      // the visitor will land on. Update these in lockstep whenever
      // the corresponding section image changes.
      defaultImage: 'img/market-custom-mountain-home.webp',
      defaultDesc: "How Crystal Ball bridges European manufacturing capacity with Canadian construction discipline — built on more than two decades of envelope, curtain wall, and Passive House experience.",
      categories: [
        {
          title: 'About',
          titleHref: 'about.html',
          items: [
            { name: 'Our Vision',       href: 'about.html#vision',     image: 'img/lifestyle-curtain-wall-interior.webp', desc: 'Closing the gap between European engineering and Canadian execution.' },
            { name: 'Our Foundation',   href: 'about.html#foundation', image: 'img/market-custom-interior.webp',           desc: 'Led by construction. Informed by 20+ years of envelope and curtain wall experience.' },
            { name: 'Why Crystal Ball', href: 'about.html#why',        image: 'img/lifestyle-arched-window.webp',          desc: "More than a distributor — a construction partner who reads the drawings." },
          ],
        },
      ],
    },
  };

  const currentMenu = activeMenu ? megaMenus[activeMenu] : null;

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
          <a href="about.html" onMouseEnter={() => setActiveMenu('about')} className={`${navLinkBase} ${navText(a)}`}>
            ABOUT <span className={navUnderline(a)}></span>
          </a> ); })()}
          {(() => { const a = activeMenu === 'services' || currentPage === 'services'; return (
          <a href="services.html" onMouseEnter={() => setActiveMenu('services')} className={`${navLinkBase} ${navText(a)}`}>
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
          <a href="markets.html" onMouseEnter={() => setActiveMenu('markets')} className={`${navLinkBase} ${navText(a)}`}>
            MARKETS WE SERVE <span className={navUnderline(a)}></span>
          </a> ); })()}
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
              <a href="about.html" className="block py-3 text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase hover:text-glass transition">About &rarr;</a>
              {megaMenus.about.categories.flatMap(cat => cat.items).map((item) => (
                <a key={item.name} href={item.href} className="block py-3 text-[14px] text-[#4D4D4D]/80 hover:text-black transition">{item.name}</a>
              ))}
            </div>
          </div>

          <button onClick={() => setMobileDropdown(mobileDropdown === 'services' ? null : 'services')} className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]">
            SERVICES <span className={`transition ${mobileDropdown === 'services' ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${mobileDropdown === 'services' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-3 pt-4">
              <a href="services.html" className="block py-3 text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase hover:text-glass transition">Services &rarr;</a>
              {megaMenus.services.categories.flatMap(cat => cat.items).map((item) => (
                <a key={item.name} href={item.href} className="block py-3 text-[14px] text-[#4D4D4D]/80 hover:text-black transition">{item.name}</a>
              ))}
            </div>
          </div>

          <button onClick={() => setMobileDropdown(mobileDropdown === 'systems' ? null : 'systems')} className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]">
            SYSTEMS <span className={`transition ${mobileDropdown === 'systems' ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${mobileDropdown === 'systems' ? 'max-h-[1200px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-6 pt-4">
              <a href="products.html" className="block py-2 text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-3 hover:text-glass transition">Systems &rarr;</a>
              {megaMenus.systems.categories.map((cat) => (
                <div key={cat.title}>
                  {/* Parent category — links to category section on products.html */}
                  <a href={cat.titleHref} className="block py-2 text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-3 hover:text-glass transition">{cat.title} →</a>
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
              <a href="markets.html" className="block py-3 text-[14px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase hover:text-glass transition">Markets We Serve &rarr;</a>
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
                <div className="flex items-center gap-1 text-[14px] text-white/80">
                  <a href="tel:+14162275330" className="hover:text-white transition">416-227-5330</a>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-[14px] text-white/50 mt-10">Toronto, ON, Canada</p>
        </div>

        <div className="md:col-span-3">
          <h4 className="heading-label text-[14px] tracking-[0.2em] text-white uppercase mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="about.html" className="text-[14px] text-white/70 hover:text-white transition">About</a></li>
            <li><a href="products.html" className="text-[14px] text-white/70 hover:text-white transition">Systems</a></li>
            <li><a href="portfolio.html" className="text-[14px] text-white/70 hover:text-white transition">Portfolio</a></li>
            <li><a href="project-support.html" className="text-[14px] text-white/70 hover:text-white transition">Project Support</a></li>
            <li><a href="contact.html" className="text-[14px] text-white/70 hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="heading-label text-[14px] tracking-[0.2em] text-white uppercase mb-6">Markets We Serve</h4>
          <ul className="space-y-4">
            <li><a href="markets.html" className="text-[14px] text-white/70 hover:text-white transition">Overview</a></li>
            <li><a href="commercial-developers.html" className="text-[14px] text-white/70 hover:text-white transition">Commercial Developers & GCs</a></li>
            <li><a href="architects-custom-builders.html" className="text-[14px] text-white/70 hover:text-white transition">Architects & Custom Builders</a></li>
            <li><a href="dealer-partnerships.html" className="text-[14px] text-white/70 hover:text-white transition">Dealer Partnerships</a></li>
          </ul>
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
      className="block bg-[#1A1A1A] px-6 py-5 text-center hover:bg-black transition group"
    >
      <span className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 md:gap-3 text-white tracking-wider md:tracking-[0.2em] text-[14px] md:text-[15px] font-bold uppercase">
        <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-6 md:h-6 inline-block opacity-90 group-hover:rotate-12 transition-transform shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <ellipse cx="12" cy="12" rx="4" ry="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M3.5 7h17M3.5 17h17" />
        </svg>
        <span className="max-w-full whitespace-normal text-center leading-6">Handcrafted by Talkerstein Consulting Group</span>
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
