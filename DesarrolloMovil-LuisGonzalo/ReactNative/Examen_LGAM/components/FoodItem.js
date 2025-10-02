import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FOOD_CATEGORIES } from '../utils/helpers';

const FoodItem = ({ food, onDelete }) => {
  const categoryInfo = FOOD_CATEGORIES.find(cat => cat.key === food.category);
  
  const handleDelete = () => {
    Alert.alert(
      'Eliminar alimento',
      `¿Estás seguro de que quieres eliminar "${food.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(food.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.categoryIcon}>
            {categoryInfo?.icon || '🍽️'}
          </Text>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {food.name}
            </Text>
            <Text style={styles.category}>
              {categoryInfo?.label || food.category}
            </Text>
          </View>
          <Text style={styles.calories}>
            {food.calories} cal
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: '#FF6B6B',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FoodItem;