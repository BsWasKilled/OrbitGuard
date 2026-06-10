import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { useMission } from '../context/MissionContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import { formatNumber } from '../utils/format';

export default function HomeScreen() {
  const { telemetry, alerts } = useMission();
  const statusTone = alerts.length ? colors.warning : colors.success;

  return (
    <Screen>
      <Header section="HOME" title="Missão" subtitle="Monitoramento preditivo em tempo real simulado." badge={alerts.length ? 'ATENÇÃO' : 'NOMINAL'} badgeTone={statusTone} />

      <Card accent={colors.primary} style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.label}>MISSÃO ATIVA</Text>
            <Text style={styles.mission}>{telemetry.missionName}</Text>
          </View>
          <View style={styles.orbitPill}><Text style={styles.orbitText}>{telemetry.orbit}</Text></View>
        </View>
        <View style={styles.divider} />
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.label}>STATUS</Text>
            <Text style={[styles.status, { color: statusTone }]}>{alerts.length ? 'Atenção operacional' : telemetry.status}</Text>
          </View>
          <View style={[styles.alertPill, { backgroundColor: alerts.length ? colors.redSoft : colors.greenSoft, borderColor: statusTone }]}>
            <Text style={[styles.alertText, { color: statusTone }]}>{alerts.length} alertas</Text>
          </View>
        </View>
      </Card>

      <View style={styles.strip}>
        <View style={styles.stripItem}><Text style={styles.stripValue}>99%</Text><Text style={styles.stripLabel}>Uptime</Text></View>
        <View style={styles.verticalLine} />
        <View style={styles.stripItem}><Text style={styles.stripValue}>{formatNumber(408)} km</Text><Text style={styles.stripLabel}>Altitude</Text></View>
        <View style={styles.verticalLine} />
        <View style={styles.stripItem}><Text style={[styles.stripValue, { color: colors.primary }]}>8 km/s</Text><Text style={styles.stripLabel}>Velocidade</Text></View>
      </View>

      <View style={styles.grid}>
        <MetricCard label="Temperatura" value={telemetry.temperature} suffix="°C" tone={colors.warning} note="em alta" />
        <MetricCard label="Estabilidade" value={telemetry.stability} suffix="%" tone={colors.success} note="estável" />
        <MetricCard label="Oxigênio" value={telemetry.oxygen} suffix="%" tone={colors.secondary} note="estável" />
        <MetricCard label="Radiação" value={telemetry.radiation} suffix=" μSv" tone={colors.primary} note="estável" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: '#13183A' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center' },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  mission: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 5 },
  orbitPill: { borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.purpleSoft, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  orbitText: { color: '#CDBEFF', fontSize: 12, fontWeight: '900' },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 13 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { fontSize: 16, fontWeight: '900', marginTop: 4 },
  alertPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 7 },
  alertText: { fontSize: 11, fontWeight: '900' },
  strip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 12, marginBottom: 10 },
  stripItem: { flex: 1, alignItems: 'center' },
  stripValue: { color: colors.secondary, fontSize: 14, fontWeight: '900' },
  stripLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', marginTop: 2 },
  verticalLine: { width: 1, height: 28, backgroundColor: colors.line },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});
