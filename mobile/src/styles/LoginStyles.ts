import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingBottom: 48 },
  brand: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.wine, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  brandText: { color: colors.white, fontSize: 21, fontWeight: '800' },
  title: { fontSize: 29, fontWeight: '800', color: colors.graphite, marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 32, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', color: colors.graphite, marginBottom: 8 },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, height: 52, paddingHorizontal: 15, fontSize: 16, color: colors.graphite, marginBottom: 20 },
  error: { color: colors.error, marginBottom: 16, lineHeight: 20 },
  button: { height: 52, backgroundColor: colors.wine, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  linkButton: { paddingVertical: 20, alignItems: 'center' },
  linkText: { color: colors.wine, fontWeight: '600' },
});
