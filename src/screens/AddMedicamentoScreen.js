import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function AddMedicamentoScreen() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState(null);


  useEffect(() => {

    const inicializarPantalla = async () => {
      try {

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }

        const { data, error } = await supabase
            .from('medicamentos')
            .select('id, nombre')
            .eq('tipo', 'cronico')
            .order('nombre', { ascending: true });

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          setMedicamentos(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    inicializarPantalla();
  }, []);

  const seleccionarMedicamento = async (medicamentoId) => {
    console.log("ID del usuario logueado:", userId);

    if (!userId) {
      Alert.alert("Error", "No se reconoce al usuario. Intenta reiniciar la app.");
      return;
    }

    const { error } = await supabase
        .from('usuario_medicamento')
        .insert({
          usuario_id: userId,
          medicamento_id: medicamentoId,
        });

    if (error) {
      Alert.alert('Error', error.message);
      console.log("DETALLE:", error.details);
    } else {
      Alert.alert('Añadido', 'Medicamento añadido correctamente');
      router.replace('/areaPersonal');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Añadir medicación crónica</Text>

        <FlatList
            data={medicamentos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => seleccionarMedicamento(item.id)}
                >
                  <Text style={styles.text}>• {item.nombre}</Text>
                  <Ionicons name="add-circle" size={25} color="#333" />
                </TouchableOpacity>
            )}
        />
      </View>


  );

}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  text: { fontSize: 16 },
});
