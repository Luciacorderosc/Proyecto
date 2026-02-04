import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
    const router = useRouter();

    const abrirCalendario = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('calshow://');
        } else {
            Linking.openURL('content://com.android.calendar/time/');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calendario</Text>

            <Text style={styles.text}>
                Abre el calendario del dispositivo para gestionar tus recordatorios.
            </Text>

            <TouchableOpacity style={styles.button} onPress={abrirCalendario}>
                <Ionicons name="calendar" size={26} color="#fff" />
                <Text style={styles.buttonText}>Abrir calendario del móvil</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.back}>← Volver</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#555',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    back: {
        textAlign: 'center',
        color: '#3498db',
        fontSize: 16,
    },
});
