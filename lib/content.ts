// Single source of truth. Every fact below comes from Crescivo_Business_Solutions_Brochure.pdf.
// Copy is lightly edited for the web (sentence case, punctuation); meaning is unchanged.

export const SITE = {
  name: "Crescivo Business Solutions",
  shortName: "Crescivo",
  url: "https://www.crescivo.com",
  positioning: "Business consulting & technology partner",
  tagline: "Empowering businesses to grow, scale & succeed",
  description:
    "Crescivo Business Solutions is a business consulting and technology partner. We pair strategy with hands-on execution across marketing, creative, HR and technology to help businesses grow, scale and succeed.",
  phone: "+91 6238118758",
  phoneHref: "tel:+916238118758",
  email: "hello@crescivo.com",
  website: "www.crescivo.com",
} as const;

export const NAV = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#solutions", label: "Solutions" },
  { href: "#why", label: "Why Crescivo" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
] as const;

export const HERO = {
  lead: "Your growth, our strategy. We turn strategy into success — pairing business consulting with hands-on execution across marketing, creative, HR and technology.",
};

export const ABOUT = {
  statement:
    "Crescivo is a forward-thinking business consulting company dedicated to helping organizations achieve sustainable growth and unlock their true potential.",
  body: "We combine strategic thinking, creative execution and technology-driven solutions to transform businesses and drive measurable results.",
  approach: ["Strategic thinking", "Creative execution", "Technology-driven"],
};

export const MISSION = {
  intro: "Three commitments that guide every engagement we take on.",
  items: [
    { title: "Powerful strategies", text: "Deliver solutions that help businesses grow faster and operate smarter.", glyph: "target" },
    { title: "Sustainable growth", text: "Focus on long-term success through proven methodologies.", glyph: "growth" },
    { title: "Client success", text: "Build partnerships that transform ideas into measurable outcomes.", glyph: "partners" },
  ],
} as const;

export const SERVICE_AREAS = [
  { id: "strategy", label: "business strategy & consulting" },
  { id: "marketing", label: "marketing" },
  { id: "creative", label: "creative & media" },
  { id: "operations", label: "HR & technology" },
  { id: "software", label: "software development" },
] as const;

export const STRATEGY = {
  title: "Business strategy & consulting",
  subtitle: "Strategic roadmap",
  text: "Build a clear path to success with comprehensive business plans and growth strategies.",
  items: ["Business plan creation", "Strategic development", "Market expansion planning"],
};

export const MARKETING = {
  title: "Marketing solutions",
  items: [
    { title: "Digital marketing", text: "Comprehensive online presence through social media management, paid advertising and SEO optimization." },
    { title: "Traditional campaigns", text: "Local brand promotions, market activation and offline marketing strategies that connect with your community." },
    { title: "Online branding", text: "Build a powerful digital identity with strategic SEO and comprehensive online branding solutions." },
  ],
};

export const CREATIVE = {
  title: "Creative & media services",
  items: [
    { title: "Video production", text: "Shooting, editing and production of professional video content." },
    { title: "Graphic design", text: "Compelling visual identity through advertisements and branding materials." },
    { title: "Corporate materials", text: "Company profiles, brochures and business documentation." },
  ],
};

export const OPERATIONS = {
  title: "HR & technology solutions",
  hr: ["Recruitment & talent acquisition", "Payroll management", "HR training programs", "Company policy development"],
  tech: [
    { title: "Website development & maintenance", text: "Ongoing updates, performance and support." },
    { title: "Business automation solutions", text: "Streamline repetitive tasks and workflows." },
  ],
};

export const SOFTWARE = {
  title: "Software development",
  text: "Empowering digital transformation with scalable, secure software solutions tailored to your unique business requirements.",
  // Ordered top → bottom to match the layers of the 3D stack.
  items: [
    { title: "Mobile & web platforms", text: "Engaging, high-performance applications for iOS, Android and web environments." },
    { title: "System integration & API", text: "Seamless connectivity and cloud integration to unify your business tools and architecture." },
    { title: "Custom applications", text: "End-to-end development of bespoke software designed to optimize your internal workflows." },
  ],
};

export const SOLUTIONS = {
  title: "Technology & software solutions",
  text: "From core business systems to intelligent automation — the platforms and tools to run and scale every part of your operation.",
  // Grouping is editorial (for filtering); the list itself is the brochure's, in its order.
  groups: [
    { id: "systems", label: "Business systems" },
    { id: "platforms", label: "Digital platforms" },
    { id: "automation", label: "AI & automation" },
    { id: "infrastructure", label: "Integration & cloud" },
  ],
  items: [
    { name: "ERP", group: "systems", icon: "layers" },
    { name: "CRM", group: "systems", icon: "users" },
    { name: "HRMS", group: "systems", icon: "user-plus" },
    { name: "Accounting", group: "systems", icon: "dollar" },
    { name: "E-Commerce", group: "platforms", icon: "cart" },
    { name: "Websites", group: "platforms", icon: "monitor" },
    { name: "Mobile Apps", group: "platforms", icon: "phone" },
    { name: "SaaS", group: "platforms", icon: "cloud" },
    { name: "AI Solutions", group: "automation", icon: "cpu" },
    { name: "AI Voice Agents", group: "automation", icon: "mic" },
    { name: "WhatsApp Automation", group: "automation", icon: "message" },
    { name: "Booking Systems", group: "systems", icon: "calendar" },
    { name: "Management Systems", group: "systems", icon: "grid" },
    { name: "Custom Software", group: "platforms", icon: "code" },
    { name: "API Integrations", group: "infrastructure", icon: "link" },
    { name: "Cloud Solutions", group: "infrastructure", icon: "server" },
  ],
} as const;

export const WHY = {
  title: "Why choose Crescivo?",
  motto: ["Strategy.", "Execution.", "Results."],
  items: [
    { title: "Complete solutions", text: "Everything you need in one place — from strategy to execution.", icon: "check" },
    { title: "Tailored approach", text: "Custom strategies designed specifically for your unique business.", icon: "sliders" },
    { title: "Data-driven", text: "Creative solutions backed by analytics and proven results.", icon: "chart" },
    { title: "Experienced team", text: "Dedicated experts focused on your real growth and ROI.", icon: "briefcase" },
  ],
} as const;

export const PROCESS = {
  title: "Our proven process",
  steps: [
    { title: "Discover", text: "Understand your business, goals and unique challenges." },
    { title: "Strategize", text: "Build a customized plan aligned with your objectives." },
    { title: "Execute", text: "Implement solutions effectively and efficiently." },
    { title: "Grow", text: "Measure progress and scale your success." },
  ],
};

export const CTA = {
  title: "Let’s grow together",
  lead: "Transform your ideas into measurable success with Crescivo Business Solutions.",
  question: "Ready to scale smarter and grow faster?",
  text: "Contact us today to start your journey to sustainable growth and long-term success.",
};
