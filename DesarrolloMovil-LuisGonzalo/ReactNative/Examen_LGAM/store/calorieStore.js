import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCalorieStore = create((set, get) => ({
  // Sistema de perfiles múltiples
  profiles: [], // Array de perfiles: [{ id, name, age, gender, weight, height, activityLevel, calorieGoal, createdAt }]
  currentProfileId: null,

  // Registros de comidas por perfil y fecha
  foodRecords: {}, // { 'profileId_YYYY-MM-DD': [{ id, name, calories, category, timestamp }] }

  // Fecha actual seleccionada
  selectedDate: new Date().toISOString().split('T')[0],

  // Acciones para perfiles
  createProfile: async (profileData) => {
    const id = Date.now().toString();
    const calorieGoal = calculateCalorieGoal(profileData);
    const newProfile = {
      id,
      ...profileData,
      calorieGoal,
      createdAt: new Date().toISOString(),
    };
    
    const state = get();
    const updatedProfiles = [...state.profiles, newProfile];
    
    set({ 
      profiles: updatedProfiles,
      currentProfileId: id // Seleccionar automáticamente el nuevo perfil
    });
    
    await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    await AsyncStorage.setItem('currentProfileId', id);
    
    return newProfile;
  },

  deleteProfile: async (profileId) => {
    const state = get();
    const updatedProfiles = state.profiles.filter(p => p.id !== profileId);
    let newCurrentProfileId = state.currentProfileId;
    
    // Si se elimina el perfil actual, seleccionar otro o null
    if (state.currentProfileId === profileId) {
      newCurrentProfileId = updatedProfiles.length > 0 ? updatedProfiles[0].id : null;
    }
    
    // Eliminar registros de comida del perfil eliminado
    const updatedFoodRecords = {};
    Object.keys(state.foodRecords).forEach(key => {
      if (!key.startsWith(`${profileId}_`)) {
        updatedFoodRecords[key] = state.foodRecords[key];
      }
    });
    
    set({ 
      profiles: updatedProfiles,
      currentProfileId: newCurrentProfileId,
      foodRecords: updatedFoodRecords
    });
    
    await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    await AsyncStorage.setItem('currentProfileId', newCurrentProfileId || '');
    await AsyncStorage.setItem('foodRecords', JSON.stringify(updatedFoodRecords));
  },

  selectProfile: async (profileId) => {
    set({ currentProfileId: profileId });
    await AsyncStorage.setItem('currentProfileId', profileId);
  },

  updateProfile: async (profileId, profileData) => {
    const state = get();
    const calorieGoal = calculateCalorieGoal(profileData);
    const updatedProfiles = state.profiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, ...profileData, calorieGoal }
        : profile
    );
    
    set({ profiles: updatedProfiles });
    await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
  },

  // Acciones para comidas (ahora por perfil)
  addFoodRecord: async (food) => {
    const state = get();
    if (!state.currentProfileId) return;
    
    const key = `${state.currentProfileId}_${state.selectedDate}`;
    const currentRecords = state.foodRecords[key] || [];
    
    const newRecord = {
      id: Date.now().toString(),
      ...food,
      timestamp: new Date().toISOString(),
    };

    const updatedRecords = [...currentRecords, newRecord];
    const newFoodRecords = {
      ...state.foodRecords,
      [key]: updatedRecords,
    };

    set({ foodRecords: newFoodRecords });
    await AsyncStorage.setItem('foodRecords', JSON.stringify(newFoodRecords));
  },

  removeFoodRecord: async (recordId) => {
    const state = get();
    if (!state.currentProfileId) return;
    
    const key = `${state.currentProfileId}_${state.selectedDate}`;
    const currentRecords = state.foodRecords[key] || [];
    
    const updatedRecords = currentRecords.filter(record => record.id !== recordId);
    const newFoodRecords = {
      ...state.foodRecords,
      [key]: updatedRecords,
    };

    set({ foodRecords: newFoodRecords });
    await AsyncStorage.setItem('foodRecords', JSON.stringify(newFoodRecords));
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  loadData: async () => {
    try {
      const [profilesData, currentProfileIdData, foodRecordsData] = await Promise.all([
        AsyncStorage.getItem('profiles'),
        AsyncStorage.getItem('currentProfileId'),
        AsyncStorage.getItem('foodRecords'),
      ]);

      if (profilesData) {
        const profiles = JSON.parse(profilesData);
        set({ profiles });
      }

      if (currentProfileIdData) {
        set({ currentProfileId: currentProfileIdData });
      }

      if (foodRecordsData) {
        set({ foodRecords: JSON.parse(foodRecordsData) });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  },

  // Getters computados (ahora por perfil)
  getCurrentProfile: () => {
    const state = get();
    return state.profiles.find(p => p.id === state.currentProfileId) || null;
  },

  getTodayRecords: () => {
    const state = get();
    if (!state.currentProfileId) return [];
    const key = `${state.currentProfileId}_${state.selectedDate}`;
    return state.foodRecords[key] || [];
  },

  getTotalCalories: () => {
    const state = get();
    if (!state.currentProfileId) return 0;
    const key = `${state.currentProfileId}_${state.selectedDate}`;
    const records = state.foodRecords[key] || [];
    return records.reduce((total, record) => total + record.calories, 0);
  },

  getRemainingCalories: () => {
    const state = get();
    const currentProfile = state.getCurrentProfile();
    if (!currentProfile) return 0;
    const totalConsumed = state.getTotalCalories();
    return Math.max(0, currentProfile.calorieGoal - totalConsumed);
  },

  getRecordsByCategory: () => {
    const state = get();
    if (!state.currentProfileId) return {};
    const key = `${state.currentProfileId}_${state.selectedDate}`;
    const records = state.foodRecords[key] || [];
    return records.reduce((acc, record) => {
      if (!acc[record.category]) {
        acc[record.category] = [];
      }
      acc[record.category].push(record);
      return acc;
    }, {});
  },

  // Obtener estadísticas de la semana actual (por perfil)
  getWeeklyStats: () => {
    const state = get();
    const currentProfile = state.getCurrentProfile();
    if (!currentProfile) return [];
    
    const today = new Date();
    const weekDays = [];
    
    // Generar los últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weekDays.push(date.toISOString().split('T')[0]);
    }

    return weekDays.map(date => {
      const key = `${state.currentProfileId}_${date}`;
      const records = state.foodRecords[key] || [];
      const totalCalories = records.reduce((sum, record) => sum + record.calories, 0);
      return {
        date,
        totalCalories,
        goal: currentProfile.calorieGoal,
        percentage: currentProfile.calorieGoal > 0 ? (totalCalories / currentProfile.calorieGoal) * 100 : 0,
      };
    });
  },

  // Obtener total de calorías por categoría en un período (por perfil)
  getCategoryTotals: (days = 7) => {
    const state = get();
    if (!state.currentProfileId) return {};
    
    const today = new Date();
    const categoryTotals = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const key = `${state.currentProfileId}_${dateString}`;
      const records = state.foodRecords[key] || [];
      
      records.forEach(record => {
        if (!categoryTotals[record.category]) {
          categoryTotals[record.category] = 0;
        }
        categoryTotals[record.category] += record.calories;
      });
    }
    
    return categoryTotals;
  },
}));

// Función para calcular las calorías objetivo basada en el perfil
const calculateCalorieGoal = (profile) => {
  const { age, gender, weight, height, activityLevel } = profile;
  
  if (!age || !weight || !height) return 0;

  // Fórmula de Harris-Benedict revisada
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Factores de actividad
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * activityFactors[activityLevel];
  return Math.round(tdee);
};

export default useCalorieStore;