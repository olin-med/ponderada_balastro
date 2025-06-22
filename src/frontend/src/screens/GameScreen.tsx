import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { startGame, hit, stay, getState, getMe } from '../api';
import { Card } from '../components/Card';
import { colors, spacing } from '../theme';
import Toast from 'react-native-toast-message';
import ResultModal from '../components/ResultModal';

export default function GameScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [state, setState] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const fetchState = async () => {
    const { data } = await getState();
    setState(data);
    if (data.status !== 'playing') setShowResult(true);
  };

  const fetchStats = async () => {
    try {
      const { data } = await getMe();
      setStats(data);
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Session expired' });
      navigation.replace('Login');
    }
  };

  const handle = (action: () => Promise<any>) => async () => {
    setLoading(true);
    try {
      await action();
      await fetchState();
      await fetchStats();
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Oops', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    await startGame();
    await fetchState();
    await fetchStats();
    setShowResult(false);
  };

  const handleHit = handle(hit);
  const handleStay = handle(stay);

  const handleQuit = () => {
    setShowResult(false);
    navigation.navigate('Menu');
  };

  useEffect(() => {
    setShowResult(false);
    fetchState();
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♠ Blackjack</Text>

      {stats && (
        <Text style={styles.stats}>
          Wins: {stats.wins} • Losses: {stats.losses} • Draws: {stats.draws}
        </Text>
      )}

      <Section label="Dealer">
        {state?.dealerHand?.map((c: any, i: number) => (
          <Card key={i} {...c} />
        ))}
      </Section>

      <Section label="You">
        {state?.playerHand?.map((c: any, i: number) => (
          <Card key={i} {...c} />
        ))}
      </Section>

      {loading && (
        <ActivityIndicator color={colors.gold} style={{ marginVertical: spacing(4) }} />
      )}

      <ActionBar
        onStart={handleStart}
        onHit={handleHit}
        onStay={handleStay}
        onQuit={handleQuit}
        disabled={loading || state?.status !== 'playing'}
      />

      <ResultModal
        visible={showResult}
        status={state?.status}
        playerScore={stats?.wins}
        dealerScore={stats?.losses}
        onPlayAgain={handleStart}
        onQuit={handleQuit}
      />

      <Toast />
    </View>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.cards}>{children}</View>
    </View>
  );
}

function ActionBar({
  onStart,
  onHit,
  onStay,
  onQuit,
  disabled,
}: {
  onStart: () => void;
  onHit: () => void;
  onStay: () => void;
  onQuit: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.actions}>
      <ActionButton label="Start" onPress={onStart} color={colors.green} />
      <ActionButton label="Hit" onPress={onHit} disabled={disabled} color={colors.gold} />
      <ActionButton label="Stay" onPress={onStay} disabled={disabled} color={colors.red} />
      <ActionButton label="Back to Menu" onPress={onQuit} color={colors.surface} />
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
  color,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  color: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: color },
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.3 },
      ]}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(4),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gold,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  stats: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing(4),
  },
  section: {
    marginVertical: spacing(3),
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    marginBottom: spacing(2),
  },
  cards: { flexDirection: 'row' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: spacing(6),
  },
  btn: {
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(6),
    borderRadius: 6,
    marginHorizontal: spacing(1.5),
    marginVertical: spacing(1),
  },
  btnText: { color: colors.text, fontWeight: '600', fontSize: 16 },
});
