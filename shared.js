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
          "streetAddress": "25 Golden Trail",
          "addressLocality": "Vaughan",
          "addressRegion": "ON",
          "postalCode": "L6A 5A1",
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
  // Real product data. Spec bullets pulled from manufacturer documentation
  // and rewritten in the voice of a working architect, not a brochure.
  // Sources: abm-window.eu (Aliplast, Aluprof), aluplast.net, fibertec.com, energio-fenetres.com

  // --- WINDOWS / ALUMINUM ---
  { id: 'imperial-aliplast', name: 'Imperial', tag: 'Aluminum · Aliplast', category: 'Windows', image: 'img/j-nadl-220-1620x1080.jpg.webp',
    blurb: 'Five-chamber aluminum profile built for the kind of openings that make the architect happy — generous sightlines, glass up to 56mm, and thermal numbers that hold their own in a Toronto winter.',
    specs: ['77mm frame depth, 5-chamber thermal break', 'Uw down to 0.83 W/m²K with triple glazing', 'Glass thickness up to 56mm — handles acoustic + security units', 'Sash weight tolerance up to 160kg', 'Concealed hinge option for clean architectural lines'] },
  { id: 'genesis-aliplast', name: 'Genesis', tag: 'Aluminum · Aliplast', category: 'Windows', image: 'img/jedraszek-best-391-1620x1080.jpg.webp',
    blurb: 'Aliplast\'s flagship Passive House-certified system. When the spec says triple-glazed, low-U, large-format — this is the one that delivers it without compromise.',
    specs: ['85mm frame depth, 6-chamber profile', 'Passive House certified (Component, phB qualified)', 'Uw to 0.71 W/m²K with the right glazing', 'Glass up to 73mm', 'Concealed gasket and stainless hardware throughout'] },
  { id: 'mb-86-aluprof', name: 'MB-86', tag: 'Aluminum · Aluprof', category: 'Windows', image: 'img/al_063.20-1920x1040.jpg.webp',
    blurb: 'Aluprof\'s thermally-broken workhorse. ST, SI, and Aero variants let you tune the thermal performance to what the energy model actually needs — without paying for what it doesn\'t.',
    specs: ['77mm frame depth, three thermal variants (ST / SI / Aero)', 'Uw from 1.4 down to 0.5 W/m²K', 'Glass up to 67.5mm', 'Tested to Class C5/B5 air, 1200 Pa water, AE 2400 Pa wind', 'Same profile family as MB-SR50N curtain wall — clean integration'] },
  { id: 'mb-70-aluprof', name: 'MB-70', tag: 'Aluminum · Aluprof', category: 'Windows', image: 'img/al_098.20-1852x1080.jpg.webp',
    blurb: 'The MB-70 is what you specify when the project doesn\'t need MB-86\'s thermal numbers but does need MB-86\'s build quality. The middle of the Aluprof family, in the best sense.',
    specs: ['70mm frame depth, 3-chamber thermal break', 'Uw to 1.1 W/m²K with appropriate glazing', 'Glass up to 49mm', 'Two acoustic variants: Rw 38–45 dB', 'Industrial Aluprof hardware — high cycle count, low service'] },

  // --- WINDOWS / uPVC ---
  { id: 'energeto-neo', name: 'energeto® neo', tag: 'uPVC · Aluplast', category: 'Windows', image: 'img/29934274d638ae4gb488d6dbdb7aa6a6.jpg',
    blurb: 'Aluplast bonded the IGU directly into the sash (powerdur), so the window doesn\'t need a steel reinforcement and gets thinner sightlines plus better thermals. The technology shows up in the energy model.',
    specs: ['85mm frame depth, 6 chambers, steel-free sash', 'Uw to 0.79 W/m²K (triple-glazed)', 'Tilt & Turn and outward-swing door variants', 'Bonded-glass construction = thinner profiles, lighter sash', 'Foiled woodgrain and lacquered colour options'] },
  { id: 'neo-casement', name: 'neo casement', tag: 'uPVC · Aluplast', category: 'Windows', image: 'img/8e1f7b24c039e83gd4060f904f2ee414.jpg',
    blurb: 'North American-style casement on a European profile. For projects where the architect wants the outswing operation but the energy model needs the European thermal numbers.',
    specs: ['85mm frame depth, multi-chamber profile', 'Uw to 0.94 W/m²K with appropriate glazing', 'Casement and awning configurations available', 'Multi-point locking — 4+ locking points per sash', 'NAFS-compliant hardware on Canadian configurations'] },

  // --- WINDOWS / FIBERGLASS ---
  { id: '300-casement', name: '300 Series Casement', tag: 'Fiberglass · Fibertec', category: 'Windows', image: 'img/fiberglass-triple-glazed-windows-and-doors-800x500-1.jpg',
    blurb: 'Pultruded fiberglass — same thermal expansion as glass, so the seals stay sealed through 60°C of annual swing. This is the system for cold-climate, long-life, low-maintenance projects.',
    specs: ['3-1/4" frame depth, pultruded fiberglass', 'Uw down to 0.13 (U-1 in metric)', 'Triple-glazed standard, low-iron and laminated upgrades', 'Manufactured in Canada — short lead times, Canadian code testing', 'Manufacturer-claimed 60+ year service life'] },
  { id: '300-awning', name: '300 Series Awning', tag: 'Fiberglass · Fibertec', category: 'Windows', image: 'img/350-series-awning.jpg',
    blurb: 'The casement\'s sibling. Outswing top-hinged operation for ventilation that works in the rain, on the same Fibertec 300 chassis.',
    specs: ['3-1/4" frame depth, pultruded fiberglass', 'Project-out hardware sized for high-cycle commercial use', 'Triple-glazed standard, U-values matching 300 Casement', 'Insect screen option', 'Same finish and colour range as 300 Casement'] },
  { id: '300-fixed', name: '300 Series Fixed', tag: 'Fiberglass · Fibertec', category: 'Windows', image: 'img/fiberglass-beechwood-casement-windows-fixed-windows-700x400-1.jpg',
    blurb: 'When the design calls for a big inoperable opening, the fixed unit pushes the thermals further than the operable systems. Maximum glass, minimum sightline.',
    specs: ['Slim fixed-frame profile matching 300 Casement/Awning', 'Uw down to 0.12 — among the lowest available in fiberglass', 'Large-format glazing up to 4500mm × 2500mm', 'Glass options: triple, low-iron, laminated, acoustic', 'Sightline matched to operable units for clean ganging'] },

  // --- DOORS / ALUMINUM ---
  { id: 'genesis-75mm', name: 'Genesis 75mm Entrance', tag: 'Aluminum · Energio', category: 'Doors', image: 'img/TERTIAIRES1-scaled-1.webp',
    blurb: 'Energio\'s commercial-grade swing door. 75mm frame depth, thermal break, and the kind of hardware that survives a thousand cycles a day at a hotel entrance.',
    specs: ['75mm thermally-broken aluminum frame', 'Mid-pivot hinge or butt hinge configurations', 'Multi-point or panic exit hardware', 'Glass up to 50mm — supports acoustic and security units', 'Commercial-cycle rated, AAMA tested'] },
  { id: 'imperial-65mm', name: 'Imperial 65mm Entrance', tag: 'Aluminum · Energio', category: 'Doors', image: 'img/TERTIAIRES1-scaled-1.webp',
    blurb: 'A shallower-depth version of the Genesis chassis. Same Energio hardware, lighter frame, well-suited to residential entrances and lighter commercial.',
    specs: ['65mm thermally-broken aluminum frame', 'Single-point and multi-point lock options', 'Stainless butt hinges, Energio commercial hardware', 'Compatible with the same fixed sidelights as Genesis', 'Powder-coated and anodized finishes'] },
  { id: 'energio-fortis', name: 'Energio Fortis', tag: 'Aluminum · Energio', category: 'Doors', image: 'img/CAnnes-FD-39-AI3-scaled-1.png',
    blurb: 'Heavy-gauge aluminum entry built for the commercial cycle count. The Fortis is what goes on the front of a casino, hotel, or institutional building.',
    specs: ['Heavy-gauge aluminum, thermally broken', 'Multi-point locking + panic hardware options', 'Stainless hinges sized for high-traffic use', 'Glass up to 50mm with acoustic and laminated options', 'Available in concealed-closer and overhead-closer configurations'] },
  { id: 'modern-slide', name: 'Modern Slide', tag: 'Aluminum · Energio', category: 'Doors', image: 'img/MDS-REALIZACJE.jpg',
    blurb: 'Standard sliding patio door, Energio build quality. The everyday system for residential patios where the budget doesn\'t reach for Ultra Glide.',
    specs: ['Aluminum frame, thermally broken', '2-track and 3-track configurations', 'Stainless ball-bearing rollers, low-threshold option', 'Glass up to 32mm', 'Modular handle and lock options'] },
  { id: 'ultra-glide', name: 'Ultra Glide', tag: 'Aluminum · Lift & Slide · Energio', category: 'Doors', image: 'img/shutterstock_552591889.webp',
    blurb: 'Lift-and-slide. Lever the handle, the sash lifts off the seal and glides — drop it back down and the gasket seals like a fixed window. The system for opening up a whole wall of a custom home.',
    specs: ['Slim 35mm interlock — the closest you get to a fixed sightline on an operable wall', 'Panel weight up to 400kg per leaf', 'Lift-and-slide mechanism — perfect weather seal closed, smooth open', 'Glass up to 56mm including triple-glazed acoustic', 'Multi-rail configurations: 2, 3, 4-track + pocket'] },
  { id: 'panorama', name: 'PANORAMA Bi-fold', tag: 'Aluminum · Bi-fold · Energio', category: 'Doors', image: 'img/Panorama.webp',
    blurb: 'Accordion bi-fold by Aliplast on a 75mm frame. Folds the wall away when the weather is right. Engineered to hold its alignment and seal through the Canadian humidity cycle.',
    specs: ['75mm thermally-broken aluminum frame', 'Up to 7 panel configurations, both-way fold', 'Sash weight to 100kg, glass up to 44mm', 'Stainless hinges and rollers', 'Threshold options including low-threshold for barrier-free'] },

  // --- DOORS / uPVC ---
  { id: 'neo-smart-slide', name: 'neo smart-slide', tag: 'uPVC · Aluplast', category: 'Doors', image: 'img/06bb4e22c8c4afcg1ab78cdac67ee33e.jpg',
    blurb: 'Aluplast\'s standard sliding system on the neo platform. Better thermals than a stock vinyl patio door, accessible price point for high-performance residential.',
    specs: ['85mm frame depth, multi-chamber uPVC', 'Tilt-slide mechanism — partial seal in tilt position for ventilation', 'Uw to 1.3 W/m²K', 'Glass up to 44mm', 'Foiled and lacquered finishes'] },
  { id: 'lift-slide', name: 'lift-slide 85mm', tag: 'uPVC · Aluplast', category: 'Doors', image: 'img/e4edeebb4ca669eg31666aa0517eaf3f.jpg',
    blurb: 'uPVC lift-and-slide. Same mechanism as Ultra Glide — sash lifts off the seal on operation — at a residential price point. The compromise spot between sliding patio and Ultra Glide.',
    specs: ['85mm frame depth, multi-chamber uPVC', 'Sash weight to 200kg per leaf', 'Uw to 1.1 W/m²K with appropriate glazing', 'Glass up to 51mm', 'Pre-finished colours and woodgrain foils'] },

  // --- DOORS / FIBERGLASS ---
  { id: '200-entry', name: '200 Series Entry', tag: 'Fiberglass · Fibertec', category: 'Doors', image: 'img/olympus-digital-camera-1125x1500-1.jpg',
    blurb: 'Pultruded fiberglass entry door. Doesn\'t warp, doesn\'t telegraph the temperature, doesn\'t rust. Made in Canada for Canadian projects.',
    specs: ['Pultruded fiberglass with polyurethane foam core', 'Class-leading thermal performance', 'Multi-point lock and panic hardware options', 'Sidelight and transom-compatible', 'Triple-weatherstripped'] },
  { id: '750-sliding', name: '750 Series Sliding', tag: 'Fiberglass · Fibertec', category: 'Doors', image: 'img/750-sliding-patio-door-700x400-1.jpg',
    blurb: 'Fibertec\'s sliding patio. Same dimensional stability story as the 300 Series window — the seals stay sealed because the frame doesn\'t move with the seasons.',
    specs: ['Pultruded fiberglass frame and sash', 'Standard 2-track, optional 3-track', 'Triple-glazed standard', 'Stainless tandem rollers', 'Same finish range as Fibertec 200 Series and 300 Series'] },

  // --- CURTAIN WALL ---
  { id: 'mc-wall', name: 'MC Wall', tag: 'Aluminum · Aliplast', category: 'Curtain wall', image: 'img/j-nadl-2341-1620x1080.jpg.webp',
    blurb: 'Aliplast MC Wall. Stick-built or unitized — the same profile family scales from a mid-rise lobby to a 30-storey envelope. Tested wind loads up to 2.4 kPa.',
    specs: ['50mm and 65mm mullion options', 'Stick-built and unitized assembly', 'Designed to AE 2400 Pa wind load, RE 1200 Pa water', 'Continuous EPDM gaskets and pressure-equalized rain screen', 'Integrates with Aliplast Imperial / Genesis vents'] }
];

