import { ref } from 'vue'
import type { Ref } from 'vue'

import type { User } from '../types.d'

interface UseFetchUsersReturn {
  users: Ref<User[]>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  isSuccessful: Ref<boolean>
}

const API_URL = 'https://randomuser.me/api/?results=100'

export default function useFetchUsers(): UseFetchUsersReturn {
  const isLoading = ref(false)
  const users = ref([])
  const error = ref(null)
  const isSuccessful = ref(false)

  isLoading.value = true

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      users.value = data.results
      isSuccessful.value = true
    })
    .catch(err => {
      error.value = err
    })
    .finally(() => {
      isLoading.value = false
    })

  return { users, error, isLoading, isSuccessful }
}
