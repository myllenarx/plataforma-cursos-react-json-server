import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { catalogApi } from '../services/catalog';
import type { Curso } from '../types/catalog';
import { styles } from '../styles/CatalogStyles';
type Props = NativeStackScreenProps<RootStackParamList, 'Courses'>;
export function CoursesScreen({ navigation }: Props) {
  const { token } = useAuth();
  const [items, setItems] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const load = useCallback(async (refresh = false) => {
    if (!token) return;
    if (refresh) setRefreshing(true); else setLoading(true);
    setError('');
    try { setItems(await catalogApi.cursos(token)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível carregar os cursos.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, [token]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  return <FlatList style={styles.screen} contentContainerStyle={styles.content} data={items} keyExtractor={item => String(item.ID_Curso)}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />}
    ListHeaderComponent={<><Text style={styles.title}>Cursos disponíveis</Text><Text style={styles.subtitle}>Conheça os cursos cadastrados na plataforma.</Text>{error ? <Text style={styles.error}>{error}</Text> : null}</>}
    ListEmptyComponent={<Text style={styles.empty}>{error ? 'Puxe para baixo para tentar novamente.' : 'Nenhum curso cadastrado.'}</Text>}
    renderItem={({ item }) => <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CourseDetail', { id: item.ID_Curso })} accessibilityRole="button"><Text style={styles.cardTitle}>{item.Titulo}</Text><Text style={styles.meta}>{item.categoria?.Nome ?? 'Curso'} · {item.Nivel}</Text><Text style={styles.body} numberOfLines={3}>{item.Descricao || 'Sem descrição.'}</Text><Text style={styles.action}>Ver curso e aulas</Text></TouchableOpacity>}
  />;
}
