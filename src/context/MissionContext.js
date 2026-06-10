import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialTelemetry, history as baseHistory } from '../data/missionData';
import { buildAlerts } from '../utils/alerts';

const MissionContext = createContext(null);

const THRESHOLDS_KEY = '@orbitguard_thresholds';
const OCCURRENCES_KEY = '@orbitguard_occurrences_v2';

const defaultThresholds = {
  temperature: 45,
  battery: 25,
  signal: 70
};

const defaultOccurrenceForm = {
  operatorName: '',
  title: '',
  category: 'Operacional',
  priority: 'Média',
  description: ''
};

function randomDelta(value, min, max, floor = 0, ceiling = 100) {
  const next = value + Math.round((Math.random() * (max - min) + min) * 10) / 10;
  return Math.min(ceiling, Math.max(floor, next));
}

export function MissionProvider({ children }) {
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [history, setHistory] = useState(baseHistory);
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [occurrenceForm, setOccurrenceForm] = useState(defaultOccurrenceForm);
  const [occurrences, setOccurrences] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadStorage() {
      try {
        const [savedThresholds, savedOccurrences] = await Promise.all([
          AsyncStorage.getItem(THRESHOLDS_KEY),
          AsyncStorage.getItem(OCCURRENCES_KEY)
        ]);

        if (savedThresholds) setThresholds(JSON.parse(savedThresholds));
        if (savedOccurrences) setOccurrences(JSON.parse(savedOccurrences));
      } finally {
        setLoaded(true);
      }
    }

    loadStorage();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((current) => ({
        ...current,
        temperature: randomDelta(current.temperature, -1.2, 1.5, 25, 60),
        radiation: randomDelta(current.radiation, -1, 1.8, 0, 80),
        stability: randomDelta(current.stability, -1.8, 1.1, 70, 100),
        battery: randomDelta(current.battery, -1.4, 0.6, 0, 100),
        solarInput: randomDelta(current.solarInput, -2, 2, 0, 100),
        consumption: randomDelta(current.consumption, -1.5, 2, 0, 100),
        signal: randomDelta(current.signal, -2.2, 1.3, 0, 100),
        latency: Math.round(randomDelta(current.latency, -12, 16, 70, 450)),
        packetLoss: randomDelta(current.packetLoss, -0.3, 0.5, 0, 10)
      }));
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setHistory((current) => ({
      sensors: [...current.sensors.slice(-6), telemetry.temperature],
      energy: [...current.energy.slice(-6), telemetry.battery],
      signal: [...current.signal.slice(-6), telemetry.signal]
    }));
  }, [telemetry.temperature, telemetry.battery, telemetry.signal]);

  function updateOccurrenceField(key, value) {
    setOccurrenceForm((current) => ({ ...current, [key]: value }));
  }

  function resetOccurrenceForm() {
    setOccurrenceForm(defaultOccurrenceForm);
  }

  async function registerOccurrence() {
    const nextOccurrence = {
      id: Date.now().toString(),
      ...occurrenceForm,
      mission: telemetry.missionName,
      createdAt: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const nextList = [nextOccurrence, ...occurrences].slice(0, 6);
    setOccurrences(nextList);
    setOccurrenceForm(defaultOccurrenceForm);
    await AsyncStorage.setItem(OCCURRENCES_KEY, JSON.stringify(nextList));
  }

  async function saveThresholds(nextThresholds) {
    setThresholds(nextThresholds);
    await AsyncStorage.setItem(THRESHOLDS_KEY, JSON.stringify(nextThresholds));
  }

  const alerts = useMemo(() => buildAlerts(telemetry, thresholds), [telemetry, thresholds]);

  const value = {
    loaded,
    telemetry,
    history,
    thresholds,
    alerts,
    saveThresholds,
    occurrenceForm,
    occurrences,
    updateOccurrenceField,
    resetOccurrenceForm,
    missionName: telemetry.missionName,
    registerOccurrence
  };

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

export function useMission() {
  return useContext(MissionContext);
}
