import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import useCalorieStore from '../store/calorieStore';

const AddFoodScreen = ({ navigation }) => {
  const { addFoodRecord, getCurrentProfile } = useCalorieStore();

  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    category: 'Desayuno',
    quantity: '1',
  });

  const currentProfile = getCurrentProfile();

  const categories = [
    { key: 'Desayuno', label: 'Desayuno', icon: '☕' },
    { key: 'Almuerzo', label: 'Almuerzo', icon: '🍽️' },
    { key: 'Cena', label: 'Cena', icon: '🌙' },
    { key: 'Snack', label: 'Snack', icon: '🍎' },
  ];

  const commonFoods = [
    { name: 'Manzana', calories: 95, category: 'Snack' },
    { name: 'Plátano', calories: 105, category: 'Snack' },
    { name: 'Pan tostado', calories: 80, category: 'Desayuno' },
    { name: 'Huevo cocido', calories: 70, category: 'Desayuno' },
    { name: 'Yogurt natural', calories: 150, category: 'Snack' },
    { name: 'Almendras (30g)', calories: 170, category: 'Snack' },
    { name: 'Pechuga de pollo (100g)', calories: 165, category: 'Almuerzo' },
    { name: 'Arroz blanco (1 taza)', calories: 205, category: 'Almuerzo' },
    { name: 'Ensalada verde', calories: 20, category: 'Almuerzo' },
    { name: 'Pasta (1 taza)', calories: 220, category: 'Cena' },
  ];

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del alimento');
      return;
    }

    if (!formData.calories || parseInt(formData.calories) <= 0) {
      Alert.alert('Error', 'Por favor ingresa las calorías válidas');
      return;
    }

    if (!currentProfile) {
      Alert.alert('Error', 'No hay un perfil seleccionado');
      return;
    }

    try {
      await addFoodRecord({
        name: formData.name.trim(),
        calories: parseInt(formData.calories),
        category: formData.category,
        quantity: parseFloat(formData.quantity) || 1,
      });

      Alert.alert('Éxito', 'Alimento agregado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el alimento');
      console.error('Error adding food:', error);
    }
  };

  const handleQuickAdd = async (food) => {
    try {
      await addFoodRecord({
        name: food.name,
        calories: food.calories,
        category: food.category,
        quantity: 1,
      });

      Alert.alert('Éxito', `${food.name} agregado correctamente`, [
        {
          text: 'Agregar otro',
          style: 'default',
        },
        {
          text: 'Volver',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el alimento');
      console.error('Error adding food:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Alimento</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Formulario principal */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Nuevo Alimento</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre del alimento *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ej: Manzana verde"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Calorías *</Text>
              <TextInput
                style={styles.input}
                value={formData.calories}
                onChangeText={(text) => setFormData({ ...formData, calories: text })}
                placeholder="Ej: 95"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Cantidad</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    formData.category === category.key && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, category: category.key })}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category.key && styles.categoryTextSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Agregar Alimento</Text>
          </TouchableOpacity>
        </View>

        {/* Alimentos comunes */}
        <View style={styles.quickAddContainer}>
          <Text style={styles.sectionTitle}>Alimentos Comunes</Text>
          <Text style={styles.sectionSubtitle}>Toca para agregar rápidamente</Text>
          
          <View style={styles.commonFoodsGrid}>
            {commonFoods.map((food, index) => (
              <TouchableOpacity
                key={index}
                style={styles.commonFoodItem}
                onPress={() => handleQuickAdd(food)}
              >
                <Text style={styles.commonFoodIcon}>
                  {categories.find(cat => cat.key === food.category)?.icon || '🍽️'}
                </Text>
                <Text style={styles.commonFoodName}>{food.name}</Text>
                <Text style={styles.commonFoodCalories}>{food.calories} kcal</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  formGroup: {
    marginVertical: 12,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formGroupHalf: {
    flex: 0.48,
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginRight: '2%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickAddContainer: {
    padding: 16,
  },
  commonFoodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  commonFoodItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  commonFoodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  commonFoodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  commonFoodCalories: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default AddFoodScreen;
