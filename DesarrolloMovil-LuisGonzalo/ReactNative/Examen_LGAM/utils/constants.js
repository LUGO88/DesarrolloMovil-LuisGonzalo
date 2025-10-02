// Colores de la aplicación
export const COLORS = {
  primary: '#4ECDC4',
  primaryDark: '#44A08D',
  secondary: '#FFE66D',
  success: '#4ECDC4',
  warning: '#FFE66D',
  error: '#FF6B6B',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
};

// Espaciado
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Tipografía
export const TYPOGRAPHY = {
  sizes: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    display: 24,
    hero: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

// Radios de borde
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 25,
  circle: 50,
};

// Sombras
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Contador de Calorías',
  version: '1.0.0',
  author: 'Gonzalo',
  description: 'Aplicación para el seguimiento de calorías',
  storageKeys: {
    profile: 'profile',
    foodRecords: 'foodRecords',
    settings: 'settings',
  },
  limits: {
    maxAge: 120,
    minAge: 10,
    maxWeight: 300,
    minWeight: 20,
    maxHeight: 250,
    minHeight: 100,
    maxCalories: 9999,
    maxFoodNameLength: 50,
  },
};