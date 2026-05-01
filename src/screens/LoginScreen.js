import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Simpan kredensial secara aman untuk fitur biometrik nanti
      await SecureStore.setItemAsync('saved_email', email);
      await SecureStore.setItemAsync('saved_password', password);
    } catch (e) {
      Alert.alert('Login gagal', e.message);
    }
  };

  const handleBiometric = async () => {
    // Ambil kredensial yang tersimpan dari login sebelumnya
    const savedEmail = await SecureStore.getItemAsync('saved_email');
    const savedPassword = await SecureStore.getItemAsync('saved_password');
    
    if (!savedEmail || !savedPassword) {
      Alert.alert('Belum ada data', 'Silakan login dulu dengan email & password untuk mengaktifkan biometrik.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login dengan biometric',
      fallbackLabel: 'Gunakan password',
    });

    if (result.success) {
      try {
        // Lakukan login ke Firebase secara otomatis di latar belakang
        await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
        Alert.alert('Berhasil', 'Welcome back!');
      } catch (e) {
        Alert.alert('Sesi Kadaluarsa', 'Password mungkin telah diubah. Silakan login manual.');
      }
    } else {
      Alert.alert('Gagal', 'Biometric tidak cocok atau dibatalkan.');
    }
  };

 return (
   <View style={{ padding: 20 }}>
     <TextInput 
       placeholder="Email" 
       value={email} 
       onChangeText={setEmail}
       autoCapitalize="none" 
       style={styles.input}
     />
     <TextInput 
       placeholder="Password" 
       value={password} 
       onChangeText={setPassword}
       secureTextEntry 
       style={styles.input}
     />
     <View style={styles.buttonContainer}>
       <Button title="Login" onPress={handleLogin} />
     </View>
     <View style={styles.buttonContainer}>
       <Button title="Login dengan Biometric" onPress={handleBiometric} />
     </View>
     <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>Belum punya akun? Daftar</Text>
     <Text style={styles.linkText} onPress={() => navigation.navigate('ForgotPassword')}>Lupa password?</Text>
   </View>
 );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginVertical: 5,
  },
  linkText: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
  }
});
