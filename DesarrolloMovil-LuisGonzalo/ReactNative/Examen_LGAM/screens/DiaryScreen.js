import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useCalorieStore from '../store/calorieStore';
import { formatDate } from '../utils/helpers';

const DiaryScreen = ({ navigation }) => {
  const {
    profiles,
    currentProfileId,
    getTotalCalories,
    getRemainingCalories,
    getTodayRecords,
    removeFoodRecord,
    loadData,
    getCurrentProfile,
    addFoodRecord,
  } = useCalorieStore();

  useEffect(() => {
    loadData();
  }, []);

  const currentProfile = getCurrentProfile();
  const totalCalories = getTotalCalories();
  const remainingCalories = getRemainingCalories();
  const todayRecords = getTodayRecords();

  const quickAddFood = async (name, cal) => {
    try {
      await addFoodRecord({
        name,
        calories: cal,
        category: 'Snack',
      });
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleAddFood = () => {
    navigation.navigate('AddFood');
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItemContainer}>
      <View style={styles.foodItemHeader}>
        <View style={styles.foodIcon}>
          <Text style={styles.foodIconText}>
            {item.category === 'Desayuno' ? '☕' : 
             item.category === 'Almuerzo' ? '🍽️' :
             item.category === 'Cena' ? '🌙' : '🍎'}
          </Text>
        </View>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodTime}>
            {new Date(item.timestamp).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesText}>{item.calories}</Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay comidas registradas hoy</Text>
    </View>
  );

  // Si no hay perfiles, mostrar pantalla de bienvenida
  if (profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>¡Bienvenido a CalorieTracker!</Text>
          <Text style={styles.welcomeSubtitle}>Crea tu primer perfil para comenzar</Text>
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.createProfileButtonText}>Crear Perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Si no hay perfil seleccionado, mostrar mensaje
  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileSelectionContainer}>
          <Text style={styles.profileSelectionTitle}>Selecciona un perfil</Text>
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.createProfileButtonText}>Ir a Perfiles</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con nombre de la app y calorías totales */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>CalorieTracker</Text>
        <View style={styles.caloriesSummary}>
          <Text style={styles.caloriesNumber}>{totalCalories}</Text>
          <Text style={styles.caloriesGoal}>de {currentProfile.calorieGoal} kcal</Text>
        </View>
      </View>

      {/* Fecha actual */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {formatDate(new Date().toISOString().split('T')[0])}
        </Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#4CAF50', '#8BC34A']}
            style={[
              styles.progressFill,
              { 
                width: Math.min(100, (totalCalories / currentProfile.calorieGoal) * 100) + '%'
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Progreso diario {Math.round((totalCalories / currentProfile.calorieGoal) * 100)}%
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección Agregar Alimento */}
        <TouchableOpacity style={styles.addFoodContainer} onPress={handleAddFood}>
          <Text style={styles.addFoodIcon}>+</Text>
          <Text style={styles.addFoodText}>Agregar Alimento</Text>
        </TouchableOpacity>

        {/* Sugerencias de alimentos rápidos */}
        <Text style={styles.sectionTitle}>Agregar rápido:</Text>
        <View style={styles.quickAddContainer}>
          <TouchableOpacity 
            style={styles.quickAddItem}
            onPress={() => quickAddFood('Manzana', 95)}
          >
            <Text style={styles.quickAddText}>Manzana (95 kcal)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAddItem}
            onPress={() => quickAddFood('Plátano', 105)}
          >
            <Text style={styles.quickAddText}>Plátano (105 kcal)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickAddContainer}>
          <TouchableOpacity 
            style={styles.quickAddItem}
            onPress={() => quickAddFood('Yogurt', 150)}
          >
            <Text style={styles.quickAddText}>Yogurt (150 kcal)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAddItem}
            onPress={() => quickAddFood('Almendras (30g)', 170)}
          >
            <Text style={styles.quickAddText}>Almendras (30g) (170 kcal)</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de comidas del día */}
        <View style={styles.todayFoodsContainer}>
          <Text style={styles.todayFoodsTitle}>Comidas de Hoy</Text>
          
          {todayRecords.length > 0 ? (
            <FlatList
              data={todayRecords}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#E0E0E0' }} />}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  profileSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  profileSelectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  createProfileButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesSummary: {
    alignItems: 'flex-end',
  },
  caloriesNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  caloriesGoal: {
    fontSize: 12,
    color: '#666',
  },
  dateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#999',
    textTransform: 'capitalize',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addFoodContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addFoodIcon: {
    fontSize: 24,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold',
  },
  addFoodText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quickAddContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quickAddItem: {
    flex: 1,
    backgroundColor: '#008B8B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  quickAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  todayFoodsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  todayFoodsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  foodItemContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  foodItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  foodIconText: {
    fontSize: 20,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  foodTime: {
    fontSize: 12,
    color: '#999',
  },
  caloriesContainer: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default DiaryScreen;
