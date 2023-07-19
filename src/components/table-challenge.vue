<script setup lang="ts">
import { computed, ref } from 'vue'

import UserList from './user-list.vue'

import type { User } from '../types.d'

const users = ref<User[]>([])
const defaultUsers = ref<User[]>([])
const isLoading = ref(false)
const filter = ref('')
const colored = ref(false)
const sorted = ref(false)
const filteredUsers = computed(() => {
  if (!filter.value) {
    return users.value
  }

  return users.value.filter(user =>
    user.location.country.toLowerCase().includes(filter.value.toLowerCase())
  )
})
const sortedUsers = computed(() => {
  if (!sorted.value) {
    return filteredUsers.value
  }

  return filteredUsers.value.toSorted((a, b) =>
    a.location.country.localeCompare(b.location.country)
  )
})

isLoading.value = true
fetchUsers().then(results => {
  // console.log(results)
  users.value = results
  defaultUsers.value = results
  isLoading.value = false
})

async function fetchUsers() {
  const response = await fetch('https://randomuser.me/api/?results=100').then(
    response => response.json()
  )
  const results = response.results
  return results
}

function deleteUser(uuid: string) {
  users.value = users.value.filter(user => user.login.uuid !== uuid)
}

function resetUsers() {
  users.value = defaultUsers.value
}
</script>

<template>
  <div>
    <h1>Users</h1>

    <header class="grid">
      <label for="colored">
        <input
          v-model="colored"
          type="checkbox"
          id="colored"
          name="colored"
          role="switch"
        />
        Colored
      </label>

      <label for="sorted">
        <input
          type="checkbox"
          id="sorted"
          name="sorted"
          role="switch"
          v-model="sorted"
        />
        Sorted by country
      </label>

      <button @click="resetUsers">Reset</button>

      <input
        type="text"
        id="filter"
        v-model="filter"
        placeholder="Filter by..."
      />
    </header>

    <main :aria-busy="isLoading">
      <user-list
        v-if="users.length"
        :users="sortedUsers"
        :colored="colored"
        @delete-user="deleteUser"
      ></user-list>
    </main>
  </div>
</template>

<style>
header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  align-items: center;
}
</style>
