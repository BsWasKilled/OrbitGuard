import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

export default function Header({ section, title, subtitle, badge, badgeTone = colors.success }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.section}>{section || title.toUpperCase()}</Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.brand}>ORBITGUARD</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, { borderColor: badgeTone, backgroundColor: `${badgeTone}22` }]}>
            <Text style={[styles.badgeText, { color: badgeTone }]}>● {badge}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  section: { color: colors.muted, fontSize: 11, fontWeight: '900', letterSpacing: 3, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  brand: { color: colors.secondary, fontSize: 11, fontWeight: '900', letterSpacing: 2.2 },
  title: { color: colors.text, fontSize: 27, fontWeight: '900', marginTop: 2 },
  subtitle: { color: colors.textSoft, fontSize: 13, marginTop: 4, maxWidth: 245, lineHeight: 18 },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, marginTop: 38 },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 }
});
