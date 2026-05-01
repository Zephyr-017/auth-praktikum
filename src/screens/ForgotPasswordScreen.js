import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
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
   <View style={{ padding: 20 }}>
     <TextInput 
       placeholder="Email" 
       value={email} 
       onChangeText={setEmail}
       autoCapitalize="none" 
       style={styles.input}
     />
     <View style={styles.buttonContainer}>
       <Button title="Reset Password" onPress={handleReset} />
     </View>
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
  }
});
