import { APP_CONFIG } from './constants';

// Validaciones para el perfil del usuario
export const validateProfile = (profileData) => {
  const errors = {};
  const { age, weight, height } = profileData;
  const { limits } = APP_CONFIG;

  if (!age || isNaN(age)) {
    errors.age = 'La edad es requerida y debe ser un número';
  } else if (parseInt(age) < limits.minAge || parseInt(age) > limits.maxAge) {
    errors.age = `La edad debe estar entre ${limits.minAge} y ${limits.maxAge} años`;
  }

  if (!weight || isNaN(weight)) {
    errors.weight = 'El peso es requerido y debe ser un número';
  } else if (parseFloat(weight) < limits.minWeight || parseFloat(weight) > limits.maxWeight) {
    errors.weight = `El peso debe estar entre ${limits.minWeight} y ${limits.maxWeight} kg`;
  }

  if (!height || isNaN(height)) {
    errors.height = 'La altura es requerida y debe ser un número';
  } else if (parseInt(height) < limits.minHeight || parseInt(height) > limits.maxHeight) {
    errors.height = `La altura debe estar entre ${limits.minHeight} y ${limits.maxHeight} cm`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validaciones para registros de comida
export const validateFoodRecord = (foodData) => {
  const errors = {};
  const { name, calories } = foodData;
  const { limits } = APP_CONFIG;

  if (!name || !name.trim()) {
    errors.name = 'El nombre del alimento es requerido';
  } else if (name.trim().length > limits.maxFoodNameLength) {
    errors.name = `El nombre no puede exceder ${limits.maxFoodNameLength} caracteres`;
  }

  if (!calories || isNaN(calories)) {
    errors.calories = 'Las calorías son requeridas y deben ser un número';
  } else if (parseInt(calories) <= 0 || parseInt(calories) > limits.maxCalories) {
    errors.calories = `Las calorías deben estar entre 1 y ${limits.maxCalories}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validar si una fecha es válida
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Validar si el usuario tiene un perfil completo
export const hasCompleteProfile = (profile) => {
  return profile && 
         profile.age > 0 && 
         profile.weight > 0 && 
         profile.height > 0 && 
         profile.calorieGoal > 0;
};

// Sanitizar texto de entrada
export const sanitizeText = (text) => {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
};

// Formatear número de calorías
export const formatCalories = (calories) => {
  if (isNaN(calories)) return '0';
  return Math.round(calories).toLocaleString();
};

// Validar límites de entrada numérica
export const validateNumericInput = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};