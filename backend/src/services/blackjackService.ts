import { Card, GameState } from '../models/types';
import { createDeck } from '../utils/shuffle';

function getCardValue(card: Card): number {
  if (card.value === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.value)) return 10;
  return parseInt(card.value);
}

function calculateScore(hand: Card[]): number {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    const val = getCardValue(card);
    score += val;
    if (card.value === 'A') aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

export function startGame(): GameState {
  const deck = createDeck();
  const playerHand = [deck.pop()!, deck.pop()!];
  const dealerHand = [deck.pop()!];
  return {
    deck,
    playerHand,
    dealerHand,
    status: 'playing'
  };
}

export function hit(state: GameState): GameState {
  state.playerHand.push(state.deck.pop()!);
  const playerScore = calculateScore(state.playerHand);
  if (playerScore > 21) state.status = 'player_bust';
  return state;
}

export function stay(state: GameState): GameState {
  while (calculateScore(state.dealerHand) < 17) {
    state.dealerHand.push(state.deck.pop()!);
  }
  const playerScore = calculateScore(state.playerHand);
  const dealerScore = calculateScore(state.dealerHand);

  if (dealerScore > 21) state.status = 'dealer_bust';
  else if (playerScore > dealerScore) state.status = 'player_win';
  else if (dealerScore > playerScore) state.status = 'dealer_win';
  else state.status = 'push';

  return state;
}