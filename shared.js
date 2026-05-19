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

const products = [
  { id: 'imperial-aliplast', name: 'Imperial (Aliplast)', tag: 'Aluminum', category: 'Windows', image: 'img/j-nadl-220-1620x1080.jpg.webp', specs: ['High-performance profile', 'Superior thermal efficiency'] },
  { id: 'genesis-aliplast', name: 'Genesis (Aliplast)', tag: 'Aluminum', category: 'Windows', image: 'img/jedraszek-best-391-1620x1080.jpg.webp', specs: ['Advanced sealing systems', 'Modern architectural intent'] },
  { id: 'mb-86-aluprof', name: 'MB-86 (Aluprof)', tag: 'Aluminum', category: 'Windows', image: 'img/al_063.20-1920x1040.jpg.webp', specs: ['Large-span glazing capabilities', 'Thermal continuity detailing'] },
  { id: 'mb-70-aluprof', name: 'MB-70 (Aluprof)', tag: 'Aluminum', category: 'Windows', image: 'img/al_098.20-1852x1080.jpg.webp', specs: ['Multi-chamber profile design', 'Acoustic insulation properties'] },
  { id: 'energeto-neo', name: 'energeto® neo (Aluplast)', tag: 'uPVC - T&T and Swing', category: 'Windows', image: 'img/29934274d638ae4gb488d6dbdb7aa6a6.jpg', specs: ['High energy efficiency', 'Modern sleek look'] },
  { id: 'neo-casement', name: 'neo-casement (Aluplast)', tag: 'uPVC - Casement', category: 'Windows', image: 'img/8e1f7b24c039e83gd4060f904f2ee414.jpg', specs: ['Casement specific design', 'Secure multi-point locking'] },
  { id: '300-casement', name: '300 series (Casement)', tag: 'Fiberglass', category: 'Windows', image: 'img/fiberglass-triple-glazed-windows-and-doors-800x500-1.jpg', specs: ['Extreme durability', 'Minimal expansion/contraction'] },
  { id: '300-awning', name: '300 series (Awning)', tag: 'Fiberglass', category: 'Windows', image: 'img/350-series-awning.jpg', specs: ['Excellent ventilation', 'Weather tight seal'] },
  { id: '300-fixed', name: '300 series (Fix window)', tag: 'Fiberglass', category: 'Windows', image: 'img/fiberglass-beechwood-casement-windows-fixed-windows-700x400-1.jpg', specs: ['Maximum light transmittance', 'High architectural value'] },
  { id: 'genesis-75mm', name: 'Genesis 75mm', tag: 'Aluminum', category: 'Doors', image: 'img/TERTIAIRES1-scaled-1.webp', specs: ['High thermal insulation', 'Robust structural integrity'] },
  { id: 'imperial-65mm', name: 'Imperial 65mm', tag: 'Aluminum', category: 'Doors', image: 'img/TERTIAIRES1-scaled-1.webp', specs: ['Durable frame construction', 'Commercial grade hardware'] },
  { id: 'energio-fortis', name: 'Energio Fortis', tag: 'Aluminum', category: 'Doors', image: 'img/CAnnes-FD-39-AI3-scaled-1.png', specs: ['Enhanced security multi-point locks', 'Superior weather sealing'] },
  { id: 'modern-slide', name: 'Modern Slide', tag: 'Aluminum', category: 'Doors', image: 'img/MDS-REALIZACJE.jpg', specs: ['Minimalist frame sightlines', 'Fluid movement mechanics'] },
  { id: 'ultra-glide', name: 'Ultra Glide', tag: 'Aluminum - Lift and Slide', category: 'Doors', image: 'img/shutterstock_552591889.webp', specs: ['Large-format panel support', 'Effortless lift mechanism'] },
  { id: 'panorama', name: 'PANORAMA', tag: 'Aluminum - Accordion/Bi-fold', category: 'Doors', image: 'img/Panorama.webp', specs: ['75mm frame depth', 'Seamless indoor-outdoor flow'] },
  { id: 'neo-smart-slide', name: 'neo smart-slide', tag: 'uPVC - Standard sliding', category: 'Doors', image: 'img/06bb4e22c8c4afcg1ab78cdac67ee33e.jpg', specs: ['Smooth gliding track', 'High weather resistance'] },
  { id: 'lift-slide', name: 'lift-slide (Aluplast)', tag: 'uPVC - Lift and slide', category: 'Doors', image: 'img/e4edeebb4ca669eg31666aa0517eaf3f.jpg', specs: ['Heavy duty panel support', 'Superior draft protection'] },
  { id: '200-entry', name: '200 series (entry doors)', tag: 'Fiberglass', category: 'Doors', image: 'img/olympus-digital-camera-1125x1500-1.jpg', specs: ['Impact resistant skin', 'High density insulation core'] },
  { id: '750-sliding', name: '750 series (Sliding doors)', tag: 'Fiberglass', category: 'Doors', image: 'img/750-sliding-patio-door-700x400-1.jpg', specs: ['Slim profile design', 'Exceptional structural rigidity'] },
  { id: 'mc-wall', name: 'MC Wall (Aliplast)', tag: 'Aluminum', category: 'Curtain wall', image: 'img/j-nadl-2341-1620x1080.jpg.webp', specs: ['Stick-built & unitized options', 'Engineered for high wind loads'] }
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
      <div className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

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
    <div ref={ref} className={`relative overflow-hidden w-full ${className}`}>
      {children}
      <div className={`absolute inset-0 z-40 bg-canvas transition-transform duration-[1.4s] ease-[cubic-bezier(0.77,0,0.175,1)] origin-right pointer-events-none flex items-center justify-start ${isVisible ? 'scale-x-0' : 'scale-x-100'}`} style={{ transitionDelay: `${delay}ms` }}>
        <div className="h-full w-32 border-l border-white/40 bg-white/30 backdrop-blur-xl -translate-x-full"></div>
        <div className="h-full w-16 border-l border-white/20 bg-white/10 backdrop-blur-md -translate-x-full ml-2"></div>
      </div>
    </div>
  );
}

