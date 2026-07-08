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
