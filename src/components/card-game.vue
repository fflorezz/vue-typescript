<script setup lang="ts">
import { reactive, watchEffect } from 'vue'

import { shuffle } from 'lodash'

type Card = {
  id: number
  content: string
  flipped: boolean
  matched: boolean
}

const cards: Card[] = generateCards()

watchEffect(() => {
  const flippedCards = cards.filter(card => card.flipped && !card.matched)

  if (flippedCards.length === 2) {
    compareCards(flippedCards)
  }
})

function compareCards(cards: Card[]) {
  const matched = cards[0].content === cards[1].content

  if (matched) {
    setMatchedCards(cards)
    return
  }

  unflipCards(cards)
}

function setMatchedCards(cards: Card[]) {
  cards.forEach(card => (card.matched = true))
}

function unflipCards(cards: Card[]) {
  setTimeout(() => {
    cards.forEach(card => (card.flipped = false))
  }, 1000)
}

function flipCard(card: Card) {
  if (card.matched) {
    return
  }
  card.flipped = !card.flipped
}

function generateCards() {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊']
  const cards = emojis.flatMap(emoji => [
    {
      id: Math.random(),
      content: emoji,
      flipped: false,
      matched: false,
    },
    {
      id: Math.random(),
      content: emoji,
      flipped: false,
      matched: false,
    },
  ])

  return reactive(shuffle(cards))
}
</script>

<template>
  <div class="container">
    <h1>Card Game</h1>
    <div class="cards-container">
      <div
        v-for="card in cards"
        :key="card.id"
        class="card"
        :class="{ flipped: card.flipped, matched: card.matched }"
        @click="flipCard(card)"
      >
        <div class="back">
          <div class="">{{ card.content }}</div>
        </div>
        <div class="front"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-container {
  display: grid;
  row-gap: 20px;
  column-gap: 20px;
  grid-template-columns: repeat(4, 100px);
  grid-template-rows: repeat(3, 100px);
}
.card {
  position: relative;
  cursor: pointer;
}

.back,
.front {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: transform 0.3s ease-in-out;
  position: absolute;
  backface-visibility: hidden;
}
.card.matched {
  opacity: 0.5;
  cursor: default;
}
.card.flipped .front {
  transform: rotateY(-0.5turn);
}
.card.flipped .back {
  transform: rotateY(0turn);
}
.back {
  transform: rotateY(0.5turn);
}

.front {
  background-color: salmon;
}
</style>
