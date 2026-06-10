import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/theme';

export default function Screen({ children }) {
  return (
    <LinearGradient colors={[colors.background, '#080D20', colors.background]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />
          {children}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 10, paddingBottom: 92 },
  glowOne: { position: 'absolute', width: 170, height: 170, borderRadius: 100, backgroundColor: 'rgba(0,217,255,0.06)', top: 180, right: -80 },
  glowTwo: { position: 'absolute', width: 150, height: 150, borderRadius: 100, backgroundColor: 'rgba(124,92,255,0.08)', top: 420, left: -70 }
});
