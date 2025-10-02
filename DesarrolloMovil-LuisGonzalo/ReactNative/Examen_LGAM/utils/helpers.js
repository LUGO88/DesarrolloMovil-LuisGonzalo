// Función para formatear fecha en formato legible
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// Función para obtener la fecha anterior
export const getPreviousDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

// Función para obtener la fecha siguiente
export const getNextDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

// Función para validar si una fecha es hoy
export const isToday = (dateString) => {
  return dateString === getTodayString();
};

// Función para validar si una fecha es futura
export const isFutureDate = (dateString) => {
  return dateString > getTodayString();
};

// Categorías de comida
export const FOOD_CATEGORIES = [
  { key: 'breakfast', label: 'Desayuno', icon: '🌅' },
  { key: 'lunch', label: 'Almuerzo', icon: '🍽️' },
  { key: 'dinner', label: 'Cena', icon: '🌙' },
  { key: 'snacks', label: 'Snacks', icon: '🍿' },
];

// Niveles de actividad
export const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentario', description: 'Poco o ningún ejercicio' },
  { key: 'light', label: 'Ligero', description: 'Ejercicio ligero 1-3 días/semana' },
  { key: 'moderate', label: 'Moderado', description: 'Ejercicio moderado 3-5 días/semana' },
  { key: 'active', label: 'Activo', description: 'Ejercicio intenso 6-7 días/semana' },
  { key: 'very_active', label: 'Muy Activo', description: 'Ejercicio muy intenso, trabajo físico' },
];

// Función para obtener el color de progreso basado en el porcentaje
export const getProgressColor = (percentage) => {
  if (percentage < 50) return '#FF6B6B'; // Rojo
  if (percentage < 80) return '#FFE66D'; // Amarillo
  if (percentage <= 100) return '#4ECDC4'; // Verde
  return '#FF8A80'; // Rojo claro (exceso)
};