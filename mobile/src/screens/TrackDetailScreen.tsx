import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { catalogApi } from '../services/catalog';
import type { Trilha } from '../types/catalog';
import { styles } from '../styles/CatalogStyles';
type Props = NativeStackScreenProps<RootStackParamList, 'TrackDetail'>;
export function TrackDetailScreen({ navigation, route }: Props) {
  const { token } = useAuth();
  const [item, setItem] = useState<Trilha | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    if (!token) return;
    setLoading(true);
    catalogApi.trilha(token, route.params.id).then(data => { if (active) setItem(data); }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'Falha ao carregar trilha.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, route.params.id]);
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error || !item) return <View style={styles.center}><Text style={styles.error}>{error || 'Trilha não encontrada.'}</Text></View>;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.title}>{item.Titulo}</Text><Text style={styles.meta}>{item.categoria?.Nome ?? 'Trilha'} · {item.cursos.length} curso(s)</Text>
    <Text style={styles.subtitle}>{item.Descricao || 'Sem descrição.'}</Text><Text style={styles.section}>Cursos desta trilha</Text>
    {item.cursos.length === 0 ? <Text style={styles.empty}>Esta trilha ainda não possui cursos.</Text> : [...item.cursos].sort((a,b) => a.Ordem-b.Ordem).map(link => <TouchableOpacity key={link.ID_Curso} style={styles.card} onPress={() => navigation.navigate('CourseDetail', { id: link.ID_Curso })} accessibilityRole="button"><Text style={styles.cardTitle}>{link.Ordem}. {link.curso.Titulo}</Text><Text style={styles.body} numberOfLines={3}>{link.curso.Descricao || 'Sem descrição.'}</Text><Text style={styles.action}>Ver curso</Text></TouchableOpacity>)}
  </ScrollView>;
}
