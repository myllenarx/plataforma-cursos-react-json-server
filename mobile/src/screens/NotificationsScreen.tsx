
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from '../services/notifications';
import { styles } from '../styles/NotificationStyles';

export function NotificationsScreen() {
  const { token, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (refresh = false) => {
    if (!token) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const data = await getNotifications(token);
      setNotifications(data);
    } catch (err) {
      const apiError = err as Error & { status?: number };

      if (apiError.status === 401) {
        await signOut();
        return;
      }

      setError(apiError.message || 'Não foi possível carregar as notificações.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, signOut]);

  useFocusEffect(
    useCallback(() => {
      void loadNotifications();
    }, [loadNotifications]),
  );

  async function handleMarkAsRead(id: number) {
    if (!token || processingId !== null) return;

    setProcessingId(id);
    setError(null);

    try {
      const updated = await markNotificationAsRead(id, token);

      setNotifications(current =>
        current.map(notification =>
          notification.ID_Notificacao === id ? updated : notification,
        ),
      );
    } catch (err) {
      const apiError = err as Error & { status?: number };

      if (apiError.status === 401) {
        await signOut();
        return;
      }

      setError(apiError.message || 'Não foi possível atualizar a notificação.');
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void loadNotifications(true)}
        />
      }
    >
      <Text style={styles.title}>Minhas notificações</Text>
      <Text style={styles.subtitle}>
        Acompanhe as mensagens recebidas na plataforma.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {notifications.length === 0 && !error ? (
        <Text style={styles.empty}>
          Você ainda não possui notificações.
        </Text>
      ) : null}

      {notifications.map(notification => (
        <View
          key={notification.ID_Notificacao}
          style={[
            styles.card,
            !notification.Lida && styles.unreadCard,
          ]}
        >
          <Text style={styles.cardTitle}>
            {notification.Titulo}
          </Text>

          <Text style={styles.message}>
            {notification.Mensagem}
          </Text>

          <Text style={styles.date}>
            {new Date(notification.DataCriacao).toLocaleString('pt-BR')}
          </Text>

          <Text style={styles.status}>
            {notification.Lida ? 'Lida' : 'Não lida'}
          </Text>

          {!notification.Lida && (
            <TouchableOpacity
              accessibilityRole="button"
              disabled={processingId !== null}
              onPress={() =>
                void handleMarkAsRead(notification.ID_Notificacao)
              }
              style={[
                processingId !== null && styles.disabledAction,
              ]}
            >
              <Text style={styles.action}>
                {processingId === notification.ID_Notificacao
                  ? 'Atualizando...'
                  : 'Marcar como lida'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
