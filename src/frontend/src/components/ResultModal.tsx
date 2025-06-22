import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors, spacing } from '../theme';

type Status =
  | 'playing'
  | 'player_bust'
  | 'dealer_bust'
  | 'player_win'
  | 'dealer_win'
  | 'push';

type Props = {
  visible: boolean;
  status?: Status;
  playerScore?: number;
  dealerScore?: number;
  onPlayAgain: () => void;
  onQuit: () => void;
};

const statusTitles: Record<Status, string> = {
  playing: '',
  player_win: '🎉 You Win!',
  dealer_win: '💀 Dealer Wins',
  player_bust: '💥 You Busted!',
  dealer_bust: '🔥 Dealer Busted - You Win!',
  push: '🤝 Push - It\'s a Tie',
};

export default function ResultModal({
  visible,
  status = 'playing',
  playerScore,
  dealerScore,
  onPlayAgain,
  onQuit,
}: Props) {
  const title = statusTitles[status] ?? 'Game Over';

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.scores}>
            <Text style={styles.scoreLine}>
              <Text style={styles.label}>You: </Text>
              {playerScore ?? '--'}
            </Text>
            <Text style={styles.scoreLine}>
              <Text style={styles.label}>Dealer: </Text>
              {dealerScore ?? '--'}
            </Text>
          </View>

          <Pressable style={styles.btn} onPress={onPlayAgain}>
            <Text style={styles.btnText}>Play Again</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.quit]} onPress={onQuit}>
            <Text style={styles.btnText}>Quit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: colors.surface,
    padding: spacing(6),
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing(4),
    textAlign: 'center',
  },
  scores: { marginBottom: spacing(4) },
  scoreLine: {
    fontSize: 18,
    color: colors.text,
    marginVertical: spacing(1),
  },
  label: { fontWeight: '600' },
  btn: {
    width: '100%',
    paddingVertical: spacing(3),
    marginTop: spacing(3),
    borderRadius: 6,
    backgroundColor: colors.green,
    alignItems: 'center',
  },
  quit: { backgroundColor: colors.red },
  btnText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
