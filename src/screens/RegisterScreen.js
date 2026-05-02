import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleRegister = async () => {
   try {
     const cred = await createUserWithEmailAndPassword(auth, email, password);
     await sendEmailVerification(cred.user);
     
     // Sign out user immediately so they don't auto-login before verifying email
     await signOut(auth);
     
     Alert.alert('Sukses', 'Cek email Anda untuk verifikasi.');
   } catch (e) {
     Alert.alert('Gagal', e.message);
   }
 };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput 
        placeholder="Email" 
        placeholderTextColor="#666"
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none" 
        style={styles.input}
      />
      <TextInput 
        placeholder="Password" 
        placeholderTextColor="#666"
        value={password} 
        onChangeText={setPassword}
        secureTextEntry 
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>Sudah punya akun? Login</Text>
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
  },
  linkText: {
    marginTop: 15,
    color: '#000000',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});
