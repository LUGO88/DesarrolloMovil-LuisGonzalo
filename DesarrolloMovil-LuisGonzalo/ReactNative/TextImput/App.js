import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Dimensions } from 'react-native';
import React, {useState} from 'react';

export default function App() {

  const [usuario, setUsuario]=useState()
  const [contraseña, setContraseña]=useState()
  const [usuarioEnviado, setUsuarioEnviado]=useState()
  const [contraseñaEnviada, setContraseñaEnviada]=useState()
  
  // Credenciales por defecto
  const USUARIO_CORRECTO = "Admin"
  const CONTRASEÑA_CORRECTA = "12345"
  
  const validarLogin = () => {
    if (usuario === USUARIO_CORRECTO && contraseña === CONTRASEÑA_CORRECTA) {
      setUsuarioEnviado(usuario)
      setContraseñaEnviada(contraseña)
      alert('Login exitoso')
    } else {
      alert('Usuario o Contraseña incorrectos, Intente nuevamente.')
    }
  }
  
  return (
    <View style={styles.container}>
      
      
      <TextInput 
        style={styles.input}
        placeholder='Usuario'
        defaultValue={usuario}
        onChangeText={t=>setUsuario(t)}/>
        <TextInput 
        style={styles.input}
        placeholder='Contraseña'
        defaultValue={contraseña}
        onChangeText={t=>setContraseña(t)}/>
      <Button title='Enviar'
        onPress={validarLogin}/>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    width:'100%',
    height:40,
    backgroundColor:'#eee',
  },
  scrollview:{
    width:Dimensions.get('window').width
  },
});