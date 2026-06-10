import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { useMission } from '../context/MissionContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';

function colorForLevel(level) {
  if (level === 'Crítico') return colors.danger;
  if (level === 'Alto') return colors.warning;
  return colors.secondary;
}

export default function AlertsScreen() {
  const { alerts } = useMission();
  const critical = alerts.filter((a) => a.level === 'Crítico').length;
  const high = alerts.filter((a) => a.level === 'Alto').length;
  const medium = alerts.filter((a) => a.level !== 'Crítico' && a.level !== 'Alto').length;

  return (
    <Screen>
      <Header section="ALERTAS" title="Alertas" subtitle="Eventos gerados a partir dos limiares críticos." badge={`${alerts.length} ATIVOS`} badgeTone={alerts.length ? colors.danger : colors.success} />

      <View style={styles.summaryRow}>
        <View style={[styles.summary, { borderColor: colors.danger, backgroundColor: colors.redSoft }]}><Text style={[styles.summaryNumber, { color: colors.danger }]}>{critical}</Text><Text style={[styles.summaryLabel, { color: colors.danger }]}>Críticos</Text></View>
        <View style={[styles.summary, { borderColor: colors.warning, backgroundColor: colors.amberSoft }]}><Text style={[styles.summaryNumber, { color: colors.warning }]}>{high}</Text><Text style={[styles.summaryLabel, { color: colors.warning }]}>Altos</Text></View>
        <View style={[styles.summary, { borderColor: colors.secondary, backgroundColor: colors.cyanSoft }]}><Text style={[styles.summaryNumber, { color: colors.secondary }]}>{medium}</Text><Text style={[styles.summaryLabel, { color: colors.secondary }]}>Moderados</Text></View>
      </View>

      {alerts.length === 0 ? (
        <Card accent={colors.success} style={styles.empty}>
          <Text style={styles.emptyTitle}>Operação nominal</Text>
          <Text style={styles.emptyText}>Nenhum evento ativo. Todos os sistemas estão dentro dos parâmetros configurados.</Text>
        </Card>
      ) : (
        alerts.map((alert, index) => {
          const tone = colorForLevel(alert.level);
          return (
            <Card key={`${alert.title}-${index}`} accent={tone} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={[styles.levelPill, { borderColor: tone, backgroundColor: `${tone}22` }]}><Text style={[styles.levelText, { color: tone }]}>{alert.level.toUpperCase()}</Text></View>
                <View style={styles.nowPill}><Text style={styles.now}>AGORA</Text></View>
              </View>
              <Text style={styles.title}>{alert.title}</Text>
              <Text style={styles.message}>{alert.message}</Text>
              <View style={styles.hr} />
              <Text style={styles.source}>Missão • Sensor automático</Text>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  summary: { flex: 1, borderWidth: 1, borderRadius: 10, alignItems: 'center', paddingVertical: 12 },
  summaryNumber: { fontSize: 20, fontWeight: '900' },
  summaryLabel: { fontSize: 10, fontWeight: '900', marginTop: 2 },
  alertCard: { padding: 16 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  levelPill: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  levelText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  nowPill: { backgroundColor: '#182242', borderWidth: 1, borderColor: colors.border, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 7, height: 32 },
  now: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  title: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 12 },
  message: { color: colors.textSoft, marginTop: 6, lineHeight: 19, fontSize: 13 },
  hr: { height: 1, backgroundColor: colors.line, marginTop: 14, marginBottom: 10 },
  source: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyTitle: { color: colors.success, fontSize: 20, fontWeight: '900' },
  emptyText: { color: colors.textSoft, textAlign: 'center', marginTop: 8, lineHeight: 20 }
});
