
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { catalogApi } from '../services/catalog';
import { getNotifications } from '../services/notifications';
import type { Curso, Trilha } from '../types/catalog';
import { styles } from '../styles/CatalogStyles';
import { styles as homeStyles } from '../styles/HomeStyles';
import { colors } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Tab = 'courses' | 'tracks';

export function HomeScreen({ navigation }: Props) {
  const { token, signOut } = useAuth();

  const [tab, setTab] = useState<Tab>('courses');
  const [courses, setCourses] = useState<Curso[]>([]);
  const [tracks, setTracks] = useState<Trilha[]>([]);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadCatalog = useCallback(
    async (refresh = false) => {
      if (!token) return;

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        if (tab === 'courses') {
          setCourses(await catalogApi.cursos(token));
        } else {
          setTracks(await catalogApi.trilhas(token));
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'Não foi possível carregar o catálogo.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, tab],
  );

  const loadNotifications = useCallback(async () => {
    if (!token) return;

    try {
      const notifications = await getNotifications(token);

      setUnreadCount(
        notifications.filter(notification => !notification.Lida).length,
      );
    } catch {
      setUnreadCount(null);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void loadCatalog();
    }, [loadCatalog]),
  );

  useFocusEffect(
    useCallback(() => {
      void loadNotifications();
    }, [loadNotifications]),
  );

  async function logout() {
    setBusy(true);

    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  function refresh() {
    void loadCatalog(true);
    void loadNotifications();
  }

  return (
    <View style={styles.screen}>
      <View style={homeStyles.toolbar}>
        <TouchableOpacity
          style={homeStyles.shortcut}
          onPress={() => navigation.navigate('MyCourses')}
          accessibilityRole="button"
        >
          <Ionicons
            name="book-outline"
            size={22}
            color={colors.wine}
          />
          <Text style={homeStyles.shortcutText}>Meus cursos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={homeStyles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
          accessibilityRole="button"
          accessibilityLabel={
            unreadCount === null
              ? 'Minhas notificações'
              : `Minhas notificações. ${unreadCount} não lidas`
          }
        >
          <Ionicons
            name="notifications-outline"
            size={27}
            color={colors.wine}
          />

          {unreadCount !== null && unreadCount > 0 && (
            <View style={homeStyles.badge}>
              <Text style={homeStyles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={homeStyles.menu}>
        <TouchableOpacity
          style={[
            homeStyles.tab,
            tab === 'courses' && homeStyles.activeTab,
          ]}
          onPress={() => setTab('courses')}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'courses' }}
        >
          <Text
            style={[
              homeStyles.tabText,
              tab === 'courses' && homeStyles.activeTabText,
            ]}
          >
            Cursos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            homeStyles.tab,
            tab === 'tracks' && homeStyles.activeTab,
          ]}
          onPress={() => setTab('tracks')}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'tracks' }}
        >
          <Text
            style={[
              homeStyles.tabText,
              tab === 'tracks' && homeStyles.activeTabText,
            ]}
          >
            Trilhas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
      >
        <Text style={styles.title}>
          {tab === 'courses'
            ? 'Todos os cursos'
            : 'Trilhas de aprendizagem'}
        </Text>

        <Text style={styles.subtitle}>
          {tab === 'courses'
            ? 'Explore os cursos disponíveis na plataforma.'
            : 'Desenvolva novas habilidades seguindo nossas trilhas.'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.wine} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : tab === 'courses' ? (
          courses.length === 0 ? (
            <Text style={styles.empty}>
              Nenhum curso cadastrado.
            </Text>
          ) : (
            courses.map(course => (
              <TouchableOpacity
                key={course.ID_Curso}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('CourseDetail', {
                    id: course.ID_Curso,
                  })
                }
                accessibilityRole="button"
              >
                <Text style={styles.cardTitle}>
                  {course.Titulo}
                </Text>

                <Text style={styles.meta}>
                  {course.categoria?.Nome ?? 'Curso'} · {course.Nivel}
                </Text>

                <Text style={styles.body} numberOfLines={3}>
                  {course.Descricao || 'Sem descrição.'}
                </Text>

                <Text style={styles.action}>
                  Ver curso e aulas
                </Text>
              </TouchableOpacity>
            ))
          )
        ) : tracks.length === 0 ? (
          <Text style={styles.empty}>
            Nenhuma trilha cadastrada.
          </Text>
        ) : (
          tracks.map(track => (
            <TouchableOpacity
              key={track.ID_Trilha}
              style={styles.card}
              onPress={() =>
                navigation.navigate('TrackDetail', {
                  id: track.ID_Trilha,
                })
              }
              accessibilityRole="button"
            >
              <Text style={styles.cardTitle}>
                {track.Titulo}
              </Text>

              <Text style={styles.meta}>
                {track.categoria?.Nome ?? 'Trilha'} ·{' '}
                {track.cursos.length} curso(s)
              </Text>

              <Text style={styles.body} numberOfLines={3}>
                {track.Descricao || 'Sem descrição.'}
              </Text>

              <Text style={styles.action}>
                Explorar trilha
              </Text>
            </TouchableOpacity>
          ))
        )}

        <View style={homeStyles.footer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Plans')}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryText}>
              Planos e pagamentos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={logout}
            disabled={busy}
            accessibilityRole="button"
          >
            {busy ? (
              <ActivityIndicator color={colors.wine} />
            ) : (
              <Text style={styles.secondaryText}>
                Sair da conta
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
