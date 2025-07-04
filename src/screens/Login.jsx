import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export default function Login({ navigation,setIsAuthenticated,setIsAdmin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setIsLoading(true);
        try {
            console.log("LOGI API ___")
            // const { data } = await axios.post('http://10.190.129.33:4000/login', { email, password });
            const { data } = await axios.post('http://10.190.129.33:4000/login', { email, password });
            console.log("LOGI API ___22")
            console.log("LOGIN Response--", data);
            if (data.success) {
                await AsyncStorage.setItem('userData', JSON.stringify({ ...data.user, docId: data.docId }));
                await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
                if(data.user?.role=='Admin'){
                    setIsAuthenticated(false) ;
                    setIsAdmin(true)
                }
                else{
                    setIsAuthenticated(true);
                    setIsAdmin(false);
                }
            }
            else
                Alert.alert("Error-", data.message)
        }
        catch (err) {
            console.log("Error in Login", err)
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    // keyboardType="email-address"
                    // autoCapitalize="none"
                    // autoComplete="email"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                />

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.linkText}>
                        Don't have an account? Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 48,
        color: '#6b7280',
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
        marginTop: 16,
        marginBottom: 24,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        paddingVertical: 12,
    },
    linkText: {
        color: '#6366f1',
        textAlign: 'center',
        fontSize: 16,
    },
});