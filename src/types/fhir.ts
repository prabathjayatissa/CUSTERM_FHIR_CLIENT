// FHIR Resource Types
export type ResourceType = 
  | 'Patient'
  | 'Practitioner'
  | 'Organization'
  | 'Observation'
  | 'Condition'
  | 'Medication'
  | 'MedicationRequest'
  | 'Encounter'
  | 'AllergyIntolerance'
  | 'Procedure'
  | 'Immunization'
  | 'DiagnosticReport'
  | 'CarePlan'
  | 'Goal'
  | 'ServiceRequest'
  | 'Device'
  | 'DocumentReference'
  | 'FamilyMemberHistory'
  | 'Location'
  | 'RelatedPerson'
  | 'Schedule'
  | 'Slot'
  | 'Appointment'
  | 'AppointmentResponse'
  | 'Coverage'
  | 'CoverageEligibilityRequest'
  | 'CoverageEligibilityResponse'
  | 'Claim'
  | 'ClaimResponse'
  | 'ExplanationOfBenefit'
  | 'MedicationDispense'
  | 'MedicationStatement'
  | 'ImagingStudy'
  | 'Communication'
  | 'CommunicationRequest'
  | 'Consent'
  | 'DetectedIssue'
  | 'Group'
  | 'List'
  | 'Questionnaire'
  | 'QuestionnaireResponse'
  | 'RiskAssessment'
  | 'HealthcareService'
  | 'PractitionerRole';

// Base Resource Interface
export interface Resource {
  resourceType: ResourceType;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    source?: string;
    profile?: string[];
    security?: CodeableConcept[];
    tag?: CodeableConcept[];
  };
}

// Common FHIR Data Types
export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface HumanName {
  use?: string;
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
}

export interface ContactPoint {
  system?: string;
  value?: string;
  use?: string;
  rank?: number;
  period?: Period;
}

