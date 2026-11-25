import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/CatalogStyles';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
export function HomeScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  async function logout() { setBusy(true); try { await signOut(); } finally { setBusy(false); } }
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.title}>Bem-vindo à plataforma!</Text>
    <Text style={styles.subtitle}>Explore os cursos e as trilhas de aprendizagem disponíveis na sua conta.</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Courses')} accessibilityRole="button"><Text style={styles.buttonText}>Explorar cursos</Text></TouchableOpacity>
    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('MyCourses')} accessibilityRole="button"><Text style={styles.secondaryText}>Meus cursos</Text></TouchableOpacity>
    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Notifications')} accessibilityRole="button" accessibilityLabel="Abrir minhas notificações"><Text style={styles.secondaryText}>Minhas notificações</Text></TouchableOpacity>
    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Tracks')} accessibilityRole="button"><Text style={styles.secondaryText}>Explorar trilhas</Text></TouchableOpacity>
    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Plans')} accessibilityRole="button"><Text style={styles.secondaryText}>Planos e pagamentos</Text></TouchableOpacity>
    <View style={styles.card}><Text style={styles.cardTitle}>Seu aprendizado começa aqui</Text><Text style={styles.body}>Os cursos e as trilhas são carregados diretamente da plataforma existente, sem dados de demonstração.</Text></View>
    <TouchableOpacity style={styles.secondaryButton} onPress={logout} disabled={busy} accessibilityRole="button">{busy ? <ActivityIndicator /> : <Text style={styles.secondaryText}>Sair da conta</Text>}</TouchableOpacity>
  </ScrollView>;
}
