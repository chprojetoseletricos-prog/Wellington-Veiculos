export type VehiclePurpose = "sale" | "rental" | "both";
export type VehicleStatus =
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "unavailable"
  | "archived";

export type VehicleImage = {
  id: string;
  url: string;
  alt: string;
  isCover?: boolean;
};

export type Vehicle = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  version: string;
  manufactureYear: number;
  modelYear: number;
  price: number | null;
  dailyPrice?: number | null;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  doors: number;
  engine?: string;
  power?: string;
  category: string;
  purpose: VehiclePurpose;
  status: VehicleStatus;
  description: string;
  location: string;
  featured: boolean;
  isLaunch: boolean;
  isPromotion?: boolean;
  showPrice: boolean;
  priceOnRequest: boolean;
  images: VehicleImage[];
  features: string[];
  createdAt: string;
};

export type Launch = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  image: string;
  date: string;
  featured: boolean;
  vehicleSlug?: string;
};

export type AdminLaunch = Launch & {
  published: boolean;
  video?: string;
  gallery: string[];
};

export type WhatsAppNumber = {
  id: string;
  name: string;
  responsible: string;
  number: string;
  sector: "sales" | "rental" | "support";
  defaultMessage: string;
  active: boolean;
  primary: boolean;
  priority: number;
};

export type SiteSettings = {
  companyName: string;
  tradeName: string;
  slogan: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  hours: string;
  about: string;
  logoUrl: string;
  alternateLogoUrl: string;
  faviconUrl: string;
  mapsUrl: string;
  heroUrl: string;
  primaryColor: string;
  accentColor: string;
  showSoldVehicles: boolean;
  social: Record<string, string>;
};

export type AdminRole = "owner" | "admin" | "manager" | "sales" | "support";

export type AdminConversation = { id: string; name: string; phone: string; email?: string; vehicle: string; last: string; time: string; unread: number; status: "open" | "pending" | "closed"; assignedTo?: string };
export type AdminMessage = { id: string; sender: "visitor" | "admin"; content: string; time: string; createdAt?: string };
export type AdminLead = { id: string; name: string; phone: string; email: string; vehicle: string; source: string; status: "new" | "contacted" | "negotiation" | "won" | "lost"; date: string; owner: string };
export type AdminBanner = { id: string; title: string; subtitle: string; desktop: string; mobile: string; cta: string; url: string; active: boolean; order: number };
export type AdminUser = { id: string; name: string; email: string; role: AdminRole; active: boolean; lastAccess: string };
export type AdminAnalytics = {
  totals: { views: number; whatsapp: number; chats: number; leads: number };
  series: Array<{ day: string; views: number; leads: number }>;
  topVehicles: Array<{ name: string; views: number; contacts: number }>;
};
