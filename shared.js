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
// Old lifestyle file paths (j-nadl-220, jedraszek-best-391, etc.) are
// still in img/ and continue to be used as `featureImage` for mega-menu
// mechanisms + as generic lifestyle imagery on hero/feature sections.
const products = [
  { id: 'imperial-aliplast', name: 'Imperial (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn', image: 'img/imperial-aliplast-1.webp', image2: 'img/imperial-aliplast-2.webp', specs: ['High-performance profile', 'Superior thermal efficiency'] },
  { id: 'genesis-aliplast', name: 'Genesis (Aliplast)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn', image: 'img/genesis-aliplast-1.png', image2: 'img/genesis-aliplast-2.jpg', specs: ['Advanced sealing systems', 'Modern architectural intent'] },
  { id: 'mb-86-aluprof', name: 'MB-86 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn', image: 'img/mb-86-aluprof-1.webp', image2: 'img/mb-86-aluprof-2.webp', specs: ['Large-span glazing capabilities', 'Thermal continuity detailing'] },
  { id: 'mb-70-aluprof', name: 'MB-70 (Aluprof)', tag: 'Aluminum', category: 'Windows', mechanism: 'Tilt & Turn', image: 'img/mb-70-aluprof-1.webp', image2: 'img/mb-70-aluprof-2.webp', specs: ['Multi-chamber profile design', 'Acoustic insulation properties'] },
  { id: 'energeto-neo', name: 'energeto® neo (Aluplast)', tag: 'uPVC - T&T and Swing', category: 'Windows', mechanism: 'Tilt & Turn', image: 'img/energeto-neo-1.jpg', image2: 'img/energeto-neo-2.jpg', specs: ['High energy efficiency', 'Modern sleek look'] },
  { id: 'neo-casement', name: 'neo-casement (Aluplast)', tag: 'uPVC - Casement', category: 'Windows', mechanism: 'Casement, Awning & Fixed', image: 'img/neo-casement-1.png', image2: 'img/neo-casement-2.jpg', specs: ['Casement specific design', 'Secure multi-point locking'] },
  { id: '300-casement', name: '300 series (Casement)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed', image: 'img/300-casement-1.jpg', image2: 'img/300-casement-2.jpg', specs: ['Extreme durability', 'Minimal expansion/contraction'] },
  { id: '300-awning', name: '300 series (Awning)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed', image: 'img/300-awning-1.jpg', image2: 'img/300-awning-2.jpg', specs: ['Excellent ventilation', 'Weather tight seal'] },
  { id: '300-fixed', name: '300 series (Fix window)', tag: 'Fiberglass', category: 'Windows', mechanism: 'Casement, Awning & Fixed', image: 'img/300-fixed-1.jpg', image2: 'img/300-fixed-2.jpg', specs: ['Maximum light transmittance', 'High architectural value'] },
  { id: 'genesis-75mm', name: 'Genesis 75mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors', image: 'img/genesis-75mm-1.webp', image2: 'img/genesis-75mm-2.jpg', specs: ['High thermal insulation', 'Robust structural integrity'] },
  { id: 'imperial-65mm', name: 'Imperial 65mm', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors', image: 'img/imperial-65mm-1.webp', image2: 'img/imperial-65mm-2.jpg', specs: ['Durable frame construction', 'Commercial grade hardware'] },
  { id: 'energio-fortis', name: 'Energio Fortis', tag: 'Aluminum', category: 'Doors', mechanism: 'Entry & Swing Doors', image: 'img/energio-fortis-1.jpg', image2: 'img/energio-fortis-2.jpg', specs: ['Enhanced security multi-point locks', 'Superior weather sealing'] },
  { id: 'modern-slide', name: 'Modern Slide', tag: 'Aluminum', category: 'Doors', mechanism: 'Sliding & Folding', image: 'img/modern-slide-1.webp', image2: 'img/modern-slide-2.jpg', specs: ['Minimalist frame sightlines', 'Fluid movement mechanics'] },
  { id: 'ultra-glide', name: 'Ultra Glide', tag: 'Aluminum - Lift and Slide', category: 'Doors', mechanism: 'Lift & Slide', image: 'img/ultra-glide-1.jpg', image2: 'img/ultra-glide-2.jpg', specs: ['Large-format panel support', 'Effortless lift mechanism'] },
  { id: 'panorama', name: 'PANORAMA', tag: 'Aluminum - Accordion/Bi-fold', category: 'Doors', mechanism: 'Sliding & Folding', image: 'img/panorama-1.png', image2: 'img/panorama-2.jpg', specs: ['75mm frame depth', 'Seamless indoor-outdoor flow'] },
  { id: 'neo-smart-slide', name: 'neo smart-slide', tag: 'uPVC - Standard sliding', category: 'Doors', mechanism: 'Sliding & Folding', image: 'img/neo-smart-slide-1.png', image2: 'img/neo-smart-slide-2.jpg', specs: ['Smooth gliding track', 'High weather resistance'] },
  { id: 'lift-slide', name: 'lift-slide (Aluplast)', tag: 'uPVC - Lift and slide', category: 'Doors', mechanism: 'Lift & Slide', image: 'img/lift-slide-1.png', image2: 'img/lift-slide-2.webp', specs: ['Heavy duty panel support', 'Superior draft protection'] },
  { id: '200-entry', name: '200 series (entry doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Entry & Swing Doors', image: 'img/200-entry-1.jpg', image2: 'img/200-entry-2.jpg', specs: ['Impact resistant skin', 'High density insulation core'] },
  { id: '750-sliding', name: '750 series (Sliding doors)', tag: 'Fiberglass', category: 'Doors', mechanism: 'Sliding & Folding', image: 'img/750-sliding-1.png', image2: 'img/750-sliding-2.jpg', specs: ['Slim profile design', 'Exceptional structural rigidity'] },
  { id: 'mc-wall', name: 'MC Wall (Aliplast)', tag: 'Aluminum', category: 'Curtain wall', mechanism: 'Curtain Wall', image: 'img/mc-wall-1.webp', image2: 'img/mc-wall-2.webp', specs: ['Stick-built & unitized options', 'Engineered for high wind loads'] }
];

// Mechanism families — how a system operates. Each product carries a
// `mechanism` field on `products` that matches one of these `name`s.
// Used by:
//  - the homepage MechanismAccordion (renders one row per mechanism)
//  - the products.html catalog (groups products under Category > Mechanism)
//  - the SYSTEMS mega menu (deep-link items)
const mechanisms = [
  { id: 'tilt-turn',                name: 'Tilt & Turn',              category: 'Windows',      tagline: 'The European default. Inward-opening, dual-operation, superior air sealing.',                                                          featureImage: 'img/al_063.20-1920x1040.jpg.webp' },
  { id: 'casement-awning-fixed',    name: 'Casement, Awning & Fixed', category: 'Windows',      tagline: 'North American configurations at European performance levels. Side-hinged casements, top-hinged awnings, large-format fixed glazing.', featureImage: 'img/fiberglass-triple-glazed-windows-and-doors-800x500-1.jpg' },
  { id: 'lift-slide',               name: 'Lift & Slide',             category: 'Doors',        tagline: 'Multi-panel glazed walls that operate at scale. Lift mechanism frees the rollers and drops a perfect weather seal in the closed position.', featureImage: 'img/shutterstock_552591889.webp' },
  { id: 'sliding-folding',          name: 'Sliding & Folding',        category: 'Doors',        tagline: 'From minimal-frame patio doors to multi-panel accordion walls. Seamless indoor-outdoor flow at residential and light-commercial scale.',  featureImage: 'img/Panorama.webp' },
  { id: 'entry-swing',              name: 'Entry & Swing Doors',      category: 'Doors',        tagline: 'Premium entrance systems with thermal continuity, multi-point hardware, and architectural integration.',                                  featureImage: 'img/TERTIAIRES1-scaled-1.webp' },
  { id: 'curtain-wall',             name: 'Curtain Wall',             category: 'Curtain wall', tagline: 'Stick-built and unitized commercial assemblies, storefront, and custom facade configurations.',                                            featureImage: 'img/j-nadl-2341-1620x1080.jpg.webp' },
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
      defaultImage: 'img/al_063.20-1920x1040.jpg.webp',
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
            { name: 'Commercial Developers & GCs', href: 'commercial-developers.html', image: 'img/81-Bay-St.-Toronto.jpg', desc: 'Curtain wall, storefront, and high-performance windows for mid-rise, mixed-use, and Net Zero projects.' },
            { name: 'Architects & Custom Builders', href: 'architects-custom-builders.html', image: 'img/82-Wilson-Ave.-Kitchener-Ontario-1.jpeg', desc: 'Tilt & Turn, Lift & Slide, and large-format glazing for Passive House and modern homes.' },
            { name: 'Dealer Partnerships', href: 'dealer-partnerships.html', image: 'img/MDS-REALIZACJE.jpg', desc: 'Premium European systems supplied to regional Canadian dealers with project-level technical support.' },
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
            { name: 'Why Crystal Ball', href: 'about.html#why', image: 'img/al_063.20-1920x1040.jpg.webp', desc: "More than a distributor — a construction partner who reads the drawings." },
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
          <a href="#" onMouseEnter={() => setActiveMenu('markets')} onClick={(e) => e.preventDefault()} className={`${navLinkBase} ${navText(a)}`}>
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
                <a href="mailto:Ilan@crystal-ball.ca" className="text-[14px] text-white/80 hover:text-white transition">Ilan@crystal-ball.ca</a>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-5 flex justify-center text-center text-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <div className="flex items-center gap-1 text-[14px] text-white/80">
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
        alert('Something went wrong submitting the form. Please email Ilan@crystal-ball.ca instead.');
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
