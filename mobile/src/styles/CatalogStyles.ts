import { StyleSheet } from 'react-native';
import { colors } from './theme';
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.graphite, fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  card: { backgroundColor: colors.white, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  cardTitle: { color: colors.graphite, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 8 },
  meta: { color: colors.wine, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  action: { color: colors.wine, fontWeight: '700', fontSize: 14, marginTop: 4 },
  button: { backgroundColor: colors.wine, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  secondaryButton: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.wine, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  secondaryText: { color: colors.wine, fontSize: 15, fontWeight: '700' },
  section: { color: colors.graphite, fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 12 },
  lesson: { paddingVertical: 13, borderTopWidth: 1, borderTopColor: colors.border },
  error: { color: colors.error, textAlign: 'center', marginVertical: 15, fontSize: 15 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 24, fontSize: 15 },
  center: { flex: 1, justifyContent: 'center', padding: 20 },
});
