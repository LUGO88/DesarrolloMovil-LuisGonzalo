import {Modal, View, StyleSheet, Text} from 'react-native';


export default () => {
  return (
      <Modal 
        animationType="slide"
        transparent={true}
        visible={true} >
          <View style = {styles.center}>
            <View style={styles.modalView}>
              <Text>Hola</Text>
            </View>
          </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
});