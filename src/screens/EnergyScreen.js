import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { useMission } from '../context/MissionContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import { formatNumber } from '../utils/format';

function Bar({ value }) {
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.max(4, Math.min(100, Math.round(value)))}%` }]} />
    </View>
  );
}

export default function EnergyScreen() {
  const { telemetry } = useMission();
  const autonomy = Math.max(1, Math.round((telemetry.battery / Math.max(telemetry.consumption, 1)) * 8));

  return (
    <Screen>
      <Header section="ENERGIA" title="Energia" subtitle="Bateria, painéis solares e consumo crítico." badge="POWER" badgeTone={colors.success} />

      <Card accent={colors.success}>
        <Text style={styles.label}>NÍVEL DE BATERIA</Text>
        <View style={styles.batteryRow}>
          <Text style={styles.battery}>{formatNumber(telemetry.battery)}%</Text>
          <Text style={styles.remaining}>≈ {autonomy}h restantes</Text>
        </View>
        <Bar value={telemetry.battery} />
        <View style={styles.scale}>
          <Text style={styles.scaleText}>0%</Text>
          <Text style={[styles.scaleText, { color: colors.danger }]}>30%</Text>
          <Text style={[styles.scaleText, { color: colors.warning }]}>60%</Text>
          <Text style={styles.scaleText}>100%</Text>
        </View>
      </Card>

      <Card accent={colors.primary}>
        <Text style={styles.label}>BALANÇO DO SISTEMA</Text>
        <Text style={styles.description}>Leitura consolidada da geração solar, consumo interno e autonomia estimada.</Text>
        <View style={styles.gridInside}>
          <View style={styles.energyBox}>
            <Text style={styles.energyIcon}>☀</Text>
            <Text style={[styles.energyValue, { color: colors.warning }]}>+{formatNumber(telemetry.solarInput)}%</Text>
            <Text style={styles.energyLabel}>Entrada solar</Text>
          </View>
          <View style={styles.energyBox}>
            <Text style={styles.energyIcon}>⌁</Text>
            <Text style={[styles.energyValue, { color: colors.primary }]}>-{formatNumber(telemetry.consumption)}%</Text>
            <Text style={styles.energyLabel}>Consumo</Text>
          </View>
        </View>
      </Card>

      <View style={styles.grid}>
        <MetricCard label="Solar" value={telemetry.solarInput} suffix="%" tone={colors.warning} />
        <MetricCard label="Consumo" value={telemetry.consumption} suffix="%" tone={colors.primary} />
        <MetricCard label="Autonomia" value={autonomy} suffix="h" tone={colors.secondary} />
        <MetricCard label="Status" value={telemetry.battery < 30 ? 'CRÍTICO' : 'OK'} suffix="" tone={telemetry.battery < 30 ? colors.danger : colors.success} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  description: { color: colors.textSoft, fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 12 },
  batteryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 5 },
  battery: { color: colors.success, fontSize: 36, fontWeight: '900' },
  remaining: { color: colors.textSoft, fontSize: 12, fontWeight: '900', marginBottom: 9 },
  barTrack: { height: 8, backgroundColor: '#273250', borderRadius: 99, overflow: 'hidden', marginTop: 8 },
  barFill: { height: '100%', backgroundColor: colors.success, borderRadius: 99 },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  scaleText: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  gridInside: { flexDirection: 'row', gap: 12 },
  energyBox: { flex: 1, minHeight: 86, borderWidth: 1, borderColor: colors.border, backgroundColor: '#182242', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  energyIcon: { color: colors.secondary, fontSize: 18, fontWeight: '900' },
  energyValue: { fontSize: 17, fontWeight: '900', marginTop: 5 },
  energyLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', marginTop: 3, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});
