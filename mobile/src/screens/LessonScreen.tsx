import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { catalogApi } from '../services/catalog';
import { enrollmentApi } from '../services/enrollment';
import type { Aula } from '../types/catalog';
import { styles } from '../styles/CatalogStyles';
type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;
export function LessonScreen({ route }: Props) {
  const { token } = useAuth();
  const [item, setItem] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    if (!token) return;
    setLoading(true);
    Promise.all([catalogApi.curso(token, route.params.courseId), enrollmentApi.minhas(token)]).then(([curso, matriculas]) => {
      if (!matriculas.some(m => m.ID_Curso === route.params.courseId)) throw new Error('Você precisa se matricular neste curso para acessar a aula.');
      if (!active) return;
      const lesson = curso?.modulos.flatMap(modulo => modulo.aulas).find(aula => aula.ID_Aula === route.params.lessonId);
      if (!lesson) throw new Error('Aula não encontrada.');
      setItem(lesson);
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'Falha ao carregar aula.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, route.params.courseId, route.params.lessonId]);
  async function openContent(url: string) {
    try {
      const allowed = /^https?:\/\//i.test(url);
      if (!allowed) { setError('O endereço do conteúdo não é um link HTTP/HTTPS válido.'); return; }
      await Linking.openURL(url);
    } catch { setError('Não foi possível abrir o conteúdo desta aula.'); }
  }
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error && !item) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  if (!item) return null;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.title}>{item.Titulo}</Text><Text style={styles.meta}>Tipo: {item.TipoConteudo}</Text>
    <Text style={styles.subtitle}>{item.DuracaoMinutos ? `Duração: ${item.DuracaoMinutos} minutos` : 'Duração não informada'}</Text>
    <View style={styles.card}><Text style={styles.cardTitle}>Conteúdo da aula</Text>
      {item.URL_Conteudo ? /^https?:\/\//i.test(item.URL_Conteudo) ? <TouchableOpacity style={styles.button} onPress={() => void openContent(item.URL_Conteudo!)} accessibilityRole="button"><Text style={styles.buttonText}>Abrir conteúdo</Text></TouchableOpacity> : <Text style={styles.body}>{item.URL_Conteudo}</Text> : <Text style={styles.body}>O conteúdo desta aula ainda não foi disponibilizado.</Text>}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
    <Text style={styles.body}>Acesso permitido para alunos matriculados neste curso.</Text>
  </ScrollView>;
}
