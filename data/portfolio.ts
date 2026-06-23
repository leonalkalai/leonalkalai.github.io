import type {
  AssetMap,
  BlogItem,
  ExperienceItem,
  FAQItem,
  HeroContent,
  NavItem,
  ProfileCard,
  ProjectItem,
  ServiceItem,
  SocialLink,
  TestimonialItem,
} from "@/types/portfolio";

export const assets: AssetMap = {
  profileImage:
    "https://cdn.prod.website-files.com/699bf5529ae9a99a06373c58/69a3c65d3aa2ba32e8bca9df_thumb-1.webp",
  ratingIcon:
    "https://cdn.prod.website-files.com/699bf5529ae9a99a06373c58/69a3c85d2dde3fef129c994f_icon-1.svg",
  favicon:
    "https://cdn.prod.website-files.com/699bf5529ae9a99a06373c58/69b7d93816d813a7a3e24d28_Favicon-32.png",
  projectImages: [
    "https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b539ebfb857959dda95041_thumb-1-p-1080.webp",
    "https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53a9cc2359db9dde9fd34_thumb-2-p-1080.webp",
    "https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53ab58b03552fa6f3ebaf_thumb-3-p-1080.webp",
    "https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53ad8ddbb8d1495fb3412_thumb-4-p-1080.webp",
    "https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53afa6d98bf9a125dc59c_thumb-5-p-1080.webp",
    "https://cdn.prod.website-files.com/69b5342710f42330586abea2/69b53b185d36d6444f789529_thumb-6-p-1080.webp",
  ],
};

export const navItems: readonly NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Articles", href: "#articles" },
];

export const skillTags: readonly string[] = [
  "React.js",
  "Next.js",
  "Node.js",
  "MongoDB",
  "TailwindCSS",
  "WordPress",
  "Product Design",
  "Digital Marketing",
];

export const socialLinks: readonly SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/leon-koundouras" },
  { label: "GitHub", href: "https://github.com/leonalkalai" },
  { label: "Portfolio", href: "https://leonalkalai.github.io" },
];

export const profileCard: ProfileCard = {
  eyebrow: "Hey there, I’m",
  name: "Leon Kountouras",
  role: "Full-Stack Developer",
  location: "Thessaloniki, Central Macedonia, Greece",
  rating: "4.9/5",
  proof:
    "Trusted technical background across modern web development, IT support, system administration, and network infrastructure.",
  ctaLabel: "Contact with me",
  ctaHref: "mailto:koundouras@gmail.com",
};

export const heroContent: HeroContent = {
  title: "Where strategy meets stunning design",
  text:
    "I build intuitive interfaces, scalable applications, and high-performing websites that solve real-world problems. Every project is built with clarity, purpose, performance, and long-term maintainability in mind.",
  ctaLabel: "Book a free call",
  ctaHref: "mailto:koundouras@gmail.com",
  counters: [
    { value: "25+", label: "Years IT Experience" },
    { value: "95+", label: "PageSpeed Score" },
    { value: "60%", label: "SEO Ranking Improvement" },
    { value: "100+", label: "Technical Problems Solved" },
  ],
};

export const projects: readonly ProjectItem[] = [
  {
    name: "MenuHelp App",
    description: "Full-stack menu scheduling platform integrating Dishes API.",
    href: "https://chingu-voyages.github.io/V53-tier2-team-23",
    image: assets.projectImages[0],
    tags: ["Full-Stack", "API", "Team Project"],
  },
  {
    name: "Bookaholics",
    description: "Book discovery platform integrating Google Books API.",
    href: "https://in-tech-gration-cohort-0x02.github.io/Bookaholics",
    image: assets.projectImages[1],
    tags: ["JavaScript", "Google Books API", "Frontend"],
  },
  {
    name: "Battlefield Game",
    description: "Classic strategy game with intelligent AI opponent.",
    href: "https://leonalkalai.github.io/BattleshipJs",
    image: assets.projectImages[2],
    tags: ["Game", "JavaScript", "AI Opponent"],
  },
  {
    name: "AFM/AMKA Validator",
    description: "Greek government identity validation tool.",
    href: "https://leonalkalai.github.io/afm-amka-validator",
    image: assets.projectImages[3],
    tags: ["Validation", "Greek IDs", "Utility"],
  },
  {
    name: "Power Consumption Calculator",
    description: "Home energy cost calculator for the European market.",
    href: "https://leonalkalai.github.io/powerconsumption",
    image: assets.projectImages[4],
    tags: ["Calculator", "Energy", "Web Tool"],
  },
  {
    name: "Humidity Counter App",
    description: "Real-time humidity monitoring for Greek regions.",
    href: "https://leonalkalai.github.io/humidity_at_Greece",
    image: assets.projectImages[5],
    tags: ["Weather", "Monitoring", "Greece"],
  },
];

