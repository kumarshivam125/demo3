import { Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { sign } from 'react-native-pure-jwt';
import axios from "axios";
import Toast from 'react-native-toast-message';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const handleInputChange = (field, value) => {
    // console.log("Field-", field, "Value-", value)
    setFormData(prev => ({ ...prev, [field]: value, }));
  };
  async function signupHandler() {
    try{
      console.log("APi call started--")
      const {data}=await axios.post('http://10.190.129.33:4000/signup', { ...formData, role: 'Admin' });
      console.log("SIGNUP Response--", data);
      if(data.success){
        Toast.show({ type: 'success', text1: 'Admin Created Successfully', });
        setFormData({
          name: '',
          email: '',
          password: '',
        });
      }
      else{
        Toast.show({ type: 'error', text1: data.message, });
      }
    }
    catch(err){
      console.log("Error in Signup", err)
    }
    console.log("Form Data-", formData)
  }
  return (
    <View style={{ marginTop: 30 }}>
      <Text style={styles.title}>Create Admin</Text>
      <View style={{ paddingHorizontal: 20 }}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          keyboardType="password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={signupHandler}>
          <Text style={styles.buttonText}>Create Admin</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default AddAdmin

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});