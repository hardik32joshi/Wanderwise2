export type UserRole = 'customer' | 'travel_agent' | 'content_manager' | 'admin' | 'super_admin';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type BookingStatus = 'pending' | 'payment_pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  state: string | null;
  description: string | null;
  cover_image: string | null;
  latitude: number | null;
  longitude: number | null;
  best_season: string | null;
  climate: string | null;
  currency: string | null;
  language: string | null;
  visa_info: string | null;
  safety_info: string | null;
  food_info: string | null;
  hidden_gems: string[];
  attractions: string[];
  travel_tips: string[];
  status: ContentStatus;
}

export interface TravelPackage {
  id: string;
  slug: string;
  destination_id: string;
  title: string;
  description: string | null;
  duration_days: number;
  base_price: number;
  max_travelers: number;
  inclusions: string[];
  exclusions: string[];
  cancellation_policy: string | null;
  status: ContentStatus;
  destinations?: Pick<Destination, 'id' | 'name' | 'slug' | 'cover_image'>;
  package_images?: { url: string; alt: string | null; sort_order: number }[];
}

export interface PackageDay {
  id: string;
  package_id: string;
  day_number: number;
  time: string | null;
  activity: string;
  location: string | null;
  duration: string | null;
  description: string | null;
  extra_price: number;
}

export interface Hotel {
  id: string;
  destination_id: string;
  name: string;
  description: string | null;
  images: string[];
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  amenities: string[];
  status: ContentStatus;
}

export interface HotelRoom {
  id: string;
  hotel_id: string;
  room_type: string;
  capacity: number;
  price: number;
  available_quantity: number;
  amenities: string[];
}

export interface Activity {
  id: string;
  slug: string;
  destination_id: string;
  title: string;
  description: string | null;
  location: string | null;
  duration: string | null;
  price: number;
  capacity: number;
  availability_status: string;
  status: ContentStatus;
  activity_images?: { url: string }[];
}

export interface Booking {
  id: string;
  booking_number: string;
  user_id: string;
  package_id: string | null;
  status: BookingStatus;
  travel_date: string | null;
  travelers_count: number;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  coupon_id: string | null;
  created_at: string;
  travel_packages?: Pick<TravelPackage, 'title' | 'slug'>;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_discount: number | null;
  status: string;
}

export interface Review {
  id: string;
  user_id: string;
  item_type: 'destination' | 'package' | 'hotel' | 'activity';
  item_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  created_at: string;
  profiles?: Pick<Profile, 'full_name'>;
}
