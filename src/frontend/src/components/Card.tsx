import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = { value: string; suit: string };

export function Card({ value, suit }: Props) {
  const isRed  = suit === 'hearts' || suit === 'diamonds';
  const colour = isRed ? colors.red : colors.bg;          // 👈 changed

  const suitIcon =
    suit === 'hearts'   ? 'cards-heart'
  : suit === 'diamonds' ? 'cards-diamond'
  : suit === 'clubs'    ? 'cards-club'
  :                       'cards-spade';

  return (
    <View style={styles.card}>
      <Icon name={suitIcon} size={24} color={colour} style={styles.icon} />
      <Text style={[styles.value, { color: colour }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 60,
    height: 90,
    backgroundColor: colors.card, // white
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 3,
  },
  icon:  { position: 'absolute', top: 6, left: 6 },
  value: { fontSize: 22, fontWeight: '600' },
});
