<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import UserList from './user-list.vue'
import type { User } from '../types.d'
import useFetchUsers from '../hooks/useFetchUsers'

const { users, isLoading, error, isSuccessful } = useFetchUsers()

const state = reactive({
  defaultUsers: [] as User[],
  filter: '',
  colored: false,
  sorted: false,
})

watch(isSuccessful, () => {
  if (isSuccessful.value) {
    state.defaultUsers = users.value
  }
})

const filteredUsers = computed(() => {
  if (!state.filter) {
    return users.value
  }

  return users.value.filter(user =>
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

function deleteUser(uuid: string) {
  users.value = users.value.filter(user => user.login.uuid !== uuid)
}

function resetUsers() {
  users.value = state.defaultUsers
}
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

    <p v-if="error">{{ error.message }}</p>

    <main :aria-busy="isLoading">
      <user-list
        v-if="users.length"
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
