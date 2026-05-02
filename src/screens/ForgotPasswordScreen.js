import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ForgotPasswordScreen({ navigation }) {
 const [email, setEmail] = useState('');

 const handleReset = async () => {
   try {
     await sendPasswordResetEmail(auth, email);
     Alert.alert('Sukses', 'Email reset password telah dikirim');
     navigation.navigate('Login');
   } catch (e) {
     Alert.alert('Gagal', e.message);
   }
 };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Password</Text>
      <TextInput 
        placeholder="Email" 
        placeholderTextColor="#666"
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none" 
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
