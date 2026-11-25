import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 28, justifyContent: 'center' },
  title: { color: colors.graphite, fontSize: 27, fontWeight: '800', marginBottom: 14 },
  description: { color: colors.muted, fontSize: 16, lineHeight: 25, marginBottom: 32 },
  button: { height: 52, backgroundColor: colors.wine, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
