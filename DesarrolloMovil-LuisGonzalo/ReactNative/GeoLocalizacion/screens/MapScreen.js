import React, {useEffect, useState} from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);

  const buscaLocation = async () => {
    const {status} = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted'){
      return Alert.alert('Permiso denegado')
    }
    const location = await Location.getCurrentPositionAsync({})
    console.log(location)
    setLocation(location.coords)
  }
  
  useEffect(() => {
    buscaLocation()
  }, [])

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.mapa}
        initialRegion={{
          latitude: location ? location.latitude : 23.752388,
          longitude: location ? location.longitude : -99.142277,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: location ? location.latitude : 23.752388, 
            longitude: location ? location.longitude : -99.142277
          }}
          title={location ? 'Tu ubicación' : 'El Estarbocks'}
          description={location ? 'Aquí estás' : 'Aqui se vende cafe'}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapa:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
