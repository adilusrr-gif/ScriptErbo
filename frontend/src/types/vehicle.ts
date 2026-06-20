export interface Vehicle {
  id: number
  vehicleType: string
  model: string
  year: number | null
  pr: string
  vin: string
  fullVin: string
  sbkts: string
  customsCleared: string
  recyclingFee: string
  epts: string
  trafficRegistration: string
  company: string
  status: string
  manager: string
  statusSecondary: string
  managerSecondary: string
  bookingDate: string
  buyerCompany: string
  contract: string
  paymentStatus: string
  paymentDate: string
  location: string
  arrivalDateLegacy: string
  dkpContract: string
  currentState: string
  departureDate: string
  note: string
  arrivalDate: string
  app: string
  rjv: string
  months: string
  delivery: string
  carrier: string
  route: string
  yearSecondary: number | null
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
