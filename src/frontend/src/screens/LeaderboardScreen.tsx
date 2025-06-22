import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { getLeaderboard } from '../api';
import { useNavigation } from '@react-navigation/native';

export default function LeaderboardScreen() {
  const nav = useNavigation<any>();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await getLeaderboard();
      setRows(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.gold} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: spacing(10),
        }}
      >
        <Text style={styles.title}>🏆 Leaderboard</Text>

        {rows.map((r, i) => (
          <View key={r.username} style={styles.row}>
            <Text style={styles.rank}>{i + 1}.</Text>
            <Text style={styles.name}>{r.username}</Text>
            <Text style={styles.stat}>
              {r.wins}-{r.losses}-{r.draws}
            </Text>
          </View>
        ))}

        <Pressable onPress={() => nav.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gold,
    textAlign: 'center',
    marginVertical: spacing(6),
  },
  row: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing(3),
    borderRadius: 6,
    marginVertical: spacing(1),
  },
  rank: { color: colors.gold, fontSize: 18, width: 30 },
  name: { flex: 1, color: colors.text, fontSize: 18 },
  stat: { color: colors.green, fontWeight: '600' },
  backBtn: { marginTop: spacing(6), alignItems: 'center' },
  backText: { color: colors.gold, fontSize: 16 },
});
