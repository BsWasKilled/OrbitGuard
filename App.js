import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Gauge, BatteryCharging, Radio, Bell, Settings, ClipboardList } from 'lucide-react-native';

import { MissionProvider } from './src/context/MissionContext';
import HomeScreen from './src/screens/HomeScreen';
import EnergyScreen from './src/screens/EnergyScreen';
import CommunicationScreen from './src/screens/CommunicationScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import OccurrenceScreen from './src/screens/OccurrenceScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/styles/theme';

const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.text,
    border: colors.border
  }
};

function iconForRoute(routeName, color, size) {
  const props = { color, size, strokeWidth: 2.2 };
  if (routeName === 'Missão') return <Gauge {...props} />;
  if (routeName === 'Energia') return <BatteryCharging {...props} />;
  if (routeName === 'Comunicação') return <Radio {...props} />;
  if (routeName === 'Alertas') return <Bell {...props} />;
  if (routeName === 'Ocorrência') return <ClipboardList {...props} />;
  return <Settings {...props} />;
}

export default function App() {
  return (
    <MissionProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => iconForRoute(route.name, color, size),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.muted,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              height: 70,
              paddingTop: 7,
              paddingBottom: 9
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '700'
            }
          })}
        >
          <Tab.Screen name="Missão" component={HomeScreen} />
          <Tab.Screen name="Energia" component={EnergyScreen} />
          <Tab.Screen name="Comunicação" component={CommunicationScreen} />
          <Tab.Screen name="Alertas" component={AlertsScreen} />
          <Tab.Screen name="Ocorrência" component={OccurrenceScreen} />
          <Tab.Screen name="Config" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MissionProvider>
  );
}
