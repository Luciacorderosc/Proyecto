import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Button,
    Modal,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function AreaPersonalScreen() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);

    const [medicacion, setMedicacion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalPuntualesVisible, setModalPuntualesVisible] = useState(false);
    const [listaPuntuales, setListaPuntuales] = useState([]);
    const [cronicoSeleccionado, setCronicoSeleccionado] = useState(null);

    useEffect(() => {
        const inicializar = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                cargarMedicacion(user.id);
            } else {
                router.replace('/');
            }
        };
        inicializar();
    }, []);

    const cargarMedicacion = async (idForzado) => {

        const idAUsar = idForzado || userId;

        if (!idAUsar) {
            console.log("Esperando ID de usuario...");
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('usuario_medicamento')
            .select(`
            id,
            medicamento_id,
            medicamentos (id, nombre)
        `)
            .eq('usuario_id', idAUsar);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            setMedicacion(data);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/');
    };

    const borrarMedicacion = async (usuarioMedicamentoId) => {
        const { error, count } = await supabase
            .from('usuario_medicamento')
            .delete({ count: 'exact' }) // Pedimos que nos cuente cuántas filas borró
            .eq('id', usuarioMedicamentoId);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            console.log("Filas borradas:", count);
            Alert.alert('Eliminado', 'Medicamento eliminado correctamente');
            // Usamos directamente el ID que tenemos guardado
            cargarMedicacion(userId);
        }
    };

    const abrirPuntualesModal = async (cronicoId) => {
        setCronicoSeleccionado(cronicoId);
        setModalPuntualesVisible(true);

        const { data, error } = await supabase
            .from('medicamentos')
            .select('id, nombre')
            .eq('tipo', 'puntual');

        if (error) {
            Alert.alert('Error', error.message);
            return;
        }


        const uniqueData = data.filter(
            (v, i, a) => a.findIndex(t => t.id === v.id) === i
        );

        setListaPuntuales(uniqueData);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Área Personal</Text>
            <Text style={styles.welcome}>Bienvenido a tu área personal</Text>

            <Text style={styles.sectionTitle}>Mi medicación crónica</Text>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : medicacion.length === 0 ? (
                <Text>No tienes medicación añadida</Text>
            ) : (
                medicacion.map((item) => (
                    <View key={item.id} style={styles.medicamentoRow}>
                        <Text style={styles.medicamento} numberOfLines={1} ellipsizeMode="tail">• {item.medicamentos.nombre}</Text>

                        <View style={styles.buttonsRow}>
                            <TouchableOpacity
                                onPress={() => borrarMedicacion(item.id)}
                                style={styles.deleteButton}
                            >
                                <Ionicons name="trash" size={25} color="#e74c3c" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => abrirPuntualesModal(item.medicamento_id)}
                                style={styles.puntualesButton}
                            >
                                <Ionicons name="list" size={25} color="#3498db" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}

            <Button title="Cerrar Sesión" onPress={handleLogout} color="#e74c3c" />


            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => router.push('/areaPersonal')}>
                    <Ionicons name="home" size={30} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/addMedicamento')}>
                    <Ionicons name="add-circle" size={30} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/calendar')}>
                    <Ionicons name="calendar" size={30} color="#333" />
                </TouchableOpacity>

            </View>


            <Modal
                visible={modalPuntualesVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalPuntualesVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona la medicación puntual</Text>
                        <ScrollView style={{ marginVertical: 10 }}>
                            {listaPuntuales.length > 0 ? (
                                listaPuntuales.map((p) => (
                                    <TouchableOpacity
                                        key={p.id}
                                        onPress={() => {
                                            setModalPuntualesVisible(false);
                                            router.push({
                                                pathname: '/interacciones',
                                                params: {
                                                    cronicoId: cronicoSeleccionado,
                                                    puntualId: p.id,
                                                },
                                            });
                                        }}
                                        style={styles.puntualItem}
                                    >
                                        <Text style={{ fontSize: 16 }}>• {p.nombre}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>No hay medicamentos puntuales</Text>
                            )}
                        </ScrollView>
                        <Button title="Cerrar" onPress={() => setModalPuntualesVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA' // Fondo gris clarito moderno
    },
    // Añade esta propiedad al View principal o usa un ScrollView
    scrollContainer: {
        padding: 20,
        paddingBottom: 120,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 5,
        textAlign: 'center',
        color: '#2C3E50'
    },
    welcome: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 25,
        color: '#7F8C8D'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#34495E',
        paddingHorizontal: 20
    },
    // Tarjetas de la lista principal
    medicamentoRow: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        marginHorizontal: 20,
        // Sombras
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    medicamento: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        flex:1,
        flexShrink:1,
        marginRight:12,
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    // Estilos de los botoncitos del MODAL
    puntualItem: {
        backgroundColor: '#EBF5FB',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#AED6F1',
    },
    puntualText: {
        fontSize: 16,
        color: '#2E86C1',
        fontWeight: '600',
    },
    // Barra de navegación corregida
    bottomBar: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        height: 65,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        maxHeight: '70%'
    },
    modalTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#2C3E50'
    },
});
