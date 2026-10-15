export type PriceGrid = Record<string, number>;

export type Course = {
  id: string;
  title: string;
  type: "cours" | "stage";
  description: string;
  schedule: string;
  age_min: number;
  age_max: number;
  capacity: number;
  price_grid: PriceGrid;
  is_open: boolean;
  monitor_id: string | null;
  created_at: string;
};

export type CourseAvailability = {
  course_id: string;
  capacity: number;
  confirmed_count: number;
  places_left: number;
};

export type RegistrationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "waitlisted";

export type Registration = {
  id: string;
  course_id: string;
  child_first_name: string;
  child_last_name: string;
  child_birthdate: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_email: string;
  parent_phone: string;
  address: string;
  medical_notes: string;
  amount_due: number | null;
  gdpr_consent: boolean;
  status: RegistrationStatus;
  created_at: string;
  courses?: { title: string; type: string } | null;
};

// Enfant d'un groupe, tel qu'affiché aux moniteurs et à l'admin
// (champs utiles en bord de bassin : ni email ni adresse).
export type GroupChild = Pick<
  Registration,
  | "id"
  | "course_id"
  | "child_first_name"
  | "child_last_name"
  | "child_birthdate"
  | "medical_notes"
  | "parent_first_name"
  | "parent_last_name"
  | "parent_phone"
>;

export const GROUP_CHILD_FIELDS =
  "id, course_id, child_first_name, child_last_name, child_birthdate, medical_notes, parent_first_name, parent_last_name, parent_phone";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "late"
  | "failed"
  | "refunded";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "monitor";
  created_at: string;
};
