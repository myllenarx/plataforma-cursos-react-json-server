import { StyleSheet } from 'react-native';
import { colors } from './theme';
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 48 },
  title: { color: colors.graphite, fontSize: 25, fontWeight: '800', marginBottom: 8 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 16 },
  card: { padding: 17, borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.white, marginBottom: 14 },
  heading: { color: colors.graphite, fontSize: 18, fontWeight: '700', marginBottom: 7 },
  price: { color: colors.wine, fontSize: 20, fontWeight: '800', marginBottom: 7 },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 8 },
  button: { backgroundColor: colors.wine, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  secondary: { borderColor: colors.wine, borderWidth: 1, padding: 13, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  secondaryText: { color: colors.wine, fontWeight: '700' },
  methodRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 9 },
  method: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginRight: 6 },
  methodSelected: { borderColor: colors.wine, backgroundColor: '#F6E9EE' },
  methodText: { color: colors.graphite, fontWeight: '600' },
  error: { color: colors.error, marginVertical: 10 },
  empty: { color: colors.muted, marginTop: 14, lineHeight: 21 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
});
