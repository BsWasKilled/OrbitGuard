import { formatNumber } from './format';

export function buildAlerts(telemetry, thresholds) {
  const alerts = [];

  if (telemetry.temperature >= thresholds.temperature) {
    alerts.push({
      level: 'Crítico',
      title: 'Temperatura acima do limite',
      message: `Sensor térmico registrou ${formatNumber(telemetry.temperature)}°C. Limite configurado: ${formatNumber(thresholds.temperature)}°C.`
    });
  }

  if (telemetry.battery <= thresholds.battery) {
    alerts.push({
      level: 'Alto',
      title: 'Energia baixa',
      message: `Bateria em ${formatNumber(telemetry.battery)}%. Priorize sistemas essenciais.`
    });
  }

  if (telemetry.signal <= thresholds.signal) {
    alerts.push({
      level: 'Médio',
      title: 'Sinal de comunicação degradado',
      message: `Qualidade do link em ${formatNumber(telemetry.signal)}%. Recalibrar antena de telemetria.`
    });
  }

  if (telemetry.stability < 85) {
    alerts.push({
      level: 'Médio',
      title: 'Oscilação orbital detectada',
      message: 'Estabilidade abaixo do padrão ideal para operação contínua.'
    });
  }

  return alerts;
}
