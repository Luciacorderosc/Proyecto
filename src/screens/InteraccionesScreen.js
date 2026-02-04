import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function InteraccionesScreen() {
    const { cronicoId, puntualId } = useLocalSearchParams();
    const [interacciones, setInteracciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!cronicoId || !puntualId) return;

        const cargarInteracciones = async () => {
            setLoading(true);
            setErrorMsg(null);

            try {
                const { data, error } = await supabase
                    .from('interacciones_medicamentos')
                    .select('nivel, descripcion')
                    .or(
                        `and(medicamento_a.eq.${cronicoId},medicamento_b.eq.${puntualId}),and(medicamento_a.eq.${puntualId},medicamento_b.eq.${cronicoId})`
                    );

                if (error) throw error;

                setInteracciones(data || []);
            } catch (err) {
                console.error('Error cargando interacciones:', err);
                setErrorMsg('Error al cargar las interacciones');
            } finally {
                setLoading(false);
            }
        };

        cargarInteracciones();
    }, [cronicoId, puntualId]);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

    if (errorMsg) return <Text style={styles.center}>{errorMsg}</Text>;

    if (!interacciones || interacciones.length === 0)
        return <Text style={styles.center}>No hay interacciones entre estos medicamentos</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Interacciones detectadas</Text>
            {interacciones.map((item, index) => (
                <View key={index} style={styles.item}>
                    <Text style={styles.nivel}>Nivel: {item.nivel}</Text>
                    <Text style={styles.descripcion}>{item.descripcion}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', fontSize: 16, color: '#555' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    item: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
    nivel: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    descripcion: { fontSize: 16, color: '#333' },
});
