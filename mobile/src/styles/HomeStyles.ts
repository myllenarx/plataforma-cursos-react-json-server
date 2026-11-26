
import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },

  shortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },

  shortcutText: {
    color: colors.wine,
    fontSize: 15,
    fontWeight: '700',
  },

  notificationButton: {
    position: 'relative',
    padding: 10,
  },

  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#D62839',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },

  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },

  menu: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tab: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.wine,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  activeTab: {
    backgroundColor: colors.wine,
  },

  tabText: {
    color: colors.wine,
    fontSize: 15,
    fontWeight: '700',
  },

  activeTabText: {
    color: colors.white,
  },

  footer: {
    marginTop: 24,
  },
});
