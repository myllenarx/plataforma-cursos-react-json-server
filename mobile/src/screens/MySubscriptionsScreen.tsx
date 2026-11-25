import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { billingApi } from '../services/billing';
import type { Assinatura, Pagamento } from '../types/billing';
import { styles } from '../styles/BillingStyles';
type Props = NativeStackScreenProps<RootStackParamList, 'MySubscriptions'>;
export function MySubscriptionsScreen({ navigation }: Props) {
  const { token } = useAuth();
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const carregar = useCallback(async () => {
    if (!token) return;
    try { setError(''); const [a, p] = await Promise.all([billingApi.assinaturas(token), billingApi.pagamentos(token)]); setAssinaturas(a); setPagamentos(p); }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao carregar histórico.'); }
    finally { setLoading(false); }
  }, [token]);
  useFocusEffect(useCallback(() => { setLoading(true); void carregar(); }, [carregar]));
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}>
    <Text style={styles.title}>Minhas assinaturas</Text>
    <Text style={styles.description}>Histórico associado à sua conta na plataforma.</Text>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {!loading && !assinaturas.length ? <Text style={styles.empty}>Você ainda não possui assinaturas.</Text> : null}
    {assinaturas.map(a => {
      const pagos = pagamentos.filter(p => p.ID_Assinatura === a.ID_Assinatura);
      return <View style={styles.card} key={a.ID_Assinatura}>
        <Text style={styles.heading}>{a.plano?.Nome ?? `Plano #${a.ID_Plano}`}</Text>
        <Text style={styles.detail}>Início: {new Date(a.DataInicio).toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.detail}>Fim: {new Date(a.DataFim).toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.detail}>{pagos.length ? `${pagos.length} pagamento(s) registrado(s)` : 'Nenhum pagamento registrado'}</Text>
        {pagos.map(p => <Text style={styles.detail} key={p.ID_Pagamento}>{p.MetodoPagamento} · {Number(p.ValorPago).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} · {new Date(p.DataPagamento).toLocaleDateString('pt-BR')}</Text>)}
        {!pagos.length && <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment', { assinaturaId: a.ID_Assinatura })}><Text style={styles.buttonText}>Registrar pagamento simulado</Text></TouchableOpacity>}
      </View>;
    })}
    <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('Plans')}><Text style={styles.secondaryText}>Ver planos disponíveis</Text></TouchableOpacity>
  </ScrollView>;
}
