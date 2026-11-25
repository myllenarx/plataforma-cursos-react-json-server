import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CoursesScreen } from '../screens/CoursesScreen';
import { TracksScreen } from '../screens/TracksScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';
import { TrackDetailScreen } from '../screens/TrackDetailScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { MyCoursesScreen } from '../screens/MyCoursesScreen';
import { PlansScreen } from '../screens/PlansScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { MySubscriptionsScreen } from '../screens/MySubscriptionsScreen';
import { styles } from '../styles/NavigationStyles';
import { NotificationsScreen } from '../screens/NotificationsScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Notifications: undefined;
  Courses: undefined;
  MyCourses: undefined;
  Tracks: undefined;
  Plans: undefined;
  Payment: { assinaturaId: number };
  MySubscriptions: undefined;
  CourseDetail: { id: number };
  TrackDetail: { id: number };
  Lesson: { courseId: number; lessonId: number };
};
const Stack = createNativeStackNavigator<RootStackParamList>();
export function AppNavigator() {
  const { token, loading } = useAuth();
  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" /></View>;
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: '#72263E', headerTitleStyle: styles.headerTitle }}>
      {token ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Plataforma de Cursos' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Minhas notificações' }} />
          <Stack.Screen name="MyCourses" component={MyCoursesScreen} options={{ title: 'Meus cursos' }} />
          <Stack.Screen name="Courses" component={CoursesScreen} options={{ title: 'Cursos' }} />
          <Stack.Screen name="Plans" component={PlansScreen} options={{ title: 'Planos' }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Pagamento' }} />
          <Stack.Screen name="MySubscriptions" component={MySubscriptionsScreen} options={{ title: 'Minhas assinaturas' }} />
          <Stack.Screen name="Tracks" component={TracksScreen} options={{ title: 'Trilhas de aprendizagem' }} />
          <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Detalhes do curso' }} />
          <Stack.Screen name="TrackDetail" component={TrackDetailScreen} options={{ title: 'Detalhes da trilha' }} />
          <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'Aula' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar conta' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
