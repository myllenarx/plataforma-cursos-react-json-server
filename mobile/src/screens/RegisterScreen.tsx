import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { register } from '../services/auth';
import { styles } from '../styles/RegisterStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!name.trim() || !email.trim() || !password) { setError('Preencha todos os campos.'); return; }
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
    if (password !== confirm) { setError('As senhas não coincidem.'); return; }
    setBusy(true); setError('');
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      Alert.alert('Cadastro realizado', 'Sua conta foi criada. Entre com seu e-mail e senha.', [
        { text: 'Ir para login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao cadastrar.'); }
    finally { setBusy(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>Cadastre-se para acessar os cursos.</Text>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" autoCapitalize="words" />
        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Mínimo de 6 caracteres" secureTextEntry />
        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput style={styles.input} value={confirm} onChangeText={setConfirm} placeholder="Repita a senha" secureTextEntry />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={submit} disabled={busy} accessibilityRole="button">
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Criar conta</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
