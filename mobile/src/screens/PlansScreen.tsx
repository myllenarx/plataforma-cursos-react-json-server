import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { billingApi } from '../services/billing';
import type { Assinatura, Plano } from '../types/billing';
import { styles } from '../styles/BillingStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Plans'>;
const dinheiro = (v: string | number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export function PlansScreen({ navigation }: Props) {
  const { token } = useAuth();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      setError('');
      const [p, a] = await Promise.all([billingApi.planos(token), billingApi.assinaturas(token)]);
      setPlanos(p); setAssinaturas(a);
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível carregar os planos.'); }
    finally { setLoading(false); }
  }, [token]);
  useFocusEffect(useCallback(() => { setLoading(true); void carregar(); }, [carregar]));
  const ativa = assinaturas.find(a => new Date(a.DataFim).getTime() >= Date.now());
  async function contratar(plano: Plano) {
    if (!token || busy) return;
    if (ativa) { Alert.alert('Assinatura existente', 'Você já possui uma assinatura vigente.'); return; }
    Alert.alert('Confirmar assinatura', `Criar uma assinatura do plano ${plano.Nome} por ${dinheiro(plano.Preco)}? O pagamento é uma simulação acadêmica.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Continuar', onPress: async () => {
        setBusy(true);
        try {
          const assinatura = await billingApi.assinar(token, plano.ID_Plano);
          navigation.navigate('Payment', { assinaturaId: assinatura.ID_Assinatura });
        } catch (e) { Alert.alert('Não foi possível assinar', e instanceof Error ? e.message : 'Tente novamente.'); await carregar(); }
        finally { setBusy(false); }
      } },
    ]);
  }
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}>
    <Text style={styles.title}>Planos e assinaturas</Text>
    <Text style={styles.description}>Escolha um plano e registre um pagamento simulado, usando os dados da plataforma.</Text>
    <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('MySubscriptions')}><Text style={styles.secondaryText}>Minhas assinaturas e pagamentos</Text></TouchableOpacity>
    {ativa && <View style={styles.card}><Text style={styles.heading}>Assinatura vigente</Text><Text style={styles.detail}>{ativa.plano?.Nome ?? `Plano ${ativa.ID_Plano}`}</Text><Text style={styles.detail}>Até {new Date(ativa.DataFim).toLocaleDateString('pt-BR')}</Text>{!ativa.pagamentos?.length && <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment', { assinaturaId: ativa.ID_Assinatura })}><Text style={styles.buttonText}>Registrar pagamento</Text></TouchableOpacity>}</View>}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {!loading && !planos.length ? <Text style={styles.empty}>Nenhum plano cadastrado na plataforma.</Text> : null}
    {planos.map(plano => <View style={styles.card} key={plano.ID_Plano}>
      <Text style={styles.heading}>{plano.Nome}</Text>
      <Text style={styles.price}>{dinheiro(plano.Preco)}</Text>
      <Text style={styles.detail}>{plano.DuracaoMeses} mês(es) de duração</Text>
      {plano.Descricao ? <Text style={styles.detail}>{plano.Descricao}</Text> : null}
      <TouchableOpacity disabled={busy || !!ativa} style={styles.button} onPress={() => contratar(plano)}><Text style={styles.buttonText}>{ativa ? 'Já possui assinatura vigente' : 'Selecionar plano'}</Text></TouchableOpacity>
    </View>)}
    {busy && <ActivityIndicator />}
  </ScrollView>;
}
