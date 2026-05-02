import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleBiometric}>
        <Text style={[styles.buttonText, styles.outlineButtonText]}>Login dengan Biometric</Text>
      </TouchableOpacity>

      <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>Belum punya akun? Daftar</Text>
      <Text style={styles.linkText} onPress={() => navigation.navigate('ForgotPassword')}>Lupa password?</Text>
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
  outlineButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  outlineButtonText: {
    color: '#000000',
  },
  linkText: {
    marginTop: 15,
    color: '#000000',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});
