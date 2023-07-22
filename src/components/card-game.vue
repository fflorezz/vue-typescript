<script setup lang="ts">
import { reactive, watchEffect, ref, onMounted, watch } from 'vue'

import { shuffle } from 'lodash'

type Card = {
  id: number
  content: string
  flipped: boolean
  matched: boolean
}

const UNFLIP_DELAY_MS = 1000
const GRID_OPTIONS = [2, 4, 6]
const unfliping = ref(false)
const cards = ref<Card[]>([])
const gridOption = ref(GRID_OPTIONS[0])

onMounted(() => {
  newGame()
})

watch(gridOption, () => {
  newGame()
})

watchEffect(() => {
  const flippedCards = cards.value.filter(card => card.flipped && !card.matched)

  if (flippedCards.length === 2) {
    const [firstCard, secondCard] = flippedCards

    if (firstCard.content === secondCard.content) {
      setMatchedCards(flippedCards)
      if (firstCard.content === '🦄') {
        setAllVisible()
      }
      return
    }

    unflipCards(flippedCards)
  }
})

function setMatchedCards(cards: Card[]) {
  cards.forEach(card => (card.matched = true))
}

function unflipCards(cards: Card[]) {
  unfliping.value = true
  setTimeout(() => {
    cards.forEach(card => (card.flipped = false))
    unfliping.value = false
  }, UNFLIP_DELAY_MS)
}

function setAllVisible() {
  const enableCards = cards.value.filter(card => !card.matched)

  enableCards.forEach(card => {
    if (!card.matched) {
      card.flipped = true
    }
  })

  unflipCards(enableCards)
}

function flipCard(card: Card) {
  if (card.matched || unfliping.value) {
    return
  }
  card.flipped = !card.flipped
}

function newGame() {
  cards.value = generateCards()
}

function generateCards() {
  const emojis = [
    '🦄',
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐼',
    '🐮',
    '🐞',
    '🐷',
    '🐸',
    '🐵',
    '🐔',
    '🐧',
    '🐦',
    '🐤',
    '🐣',
  ].slice(0, (gridOption.value * gridOption.value) / 2)

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
    <div
      class="cards-container"
      :style="{
        'grid-template-columns': `repeat(${gridOption}, 100px)`,
        'grid-template-rows': `repeat(${gridOption}, 100px)`,
      }"
    >
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
    <div class="options">
      <button @click="newGame" class="new-game-button">New Game</button>
      <select v-model="gridOption">
        <option v-for="option in GRID_OPTIONS" :value="option">
          {{ option }}x{{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.cards-container {
  display: grid;
  row-gap: 20px;
  column-gap: 20px;
  grid-template-columns: repeat(5, 100px);
  grid-template-rows: repeat(4, 100px);
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
.options {
  margin-top: 24px;
  gap: 20px;
  display: flex;
  align-items: center;
}
.new-game-button {
  width: 200px;
}
select {
  width: 200px;
}
</style>
