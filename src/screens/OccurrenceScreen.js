import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/theme';
import { useMission } from '../context/MissionContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';

const categories = ['Operacional', 'Energia', 'Comunicação', 'Sensores'];
const priorities = ['Baixa', 'Média', 'Alta', 'Crítica'];

export default function OccurrenceScreen() {
  const { missionName, occurrenceForm: form, occurrences, updateOccurrenceField, registerOccurrence } = useMission();

  async function saveOccurrence() {
    if (!form.operatorName.trim() || !form.title.trim() || !form.description.trim()) {
      Alert.alert('Ocorrência incompleta', 'Informe o nome do responsável, o título e a descrição da ocorrência.');
      return;
    }

    await registerOccurrence();
    Alert.alert('Ocorrência registrada', 'O ocorrido foi vinculado à missão atual e salvo localmente.');
  }

  return (
    <Screen>
      <Header section="OCORRÊNCIA" title="Registrar" subtitle="Registro de eventos durante a missão atual." badge="LOG" badgeTone={colors.primary} />

      <Card accent={colors.primary}>
        <Text style={styles.sectionTitle}>NOVA OCORRÊNCIA</Text>
        <Text style={styles.description}>Documente falhas, observações e riscos ocorridos durante a missão atualmente monitorada.</Text>

        <Field label="Responsável pelo registro" value={form.operatorName} onChangeText={(v) => updateOccurrenceField('operatorName', v)} placeholder="Insira seu nome" />
        <Field label="Título da ocorrência" value={form.title} onChangeText={(v) => updateOccurrenceField('title', v)} placeholder="Descreva brevemente o ocorrido" />

        <Text style={styles.fieldLabel}>Missão da ocorrência</Text>
        <View style={styles.currentMissionBox}>
          <View>
            <Text style={styles.currentMissionName}>{missionName}</Text>
            <Text style={styles.currentMissionHint}>Missão atualmente monitorada</Text>
          </View>
          <View style={styles.lockedPill}>
            <Text style={styles.lockedText}>AUTO</Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Categoria</Text>
        <ChipGroup options={categories} value={form.category} onChange={(v) => updateOccurrenceField('category', v)} />

        <Text style={styles.fieldLabel}>Prioridade</Text>
        <ChipGroup options={priorities} value={form.priority} onChange={(v) => updateOccurrenceField('priority', v)} priority />

        <Field
          label="Descrição técnica"
          value={form.description}
          onChangeText={(v) => updateOccurrenceField('description', v)}
          placeholder="Dê os detalhes do ocorrido"
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={saveOccurrence} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Registrar ocorrência</Text>
        </TouchableOpacity>
      </Card>

      <Card accent={colors.secondary}>
        <Text style={styles.sectionTitle}>HISTÓRICO DE OCORRÊNCIAS</Text>
        {occurrences.length === 0 ? (
          <Text style={styles.empty}>Nenhuma ocorrência registrada ainda.</Text>
        ) : (
          occurrences.map((item) => <OccurrenceItem key={item.id} item={item} />)
        )}
      </Card>
    </Screen>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

function ChipGroup({ options, value, onChange, priority }) {
  return (
    <View style={styles.chipWrap}>
      {options.map((option) => {
        const active = option === value;
        const tone = priority && option === 'Crítica' ? colors.danger : priority && option === 'Alta' ? colors.warning : colors.primary;
        return (
          <TouchableOpacity key={option} onPress={() => onChange(option)} style={[styles.chip, active && { borderColor: tone, backgroundColor: `${tone}22` }]}>
            <Text style={[styles.chipText, active && { color: tone }]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function OccurrenceItem({ item }) {
  const tone = item.priority === 'Crítica' ? colors.danger : item.priority === 'Alta' ? colors.warning : item.priority === 'Média' ? colors.primary : colors.success;
  return (
    <View style={[styles.occurrence, { borderLeftColor: tone }]}> 
      <View style={styles.occurrenceTop}>
        <Text style={styles.occurrenceTitle}>{item.title}</Text>
        <View style={[styles.priorityPill, { borderColor: tone, backgroundColor: `${tone}18` }]}><Text style={[styles.priorityText, { color: tone }]}>{item.priority}</Text></View>
      </View>
      <Text style={styles.occurrenceMeta}>Operador: {item.operatorName}</Text>
      <Text style={styles.occurrenceMeta}>Missão: {item.mission}</Text>
      <Text style={styles.occurrenceMeta}>{item.category} • {item.createdAt}</Text>
      <Text style={styles.occurrenceDesc}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 6 },
  description: { color: colors.textSoft, fontSize: 12, lineHeight: 17, marginBottom: 14 },
  fieldBlock: { marginBottom: 13 },
  fieldLabel: { color: colors.textSoft, fontSize: 12, fontWeight: '900', marginBottom: 8 },

  currentMissionBox: {
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 13,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  currentMissionName: { color: colors.text, fontSize: 15, fontWeight: '900' },
  currentMissionHint: { color: colors.textSoft, fontSize: 11, fontWeight: '800', marginTop: 3 },
  lockedPill: { borderWidth: 1, borderColor: colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#18213F' },
  lockedText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  input: { backgroundColor: '#18213F', borderWidth: 1, borderColor: colors.border, borderRadius: 11, color: colors.text, paddingHorizontal: 14, minHeight: 45, fontSize: 14, fontWeight: '800' },
  textArea: { minHeight: 96, paddingTop: 12, lineHeight: 19 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#18213F', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  chipText: { color: colors.textSoft, fontSize: 11, fontWeight: '900' },
  button: { backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: 50, marginTop: 2 },
  buttonText: { color: colors.text, fontSize: 15, fontWeight: '900' },
  empty: { color: colors.textSoft, fontSize: 12, lineHeight: 18 },
  occurrence: { backgroundColor: '#18213F', borderWidth: 1, borderColor: colors.border, borderLeftWidth: 3, borderRadius: 12, padding: 12, marginTop: 10 },
  occurrenceTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center' },
  occurrenceTitle: { color: colors.text, fontSize: 13, fontWeight: '900', flex: 1 },
  priorityPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  priorityText: { fontSize: 9, fontWeight: '900' },
  occurrenceMeta: { color: colors.muted, fontSize: 10, fontWeight: '900', marginTop: 7 },
  occurrenceDesc: { color: colors.textSoft, fontSize: 11, lineHeight: 16, marginTop: 7 }
});
