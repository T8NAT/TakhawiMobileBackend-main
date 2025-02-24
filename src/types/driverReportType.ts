export type MonthlyTripRevenue = {
  date: string;
  total_trips_price: number;
  total_distance: number;
  driver_profit: number;
};

export type TripRevenue = {
  totalRevenue: Omit<MonthlyTripRevenue, 'date'> & { total_trips: number };
  monthlyRevenue: MonthlyTripRevenue[];
};
