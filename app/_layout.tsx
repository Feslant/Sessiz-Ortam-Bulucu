import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { LogBox, Platform } from 'react-native';
import 'react-native-reanimated';

LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted',
  'VirtualizedLists should never be nested',
]);

type TimerMap = Record<string, ReturnType<typeof global.setTimeout>>;

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      const _setTimeout = global.setTimeout;
      const _clearTimeout = global.clearTimeout;

      const MAX_TIMER_DURATION_MS = 60 * 1000;
      const timerFix: TimerMap = {};

      const runTask = (
        id: string,
        fn: (...args: any[]) => void,
        ttl: number,
        args?: any[]
      ) => {
        const waitingTime = ttl - Date.now();

        if (waitingTime <= 0) {
          fn(...(args ?? []));
          return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(
          () => runTask(id, fn, ttl, args),
          afterTime
        );
      };

      global.setTimeout = ((fn: (...args: any[]) => void, time?: number, ...args: any[]) => {
        if (time && time > MAX_TIMER_DURATION_MS) {
          const ttl = Date.now() + time;
          const id = `_lt_${Object.keys(timerFix).length}`;
          runTask(id, fn, ttl, args);
          return id as any;
        }
        return _setTimeout(fn, time as number, ...args);
      }) as typeof setTimeout;

      global.clearTimeout = ((id: any) => {
        if (typeof id === 'string' && id.startsWith('_lt_')) {
          _clearTimeout(timerFix[id]);
          delete timerFix[id];
          return;
        }
        _clearTimeout(id);
      }) as typeof clearTimeout;
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="place-detail"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        options={{ presentation: 'card', headerShown: false }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
