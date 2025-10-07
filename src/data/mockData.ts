import { faker } from '@faker-js/faker'
import type {
  Patient,
  Appointment,
  Provider,
  ClinicalNote,
  VitalSigns,
  Medication,
  Allergy,
  Problem,
  IndiaCompliance,
  QatarCompliance,
  DashboardMetrics,
  LabResult,
  Immunization,
  Claim,
  Payment,
} from '../types'

// Seed for consistent data
faker.seed(123)

// Generate Providers
export const generateProviders = (count: number): Provider[] => {
  const specialties = ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Gynecology']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `PRV-${String(i + 1).padStart(4, '0')}`,
    name: faker.person.fullName(),
    specialty: faker.helpers.arrayElement(specialties),
    qualification: faker.helpers.arrayElement(['MBBS, MD', 'MBBS, MS', 'MBBS, DNB', 'MBBS, DM']),
    licenseNumber: `MED${faker.number.int({ min: 10000, max: 99999 })}`,
    email: faker.internet.email(),
    phone: faker.phone.number(),
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      { dayOfWeek: 5, startTime: '09:00', endTime: '13:00', slotDuration: 30 },
    ],
  }))
}

// Generate Patients
export const generatePatients = (count: number): Patient[] => {
  return Array.from({ length: count }, (_, i) => {
    const country = faker.helpers.arrayElement(['India', 'Qatar'] as const)
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    
    return {
      id: `PAT-${String(i + 1).padStart(6, '0')}`,
      firstName,
      lastName,
      dateOfBirth: faker.date.birthdate({ min: 1, max: 90, mode: 'age' }).toISOString().split('T')[0],
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other'] as const),
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country,
      },
      emergencyContact: {
        name: faker.person.fullName(),
        relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Child', 'Friend']),
        phone: faker.phone.number(),
      },
      insurance: {
        provider: faker.helpers.arrayElement(['HealthCare Plus', 'MediShield', 'Global Health', 'Wellness Insurance']),
        policyNumber: faker.string.alphanumeric(10).toUpperCase(),
        groupNumber: faker.string.alphanumeric(6).toUpperCase(),
        expiryDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
      },
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
      nationalId: country === 'India' 
        ? `${faker.number.int({ min: 1000, max: 9999 })} ${faker.number.int({ min: 1000, max: 9999 })} ${faker.number.int({ min: 1000, max: 9999 })}`
        : `QID${faker.number.int({ min: 10000000, max: 99999999 })}`,
      bloodType: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
      status: faker.helpers.weightedArrayElement([
        { weight: 9, value: 'Active' as const },
        { weight: 1, value: 'Inactive' as const }
      ]),
      registrationDate: faker.date.past({ years: 2 }).toISOString().split('T')[0],
      lastVisit: faker.helpers.maybe(() => faker.date.recent({ days: 30 }).toISOString().split('T')[0], { probability: 0.7 }),
    }
  })
}

