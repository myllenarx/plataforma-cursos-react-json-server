import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { enrollmentApi } from '../services/enrollment';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { catalogApi } from '../services/catalog';
import type { Curso } from '../types/catalog';
import { styles } from '../styles/CatalogStyles';
import { billingApi } from '../services/billing';
import { usuarioIdDoToken } from '../services/enrollment';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;
export function CourseDetailScreen({ navigation, route }: Props) {
  const { token } = useAuth();
  const [item, setItem] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    setEnrollmentError('');
    try {
      const [curso, matriculas] = await Promise.all([
        catalogApi.curso(token, route.params.id),
        enrollmentApi.minhas(token),
      ]);
      if (!curso) throw new Error('Curso não encontrado.');
      setItem(curso);
      setEnrolled(matriculas.some(m => m.ID_Curso === route.params.id));
    } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao carregar curso.'); }
    finally { setLoading(false); }
  }, [token, route.params.id]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  
async function matricular() {
  if (!token || !item || busy || enrolled) return;

  setBusy(true);
  setEnrollmentError('');

  try {
    const assinaturas = await billingApi.assinaturas(token);
    const usuarioId = usuarioIdDoToken(token);
    const agora = Date.now();

    const vigentes = assinaturas.filter(assinatura =>
      assinatura.ID_Usuario === usuarioId &&
      new Date(assinatura.DataInicio).getTime() <= agora &&
      new Date(assinatura.DataFim).getTime() >= agora
    );

    const possuiPlanoPago = vigentes.some(assinatura =>
      assinatura.pagamentos.some(pagamento =>
        Number(pagamento.ValorPago) >=
        Number(assinatura.plano.Preco)
      )
    );

    if (!possuiPlanoPago) {
      const pendente = vigentes.find(
        assinatura => assinatura.pagamentos.length === 0
      );

      if (pendente) {
        Alert.alert(
          'Pagamento necessário',
          'Realize o pagamento da sua assinatura para acessar os cursos.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Pagar',
              onPress: () =>
                navigation.navigate('Payment', {
                  assinaturaId: pendente.ID_Assinatura,
                }),
            },
          ],
        );
      } else if (vigentes.length > 0) {
        Alert.alert(
          'Pagamento insuficiente',
          'Sua assinatura possui um pagamento que não cobre o valor do plano. Verifique suas assinaturas.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Ver assinaturas',
              onPress: () =>
                navigation.navigate('MySubscriptions'),
            },
          ],
        );
      } else {
        Alert.alert(
          'Assinatura necessária',
          'Contrate um plano para realizar a matrícula e acessar os cursos.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Ver planos',
              onPress: () => navigation.navigate('Plans'),
            },
          ],
        );
      }

      return;
    }

    await enrollmentApi.matricular(token, item.ID_Curso);

    setEnrolled(true);

    Alert.alert(
      'Matrícula realizada',
      'O curso já está disponível em Meus cursos.',
    );

  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : 'Não foi possível realizar a matrícula.';

    if (/já está matriculado/i.test(message)) {
      setEnrolled(true);

      Alert.alert(
        'Matrícula existente',
        'Este curso já está na sua lista.',
      );
    } else {
      setEnrollmentError(message);
    }
  } finally {
    setBusy(false);
  }
}

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error || !item) return <View style={styles.center}><Text style={styles.error}>{error || 'Curso não encontrado.'}</Text></View>;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.title}>{item.Titulo}</Text>
    <Text style={styles.meta}>{item.categoria?.Nome ?? 'Curso'} · {item.Nivel}</Text>
    <Text style={styles.subtitle}>{item.Descricao || 'Sem descrição.'}</Text>
    <View style={styles.card}><Text style={styles.cardTitle}>Informações</Text><Text style={styles.body}>Instrutor: {item.instrutor?.name ?? 'Não informado'}</Text><Text style={styles.body}>Carga horária: {String(item.TotalHoras)} h</Text><Text style={styles.body}>Total de aulas: {item.TotalAulas}</Text></View>
    {enrolled ? <View style={styles.card}><Text style={styles.meta}>Você já está matriculado neste curso.</Text><TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('MyCourses')} accessibilityRole="button"><Text style={styles.secondaryText}>Ver meus cursos</Text></TouchableOpacity></View> : <TouchableOpacity style={styles.button} onPress={() => void matricular()} disabled={busy} accessibilityRole="button">{busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Matricular-se neste curso</Text>}</TouchableOpacity>}
    {enrollmentError ? <Text style={styles.error}>{enrollmentError}</Text> : null}
    <Text style={styles.section}>Módulos e aulas</Text>
    {item.modulos.length === 0 ? <Text style={styles.empty}>Este curso ainda não possui módulos.</Text> : [...item.modulos].sort((a,b) => a.Ordem-b.Ordem).map(modulo => <View key={modulo.ID_Modulo} style={styles.card}>
      <Text style={styles.cardTitle}>{modulo.Ordem}. {modulo.Titulo}</Text>
      {modulo.aulas.length === 0 ? <Text style={styles.body}>Nenhuma aula cadastrada.</Text> : [...modulo.aulas].sort((a,b) => a.Ordem-b.Ordem).map(aula => <TouchableOpacity key={aula.ID_Aula} style={styles.lesson} onPress={() => enrolled ? navigation.navigate('Lesson', { courseId: item.ID_Curso, lessonId: aula.ID_Aula }) : Alert.alert('Matrícula necessária', 'Matricule-se neste curso para acessar as aulas.')} accessibilityRole="button"><Text style={styles.cardTitle}>{aula.Ordem}. {aula.Titulo}</Text><Text style={styles.meta}>{aula.TipoConteudo}{aula.DuracaoMinutos ? ` · ${aula.DuracaoMinutos} min` : ''}</Text><Text style={styles.action}>{enrolled ? 'Ver detalhes da aula' : 'Matricule-se para acessar'}</Text></TouchableOpacity>)}
    </View>)}
  </ScrollView>;
}
