export interface PortfolioProject {
  readonly title: string;
  readonly url: string;
  readonly meta: string;
  readonly description: string;
  readonly year: string;
}

export type AssetMap = {
  profileImage: string;
  ratingIcon?: string;
  favicon?: string;
  projectImages: string[];
  [key: string]: string | string[] | undefined;
};

export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon?: string;
};

export type HeroCounter = {
  value: string;
  label: string;
};

export type HeroContent = {
  title?: string;
  subtitle?: string;
  description?: string;
  text?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  counters?: HeroCounter[];
};

export type ProfileCard = {
  eyebrow?: string;
  name?: string;
  role?: string;
  title?: string;
  image?: string;
  location?: string;
  rating?: string;
  proof?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type ProjectItem = {
  name?: string;
  title?: string;
  slug?: string;
  href?: string;
  url?: string;
  image?: string;
  description?: string;
  meta?: string;
  year?: string;
  tags?: string[];
};

export type ServiceItem = {
  title: string;
  description?: string;
  icon?: string;
  technologies?: string[];
};

export type ExperienceItem = {
  role?: string;
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  period?: string;
  duration?: string;
  description?: string;
  website?: string;
  points?: string[];
  technologies?: string[];
  projects?: string[];
};

export type TestimonialItem = {
  name: string;
  role?: string;
  quote: string;
  image?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type BlogItem = {
  title: string;
  slug?: string;
  image?: string;
  excerpt?: string;
  text?: string;
  href?: string;
  date?: string;
  category?: string;
  readTime?: string;
};

export interface WebflowAssetMap {
  readonly css: readonly string[];
  readonly scripts: readonly string[];
}
