export interface Vehicle {
  id: number
  vehicleType: string
  brand: string
  model: string
  year: number | null
  vin: string
  fullVin: string
  company: string
  status: string
  manager: string
  buyerCompany: string
  contract: string
  bookingDate: string
  paymentStatus: string
  paymentDate: string
  note: string
  delivery: string
  carrier: string
  route: string
  arrivalDate: string
  updatedAt: string
}

export type VehicleInput = Omit<Vehicle, "id" | "updatedAt">

export interface DashboardStats {
  total: number
  available: number
  booked: number
  sold: number
  repair: number
  awaitingPayment: number
  recentChanges: Vehicle[]
}

export interface VehicleFilterParams {
  vehicleType?: string
  status?: string
  manager?: string
  company?: string
  paymentStatus?: string
  delivery?: string
}