function CrystalLogo({ className = '' }) {
  return (
    <img src="img/Crystal_Ball_-_Full_Color_-_Horizontal_k5ahdw-scaled.png" alt="Crystal Ball" className={className} />
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
      defaultDesc: 'Windows, doors, and curtain wall systems engineered for Canadian conditions and Canadian code.',
      categories: [
        {
          title: 'Windows',
          titleHref: 'products.html?cat=windows',
          items: products.filter(p => p.category === 'Windows').map(p => ({
            name: p.name,
            href: `${p.id}.html`,
            image: p.image,
            desc: `${p.tag} · ${p.specs.join(' · ')}`,
          })),
        },
        {
          title: 'Doors',
          titleHref: 'products.html?cat=doors',
          items: products.filter(p => p.category === 'Doors').map(p => ({
            name: p.name,
            href: `${p.id}.html`,
            image: p.image,
            desc: `${p.tag} · ${p.specs.join(' · ')}`,
          })),
        },
        {
          title: 'Curtain Wall',
          titleHref: 'products.html?cat=curtain-wall',
          items: products.filter(p => p.category === 'Curtain wall').map(p => ({
            name: p.name,
            href: `${p.id}.html`,
            image: p.image,
            desc: `${p.tag} · ${p.specs.join(' · ')}`,
          })),
        }
      ]
    },
    portfolio: {
      label: 'PORTFOLIO',
      defaultImage: 'img/Forma-1.jpg',
      defaultDesc: 'Explore our portfolio of premium architectural installations and custom glazing solutions across Canada.',
      categories: [
        {
          title: 'Commercial',
          items: showcaseProjects.filter(p => p.type === 'Commercial').map(p => ({ name: p.title, href: `portfolio.html#${p.id}`, image: p.image, desc: p.description })),
        },
        {
          title: 'Custom Residential',
          items: showcaseProjects.filter(p => p.type === 'Custom Residential').map(p => ({ name: p.title, href: `portfolio.html#${p.id}`, image: p.image, desc: p.description })),
        },
        {
          title: 'Curtain Wall',
          items: showcaseProjects.filter(p => p.type === 'Curtain Wall').map(p => ({ name: p.title, href: `portfolio.html#${p.id}`, image: p.image, desc: p.description })),
        },
      ].filter(c => c.items.length > 0),
    },
    markets: {
      label: 'MARKETS WE SERVE',
      defaultImage: 'img/Forma-1.jpg',
      defaultDesc: 'European-engineered facade systems tailored to commercial, custom residential, and regional dealer partners across Canada.',
      categories: [
        {
          items: [
            { name: 'Commercial Developers & GCs', href: 'commercial-developers.html', image: 'img/81-Bay-St.-Toronto.jpg', desc: 'Curtain wall, storefront, and high-performance windows for mid-rise, mixed-use, and Net Zero projects.' },
            { name: 'Architects & Custom Builders', href: 'architects-custom-builders.html', image: 'img/82-Wilson-Ave.-Kitchener-Ontario-1.jpeg', desc: 'Tilt & Turn, Lift & Slide, and large-format glazing for Passive House and modern homes.' },
            { name: 'Dealer Partnerships', href: 'dealer-partnerships.html', image: 'img/MDS-REALIZACJE.jpg', desc: 'Premium European systems supplied to regional Canadian dealers with project-level technical support.' },
          ],
        },
      ],
    },
  };

  const currentMenu = activeMenu ? megaMenus[activeMenu] : null;

  useEffect(() => {
    if (currentMenu) {
      setHoveredInfo({
        image: currentMenu.defaultImage,
        eyebrow: currentMenu.label,
        desc: currentMenu.defaultDesc
      });
    }
  }, [activeMenu]);

  return (
    <header onMouseLeave={() => setActiveMenu(null)} className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-[#FBFBFB]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="index.html" className="flex items-center gap-4 outline-none">
          <CrystalLogo className="h-12 w-auto object-contain" />
        </a>

        <nav className="hidden items-center gap-10 text-[14px] font-semibold tracking-[0.15em] text-[#4D4D4D]/80 md:flex">
          <a href="about.html" onMouseEnter={() => setActiveMenu(null)} className={`relative py-1 outline-none transition ${currentPage === 'about' ? 'text-[#111]' : 'hover:text-[#111]'}`}>
            ABOUT <span className={`absolute bottom-0 left-0 w-full h-[2px] transition-colors ${currentPage === 'about' ? 'bg-glass' : 'bg-transparent'}`}></span>
          </a>
          <a href="products.html" onMouseEnter={() => setActiveMenu('systems')} className={`relative py-1 outline-none transition ${activeMenu === 'systems' || currentPage === 'products' ? 'text-[#111]' : 'hover:text-[#111]'}`}>
            SYSTEMS <span className={`absolute bottom-0 left-0 w-full h-[2px] transition-colors ${activeMenu === 'systems' || currentPage === 'products' ? 'bg-glass' : 'bg-transparent'}`}></span>
          </a>
          <a href="portfolio.html" onMouseEnter={() => setActiveMenu('portfolio')} className={`relative py-1 outline-none transition ${activeMenu === 'portfolio' || currentPage === 'portfolio' ? 'text-[#111]' : 'hover:text-[#111]'}`}>
            PORTFOLIO <span className={`absolute bottom-0 left-0 w-full h-[2px] transition-colors ${activeMenu === 'portfolio' || currentPage === 'portfolio' ? 'bg-glass' : 'bg-transparent'}`}></span>
          </a>
          <a href="#" onMouseEnter={() => setActiveMenu('markets')} onClick={(e) => e.preventDefault()} className={`relative py-1 outline-none transition ${activeMenu === 'markets' || currentPage === 'markets' ? 'text-[#111]' : 'hover:text-[#111]'}`}>
            MARKETS WE SERVE <span className={`absolute bottom-0 left-0 w-full h-[2px] transition-colors ${activeMenu === 'markets' || currentPage === 'markets' ? 'bg-glass' : 'bg-transparent'}`}></span>
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 border border-black/15 md:hidden">
            <span className={`h-px w-5 bg-[#4D4D4D] transition ${mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}></span>
            <span className={`h-px w-5 bg-[#4D4D4D] transition ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-px w-5 bg-[#4D4D4D] transition ${mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}></span>
          </button>
          <a href="contact.html" className="hidden border border-charcoal bg-canvas px-6 py-3 text-[14px] font-bold tracking-[0.2em] text-darkheading hover:bg-darkheading hover:text-white transition md:block uppercase shadow-sm">
            CONTACT US
          </a>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <div className={`overflow-hidden border-t border-black/10 bg-[#FBFBFB] transition-all duration-500 ${currentMenu ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {currentMenu && (
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-[1fr_1fr]">
            {currentMenu.categories ? (
              <div className={`grid gap-8 ${currentMenu.categories.length >= 3 ? 'md:grid-cols-3' : currentMenu.categories.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                {currentMenu.categories.map((category, ci) => (
                  <div key={category.title || `cat-${ci}`}>
                    {category.title && (
                      category.titleHref ? (
                        <a href={category.titleHref} className="group/title flex items-center justify-between text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-4 pb-2 border-b border-black/10 hover:text-glass transition outline-none">
                          <span>{category.title}</span>
                          <span className="text-glass opacity-0 -translate-x-2 transition-all duration-300 group-hover/title:opacity-100 group-hover/title:translate-x-0">→</span>
                        </a>
                      ) : (
                        <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-4 pb-2 border-b border-black/10">{category.title}</h4>
                      )
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
            ) : (
              <div className={`grid gap-3 ${currentMenu.items.length >= 4 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                {currentMenu.items.map((item) => (
                  <a key={item.name} href={item.href} onMouseEnter={() => setHoveredInfo({ image: item.image, eyebrow: currentMenu.label, desc: item.desc })} className="group relative overflow-hidden border border-black/10 bg-black/[0.02] px-6 py-4 text-[14px] text-left text-[#4D4D4D]/80 transition hover:border-glass hover:text-black outline-none">
                    <span className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-glass/10 to-transparent transition-all duration-500 group-hover:w-full"></span>
                    <span className="relative flex items-center justify-between gap-4">
                      {item.name}
                      <span className="translate-x-[-8px] text-glass opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
                    </span>
                  </a>
                ))}
              </div>
            )}

            <div className="relative hidden h-[400px] w-full overflow-hidden border border-black/10 md:block">
              <img src={hoveredInfo?.image || currentMenu.defaultImage} className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
              <div key={activeMenu} className="absolute inset-y-0 left-0 w-1/2 translate-x-[-100%] border-r border-glass/30 bg-white/40 backdrop-blur-sm animate-[slideGlass_1s_ease_forwards]"></div>
              <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                <p className="text-[14px] font-bold tracking-[0.2em] text-glass uppercase transition-all duration-300">{hoveredInfo?.eyebrow || currentMenu.label}</p>
                <p className="mt-3 max-w-sm text-[15px] font-medium leading-7 text-[#1A1A1A] drop-shadow-sm transition-all duration-300">{hoveredInfo?.desc || currentMenu.defaultDesc}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      <div className={`border-t border-black/10 bg-[#FBFBFB] transition-all duration-500 md:hidden ${mobileMenuOpen ? 'max-h-[calc(100vh-88px)] overflow-y-auto opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
        <div className="space-y-2 px-6 py-6 pb-20">
          <a href="about.html" className="block w-full text-left border-b border-black/10 py-5 text-[14px] tracking-[0.15em] text-[#4D4D4D]">ABOUT</a>

          <button onClick={() => setMobileDropdown(mobileDropdown === 'systems' ? null : 'systems')} className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-[14px] tracking-[0.15em] text-[#4D4D4D]">
            PRODUCTS <span className={`transition ${mobileDropdown === 'systems' ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${mobileDropdown === 'systems' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-6 pt-4">
              {megaMenus.systems.categories.map((category) => (
                <div key={category.title}>
                  {category.titleHref ? (
                    <a href={category.titleHref} className="block text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-3 hover:text-glass transition">{category.title} →</a>
                  ) : (
                    <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-3">{category.title}</h4>
                  )}
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <a key={item.name} href={item.href} className="group flex w-full items-center text-left text-[14px] text-[#4D4D4D]/80 hover:text-black transition-colors">
                        {item.name} <span className="ml-2 text-glass opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a href="portfolio.html" className="block w-full text-left border-b border-black/10 py-5 text-[14px] tracking-[0.15em] text-[#4D4D4D]">PORTFOLIO</a>

          <button onClick={() => setMobileDropdown(mobileDropdown === 'markets' ? null : 'markets')} className="flex w-full items-center justify-between border-b border-black/10 py-5 text-left text-[14px] tracking-[0.15em] text-[#4D4D4D]">
            MARKETS WE SERVE <span className={`transition ${mobileDropdown === 'markets' ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${mobileDropdown === 'markets' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-3 pt-4">
              {megaMenus.markets.categories.flatMap(cat => cat.items).map((item) => (
                <a key={item.name} href={item.href} className="block py-3 text-[14px] text-[#4D4D4D]/80 hover:text-black transition">{item.name}</a>
              ))}
            </div>
          </div>

          <a href="contact.html" className="mt-6 w-full block border border-darkheading bg-darkheading px-5 py-4 text-center text-[14px] font-bold tracking-[0.2em] text-white hover:bg-charcoal transition uppercase">CONTACT US</a>
        </div>
      </div>
    </header>
  );
}

// --- FOOTER ---
function Footer() {
  return (
    <React.Fragment>
    <footer className="border-t border-black/10 bg-ink pt-24 pb-12 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-black/10 pb-16">

        <div className="md:col-span-5">
          <div className="flex justify-center md:justify-start mb-8">
            <a href="index.html" className="outline-none inline-block">
              <img src="img/Crystal-Ball-Full-Color-Vertical-scaled.png" alt="Crystal Ball" className="w-80 max-w-full md:w-64 h-auto opacity-90" />
            </a>
          </div>
          <p className="text-[14px] leading-7 text-[#4D4D4D] font-medium max-w-sm mb-4">
            Premium window and door solutions for contemporary homes and commercial projects. Engineered for the envelope.
          </p>

          <div className="mt-8 border-l-[1.5px] border-black/10 pl-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <span className="w-5 flex justify-center text-center text-[#1A1A1A]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <a href="mailto:Ilan@crystal-ball.ca" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Ilan@crystal-ball.ca</a>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-5 flex justify-center text-center text-[#1A1A1A]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <div className="flex items-center gap-1 text-[14px] text-[#4D4D4D] font-medium">
                  <a href="tel:+16476223226" className="hover:text-black transition">647-622-3226</a>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-[13px] font-medium text-[#4D4D4D]/60 mt-10">Toronto, ON, Canada</p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="about.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">About</a></li>
            <li><a href="products.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Systems</a></li>
            <li><a href="portfolio.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Portfolio</a></li>
            <li><a href="project-support.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Project Support</a></li>
            <li><a href="contact.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Contact Us</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-6">Markets We Serve</h4>
          <ul className="space-y-4">
            <li><a href="commercial-developers.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Commercial Developers & GCs</a></li>
            <li><a href="architects-custom-builders.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Architects & Custom Builders</a></li>
            <li><a href="dealer-partnerships.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Dealer Partnerships</a></li>
          </ul>

          <div className="flex gap-6 mt-10">
            <a href="#" className="text-[12px] font-bold tracking-[0.15em] text-glass uppercase hover:text-black transition">LinkedIn</a>
            <a href="#" className="text-[12px] font-bold tracking-[0.15em] text-glass uppercase hover:text-black transition">Instagram</a>
            <a href="#" className="text-[12px] font-bold tracking-[0.15em] text-glass uppercase hover:text-black transition">Facebook</a>
          </div>
        </div>

      </div>

      <div className="mx-auto max-w-7xl mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-medium text-[#4D4D4D]/60">
        <p>&copy; 2026 Crystal Ball Windows & Doors Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="privacy.html" className="hover:text-black transition">Privacy Policy</a>
          <a href="terms.html" className="hover:text-black transition">Terms of Service</a>
        </div>
      </div>
    </footer>

    <a
      href="https://talkerstein.com"
      target="_blank"
      rel="noopener"
      className="block bg-[#1A1A1A] py-5 text-center hover:bg-black transition group"
    >
      <span className="inline-flex items-center justify-center gap-2 md:gap-3 text-white tracking-wider md:tracking-[0.2em] text-[10px] md:text-[15px] font-bold uppercase whitespace-nowrap">
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

// --- BOTTOM CTA (reusable across pillar/sub pages) ---
function BottomCTA() {
  return (
    <section className="bg-obsidian border-t border-black/10 px-6 py-24 relative">
      <div className="mx-auto max-w-3xl text-center relative z-10">
        <TextReveal><h2 className="text-3xl font-light text-[#4D4D4D] md:text-5xl mb-6">Ready to discuss your project?</h2></TextReveal>
        <TextReveal delay={100}><p className="text-[16px] leading-7 text-[#4D4D4D]/80 mb-10 font-medium">We bring European engineering and construction intelligence to every facade.</p></TextReveal>
        <TextReveal delay={200}>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="contact.html" className="border border-darkheading bg-darkheading px-8 py-4 text-[13px] font-bold tracking-[0.2em] text-white hover:bg-charcoal transition uppercase outline-none shadow-sm">CONTACT US</a>
            <a href="products.html" className="border border-black/10 bg-white px-8 py-4 text-[13px] font-bold tracking-[0.2em] text-darkheading hover:border-glass transition uppercase outline-none shadow-sm">BROWSE PRODUCTS</a>
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
    <div onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6 backdrop-blur-md">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl overflow-hidden border border-black/10 p-8 shadow-2xl bg-white/95 max-h-[90vh] overflow-y-auto">
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
          <button type="submit" disabled={submitting} className="mt-4 w-full border border-darkheading bg-darkheading px-8 py-4 text-center text-[14px] font-bold tracking-[0.2em] text-white hover:bg-charcoal transition uppercase outline-none disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? 'SENDING…' : 'REQUEST CONSULTATION'}
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
