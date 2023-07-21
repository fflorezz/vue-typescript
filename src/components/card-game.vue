<script setup lang="ts">
import { reactive, watchEffect } from 'vue'

const cards = reactive([
  {
    id: 1,
    content: '🐶',
    flipped: false,
    matched: false,
  },
  {
    id: 2,
    content: '🐱',
    flipped: false,
    matched: false,
  },
  {
    id: 3,
    content: '🐶',
    flipped: false,
    matched: false,
  },
  {
    id: 4,
    content: '🐱',
    flipped: false,
    matched: false,
  },
])

watchEffect(() => {
  const flippedCards = cards.filter(card => card.flipped && !card.matched)

  if (flippedCards.length === 2) {
    compareCards(flippedCards)
  }
})

function compareCards(cards) {
  const matched = cards[0].content === cards[1].content

  if (matched) {
    setMatchedCards(cards)
    return
  }

  unflipCards(cards)
}

function setMatchedCards(cards) {
  cards.forEach(card => (card.matched = true))
}

function unflipCards(cards) {
  setTimeout(() => {
    cards.forEach(card => (card.flipped = false))
  }, 1000)
}

function flipCard(card) {
  if (card.matched) {
    return
  }
  card.flipped = !card.flipped
}
</script>

<template>
  <div class="container">
    <h1>Card Game</h1>
    <div class="grid">
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
.card {
  position: relative;
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
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  position: absolute;
  backface-visibility: hidden;
}
.card.flipped .front {
  transform: rotateY(-0.5turn);
}
.card.flipped .back {
  transform: rotateY(0turn);
}
.card .back {
  transform: rotateY(0.5turn);
}
</style>
