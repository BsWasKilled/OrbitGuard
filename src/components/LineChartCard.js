import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../styles/theme';
import Card from './Card';

const width = Dimensions.get('window').width - 68;

export default function LineChartCard({ title, data, suffix = '' }) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.live}>● LIVE</Text>
      </View>
      <LineChart
        data={{
          labels: ['T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Agora'],
          datasets: [{ data }]
        }}
        width={width}
        height={210}
        yAxisSuffix={suffix}
        chartConfig={{
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 229, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(185, 196, 226, ${opacity})`,
          propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
          propsForBackgroundLines: { stroke: 'rgba(148,163,184,0.14)' }
        }}
        bezier
        style={styles.chart}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 17, fontWeight: '900' },
  live: { color: colors.danger, fontSize: 11, fontWeight: '900' },
  chart: { marginTop: 10, borderRadius: 18, marginLeft: -6 }
});
