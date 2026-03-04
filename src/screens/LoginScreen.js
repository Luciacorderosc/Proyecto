
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Atención', 'Los campos son obligatorios');
            return;
        }

        try {

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {

                Alert.alert('Error de acceso', error.message);
            } else {

                router.replace('/areaPersonal');
            }
        } catch (err) {
            Alert.alert('Error', 'Ocurrió un problema inesperado');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LumiPharma</Text>
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#666"/>
            <TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword}  placeholderTextColor="#666" secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <Text style={styles.register} onPress={() => router.push('/register')}>
                Aun no tienes una cuenta? Registrate gratis!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f2f2f7' },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#8A36D2'},

    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#8A36D2',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    register: {
        marginTop: 20,
        color: '#555',
        fontSize: 14,
    },
    registerLink: {
        color: '#6C63FF',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});
