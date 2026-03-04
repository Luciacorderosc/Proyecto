// RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase'; // Asegúrate de que la ruta sea correcta
import { Alert } from 'react-native'; // Para mostrar errores de forma nativa

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {

        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }


        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) {
                Alert.alert('Error de Registro', error.message);
            } else {

                Alert.alert(
                    '¡Éxito!',
                    'Cuenta creada correctamente. Ya puedes iniciar sesión.'
                );
                router.push('/'); //
            }
        } catch (err) {
            Alert.alert('Error inesperado', 'No se pudo conectar con el servidor.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <TextInput placeholder="Nombre completo" style={styles.input} value={name} onChangeText={setName} />
            <TextInput placeholder="Correo electrónico" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput placeholder="Confirmar contraseña" style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
            <Text style={styles.loginLink} onPress={() => router.push('/')}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f2f2f7',
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#8A36D2',
    },
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
        fontSize: 16,
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
    register: {
        marginTop: 20,
        color: '#555',
        fontSize: 14,
        textAlign: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerLink: {
        color: '#8A36D2',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },

    loginLink: {
        marginTop: 20,
        color: 'grey',
        textAlign: 'center',
        fontSize: 16 },
});