// Generate Appointments
export const generateAppointments = (patients: Patient[], providers: Provider[], count: number): Appointment[] => {
  const appointmentTypes = ['Consultation', 'Follow-up', 'Procedure', 'Telehealth'] as const
  
  return Array.from({ length: count }, (_, i) => {
    const patient = faker.helpers.arrayElement(patients)
    const provider = faker.helpers.arrayElement(providers)
    const date = faker.date.between({ 
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    })
    const hour = faker.number.int({ min: 9, max: 16 })
    const minute = faker.helpers.arrayElement(['00', '30'])
    
    return {
      id: `APT-${String(i + 1).padStart(6, '0')}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      providerId: provider.id,
      providerName: provider.name,
      date: date.toISOString().split('T')[0],
      time: `${String(hour).padStart(2, '0')}:${minute}`,
      duration: faker.helpers.arrayElement([15, 30, 45, 60]),
      type: faker.helpers.arrayElement(appointmentTypes),
      status: date < new Date() 
        ? faker.helpers.arrayElement(['Completed', 'Cancelled', 'No-show'] as const)
        : faker.helpers.arrayElement(['Scheduled', 'Checked-in', 'In Progress'] as const),
      reason: faker.helpers.arrayElement([
        'General Checkup',
        'Follow-up Visit',
        'Fever and Cough',
        'Vaccination',
        'Blood Pressure Check',
        'Diabetes Management',
        'Annual Physical',
        'Lab Results Review',
      ]),
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
    }
  })
}

// Generate Vital Signs
const generateVitalSigns = (): VitalSigns => ({
  temperature: faker.number.float({ min: 36.0, max: 38.5, fractionDigits: 1 }),
  bloodPressureSystolic: faker.number.int({ min: 110, max: 140 }),
  bloodPressureDiastolic: faker.number.int({ min: 70, max: 90 }),
  heartRate: faker.number.int({ min: 60, max: 100 }),
  respiratoryRate: faker.number.int({ min: 12, max: 20 }),
  oxygenSaturation: faker.number.int({ min: 95, max: 100 }),
  weight: faker.number.float({ min: 50, max: 100, fractionDigits: 1 }),
  height: faker.number.float({ min: 150, max: 190, fractionDigits: 1 }),
  bmi: undefined,
  recordedAt: new Date().toISOString(),
})

// Generate Clinical Notes
export const generateClinicalNotes = (patients: Patient[], providers: Provider[], count: number): ClinicalNote[] => {
  const diagnoses = [
    { code: 'J00', description: 'Acute nasopharyngitis (common cold)' },
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E11', description: 'Type 2 diabetes mellitus' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'R50.9', description: 'Fever, unspecified' },
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const patient = faker.helpers.arrayElement(patients)
    const provider = faker.helpers.arrayElement(providers)
    const diagnosis = faker.helpers.arrayElement(diagnoses)
    
    return {
      id: `NOTE-${String(i + 1).padStart(6, '0')}`,
      patientId: patient.id,
      appointmentId: `APT-${String(faker.number.int({ min: 1, max: 100 })).padStart(6, '0')}`,
      providerId: provider.id,
      providerName: provider.name,
      date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      type: 'SOAP',
      subjective: faker.lorem.paragraph(),
      objective: faker.lorem.paragraph(),
      assessment: diagnosis.description,
      plan: faker.lorem.sentences(2),
      vitalSigns: generateVitalSigns(),
      diagnoses: [{ ...diagnosis, type: 'Primary' as const }],
      medications: [],
    }
  })
}

// Generate Medications
export const generateMedications = (count: number): Medication[] => {
  const medications = [
    'Paracetamol 500mg',
    'Amoxicillin 250mg',
    'Metformin 500mg',
    'Lisinopril 10mg',
    'Atorvastatin 20mg',
    'Omeprazole 20mg',
    'Ibuprofen 400mg',
    'Aspirin 75mg',
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `MED-${String(i + 1).padStart(6, '0')}`,
    name: faker.helpers.arrayElement(medications),
    dosage: faker.helpers.arrayElement(['1 tablet', '2 tablets', '1 capsule']),
    frequency: faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Three times daily', 'As needed']),
    route: faker.helpers.arrayElement(['Oral', 'IV', 'Topical']),
    startDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
    endDate: faker.helpers.maybe(() => faker.date.soon({ days: 30 }).toISOString().split('T')[0]),
    prescribedBy: faker.person.fullName(),
    status: faker.helpers.arrayElement(['Active', 'Completed', 'Discontinued'] as const),
    instructions: faker.helpers.maybe(() => faker.lorem.sentence()),
  }))
}

// Generate Allergies
export const generateAllergies = (count: number): Allergy[] => {
  const allergens = ['Penicillin', 'Peanuts', 'Shellfish', 'Latex', 'Aspirin', 'Pollen', 'Dust mites']
  const reactions = ['Rash', 'Hives', 'Swelling', 'Anaphylaxis', 'Breathing difficulty', 'Nausea']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ALG-${String(i + 1).padStart(4, '0')}`,
    allergen: faker.helpers.arrayElement(allergens),
    reaction: faker.helpers.arrayElement(reactions),
    severity: faker.helpers.arrayElement(['Mild', 'Moderate', 'Severe'] as const),
    onsetDate: faker.helpers.maybe(() => faker.date.past({ years: 5 }).toISOString().split('T')[0]),
  }))
}

