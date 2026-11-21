export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  sold: number;
  total: number;
  status: string;
  image?: string;
  category?: string;
  organizer_name?: string;
  organizer_contact?: string;
  organizer_email?: string;
  description?: string;
}