export interface Address {
  use?: string;
  type?: string;
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: Period;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface Reference {
  reference?: string;
  type?: string;
  identifier?: Identifier;
  display?: string;
}

export interface Identifier {
  use?: string;
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export interface Quantity {
  value?: number;
  comparator?: string;
  unit?: string;
  system?: string;
  code?: string;
}

export interface Range {
  low?: Quantity;
  high?: Quantity;
}

export interface Ratio {
  numerator?: Quantity;
  denominator?: Quantity;
}

export interface SampledData {
  origin: Quantity;
  period: number;
  factor?: number;
  lowerLimit?: number;
  upperLimit?: number;
  dimensions: number;
  data?: string;
}

export interface Annotation {
  authorReference?: Reference;
  authorString?: string;
  time?: string;
  text: string;
}

export interface Timing {
  event?: string[];
  repeat?: {
    boundsDuration?: Quantity;
    boundsRange?: Range;
    boundsPeriod?: Period;
    count?: number;
    countMax?: number;
    duration?: number;
    durationMax?: number;
    durationUnit?: string;
    frequency?: number;
    frequencyMax?: number;
    period?: number;
    periodMax?: number;
    periodUnit?: string;
    dayOfWeek?: string[];
    timeOfDay?: string[];
    when?: string[];
    offset?: number;
  };
  code?: CodeableConcept;
}

export interface Dosage {
  sequence?: number;
  text?: string;
  additionalInstruction?: CodeableConcept[];
  patientInstruction?: string;
  timing?: Timing;
  asNeeded?: boolean | CodeableConcept;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  doseAndRate?: {
    type?: CodeableConcept;
    dose?: Quantity | Range;
    rate?: Quantity | Range | Ratio;
  }[];
  maxDosePerPeriod?: Ratio;
  maxDosePerAdministration?: Quantity;
  maxDosePerLifetime?: Quantity;
}

// Patient Resource
export interface Patient extends Resource {
  resourceType: 'Patient';
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: string;
  birthDate?: string;
  deceased?: boolean | string;
  address?: Address[];
  maritalStatus?: CodeableConcept;
  multipleBirth?: boolean | number;
  photo?: Attachment[];
  contact?: PatientContact[];
  communication?: {
    language: CodeableConcept;
    preferred?: boolean;
  }[];
  generalPractitioner?: Reference[];
  managingOrganization?: Reference;
  link?: {
    other: Reference;
    type: string;
  }[];
}

export interface PatientContact {
  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: string;
  organization?: Reference;
  period?: Period;
}

// Practitioner Resource
export interface Practitioner extends Resource {
  resourceType: 'Practitioner';
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  address?: Address[];
  gender?: string;
  birthDate?: string;
  photo?: Attachment[];
  qualification?: {
    identifier?: Identifier[];
    code: CodeableConcept;
    period?: Period;
    issuer?: Reference;
  }[];
  communication?: CodeableConcept[];
}

// Organization Resource
export interface Organization extends Resource {
  resourceType: 'Organization';
  identifier?: Identifier[];
  active?: boolean;
  type?: CodeableConcept[];
  name?: string;
  alias?: string[];
  telecom?: ContactPoint[];
  address?: Address[];
  partOf?: Reference;
  contact?: {
    purpose?: CodeableConcept;
    name?: HumanName;
    telecom?: ContactPoint[];
    address?: Address;
  }[];
  endpoint?: Reference[];
}

// Observation Resource
export interface Observation extends Resource {
  resourceType: 'Observation';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  focus?: Reference[];
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  effectiveTiming?: Timing;
  effectiveInstant?: string;
  issued?: string;
  performer?: Reference[];
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  note?: Annotation[];
  bodySite?: CodeableConcept;
  method?: CodeableConcept;
  specimen?: Reference;
  device?: Reference;
  referenceRange?: ObservationReferenceRange[];
  hasMember?: Reference[];
  derivedFrom?: Reference[];
  component?: ObservationComponent[];
}

export interface ObservationReferenceRange {
  low?: Quantity;
  high?: Quantity;
  type?: CodeableConcept;
  appliesTo?: CodeableConcept[];
  age?: Range;
  text?: string;
}

export interface ObservationComponent {
  code: CodeableConcept;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  referenceRange?: ObservationReferenceRange[];
}

// Condition Resource
export interface Condition extends Resource {
  resourceType: 'Condition';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  severity?: CodeableConcept;
  code?: CodeableConcept;
  bodySite?: CodeableConcept[];
  subject: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  onsetAge?: Quantity;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  abatementDateTime?: string;
  abatementAge?: Quantity;
  abatementPeriod?: Period;
  abatementRange?: Range;
  abatementString?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  stage?: {
    summary?: CodeableConcept;
    assessment?: Reference[];
    type?: CodeableConcept;
  }[];
  evidence?: {
    code?: CodeableConcept[];
    detail?: Reference[];
  }[];
  note?: Annotation[];
}

// Medication Resource
export interface Medication extends Resource {
  resourceType: 'Medication';
  identifier?: Identifier[];
  code?: CodeableConcept;
  status?: string;
  manufacturer?: Reference;
  form?: CodeableConcept;
  amount?: Ratio;
  ingredient?: {
    itemCodeableConcept?: CodeableConcept;
    itemReference?: Reference;
    isActive?: boolean;
    strength?: Ratio;
  }[];
  batch?: {
    lotNumber?: string;
    expirationDate?: string;
  };
}

// MedicationRequest Resource
export interface MedicationRequest extends Resource {
  resourceType: 'MedicationRequest';
  identifier?: Identifier[];
  status: string;
  statusReason?: CodeableConcept;
  intent: string;
  category?: CodeableConcept[];
  priority?: string;
  doNotPerform?: boolean;
  reported?: boolean;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  encounter?: Reference;
  supportingInformation?: Reference[];
  authoredOn?: string;
  requester?: Reference;
  performer?: Reference;
  performerType?: CodeableConcept;
  recorder?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  groupIdentifier?: Identifier;
  courseOfTherapyType?: CodeableConcept;
  insurance?: Reference[];
  note?: Annotation[];
  dosageInstruction?: Dosage[];
  dispenseRequest?: {
    initialFill?: {
      quantity?: Quantity;
      duration?: Duration;
    };
    dispenseInterval?: Duration;
    validityPeriod?: Period;
    numberOfRepeatsAllowed?: number;
    quantity?: Quantity;
    expectedSupplyDuration?: Duration;
    performer?: Reference;
  };
  substitution?: {
    allowedBoolean?: boolean;
    allowedCodeableConcept?: CodeableConcept;
    reason?: CodeableConcept;
  };
  priorPrescription?: Reference;
  detectedIssue?: Reference[];
  eventHistory?: Reference[];
}

// Encounter Resource
export interface Encounter extends Resource {
  resourceType: 'Encounter';
  identifier?: Identifier[];
  status: string;
  statusHistory?: {
    status: string;
    period: Period;
  }[];
  class: Coding;
  classHistory?: {
    class: Coding;
    period: Period;
  }[];
  type?: CodeableConcept[];
  serviceType?: CodeableConcept;
  priority?: CodeableConcept;
  subject?: Reference;
  episodeOfCare?: Reference[];
  basedOn?: Reference[];
  participant?: {
    type?: CodeableConcept[];
    period?: Period;
    individual?: Reference;
  }[];
  appointment?: Reference[];
  period?: Period;
  length?: Duration;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  diagnosis?: {
    condition: Reference;
    use?: CodeableConcept;
    rank?: number;
  }[];
  account?: Reference[];
  hospitalization?: {
    preAdmissionIdentifier?: Identifier;
    origin?: Reference;
    admitSource?: CodeableConcept;
    reAdmission?: CodeableConcept;
    dietPreference?: CodeableConcept[];
    specialCourtesy?: CodeableConcept[];
    specialArrangement?: CodeableConcept[];
    destination?: Reference;
    dischargeDisposition?: CodeableConcept;
  };
  location?: {
    location: Reference;
    status?: string;
    physicalType?: CodeableConcept;
    period?: Period;
  }[];
  serviceProvider?: Reference;
  partOf?: Reference;
}

// AllergyIntolerance Resource
export interface AllergyIntolerance extends Resource {
  resourceType: 'AllergyIntolerance';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: string;
  category?: string[];
  criticality?: string;
  code?: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  onsetAge?: Quantity;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: string;
  note?: Annotation[];
  reaction?: {
    substance?: CodeableConcept;
    manifestation: CodeableConcept[];
    description?: string;
    onset?: string;
    severity?: string;
    exposureRoute?: CodeableConcept;
    note?: Annotation[];
  }[];
}

// Procedure Resource
export interface Procedure extends Resource {
  resourceType: 'Procedure';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: string;
  statusReason?: CodeableConcept;
  category?: CodeableConcept;
  code?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  performed?: string | Period | string | Age | Range | string;
  recorder?: Reference;
  asserter?: Reference;
  performer?: {
    function?: CodeableConcept;
    actor: Reference;
    onBehalfOf?: Reference;
  }[];
  location?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  bodySite?: CodeableConcept[];
  outcome?: CodeableConcept;
  report?: Reference[];
  complication?: CodeableConcept[];
  complicationDetail?: Reference[];
  followUp?: CodeableConcept[];
  note?: Annotation[];
  focalDevice?: {
    action?: CodeableConcept;
    manipulated: Reference;
  }[];
  usedReference?: Reference[];
  usedCode?: CodeableConcept[];
}

// Immunization Resource
export interface Immunization extends Resource {
  resourceType: 'Immunization';
  identifier?: Identifier[];
  status: string;
  statusReason?: CodeableConcept;
  vaccineCode: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  occurrence?: string | string;
  recorded?: string;
  primarySource?: boolean;
  reportOrigin?: CodeableConcept;
  location?: Reference;
  manufacturer?: Reference;
  lotNumber?: string;
  expirationDate?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: {
    function?: CodeableConcept;
    actor: Reference;
  }[];
  note?: Annotation[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  isSubpotent?: boolean;
  subpotentReason?: CodeableConcept[];
  education?: {
    documentType?: string;
    publicationDate?: string;
    presentationDate?: string;
    url?: string;
    reference?: string;
    title?: string;
  }[];
  programEligibility?: CodeableConcept[];
  fundingSource?: CodeableConcept;
  reaction?: {
    date?: string;
    detail?: Reference;
    reported?: boolean;
  }[];
  protocolApplied?: {
    series?: string;
    authority?: Reference;
    targetDisease?: CodeableConcept[];
    doseNumberPositiveInt?: number;
    doseNumberString?: string;
    seriesDosesPositiveInt?: number;
    seriesDosesString?: string;
  }[];
}

// DiagnosticReport Resource
export interface DiagnosticReport extends Resource {
  resourceType: 'DiagnosticReport';
  identifier?: Identifier[];
  basedOn?: Reference[];
  status: string;
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  issued?: string;
  performer?: Reference[];
  resultsInterpreter?: Reference[];
  specimen?: Reference[];
  result?: Reference[];
  imagingStudy?: Reference[];
  media?: {
    comment?: string;
    link: Reference;
  }[];
  conclusion?: string;
  conclusionCode?: CodeableConcept[];
  presentedForm?: Attachment[];
}

// Bundle Resource for search results
export interface Bundle extends Resource {
  resourceType: 'Bundle';
  type: string;
  total?: number;
  link?: BundleLink[];
  entry?: BundleEntry[];
}

export interface BundleLink {
  relation: string;
  url: string;
}

export interface BundleEntry {
  fullUrl?: string;
  resource?: Resource;
  search?: {
    mode?: string;
    score?: number;
  };
}

// Additional Data Types
export interface Attachment {
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

export interface Duration extends Quantity {
  // Duration is a specialization of Quantity
}

// Search Parameters
export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// Error Response
export interface FhirError {
  status: number;
  message: string;
  issue?: {
    severity: string;
    code: string;
    details?: CodeableConcept;
    diagnostics?: string;
    expression?: string[];
  }[];
}