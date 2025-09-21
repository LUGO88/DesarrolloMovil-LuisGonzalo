import {Dimensions, StyleSheet, View} from 'react-native';
import MapView from 'react-native-maps';

export default () => {
  return (
      <MapView style={styles.mapa}/>
  );
}

const styles = StyleSheet.create({
    mapa: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});