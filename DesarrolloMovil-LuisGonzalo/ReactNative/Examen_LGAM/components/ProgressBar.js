import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getProgressColor } from '../utils/helpers';

const ProgressBar = ({ current, goal, style }) => {
  const percentage = goal > 0 ? (current / goal) * 100 : 0;
  const progressColor = getProgressColor(percentage);
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
          <LinearGradient
            colors={[progressColor, progressColor]}
            style={[
              styles.progressFill,
              { width: `${Math.min(percentage, 100)}%` }
            ]}
          />
        </View>
      </View>
      <Text style={styles.percentageText}>
        {percentage.toFixed(0)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  progressBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
});

export default ProgressBar;