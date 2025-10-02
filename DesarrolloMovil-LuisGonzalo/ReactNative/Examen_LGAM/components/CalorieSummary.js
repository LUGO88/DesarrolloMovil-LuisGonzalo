import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';

const CalorieSummary = ({ consumed, goal, remaining }) => {
  const percentage = goal > 0 ? (consumed / goal) * 100 : 0;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen del Día</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{consumed}</Text>
          <Text style={styles.statLabel}>Consumidas</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{goal}</Text>
          <Text style={styles.statLabel}>Meta</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: remaining > 0 ? '#4ECDC4' : '#FF6B6B' }]}>
            {remaining}
          </Text>
          <Text style={styles.statLabel}>Restantes</Text>
        </View>
      </View>
      
      <ProgressBar 
        current={consumed} 
        goal={goal} 
        style={styles.progressBar}
      />
      
      {percentage > 100 && (
        <Text style={styles.warningText}>
          ⚠️ Has excedido tu meta diaria en {Math.round(consumed - goal)} calorías
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  progressBar: {
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CalorieSummary;