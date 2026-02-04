import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function AddMedicamentoPuntualScreen() {
    const router = useRouter();
    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarMedicamentos();
    }, []);

    const cargarMedicamentos = async () => {
        const { data, error } = await supabase
            .from('medicamentos')
            .select('id, nombre')
            .eq('tipo', 'puntual');

        if (error) {
            console.error(error);
        } else {
            setMedicamentos(data);
        }
        setLoading(false);
    };

    const seleccionarMedicamento = (medicamentoId, nombre) => {
        router.push({
            pathname: '/interacciones',
            params: { medicamentoId, nombre },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Medicación puntual</Text>

            {loading ? (
                <Text>Cargando...</Text>
            ) : (
                medicamentos.map((m) => (
                    <TouchableOpacity
                        key={m.id}
                        style={styles.card}
                        onPress={() => seleccionarMedicamento(m.id, m.nombre)}
                    >
                        <Text style={styles.nombre}>{m.nombre}</Text>
                    </TouchableOpacity>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginBottom: 10,
    },
    nombre: {
        fontSize: 16,
    },
});
