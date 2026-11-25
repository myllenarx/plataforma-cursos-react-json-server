import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { billingApi } from '../services/billing';
import type { Assinatura, Pagamento } from '../types/billing';
import { styles } from '../styles/BillingStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;
const methods: Pagamento['MetodoPagamento'][] = ['PIX', 'CARTAO', 'BOLETO'];
export function PaymentScreen({ navigation, route }: Props) {
  const { token } = useAuth();
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [metodo, setMetodo] = useState<Pagamento['MetodoPagamento']>('PIX');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useFocusEffect(useCallback(() => {
    let mounted = true;
    if (token) billingApi.assinaturas(token).then(items => {
      if (mounted) { const item = items.find(a => a.ID_Assinatura === route.params.assinaturaId); setAssinatura(item ?? null); }
    }).catch(e => { if (mounted) setError(e instanceof Error ? e.message : 'Erro ao consultar assinatura.'); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [token, route.params.assinaturaId]));
  async function pagar() {
    if (!token || !assinatura || busy) return;
    if (assinatura.pagamentos?.length) { Alert.alert('Pagamento já registrado', 'Esta assinatura já possui um pagamento.'); return; }
    Alert.alert('Confirmar simulação', `Registrar pagamento simulado via ${metodo}? Nenhum valor real será cobrado.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Registrar', onPress: async () => {
        setBusy(true);
        try {
          await billingApi.registrarPagamento(token, assinatura, metodo);
          Alert.alert('Pagamento registrado', 'O pagamento simulado foi salvo na plataforma.', [{ text: 'Ver histórico', onPress: () => navigation.replace('MySubscriptions') }]);
        } catch (e) { Alert.alert('Erro ao registrar', e instanceof Error ? e.message : 'Tente novamente.'); }
        finally { setBusy(false); }
      } },
    ]);
  }
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.title}>Pagamento simulado</Text>
    <Text style={styles.description}>Ambiente acadêmico: esta operação registra uma transação no banco de dados, sem gateway real, PIX real ou cobrança financeira.</Text>
    {loading ? <ActivityIndicator /> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {!loading && !assinatura ? <Text style={styles.empty}>Assinatura não encontrada.</Text> : null}
    {assinatura ? <View style={styles.card}>
      <Text style={styles.heading}>{assinatura.plano?.Nome ?? 'Plano'}</Text>
      <Text style={styles.price}>{Number(assinatura.plano?.Preco ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
      <Text style={styles.detail}>Assinatura #{assinatura.ID_Assinatura}</Text>
      {assinatura.pagamentos?.length ? <Text style={styles.detail}>Esta assinatura já possui pagamento registrado.</Text> : <>
        <Text style={styles.heading}>Método de pagamento</Text>
        <View style={styles.methodRow}>{methods.map(m => <TouchableOpacity key={m} style={[styles.method, metodo === m && styles.methodSelected]} onPress={() => setMetodo(m)}><Text style={styles.methodText}>{m === 'CARTAO' ? 'Cartão' : m === 'BOLETO' ? 'Boleto' : 'PIX'}</Text></TouchableOpacity>)}</View>
        <TouchableOpacity style={styles.button} disabled={busy} onPress={pagar}><Text style={styles.buttonText}>Confirmar pagamento simulado</Text></TouchableOpacity>
      </>}
    </View> : null}
    {busy && <ActivityIndicator />}
  </ScrollView>;
}