const showcaseProjects = [
  // Real projects from Ilan Muskal, April 2026.
  // PM partnerships preserved where Ilan acted as project manager rather than sole contractor.
  { id: '141-bay-st',         title: '141 Bay St.',                          description: 'Downtown Toronto commercial tower. Crystal Ball was project manager for BESI on the envelope scope.',                                      image: 'img/141-bay-st-toronto.jpg',  location: 'Toronto, Ontario',   type: 'Commercial',          year: '2024', scope: 'Curtain Wall, Storefront',          criteria: 'OBC, Toronto Green Standard',         partner: 'PM for BESI' },
  { id: '81-bay-st',          title: '81 Bay St.',                          description: 'Mixed-use tower in the financial core. PM for Tagg Industries on the facade package.',                                                   image: 'img/81-bay-st-toronto.jpg',   location: 'Toronto, Ontario',   type: 'Commercial',          year: '2024', scope: 'Windows, Curtain Wall',             criteria: 'LEED, Toronto Green Standard',        partner: 'PM for Tagg Industries' },
  { id: 'forma',              title: 'Forma — 266 King St. W',              description: 'Frank Gehry / Diamond Schmitt residential tower. Project-managed the envelope scope on behalf of BESI.',                                  image: 'img/forma-1.jpg',             location: 'Toronto, Ontario',   type: 'Curtain Wall',        year: '2024', scope: 'Unitized Curtain Wall, Storefront', criteria: 'OBC, NBCC, Toronto Green Standard',   partner: 'PM for BESI' },
  { id: 'woodbine-casino',    title: 'Woodbine Casino Hotel',               description: 'Hotel and casino expansion. PM for Krisro Metal Industries on the high-cycle, high-traffic facade scope.',                                image: 'img/woodbine-1.jpg',          location: 'Toronto, Ontario',   type: 'Commercial',          year: '2023', scope: 'Windows, Doors, Storefront',         criteria: 'OBC, LEED',                           partner: 'PM for Krisro Metal Industries' },
  { id: '1620-main-east',     title: '1620 Main St. East',                  description: 'Passive House low-rise residential in Hamilton. Supplied in cooperation with BESI to certified Passive House criteria.',                  image: 'img/1620-main-st-east-1.jpg', location: 'Hamilton, Ontario',  type: 'Restoration & Retrofit', year: '2024', scope: 'Tilt & Turn Windows, Entrance Doors', criteria: 'Passive House Certified',            partner: 'with BESI' },
  { id: '82-wilson-ave',      title: '82 Wilson Ave.',                      description: 'Custom residential in Kitchener delivered in cooperation with Trust Pro Build. Large-format glazing tuned to the architectural intent.', image: 'img/82-wilson-ave-1.jpg',     location: 'Kitchener, Ontario', type: 'Custom Residential',  year: '2025', scope: 'Tilt & Turn Windows, Lift & Slide Doors', criteria: 'OBC, Net Zero Ready',          partner: 'with Trust Pro Build' },
  { id: '216-murray-ottawa',  title: '216 Murray St.',                      description: 'Multi-unit residential in central Ottawa. Tight envelope sequencing on an occupied infill site.',                                       image: 'img/216-murray-st-ottawa.jpg', location: 'Ottawa, Ontario',   type: 'Restoration & Retrofit', year: '2024', scope: 'Tilt & Turn Windows, Entrance Doors', criteria: 'NBCC, Cold Climate',                  partner: '' }
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // v3 IA — five flat top-level links + GET A QUOTE button. No mega menus.
  const navLinks = [
    { label: 'HOME',     href: 'index.html',    key: 'home' },
    { label: 'ABOUT',    href: 'about.html',    key: 'about' },
    { label: 'SERVICES', href: 'services.html', key: 'services' },
    { label: 'PROJECTS', href: 'projects.html', key: 'projects' },
    { label: 'CONTACT',  href: 'contact.html',  key: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-[#FEFEFE]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="index.html" className="flex items-center gap-4 outline-none">
          <CrystalLogo className="h-10 w-auto object-contain" />
        </a>

        <nav className="hidden items-center gap-8 text-[13px] font-semibold tracking-[0.2em] text-[#4D4D4D]/80 md:flex">
          {navLinks.map(link => {
            const active = currentPage === link.key;
            return (
              <a key={link.key} href={link.href} className={`relative py-1 outline-none transition ${active ? 'text-[#111]' : 'hover:text-[#111]'}`}>
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] transition-colors ${active ? 'bg-glass' : 'bg-transparent'}`}></span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-black/15 md:hidden" aria-label="Toggle menu">
            <span className={`h-px w-5 bg-[#4D4D4D] transition ${mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}></span>
            <span className={`h-px w-5 bg-[#4D4D4D] transition ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-px w-5 bg-[#4D4D4D] transition ${mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}></span>
          </button>
          <a href="contact.html" className="hidden border border-darkheading bg-canvas px-6 py-2.5 text-[12px] font-bold tracking-[0.2em] text-darkheading hover:bg-darkheading hover:text-white transition md:block uppercase">
            Get a Quote
          </a>
        </div>
      </div>

      {/* Mobile drawer — flat list of 5 + CTA */}
      <div className={`border-t border-black/10 bg-[#FEFEFE] transition-all duration-500 md:hidden ${mobileMenuOpen ? 'max-h-[calc(100vh-88px)] overflow-y-auto opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
        <div className="space-y-1 px-6 py-6 pb-20">
          {navLinks.map(link => (
            <a key={link.key} href={link.href} className={`block w-full text-left border-b border-black/10 py-5 text-[14px] tracking-[0.2em] uppercase ${currentPage === link.key ? 'text-[#111] font-bold' : 'text-[#4D4D4D]'}`}>
              {link.label}
            </a>
          ))}
          <a href="contact.html" className="mt-8 block w-full text-center border border-darkheading bg-darkheading px-5 py-4 text-[13px] font-bold tracking-[0.2em] text-white hover:bg-charcoal transition uppercase">
            Get a Quote
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
    <footer className="border-t border-black/10 bg-ink pt-24 pb-12 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-black/10 pb-16">

        <div className="md:col-span-5">
          <a href="index.html" className="outline-none mb-8 inline-block">
            <img src="img/Crystal-Ball-Full-Color-Vertical-scaled.png" alt="Crystal Ball" className="w-56 md:w-64 h-auto opacity-90" />
          </a>
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

          <p className="text-[13px] font-medium text-[#4D4D4D]/60 mt-10">25 Golden Trail<br/>Vaughan, ON L6A 5A1</p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-6">Site</h4>
          <ul className="space-y-4">
            <li><a href="about.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">About</a></li>
            <li><a href="services.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Services</a></li>
            <li><a href="projects.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Projects</a></li>
            <li><a href="contact.html" className="text-[14px] text-[#4D4D4D] font-medium hover:text-black transition">Contact</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-6">Markets</h4>
          <ul className="space-y-4">
            <li><span className="text-[14px] text-[#4D4D4D] font-medium">Commercial Developers & GCs</span></li>
            <li><span className="text-[14px] text-[#4D4D4D] font-medium">Architects & Custom Builders</span></li>
            <li><span className="text-[14px] text-[#4D4D4D] font-medium">Regional Dealer Partnerships</span></li>
            <li><span className="text-[14px] text-[#4D4D4D] font-medium">Restoration & Retrofit</span></li>
          </ul>

          <div className="flex gap-6 mt-10">
            <a href="#" className="text-[12px] font-bold tracking-[0.15em] text-glass uppercase hover:text-black transition">LinkedIn</a>
            <a href="#" className="text-[12px] font-bold tracking-[0.15em] text-glass uppercase hover:text-black transition">Instagram</a>
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
      <span className="inline-flex items-center justify-center gap-3 text-white tracking-[0.2em] text-[13px] md:text-[15px] font-bold uppercase">
        Handcrafted by
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 inline-block opacity-90 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <ellipse cx="12" cy="12" rx="4" ry="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M3.5 7h17M3.5 17h17" />
        </svg>
        Talkerstein Consulting
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

// Expose globals
window.TextReveal = TextReveal;
window.GlassReveal = GlassReveal;
window.CrystalLogo = CrystalLogo;
window.Header = Header;
window.Footer = Footer;
window.BottomCTA = BottomCTA;
window.products = products;
window.propertyImages = propertyImages;
window.showcaseProjects = showcaseProjects;
