<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const navItems = [
  { label: '動態牆', icon: 'material-symbols:dynamic-feed', to: '/' },
  { label: '追蹤名單', icon: 'material-symbols:group', to: '/following' },
  { label: '我按讚的', icon: 'material-symbols:thumb-up', to: '/likes' },
  { label: '個人資料', icon: 'material-symbols:person', to: '/profile' },
]

const handleLogout = () => {
  authStore.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-bg">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b-2 border-dark bg-white">
      <div class="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="font-logo text-2xl text-primary">
          MetaWall
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink
            v-if="authStore.isLoggedIn"
            to="/post/create"
            class="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
          >
            張貼動態
          </NuxtLink>
          <div v-if="authStore.isLoggedIn" class="group relative">
            <button class="flex items-center gap-2">
              <img
                :src="authStore.user?.photo || '/default-avatar.svg'"
                class="h-8 w-8 rounded-full border-2 border-primary object-cover"
                alt="avatar"
              />
              <span class="text-sm font-medium text-dark">{{ authStore.user?.name }}</span>
            </button>
            <div class="invisible absolute right-0 top-full w-40 pt-2 group-hover:visible">
              <div class="rounded-lg border border-gray-border bg-white py-2 shadow-lg">
              <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-dark hover:bg-accent">
                個人資料
              </NuxtLink>
              <button class="block w-full px-4 py-2 text-left text-sm text-dark hover:bg-accent" @click="handleLogout">
                登出
              </button>
              </div>
            </div>
          </div>
          <NuxtLink v-else to="/login" class="text-sm text-primary hover:underline">
            登入
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="mx-auto flex max-w-screen-xl gap-6 px-4 py-6">
      <!-- Sidebar -->
      <aside class="hidden w-56 shrink-0 lg:block">
        <nav class="sticky top-20 space-y-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
            :class="route.path === item.to ? 'bg-primary text-white' : 'text-dark hover:bg-accent'"
          >
            <Icon :name="item.icon" size="20" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="min-w-0 flex-1">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-dark bg-white lg:hidden">
      <div class="flex justify-around py-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-1 px-3 py-1 text-xs"
          :class="route.path === item.to ? 'text-primary' : 'text-gray-border'"
        >
          <Icon :name="item.icon" size="22" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
