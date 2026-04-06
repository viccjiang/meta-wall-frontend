<script setup lang="ts">
import type { ProfileResponse } from '~/types/api'
import { extractAuthPayload } from '~/utils/auth'

definePageMeta({ layout: 'auth' })

const { apiFetch } = useApi()
const authStore = useAuthStore()
const route = useRoute()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const errorMsg = ref('')
const loading = ref(false)
const redirectPath = computed(() => {
  const redirect = route.query.redirect

  if (typeof redirect !== 'string' || !redirect.startsWith('/')) {
    return '/'
  }

  return redirect
})

const handleRegister = async () => {
  errorMsg.value = ''

  if (form.password !== form.confirmPassword) {
    errorMsg.value = '密碼與確認密碼不一致'
    return
  }

  loading.value = true
  try {
    const res = await apiFetch<unknown>('/users/sign_up', {
      method: 'POST',
      body: form,
    })
    const { token, user } = extractAuthPayload(res)

    if (!token) {
      throw new Error('註冊成功但未取得授權 token')
    }

    authStore.setToken(token)

    const currentUser = user || (await apiFetch<ProfileResponse>('/users/profile')).data
    authStore.setAuth(token, currentUser)
    await navigateTo(redirectPath.value)
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    errorMsg.value = e?.data?.message || '註冊失敗，請重試'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="mb-6 text-center text-xl font-bold text-dark">
      註冊
    </h2>
    <form class="space-y-4" @submit.prevent="handleRegister">
      <div>
        <label class="mb-1 block text-sm font-medium text-dark">暱稱</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="請輸入暱稱"
          class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-dark">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="請輸入 Email"
          class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-dark">密碼</label>
        <input
          v-model="form.password"
          type="password"
          required
          placeholder="請輸入密碼"
          class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-dark">確認密碼</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="請再次輸入密碼"
          class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-500">
        {{ errorMsg }}
      </p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {{ loading ? '註冊中...' : '註冊' }}
      </button>
    </form>
    <p class="mt-4 text-center text-sm text-gray-border">
      已經有帳號？
      <NuxtLink to="/login" class="text-primary hover:underline">
        前往登入
      </NuxtLink>
    </p>
  </div>
</template>
