// ============================================
// CLINICAL MANAGEMENT SYSTEM - CONSTANTS
// All application-wide constants and configurations
// ============================================

// API Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Clinical Management System';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  LAB_TECHNICIAN: 'lab-technician',
  PHARMACIST: 'pharmacist',
};

// Blood Groups (for patient registration)
export const BLOOD_GROUPS = [
  'A+', 
  'A-', 
  'B+', 
  'B-', 
  'AB+', 
  'AB-', 
  'O+', 
  'O-'
];

// Genders (for patient registration)
export const GENDERS = [
  'Male', 
  'Female', 
  'Other'
];

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  RESCHEDULED: 'rescheduled',
};

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'pending', label: 'Pending' },
];

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  INSURANCE: 'insurance',
  CHEQUE: 'cheque',
};

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'net_banking', label: 'Net Banking' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'cheque', label: 'Cheque' },
];

// Routes
export const ROUTES = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  ADMIN_HOME: '/admin',
  DOCTOR_HOME: '/doctor',
  RECEPTIONIST_HOME: '/receptionist',
  LAB_HOME: '/lab-technician',
  PHARMACY_HOME: '/pharmacist',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  ROLE: 'userRole',
  THEME: 'appTheme',
  REMEMBER_ME: 'rememberMe',
  LANGUAGE: 'language',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  DATETIME_FULL: 'DD/MM/YYYY HH:mm:ss',
  TIME: 'HH:mm',
  TIME_12H: 'hh:mm A',
};

// Time Formats
export const TIME_FORMATS = {
  TWELVE_HOUR: 'hh:mm A',
  TWENTY_FOUR_HOUR: 'HH:mm',
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_MB: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_AGE: 0,
  MAX_AGE: 150,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_ADDRESS_LENGTH: 10,
  MAX_ADDRESS_LENGTH: 500,
};

// Toast/Notification Duration (in milliseconds)
export const NOTIFICATION_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'en',
  CURRENCY: '₹',
  CURRENCY_CODE: 'INR',
  TIMEZONE: 'Asia/Kolkata',
  COUNTRY: 'India',
  COUNTRY_CODE: 'IN',
  PHONE_PREFIX: '+91',
};

// Medical Departments
export const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Dermatology',
  'ENT',
  'Ophthalmology',
  'Psychiatry',
  'General Medicine',
  'Surgery',
  'Radiology',
  'Pathology',
];

// Medical Specializations
export const SPECIALIZATIONS = [
  { value: 'cardiologist', label: 'Cardiologist' },
  { value: 'neurologist', label: 'Neurologist' },
  { value: 'orthopedic', label: 'Orthopedic Surgeon' },
  { value: 'pediatrician', label: 'Pediatrician' },
  { value: 'gynecologist', label: 'Gynecologist' },
  { value: 'dermatologist', label: 'Dermatologist' },
  { value: 'ent', label: 'ENT Specialist' },
  { value: 'ophthalmologist', label: 'Ophthalmologist' },
  { value: 'psychiatrist', label: 'Psychiatrist' },
  { value: 'general', label: 'General Physician' },
];

// Lab Test Types
export const LAB_TEST_TYPES = [
  'Blood Test',
  'Urine Test',
  'X-Ray',
  'CT Scan',
  'MRI',
  'Ultrasound',
  'ECG',
  'EEG',
  'Biopsy',
  'Culture Test',
];

// Medicine Types
export const MEDICINE_TYPES = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Injection',
  'Drops',
  'Ointment',
  'Cream',
  'Gel',
  'Inhaler',
  'Suppository',
];

// Dosage Frequencies
export const DOSAGE_FREQUENCIES = [
  { value: 'once_daily', label: 'Once Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'thrice_daily', label: 'Thrice Daily' },
  { value: 'four_times_daily', label: 'Four Times Daily' },
  { value: 'every_4_hours', label: 'Every 4 Hours' },
  { value: 'every_6_hours', label: 'Every 6 Hours' },
  { value: 'every_8_hours', label: 'Every 8 Hours' },
  { value: 'every_12_hours', label: 'Every 12 Hours' },
  { value: 'as_needed', label: 'As Needed' },
];

// Appointment Time Slots
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

// Days of Week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Status Colors (for badges)
export const STATUS_COLORS = {
  active: 'success',
  inactive: 'danger',
  pending: 'warning',
  completed: 'info',
  cancelled: 'danger',
  scheduled: 'primary',
  confirmed: 'success',
  rescheduled: 'warning',
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?\d{10,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMBERS_ONLY: /^\d+$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please fix the errors and try again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Data saved successfully',
  UPDATE_SUCCESS: 'Data updated successfully',
  DELETE_SUCCESS: 'Data deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_SENT: 'Email sent successfully',
};

// Table Column Widths
export const COLUMN_WIDTHS = {
  ID: '80px',
  DATE: '120px',
  TIME: '100px',
  STATUS: '120px',
  ACTIONS: '150px',
  SMALL: '100px',
  MEDIUM: '200px',
  LARGE: '300px',
};

// Breakpoints (matching CSS)
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#1e88e5',
  SECONDARY: '#64748b',
  SUCCESS: '#4caf50',
  DANGER: '#f44336',
  WARNING: '#ff9800',
  INFO: '#29b6f6',
  LIGHT: '#f8fafc',
  DARK: '#1e293b',
};

// Chart Colors
export const CHART_COLORS = [
  '#1e88e5',
  '#4caf50',
  '#ff9800',
  '#f44336',
  '#9c27b0',
  '#00bcd4',
  '#ffeb3b',
  '#795548',
];

// Export all as default for convenience
export default {
  APP_NAME,
  API_URL,
  USER_ROLES,
  BLOOD_GROUPS,
  GENDERS,
  APPOINTMENT_STATUS,
  PAYMENT_METHODS,
  ROUTES,
  STORAGE_KEYS,
  PAGINATION,
  DATE_FORMATS,
  VALIDATION,
  DEFAULTS,
  DEPARTMENTS,
  SPECIALIZATIONS,
  STATUS_COLORS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