export const services: readonly ServiceItem[] = [
  {
    title: "Brand Strategy",
    description:
      "Clear positioning, visual identity, and practical digital direction for businesses that need a stronger online presence.",
    technologies: ["Brand Identity", "Logo Design", "Digital Design", "Figma"],
  },
  {
    title: "Website Design",
    description:
      "Responsive, accessible, and performance-focused websites built with clean layouts and production-ready implementation.",
    technologies: ["React", "Next.js", "TailwindCSS", "HTML", "CSS"],
  },
  {
    title: "Product Design",
    description:
      "User-centric interfaces, practical tools, booking flows, dashboards, validators, calculators, and business web applications.",
    technologies: ["UX/UI", "React", "REST APIs", "Supabase", "MongoDB"],
  },
  {
    title: "Digital Marketing",
    description:
      "SEO-focused structure, content optimization, performance monitoring, technical SEO, and conversion-oriented improvements.",
    technologies: ["SEO", "Surfer SEO", "Performance", "Accessibility"],
  },
];

export const experience: readonly ExperienceItem[] = [
  {
    role: "Full-Stack Developer",
    company: "create-website",
    location: "Athens, Greece · Remote",
    period: "April 2025 - September 2025",
    points: [
      "Developed custom business websites using WordPress with Elementor page builder.",
      "Created custom page designs and layouts using HTML, CSS, and JavaScript.",
      "Built modern web applications with Next.js, React, and Node.js for various business needs.",
      "Implemented responsive designs and optimized user experiences across all devices.",
      "Integrated third-party APIs and services for enhanced website functionality.",
      "Optimized website performance through code optimization and image compression.",
    ],
    technologies: [
      "WordPress",
      "Elementor",
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Supabase",
      "TailwindCSS",
      "REST APIs",
    ],
  },
  {
    role: "Freelance Web Developer | React, TailwindCSS, SEO & Performance Optimization",
    company: "Phidiashouse Apartments",
    location: "Thessaloniki, Greece",
    period: "January 2025 - Present",
    website: "phidiashouse.com",
    points: [
      "Designed and developed fully customized React-based website for luxury apartment rentals.",
      "Created comprehensive brand identity including custom logo design and visual elements.",
      "Implemented frontend improvements and data entry for booking platform integration.",
      "Achieved 95+ Google PageSpeed Insights score through advanced optimization techniques.",
      "Improved organic search rankings by 60% through strategic SEO implementation.",
      "Enhanced accessibility compliance following WCAG 2.1 guidelines.",
    ],
    technologies: [
      "React",
      "TailwindCSS",
      "JavaScript",
      "SEO Optimization",
      "Performance Monitoring",
      "Accessibility Standards",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "atom software group",
    location: "Thessaloniki, Greece",
    period: "February 2025 - March 2025",
    website: "atomgroup.gr",
    points: [
      "Developed enterprise-level applications using Angular, Node.js, and MongoDB technology stack.",
      "Contributed to European Union co-funded projects under Human Resources and Social Cohesion program.",
      "Implemented frontend components and user interface improvements.",
      "Collaborated with cross-functional teams to deliver projects supporting employment initiatives.",
    ],
    technologies: [
      "Angular",
      "Node.js",
      "MongoDB",
      "TypeScript",
      "Frontend Development",
      "EU Projects",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Chingu",
    location: "Remote · International Team",
    period: "December 2024 - February 2025",
    website: "chingu.io",
    points: [
      "Completed intensive 6-week remote development program working in international distributed teams.",
      "Developed full-stack applications following Agile methodologies and modern development practices.",
      "Enhanced collaboration skills through daily stand-ups, code reviews, and pair programming sessions.",
      "Implemented frontend features and user interface components.",
    ],
    technologies: [
      "Full-Stack JavaScript",
      "Git Collaboration",
      "Agile Development",
      "Remote Tools",
      "Frontend Development",
    ],
  },
  {
    role: "Web Content Writer - SEO Specialist",
    company: "secretmassage.gr - easyreno.gr",
    location: "Thessaloniki, Greece",
    period: "August 2022 - November 2022",
    points: [
      "Created optimized web content for multiple websites using Surfer SEO and Grammarly.",
      "Developed strategic backlink campaigns to improve search rankings.",
      "Improved SEO performance for two distinct business websites.",
      "Delivered high-quality content meeting professional optimization standards.",
    ],
    technologies: ["SEO", "Content Writing", "Surfer SEO", "Grammarly", "Backlink Strategy"],
  },
  {
    role: "Graphics Designer",
    company: "Macroweb",
    location: "Thessaloniki, Greece",
    period: "June 2018 - July 2019",
    points: [
      "Created professional logos for newsofcentury.com and flyerias using Adobe Illustrator.",
      "Participated in logo design competition for Thessaloniki Transportation Project Organization.",
      "Delivered high-quality visual solutions for digital platforms.",
      "Developed comprehensive brand identity elements for various clients.",
    ],
    technologies: ["Adobe Illustrator", "Logo Design", "Brand Identity", "Graphic Design"],
  },
  {
    role: "Joomla Developer",
    company: "NeoTech",
    location: "Thessaloniki, Greece",
    period: "August 2017 - July 2018",
    points: [
      "Developed and maintained interco.gr e-shop using Joomla CMS.",
      "Implemented new features and functionality for online stores.",
      "Made continuous updates and improvements to existing e-commerce systems.",
      "Ensured website performance optimization and enhanced user experience.",
    ],
    technologies: ["Joomla CMS", "E-commerce Development", "HTML", "CSS", "JavaScript"],
  },
  {
    role: "Multi-Role Technical Specialist",
    company: "Forthnet",
    location: "Thessaloniki, Greece",
    period: "March 2008 - July 2017",
    duration: "9 years 5 months",
    points: [
      "Installed and configured internet and telephone lines for residential clients.",
      "Provided technical support for incoming client inquiries via Siebel CRM.",
      "Diagnosed and troubleshot internet connections, routers, and telephone lines.",
      "Conducted diagnostics on customer routers and optimized router settings.",
      "Installed and repaired equipment at data centers (DSLAM).",
      "Collaborated with Athens-Thessaloniki technical support team for nationwide coverage.",
    ],
    technologies: [
      "Technical Support",
      "Network Administration",
      "ADSL",
      "Telecommunications",
      "Siebel CRM",
      "DSLAM",
    ],
  },
];

export const testimonials: readonly TestimonialItem[] = [
  {
    quote:
      "Leon combines strong technical foundations with modern frontend execution and a practical understanding of real business websites.",
    name: "Project Collaboration",
    role: "Full-Stack Development",
  },
  {
    quote:
      "His work on React, TailwindCSS, SEO, performance, and accessibility shows a clear focus on quality and long-term maintainability.",
    name: "Website Delivery",
    role: "Performance & SEO",
  },
  {
    quote:
      "A rare profile with both development skills and deep support, systems, networking, and infrastructure experience.",
    name: "Technical Background",
    role: "IT & Web Engineering",
  },
];

export const faqs: readonly FAQItem[] = [
  {
    question: "What kind of projects do you build?",
    answer:
      "I build business websites, portfolio sites, landing pages, React and Next.js applications, WordPress websites, booking-oriented pages, validators, calculators, and practical web tools.",
  },
  {
    question: "Which technologies do you use?",
    answer:
      "My main stack includes React.js, Next.js, Node.js, MongoDB, Supabase, TailwindCSS, TypeScript, WordPress, Elementor, REST APIs, HTML, CSS, and JavaScript.",
  },
  {
    question: "Do you optimize for SEO and performance?",
    answer:
      "Yes. My experience includes technical SEO, content optimization, PageSpeed improvements, image compression, responsive design, accessibility, and performance monitoring.",
  },
  {
    question: "Are you available for new opportunities?",
    answer:
      "Yes. My CV states that I am open to new opportunities starting October 2025.",
  },
];

export const blogItems: readonly BlogItem[] = [
  {
    category: "Development",
    readTime: "6 min read",
    title: "Building scalable interfaces with React and Next.js",
    text:
      "Modern web applications need clean structure, reusable components, strong typing, and performance-focused rendering.",
    href: "#",
    image: assets.projectImages[2],
  },
  {
    category: "SEO",
    readTime: "5 min read",
    title: "Performance optimization that improves business websites",
    text:
      "Core Web Vitals, image strategy, semantic structure, and technical SEO can directly improve user experience.",
    href: "#",
    image: assets.projectImages[3],
  },
  {
    category: "Design tool",
    readTime: "6 min read",
    title: "5 design principles that elevate your projects",
    text:
      "Created component libraries, style guides, and documentation for consistency across responsive digital products.",
    href: "#",
    image: assets.projectImages[4],
  },
];
