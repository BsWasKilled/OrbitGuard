import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { useMission } from '../context/MissionContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import { formatNumber } from '../utils/format';

function SignalBars({ value }) {
  const bars = [45, 58, 70, 82, 95];
  return (
    <View style={styles.bars}>
      {bars.map((height, index) => (
        <View key={index} style={[styles.bar, { height: height / 3, opacity: value > (index + 1) * 16 ? 1 : 0.25 }]} />
      ))}
    </View>
  );
}

function getSignalStatus(value) {
  if (value < 70) return { label: 'FRACO', tone: colors.warning };
  if (value < 85) return { label: 'MÉDIO', tone: colors.primary };
  return { label: 'FORTE', tone: colors.success };
}

export default function CommunicationScreen() {
  const { telemetry } = useMission();
  const signalStatus = getSignalStatus(telemetry.signal);

  return (
    <Screen>
      <Header section="COMUNICAÇÃO" title="Comunicação" subtitle="Telemetria, latência e qualidade do sinal." badge="LINK" badgeTone={colors.success} />

      <Card accent={colors.secondary}>
        <Text style={styles.label}>QUALIDADE DO SINAL</Text>
        <View style={styles.signalRow}>
          <Text style={styles.bigSignal}>{formatNumber(telemetry.signal)}%</Text>
          <SignalBars value={telemetry.signal} />
          <View style={[styles.statusPill, { borderColor: signalStatus.tone, backgroundColor: `${signalStatus.tone}18` }]}>
            <Text style={[styles.statusText, { color: signalStatus.tone }]}>{signalStatus.label}</Text>
          </View>
        </View>
      </Card>

      <Card accent={colors.success}>
        <Text style={styles.label}>PROTOCOLOS ATIVOS</Text>
        <View style={styles.protocolRow}><Text style={styles.protocol}>● Telemetria</Text><Text style={styles.active}>ATIVO</Text></View>
        <View style={styles.hr} />
        <View style={styles.protocolRow}><Text style={styles.protocol}>● Uplink</Text><Text style={styles.active}>ATIVO</Text></View>
        <View style={styles.hr} />
        <View style={styles.protocolRow}><Text style={styles.protocol}>● Criptografia</Text><Text style={styles.active}>AES-256</Text></View>
      </Card>

      <View style={styles.grid}>
        <MetricCard label="Latência" value={telemetry.latency} suffix=" ms" tone={colors.warning} />
        <MetricCard label="Perda Pkt." value={telemetry.packetLoss} suffix="%" tone={colors.primary} />
        <MetricCard label="Protocolo" value="S" suffix="-Band" tone={colors.success} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  signalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 5 },
  bigSignal: { color: colors.secondary, fontSize: 38, fontWeight: '900', minWidth: 96 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 42 },
  bar: { width: 8, backgroundColor: colors.secondary, borderRadius: 2 },
  statusPill: { borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 11, minWidth: 72, alignItems: 'center' },
  statusText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  protocolRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  protocol: { color: colors.textSoft, fontSize: 13, fontWeight: '900' },
  active: { color: colors.success, fontSize: 12, fontWeight: '900' },
  hr: { height: 1, backgroundColor: colors.line },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});
