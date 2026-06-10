import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/theme';
import { useMission } from '../context/MissionContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import { formatNumber } from '../utils/format';

const SETTINGS_KEY = '@orbitguard_professional_settings_v2';

const defaultSettings = {
  autoReports: true,
  autoAlerts: true,
  predictiveMode: true,
  safeMode: false,
  encryptedLink: true
};

export default function SettingsScreen() {
  const { thresholds, saveThresholds, telemetry } = useMission();
  const [temperature, setTemperature] = useState(String(formatNumber(thresholds.temperature)));
  const [battery, setBattery] = useState(String(formatNumber(thresholds.battery)));
  const [signal, setSignal] = useState(String(formatNumber(thresholds.signal)));
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    setTemperature(String(formatNumber(thresholds.temperature)));
    setBattery(String(formatNumber(thresholds.battery)));
    setSignal(String(formatNumber(thresholds.signal)));
  }, [thresholds]);

  useEffect(() => {
    async function load() {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      if (saved) setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
    load();
  }, []);

  async function updateSetting(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }

  async function handleSave() {
    const next = {
      temperature: Number(temperature),
      battery: Number(battery),
      signal: Number(signal)
    };

    if (!next.temperature || !next.battery || !next.signal) {
      Alert.alert('Campos inválidos', 'Preencha todos os limiares com números válidos.');
      return;
    }

    await saveThresholds(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    Alert.alert('Configurações salvas', 'Os parâmetros da missão foram atualizados.');
  }

  return (
    <Screen>
      <Header section="CONFIG" title="Config" subtitle="Limiares e preferências automáticas da missão." badge="FORM" badgeTone={colors.primary} />

      <Card accent={colors.primary}>
        <Text style={styles.sectionTitle}>LIMIARES DE ALERTA</Text>
        <Text style={styles.description}>Alertas gerados automaticamente quando os valores ultrapassam estes limites.</Text>

        <Field label="Temperatura crítica" current={`Atual: ${formatNumber(telemetry.temperature)}°C`} value={temperature} onChangeText={setTemperature} suffix="°C" tone={colors.warning} />
        <Field label="Bateria mínima" current={`Atual: ${formatNumber(telemetry.battery)}%`} value={battery} onChangeText={setBattery} suffix="%" tone={colors.success} />
        <Field label="Sinal mínimo" current={`Atual: ${formatNumber(telemetry.signal)}%`} value={signal} onChangeText={setSignal} suffix="%" tone={colors.success} />
      </Card>


      <Card accent={colors.success}>
        <Text style={styles.sectionTitle}>AUTOMAÇÃO DO SISTEMA</Text>
        <SwitchRow title="Alertas automáticos" text="Gera eventos quando algum parâmetro fica fora do limite." value={settings.autoAlerts} onValueChange={(v) => updateSetting('autoAlerts', v)} tone={colors.success} />
        <SwitchRow title="Análise preditiva" text="Exibe recomendações inteligentes com base na telemetria simulada." value={settings.predictiveMode} onValueChange={(v) => updateSetting('predictiveMode', v)} tone={colors.secondary} />
        <SwitchRow title="Relatórios automáticos" text="Simula envio periódico de resumos para o controle da missão." value={settings.autoReports} onValueChange={(v) => updateSetting('autoReports', v)} tone={colors.warning} />
        <SwitchRow title="Link criptografado" text="Mantém o canal de comunicação marcado como seguro." value={settings.encryptedLink} onValueChange={(v) => updateSetting('encryptedLink', v)} tone={colors.primary} />
        <SwitchRow title="Modo seguro" text="Reduz consumo e prioriza sistemas essenciais em emergência." value={settings.safeMode} onValueChange={(v) => updateSetting('safeMode', v)} tone={colors.danger} last />
      </Card>

      <TouchableOpacity style={styles.button} onPress={handleSave} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Salvar configurações</Text>
      </TouchableOpacity>
    </Screen>
  );
}

function Field({ label, current, value, onChangeText, suffix, tone }) {
  return (
    <View style={styles.fieldBlock}>
      <View style={styles.fieldTop}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={[styles.currentPill, { borderColor: tone, backgroundColor: `${tone}18` }]}><Text style={[styles.currentText, { color: tone }]}>{current}</Text></View>
      </View>
      <View style={styles.inputRow}>
        <TextInput value={value} onChangeText={(v) => onChangeText(v.replace(/[^0-9]/g, ''))} keyboardType="numeric" style={styles.input} placeholderTextColor={colors.muted} />
        <View style={styles.suffixBox}><Text style={styles.suffixText}>{suffix}</Text></View>
      </View>
    </View>
  );
}

function SwitchRow({ title, text, value, onValueChange, tone, last }) {
  return (
    <View style={[styles.switchRow, last && styles.switchLast]}>
      <View style={styles.switchTextArea}>
        <Text style={styles.switchTitle}>{title}</Text>
        <Text style={styles.switchText}>{text}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: tone }} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 6 },
  description: { color: colors.textSoft, fontSize: 12, lineHeight: 17, marginBottom: 14 },
  fieldBlock: { marginBottom: 14 },
  fieldTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  fieldLabel: { color: colors.textSoft, fontSize: 12, fontWeight: '900' },
  currentPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  currentText: { fontSize: 10, fontWeight: '900' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#18213F', borderWidth: 1, borderColor: colors.border, borderRadius: 11, color: colors.text, paddingHorizontal: 14, height: 45, fontSize: 16, fontWeight: '900' },
  suffixBox: { width: 46, backgroundColor: '#18213F', borderWidth: 1, borderColor: colors.border, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  suffixText: { color: colors.muted, fontWeight: '900' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 12 },
  switchLast: { borderBottomWidth: 0 },
  switchTextArea: { flex: 1 },
  switchTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  switchText: { color: colors.textSoft, marginTop: 3, fontSize: 11, lineHeight: 16 },
  button: { backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: 50, marginBottom: 18, shadowColor: colors.primary, shadowOpacity: 0.25, shadowRadius: 20, elevation: 5 },
  buttonText: { color: colors.text, fontSize: 15, fontWeight: '900' }
});
