import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function ProfileScreen({ navigation }) {
  const [locationInfo, setLocationInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUserLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
        setIsLoading(false);
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      setLocationInfo({
        coords: location.coords,
        address: address[0] || null,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Información de Usuario</Text>
        <Text style={styles.infoText}>Nombre: Usuario Demo</Text>
        <Text style={styles.infoText}>Email: demo@ejemplo.com</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Ubicación Actual</Text>
        {locationInfo ? (
          <>
            <Text style={styles.infoText}>
              Latitud: {locationInfo.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Longitud: {locationInfo.coords.longitude.toFixed(6)}
            </Text>
            {locationInfo.address && (
              <>
                <Text style={styles.infoText}>
                  Ciudad: {locationInfo.address.city || 'No disponible'}
                </Text>
                <Text style={styles.infoText}>
                  País: {locationInfo.address.country || 'No disponible'}
                </Text>
              </>
            )}
          </>
        ) : (
          <Text style={styles.infoText}>
            {isLoading ? 'Obteniendo ubicación...' : 'Ubicación no disponible'}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={getUserLocation}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Cargando...' : 'Actualizar Ubicación'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
