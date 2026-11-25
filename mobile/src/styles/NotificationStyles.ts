
import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        color: colors.graphite,
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        color: colors.muted,
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.white,
        padding: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 12,
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: colors.wine,
    },
    cardTitle: {
        color: colors.graphite,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },
    message: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 10,
    },
    date: {
        color: colors.muted,
        fontSize: 12,
        marginBottom: 8,
    },
    status: {
        color: colors.wine,
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
    },
    action: {
        color: colors.wine,
        fontSize: 14,
        fontWeight: '700',
        marginTop: 4,
    },
    disabledAction: {
        opacity: 0.5,
    },
    error: {
        color: colors.error,
        textAlign: 'center',
        marginVertical: 15,
        fontSize: 15,
    },
    empty: {
        color: colors.muted,
        textAlign: 'center',
        marginTop: 24,
        fontSize: 15,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
});
