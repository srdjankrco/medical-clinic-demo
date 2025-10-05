// Core entity types for the Medical Clinic Management System

export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'Male' | 'Female' | 'Other'
  email: string
  phone: string
  address: Address
  emergencyContact: EmergencyContact
  insurance: Insurance
  photoUrl?: string
  nationalId?: string // Aadhaar for India, QID for Qatar
  bloodType?: string
  status: 'Active' | 'Inactive'
  registrationDate: string
  lastVisit?: string
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: 'India' | 'Qatar'
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface Insurance {
  provider: string
  policyNumber: string
  groupNumber?: string
  expiryDate: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  date: string
  time: string
  duration: number // in minutes
  type: 'Consultation' | 'Follow-up' | 'Procedure' | 'Telehealth'
  status: 'Scheduled' | 'Checked-in' | 'In Progress' | 'Completed' | 'Cancelled' | 'No-show'
  reason: string
  notes?: string
}

export interface Provider {
  id: string
  name: string
  specialty: string
  qualification: string
  licenseNumber: string
  email: string
  phone: string
  photoUrl?: string
  schedule: ProviderSchedule[]
}

export interface ProviderSchedule {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string
  endTime: string
  slotDuration: number // in minutes
}

export interface ClinicalNote {
  id: string
  patientId: string
  appointmentId: string
  providerId: string
  providerName: string
  date: string
  type: 'SOAP' | 'Progress' | 'Procedure'
  subjective: string
  objective: string
  assessment: string
  plan: string
  vitalSigns?: VitalSigns
  diagnoses: Diagnosis[]
  medications: Medication[]
}

export interface VitalSigns {
  temperature?: number // Celsius
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  weight?: number // kg
  height?: number // cm
  bmi?: number
  recordedAt: string
}

export interface Diagnosis {
  code: string // ICD-10 code
  description: string
  type: 'Primary' | 'Secondary'
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  route: string
  startDate: string
  endDate?: string
  prescribedBy: string
  status: 'Active' | 'Completed' | 'Discontinued'
  instructions?: string
}

export interface Allergy {
  id: string
  allergen: string
  reaction: string
  severity: 'Mild' | 'Moderate' | 'Severe'
  onsetDate?: string
}

export interface LabResult {
  id: string
  patientId: string
  testName: string
  testCode: string
  orderDate: string
  resultDate?: string
  status: 'Ordered' | 'In Progress' | 'Completed' | 'Cancelled'
  results: LabResultItem[]
  performedBy?: string
  notes?: string
}

export interface LabResultItem {
  name: string
  value: string
  unit: string
  referenceRange: string
  isAbnormal: boolean
}

export interface Immunization {
  id: string
  vaccineName: string
  date: string
  doseNumber?: number
  administeredBy: string
  lotNumber?: string
  expiryDate?: string
  site?: string
  route?: string
}

export interface Problem {
  id: string
  description: string
  icdCode?: string
  status: 'Active' | 'Resolved' | 'Chronic'
  onsetDate: string
  resolvedDate?: string
  notes?: string
}

export interface Claim {
  id: string
  patientId: string
  patientName: string
  appointmentId: string
  date: string
  totalAmount: number
  insuranceAmount: number
  patientAmount: number
  status: 'Draft' | 'Submitted' | 'Accepted' | 'Rejected' | 'Paid'
  submittedDate?: string
  paidDate?: string
  insuranceProvider: string
  claimNumber?: string
}

export interface Payment {
  id: string
  claimId?: string
  patientId: string
  amount: number
  method: 'Cash' | 'Card' | 'Insurance' | 'Online'
  date: string
  status: 'Pending' | 'Completed' | 'Refunded'
  reference?: string
}

// India-specific compliance types
export interface IndiaCompliance {
  ceaRegistration: {
    status: 'Not Started' | 'Provisional' | 'Permanent'
    registrationNumber?: string
    issueDate?: string
    expiryDate?: string
  }
  permits: Permit[]
  staffCredentials: StaffCredential[]
}

export interface Permit {
  id: string
  type: 'Fire Safety NOC' | 'Biomedical Waste' | 'Building Permit' | 'AERB' | 'PCPNDT'
  number: string
  issueDate: string
  expiryDate: string
  authority: string
  status: 'Valid' | 'Expiring Soon' | 'Expired'
}

export interface StaffCredential {
  id: string
  staffName: string
  role: 'Physician' | 'Nurse' | 'Technician'
  registrationNumber: string
  council: string
  issueDate: string
  expiryDate: string
  status: 'Valid' | 'Expiring Soon' | 'Expired'
}

// Qatar-specific compliance types
export interface QatarCompliance {
  mophLicensing: {
    stage: 'Not Started' | 'Project Proposal' | 'Ancillary Approvals' | 'Final Assessment' | 'Licensed'
    applicationNumber?: string
    submittedDate?: string
    approvalDate?: string
    licenseNumber?: string
    expiryDate?: string
  }
  dhpCredentials: DHPCredential[]
  equipmentApprovals: EquipmentApproval[]
}

export interface DHPCredential {
  id: string
  staffName: string
  profession: string
  psvStatus: 'Pending' | 'Completed' | 'Failed'
  prometricStatus: 'Not Taken' | 'Scheduled' | 'Passed' | 'Failed'
  dhpStatus: 'Not Applied' | 'Under Review' | 'Licensed' | 'Rejected'
  licenseNumber?: string
  issueDate?: string
  expiryDate?: string
}

export interface EquipmentApproval {
  id: string
  equipmentName: string
  manufacturer: string
  model: string
  approvalMarket: 'FDA' | 'CE' | 'Other'
  approvalNumber: string
  approvalDate: string
  status: 'Approved' | 'Pending' | 'Expired'
}

// User and authentication types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  facilityId: string
  photoUrl?: string
  lastLogin?: string
}

export type UserRole = 'Administrator' | 'Physician' | 'Nurse' | 'Receptionist' | 'Biller' | 'Patient'

// Dashboard types
export interface DashboardMetrics {
  todayAppointments: number
  waitingPatients: number
  activePatients: number
  monthlyRevenue: number
  appointmentsByStatus: AppointmentStatusCount[]
  revenueByMonth: MonthlyRevenue[]
  patientFlowToday: PatientFlowStatus[]
}

export interface AppointmentStatusCount {
  status: Appointment['status']
  count: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
}

export interface PatientFlowStatus {
  status: string
  count: number
}
