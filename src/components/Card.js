import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/theme';

export default function Card({ children, style, accent = colors.primary }) {
  return (
    <View style={[styles.card, { borderLeftColor: accent }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4
  }
});