// Generate Problems
export const generateProblems = (count: number): Problem[] => {
  const problems = [
    { desc: 'Hypertension', code: 'I10' },
    { desc: 'Type 2 Diabetes', code: 'E11' },
    { desc: 'Asthma', code: 'J45' },
    { desc: 'Chronic back pain', code: 'M54.5' },
    { desc: 'Anxiety disorder', code: 'F41.9' },
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const problem = faker.helpers.arrayElement(problems)
    return {
      id: `PROB-${String(i + 1).padStart(4, '0')}`,
      description: problem.desc,
      icdCode: problem.code,
      status: faker.helpers.arrayElement(['Active', 'Resolved', 'Chronic'] as const),
      onsetDate: faker.date.past({ years: 3 }).toISOString().split('T')[0],
      resolvedDate: faker.helpers.maybe(() => faker.date.recent({ days: 30 }).toISOString().split('T')[0]),
      notes: faker.helpers.maybe(() => faker.lorem.sentence()),
    }
  })
}

// Generate Lab Results
export const generateLabResults = (patients: Patient[], providers: Provider[], count: number): LabResult[] => {
  const testPanels = [
    {
      name: 'Complete Blood Count',
      code: 'CBC',
      items: [
        { name: 'WBC', unit: '10^9/L', range: '4.0 - 11.0' },
        { name: 'RBC', unit: '10^12/L', range: '4.5 - 5.9' },
        { name: 'Hemoglobin', unit: 'g/dL', range: '13.5 - 17.5' },
        { name: 'Hematocrit', unit: '%', range: '41 - 53' },
        { name: 'Platelets', unit: '10^9/L', range: '150 - 450' },
      ],
    },
    {
      name: 'Basic Metabolic Panel',
      code: 'BMP',
      items: [
        { name: 'Sodium', unit: 'mmol/L', range: '135 - 145' },
        { name: 'Potassium', unit: 'mmol/L', range: '3.5 - 5.0' },
        { name: 'Chloride', unit: 'mmol/L', range: '98 - 106' },
        { name: 'Glucose', unit: 'mg/dL', range: '70 - 99' },
        { name: 'Creatinine', unit: 'mg/dL', range: '0.74 - 1.35' },
      ],
    },
    {
      name: 'Lipid Panel',
      code: 'LIPID',
      items: [
        { name: 'Total Cholesterol', unit: 'mg/dL', range: '< 200' },
        { name: 'HDL', unit: 'mg/dL', range: '> 40' },
        { name: 'LDL', unit: 'mg/dL', range: '< 130' },
        { name: 'Triglycerides', unit: 'mg/dL', range: '< 150' },
      ],
    },
    {
      name: 'HbA1c',
      code: 'HBA1C',
      items: [
        { name: 'HbA1c', unit: '%', range: '4.0 - 5.6' },
      ],
    },
  ] as const

  const statuses: LabResult['status'][] = ['Ordered', 'In Progress', 'Completed']

  return Array.from({ length: count }, (_, i) => {
    const patient = faker.helpers.arrayElement(patients)
    const provider = faker.helpers.arrayElement(providers)
    const panel = faker.helpers.arrayElement(testPanels)
    const orderDate = faker.date.recent({ days: 60 })
    const resultDate = faker.helpers.maybe(() => faker.date.soon({ days: 7, refDate: orderDate }), {
      probability: 0.7,
    })

    return {
      id: `LAB-${String(i + 1).padStart(5, '0')}`,
      patientId: patient.id,
      testName: panel.name,
      testCode: panel.code,
      orderDate: orderDate.toISOString().split('T')[0],
      resultDate: resultDate?.toISOString().split('T')[0],
      status: resultDate ? 'Completed' : faker.helpers.arrayElement(statuses),
      results: panel.items.map(item => {
        const value = faker.number.float({ min: 0.8, max: 1.2, fractionDigits: 2 })
        const numericRange = item.range.split('-')
        const isAbnormal = faker.datatype.boolean({ probability: 0.15 })

        return {
          name: item.name,
          unit: item.unit,
          referenceRange: item.range,
          value: item.range.includes('<') || item.range.includes('>')
            ? faker.number.int({ min: 80, max: 220 }).toString()
            : (Number(numericRange[0]) * value).toFixed(2),
          isAbnormal,
        }
      }),
      performedBy: provider.name,
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
    }
  })
}

type PatientImmunizationRecord = Immunization & { patientId: string }

