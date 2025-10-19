/* ============================================
   CLINICAL MANAGEMENT SYSTEM - UTILITIES
   All validation, formatting, and helper functions
   ============================================ */

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  const regex = /^\+?\d{10,15}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  if (!password) return false;
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value && value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateAge = (dob) => {
  if (!dob) return false;
  const today = new Date();
  const birthDate = new Date(dob);
  return birthDate < today;
};

export const validateBloodGroup = (bloodGroup) => {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validGroups.includes(bloodGroup);
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

// ============================================
// FORMATTING FUNCTIONS
// ============================================

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  const formats = {
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD-MM-YYYY': `${day}-${month}-${year}`,
  };
  
  return formats[format] || formats['DD/MM/YYYY'];
};

export const formatTime = (time, format12Hour = true) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  
  if (format12Hour) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  return `${hours}:${minutes}`;
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  return `${formatDate(d)} ${formatTime(d.toTimeString().slice(0, 5))}`;
};

export const formatCurrency = (amount, currency = '₹') => {
  if (!amount && amount !== 0) return '';
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '';
  return `${currency}${numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    // Format: 98765 43210
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    // Format: +91 98765 43210
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const formatName = (firstName, lastName) => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  return `${first} ${last}`.trim();
};

export const formatFullName = (user) => {
  return formatName(user?.first_name, user?.last_name);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

export const formatPercentage = (value, decimals = 0) => {
  if (!value && value !== 0) return '';
  return `${parseFloat(value).toFixed(decimals)}%`;
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const calculateAge = (dob) => {
  if (!dob) return 0;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getAgeGroup = (age) => {
  if (age < 0) return 'Invalid';
  if (age < 2) return 'Infant';
  if (age < 13) return 'Child';
  if (age < 20) return 'Teenager';
  if (age < 40) return 'Young Adult';
  if (age < 60) return 'Adult';
  return 'Senior';
};

export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

export const getUserInitials = (user) => {
  return getInitials(user?.first_name, user?.last_name);
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateRandomColor = () => {
  const colors = [
    '#1e88e5', '#26a69a', '#66bb6a', '#7e57c2',
    '#ec407a', '#ff7043', '#42a5f5', '#ab47bc',
    '#ef5350', '#ffa726', '#66bb6a', '#29b6f6'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getColorFromString = (str) => {
  if (!str) return '#1e88e5';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#1e88e5', '#26a69a', '#66bb6a', '#7e57c2',
    '#ec407a', '#ff7043', '#42a5f5', '#ab47bc'
  ];
  return colors[Math.abs(hash) % colors.length];
};

export const sortArray = (array, key, direction = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    // Handle null/undefined
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    // Compare
    if (direction === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

export const filterArray = (array, searchTerm, keys) => {
  if (!Array.isArray(array)) return [];
  if (!searchTerm) return array;
  
  const lowerSearch = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return keys.some(key => {
      const value = getNestedValue(item, key);
      return value?.toString().toLowerCase().includes(lowerSearch);
    });
  });
};

export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const uniqueBy = (array, key) => {
  if (!Array.isArray(array)) return [];
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const generateToken = (prefix = 'TKN', length = 6) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = prefix;
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    today.getDate() === compareDate.getDate() &&
    today.getMonth() === compareDate.getMonth() &&
    today.getFullYear() === compareDate.getFullYear()
  );
};

export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
};

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

export const getStatusColor = (status) => {
  const statusColors = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
    completed: 'info',
    cancelled: 'danger',
    scheduled: 'primary',
    confirmed: 'success',
  };
  
  return statusColors[status?.toLowerCase()] || 'secondary';
};

export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!Array.isArray(data) || data.length === 0) return;
  
  // Get headers
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ============================================
// STORAGE HELPERS
// ============================================

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};
