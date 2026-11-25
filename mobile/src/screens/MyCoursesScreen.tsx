import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { enrollmentApi } from '../services/enrollment';
import type { Matricula } from '../types/enrollment';
import { styles } from '../styles/CatalogStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'MyCourses'>;
export function MyCoursesScreen({ navigation }: Props) {
  const { token } = useAuth();
  const [items, setItems] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const load = useCallback(async (refresh = false) => {
    if (!token) return;
    if (refresh) setRefreshing(true); else setLoading(true);
    setError('');
    try { setItems(await enrollmentApi.minhas(token)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível carregar suas matrículas.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, [token]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  return <FlatList style={styles.screen} contentContainerStyle={styles.content} data={items}
    keyExtractor={item => String(item.ID_Matricula)}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />}
    ListHeaderComponent={<><Text style={styles.title}>Meus cursos</Text><Text style={styles.subtitle}>Cursos em que sua conta está matriculada.</Text>{error ? <Text style={styles.error}>{error}</Text> : null}</>}
    ListEmptyComponent={<><Text style={styles.empty}>{error ? 'Puxe para baixo para tentar novamente.' : 'Você ainda não possui matrículas.'}</Text>{!error ? <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Courses')} accessibilityRole="button"><Text style={styles.buttonText}>Explorar cursos</Text></TouchableOpacity> : null}</>}
    renderItem={({ item }) => <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CourseDetail', { id: item.ID_Curso })} accessibilityRole="button"><Text style={styles.cardTitle}>{item.curso?.Titulo ?? `Curso ${item.ID_Curso}`}</Text><Text style={styles.meta}>Matriculado em {new Date(item.DataMatricula).toLocaleDateString('pt-BR')}</Text><Text style={styles.action}>Acessar curso</Text></TouchableOpacity>}
  />;
}