// Generate Immunizations per patient
export const generateImmunizations = (patients: Patient[]): Record<string, Immunization[]> => {
  const vaccines = [
    'Influenza',
    'COVID-19 Booster',
    'Hepatitis B',
    'Pneumococcal',
    'Tetanus-Diphtheria',
  ] as const

  const immunizations: PatientImmunizationRecord[] = patients.flatMap(patient => {
    const doseCount = faker.number.int({ min: 1, max: 4 })

    return Array.from({ length: doseCount }, (_, idx) => ({
      patientId: patient.id,
      id: `IMM-${patient.id}-${idx + 1}`,
      vaccineName: faker.helpers.arrayElement(vaccines),
      date: faker.date.past({ years: 5 }).toISOString().split('T')[0],
      doseNumber: idx + 1,
      administeredBy: faker.person.fullName(),
      lotNumber: `LOT${faker.string.alphanumeric({ length: 6 }).toUpperCase()}`,
      expiryDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
      site: faker.helpers.arrayElement(['Left Arm', 'Right Arm', 'Left Thigh', 'Right Thigh']),
      route: 'Intramuscular',
    }))
  })

  return immunizations.reduce<Record<string, Immunization[]>>((acc, record) => {
    const { patientId, ...rest } = record
    if (!acc[patientId]) {
      acc[patientId] = []
    }
    acc[patientId].push(rest)
    return acc
  }, {})
}

// Generate Claims
export const generateClaims = (appointments: Appointment[]): Claim[] => {
  return appointments.slice(0, 80).map((apt, idx) => {
    const totalAmount = faker.number.int({ min: 80, max: 500 })
    const insuranceAmount = faker.number.int({ min: 40, max: totalAmount })
    const patientAmount = totalAmount - insuranceAmount
    const status = faker.helpers.arrayElement(['Draft', 'Submitted', 'Accepted', 'Rejected', 'Paid'] as const)

    return {
      id: `CLM-${String(idx + 1).padStart(5, '0')}`,
      patientId: apt.patientId,
      patientName: apt.patientName,
      appointmentId: apt.id,
      date: apt.date,
      totalAmount,
      insuranceAmount,
      patientAmount,
      status,
      submittedDate: faker.helpers.maybe(() => faker.date.soon({ days: 5, refDate: apt.date }).toISOString().split('T')[0], { probability: 0.7 }),
      paidDate: status === 'Paid' ? faker.date.soon({ days: 15, refDate: apt.date }).toISOString().split('T')[0] : undefined,
      insuranceProvider: faker.helpers.arrayElement(['HealthCare Plus', 'MediShield', 'Global Health', 'Wellness Insurance']),
      claimNumber: `CLMNO${faker.string.numeric(7)}`,
    }
  })
}

// Generate Payments
export const generatePayments = (claims: Claim[]): Payment[] => {
  return claims.slice(0, 60).map((claim, idx) => {
    const status = claim.status === 'Paid' ? 'Completed' : faker.helpers.arrayElement(['Pending', 'Completed', 'Refunded'] as const)
    const amount = status === 'Refunded'
      ? faker.number.int({ min: 10, max: claim.patientAmount })
      : claim.patientAmount + (status === 'Completed' ? claim.insuranceAmount : 0)

    return {
      id: `PAY-${String(idx + 1).padStart(5, '0')}`,
      claimId: claim.id,
      patientId: claim.patientId,
      amount,
      method: faker.helpers.arrayElement(['Cash', 'Card', 'Insurance', 'Online'] as const),
      date: faker.date.soon({ days: 10, refDate: claim.date }).toISOString().split('T')[0],
      status,
      reference: `TXN${faker.string.alphanumeric({ length: 10 }).toUpperCase()}`,
    }
  })
}

// Generate India Compliance Data
export const generateIndiaCompliance = (): IndiaCompliance => ({
  ceaRegistration: {
    status: 'Permanent',
    registrationNumber: `CEA/2024/${faker.number.int({ min: 1000, max: 9999 })}`,
    issueDate: '2024-01-15',
    expiryDate: '2029-01-14',
  },
  permits: [
    {
      id: 'PRM-001',
      type: 'Fire Safety NOC',
      number: `FS/2024/${faker.number.int({ min: 100, max: 999 })}`,
      issueDate: '2024-02-01',
      expiryDate: '2025-01-31',
      authority: 'Fire Department',
      status: 'Valid',
    },
    {
      id: 'PRM-002',
      type: 'Biomedical Waste',
      number: `BMW/2024/${faker.number.int({ min: 100, max: 999 })}`,
      issueDate: '2024-01-20',
      expiryDate: '2025-01-19',
      authority: 'State Pollution Control Board',
      status: 'Valid',
    },
  ],
  staffCredentials: [
    {
      id: 'CRED-001',
      staffName: 'Dr. Rajesh Kumar',
      role: 'Physician',
      registrationNumber: 'MCI/12345/2020',
      council: 'Medical Council of India',
      issueDate: '2020-06-15',
      expiryDate: '2025-06-14',
      status: 'Valid',
    },
  ],
})

