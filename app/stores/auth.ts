import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string>('meta_token', {
    default: () => '',
    sameSite: 'lax',
  })
  const userCookie = useCookie<User | null>('meta_user', {
    default: () => null,
    sameSite: 'lax',
  })

  const token = ref(tokenCookie.value || '')
  const user = ref<User | null>(userCookie.value || null)

  const isLoggedIn = computed(() => !!token.value)

  const syncPersistedAuth = () => {
    tokenCookie.value = token.value || ''
    userCookie.value = user.value
  }

  const setAuth = (nextToken: string, nextUser: User) => {
    token.value = nextToken
    user.value = nextUser
    syncPersistedAuth()
  }

  const setToken = (nextToken: string) => {
    token.value = nextToken
    syncPersistedAuth()
  }

  const updateUser = (nextUser: User) => {
    user.value = nextUser
    syncPersistedAuth()
  }

  const logout = () => {
    token.value = ''
    user.value = null
    tokenCookie.value = null
    userCookie.value = null
  }

  return {
    token,
    user,
    isLoggedIn,
    setToken,
    setAuth,
    updateUser,
    logout,
  }
})
