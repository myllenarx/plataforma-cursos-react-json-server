import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: 26, paddingTop: 36, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', color: colors.graphite, marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: colors.graphite, marginBottom: 8 },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, height: 52, paddingHorizontal: 15, fontSize: 16, color: colors.graphite, marginBottom: 18 },
  error: { color: colors.error, marginBottom: 16, lineHeight: 20 },
  button: { height: 52, backgroundColor: colors.wine, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