// Generate Qatar Compliance Data
export const generateQatarCompliance = (): QatarCompliance => ({
  mophLicensing: {
    stage: 'Licensed',
    applicationNumber: `MOPH/2024/${faker.number.int({ min: 1000, max: 9999 })}`,
    submittedDate: '2024-01-10',
    approvalDate: '2024-03-15',
    licenseNumber: `HF/2024/${faker.number.int({ min: 100, max: 999 })}`,
    expiryDate: '2025-03-14',
  },
  dhpCredentials: [
    {
      id: 'DHP-001',
      staffName: 'Dr. Ahmed Hassan',
      profession: 'General Practitioner',
      psvStatus: 'Completed',
      prometricStatus: 'Passed',
      dhpStatus: 'Licensed',
      licenseNumber: `DHP/2024/${faker.number.int({ min: 10000, max: 99999 })}`,
      issueDate: '2024-02-20',
      expiryDate: '2026-02-19',
    },
  ],
  equipmentApprovals: [
    {
      id: 'EQ-001',
      equipmentName: 'X-Ray Machine',
      manufacturer: 'Siemens',
      model: 'AXIOM Iconos R200',
      approvalMarket: 'CE',
      approvalNumber: 'CE/2023/12345',
      approvalDate: '2023-11-10',
      status: 'Approved',
    },
  ],
})

// Generate Dashboard Metrics
export const generateDashboardMetrics = (appointments: Appointment[]): DashboardMetrics => {
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(apt => apt.date === today)
  
  return {
    todayAppointments: todayAppointments.length,
    waitingPatients: todayAppointments.filter(apt => apt.status === 'Checked-in').length,
    activePatients: 1248,
    monthlyRevenue: 458900,
    appointmentsByStatus: [
      { status: 'Scheduled', count: 45 },
      { status: 'Checked-in', count: 12 },
      { status: 'In Progress', count: 5 },
      { status: 'Completed', count: 234 },
      { status: 'Cancelled', count: 8 },
      { status: 'No-show', count: 3 },
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 42000 },
      { month: 'Feb', revenue: 38500 },
      { month: 'Mar', revenue: 45000 },
      { month: 'Apr', revenue: 41000 },
      { month: 'May', revenue: 43500 },
      { month: 'Jun', revenue: 45890 },
    ],
    patientFlowToday: [
      { status: 'Waiting', count: 7 },
      { status: 'With Nurse', count: 3 },
      { status: 'With Doctor', count: 5 },
      { status: 'Ready for Checkout', count: 2 },
    ],
  }
}

// Initialize all mock data
export const providers = generateProviders(15)
export const patients = generatePatients(100)
export const appointments = generateAppointments(patients, providers, 150)
export const clinicalNotes = generateClinicalNotes(patients, providers, 50)
export const medications = generateMedications(30)
export const allergies = generateAllergies(15)
export const problems = generateProblems(20)
export const indiaCompliance = generateIndiaCompliance()
export const qatarCompliance = generateQatarCompliance()
export const dashboardMetrics = generateDashboardMetrics(appointments)
export const labResults = generateLabResults(patients, providers, 80)
export const immunizationsByPatient = generateImmunizations(patients)
export const claims = generateClaims(appointments)
export const payments = generatePayments(claims)

// Helper functions for data access
export const getPatientById = (id: string) => patients.find(p => p.id === id)
export const getProviderById = (id: string) => providers.find(p => p.id === id)
export const getAppointmentById = (id: string) => appointments.find(a => a.id === id)
export const getAppointmentsByPatient = (patientId: string) => 
  appointments.filter(a => a.patientId === patientId)
export const getAppointmentsByDate = (date: string) => 
  appointments.filter(a => a.date === date)
export const getClinicalNotesByPatient = (patientId: string) =>
  clinicalNotes.filter(n => n.patientId === patientId)
