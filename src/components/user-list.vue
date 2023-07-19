<script setup lang="ts">
import type { PropType } from 'vue'
import type { User } from '../types.d'

defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
  colored: {
    type: Boolean,
  },
})
</script>

<template>
  <table :role="colored ? 'grid' : 'table'">
    <thead>
      <tr>
        <th scope="col">Picture</th>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Country</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.login.uuid">
        <td><img :src="user.picture.thumbnail" alt="" /></td>
        <td>{{ user.name.first }}</td>
        <td>{{ user.name.last }}</td>
        <td>{{ user.location.country }}</td>
        <td>
          <button
            @click="$emit('delete-user', user.login.uuid)"
            class="outline"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
