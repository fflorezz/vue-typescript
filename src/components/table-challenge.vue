<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

import UserList from './user-list.vue'

import type { User } from '../types.d'

const state = reactive({
  users: [] as User[],
  defaultUsers: [] as User[],
  isLoading: false,
  filter: '',
  colored: false,
  sorted: false,
})

const filteredUsers = computed(() => {
  if (!state.filter) {
    return state.users
  }

  return state.users.filter(user =>
    user.location.country.toLowerCase().includes(state.filter.toLowerCase())
  )
})

const sortedUsers = computed(() => {
  if (!state.sorted) {
    return filteredUsers.value
  }

  return filteredUsers.value.toSorted((a, b) =>
    a.location.country.localeCompare(b.location.country)
  )
})

async function fetchUsers() {
  state.isLoading = true
  const response = await fetch('https://randomuser.me/api/?results=100')
  const data = await response.json()
  state.users = data.results
  state.defaultUsers = data.results
  state.isLoading = false
}

function deleteUser(uuid: string) {
  state.users = state.users.filter(user => user.login.uuid !== uuid)
}

function resetUsers() {
  state.users = state.defaultUsers
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <h1>Users</h1>

    <header class="grid">
      <label for="colored">
        <input
          v-model="state.colored"
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
          v-model="state.sorted"
        />
        Sorted by country
      </label>

      <button @click="resetUsers">Reset</button>

      <input
        type="text"
        id="filter"
        v-model="state.filter"
        placeholder="Filter by..."
      />
    </header>

    <main :aria-busy="state.isLoading">
      <user-list
        v-if="state.users.length"
        :users="sortedUsers"
        :colored="state.colored"
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
