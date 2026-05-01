import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
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
       <Button title="Register" onPress={handleRegister} />
     </View>
     <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>Sudah punya akun? Login</Text>
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
