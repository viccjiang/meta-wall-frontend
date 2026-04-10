<script setup lang="ts">
import type { ProfileResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const { apiFetch } = useApi()
const authStore = useAuthStore()

const activeTab = ref<'info' | 'password'>('info')

const profileForm = reactive({
  name: authStore.user?.name || '',
  sex: authStore.user?.sex || 'other',
  photo: authStore.user?.photo || '',
})

const passwordForm = reactive({
  password: '',
  confirmPassword: '',
})

const message = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleUpdateProfile = async () => {
  message.value = ''
  errorMsg.value = ''
  loading.value = true
  try {
    const res = await apiFetch<ProfileResponse>('/users/profile', {
      method: 'PATCH',
      body: profileForm,
    })
    authStore.updateUser(res.data)
    message.value = '個人資料已更新'
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    errorMsg.value = e?.data?.message || '更新失敗'
  } finally {
    loading.value = false
  }
}

const handleUpdatePassword = async () => {
  message.value = ''
  errorMsg.value = ''

  if (passwordForm.password !== passwordForm.confirmPassword) {
    errorMsg.value = '密碼與確認密碼不一致'
    return
  }

  loading.value = true
  try {
    await apiFetch('/users/updatePassword', {
      method: 'POST',
      body: passwordForm,
    })
    message.value = '密碼已更新'
    passwordForm.password = ''
    passwordForm.confirmPassword = ''
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    errorMsg.value = e?.data?.message || '密碼更新失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h2 class="mb-4 text-lg font-bold text-dark">
      個人資料設定
    </h2>

    <div class="rounded-lg border-2 border-dark bg-white shadow-[3px_3px_0_#1B3E4F]">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button
          class="flex-1 py-3 text-sm font-medium transition-colors"
          :class="activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-gray-border'"
          @click="activeTab = 'info'"
        >
          修改資料
        </button>
        <button
          class="flex-1 py-3 text-sm font-medium transition-colors"
          :class="activeTab === 'password' ? 'border-b-2 border-primary text-primary' : 'text-gray-border'"
          @click="activeTab = 'password'"
        >
          修改密碼
        </button>
      </div>

      <div class="p-6">
        <!-- Profile Info -->
        <form v-if="activeTab === 'info'" class="space-y-4" @submit.prevent="handleUpdateProfile">
          <div class="flex justify-center">
            <img
              :src="profileForm.photo || '/default-avatar.svg'"
              class="size-20 rounded-full border-2 border-primary object-cover"
              alt="avatar"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-dark">暱稱</label>
            <input
              v-model="profileForm.name"
              type="text"
              required
              class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-dark">性別</label>
            <select
              v-model="profileForm.sex"
              class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="other">
                不公開
              </option>
              <option value="male">
                男性
              </option>
              <option value="female">
                女性
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-dark">大頭照網址</label>
            <input
              v-model="profileForm.photo"
              type="url"
              placeholder="輸入圖片網址"
              class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            更新資料
          </button>
        </form>

        <!-- Password -->
        <form v-else class="space-y-4" @submit.prevent="handleUpdatePassword">
          <div>
            <label class="mb-1 block text-sm font-medium text-dark">新密碼</label>
            <input
              v-model="passwordForm.password"
              type="password"
              required
              placeholder="請輸入新密碼"
              class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-dark">確認新密碼</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              placeholder="請再次輸入新密碼"
              class="w-full rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            更新密碼
          </button>
        </form>

        <p v-if="message" class="mt-3 text-center text-sm text-green-600">
          {{ message }}
        </p>
        <p v-if="errorMsg" class="mt-3 text-center text-sm text-red-500">
          {{ errorMsg }}
        </p>
      </div>
    </div>
  </div>
</template>
