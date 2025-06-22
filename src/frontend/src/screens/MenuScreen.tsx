import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { getMe } from '../api';
import Toast from 'react-native-toast-message';

export default function MenuScreen() {
  const nav = useNavigation<any>();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMe();
        setStats(data);
      } catch (e: any) {
        Toast.show({ type: 'error', text1: 'Session expired' });
        nav.replace('Login');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Welcome, {stats.username}</Text>
      <Text style={styles.subtitle}>
        Wins: {stats.wins} • Losses: {stats.losses} • Draws: {stats.draws}
      </Text>

      <Button label="Play" onPress={() => nav.navigate('Game')} color={colors.green}/>
      <Button label="Leaderboard" onPress={() => nav.navigate('Leaderboard')} />
      <Button label="Logout" onPress={() => nav.replace('Login')} color={colors.red} />
    </View>
  );
}

const Button = ({ label, onPress, color = colors.surface }: any) => (
  <Pressable onPress={onPress} style={({ pressed }) => [
    styles.btn, { backgroundColor: color }, pressed && { opacity: 0.7 }]}>
    <Text style={styles.btnText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  containerCenter: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing(6) },
  title: { fontSize: 26, fontWeight: '700', color: colors.gold, marginBottom: spacing(2) },
  subtitle: { color: colors.text, marginBottom: spacing(8) },
  btn: {
    width: '80%',
    paddingVertical: spacing(4),
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: spacing(2),
  },
  btnText: { color: colors.text, fontSize: 18, fontWeight: '600' },
});
