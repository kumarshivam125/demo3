import React, { useState } from 'react';
import axios from "axios";
import Toast from 'react-native-toast-message';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

export default function Signup({ navigation }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value, }));
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        console.log("SIGNUP handler called");
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const { data } = await axios.post('http://10.190.129.33:4000/signup', { ...formData, role: 'user' });
            console.log("SIGNUP Response--", data);
            if (data.success) {
                Toast.show({ type: 'success', text1: 'Account Created Successfully', });
                //Navigating the user to LOGIN as if the user is sent to home page then
                //on home page we are using UPDATE-CART function in that we are using token 
                //but we dont have token after SIGNUP and we are not generating token in SIGNUP 
                navigation.navigate("Login");
            }
            else
                Alert.alert("Error-", data.message)
        }
        catch (err) {
            console.log("Error in account Creation", err)
        }


        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        autoComplete="name"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        secureTextEntry
                        autoComplete="password-new"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleInputChange('confirmPassword', value)}
                        secureTextEntry
                        autoComplete="password-new"
                    />

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>
                            Already have an account? Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            {/* </ScrollView> */}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
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
