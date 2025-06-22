export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  value: Value;
}

export interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  deck: Card[];
  status: 'playing' | 'player_bust' | 'dealer_bust' | 'player_win' | 'dealer_win' | 'push';
}