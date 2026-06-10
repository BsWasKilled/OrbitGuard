import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { formatNumber } from '../utils/format';

export default function MetricCard({ label, value, suffix = '', tone = colors.secondary, note }) {
  return (
    <View style={[styles.card, { borderTopColor: tone }]}> 
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: tone }]}>
        {formatNumber(value)}<Text style={styles.suffix}>{suffix}</Text>
      </Text>
      {note ? <Text style={styles.note}>— {note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    backgroundColor: colors.card2,
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderTopWidth: 2,
    borderColor: colors.border,
    marginBottom: 10,
    minHeight: 82
  },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  value: { marginTop: 8, fontSize: 26, fontWeight: '900' },
  suffix: { color: colors.textSoft, fontSize: 13, fontWeight: '900' },
  note: { color: colors.textSoft, fontSize: 10, fontWeight: '800', marginTop: 2 }
});
