import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
 const { user, logout } = useAuth();

 return (
   <View style={styles.container}>
     <Text style={styles.text}>Welcome, {user?.email}</Text>
     <Button title="Logout" onPress={logout} />
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1, 
   justifyContent: 'center', 
   alignItems: 'center',
   padding: 20
 },
 text: {
   fontSize: 18,
   marginBottom: 20
 }
});
