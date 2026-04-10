<script setup lang="ts">
const props = defineProps<{
  user: {
    _id: string
    name: string
    photo: string
  }
  showFollow?: boolean
  isFollowing?: boolean
}>()

const emit = defineEmits<{
  follow: []
  unfollow: []
}>()

const authStore = useAuthStore()
const isSelf = computed(() => props.user._id === authStore.user?._id)
</script>

<template>
  <div class="flex items-center gap-3 rounded-lg border-2 border-dark bg-white p-4 shadow-[3px_3px_0_#1B3E4F]">
    <NuxtLink :to="`/user/${user._id}`">
      <img
        :src="user.photo || '/default-avatar.svg'"
        class="size-10 rounded-full border-2 border-primary object-cover"
        alt="avatar"
      />
    </NuxtLink>
    <NuxtLink :to="`/user/${user._id}`" class="flex-1 text-sm font-bold text-dark hover:underline">
      {{ user.name }}
    </NuxtLink>
    <template v-if="showFollow && authStore.isLoggedIn && !isSelf">
      <button
        v-if="isFollowing"
        class="rounded-lg border-2 border-gray-border px-3 py-1 text-xs text-gray-border hover:border-red-400 hover:text-red-400"
        @click="emit('unfollow')"
      >
        取消追蹤
      </button>
      <button
        v-else
        class="rounded-lg border-2 border-primary bg-primary px-3 py-1 text-xs text-white hover:bg-primary/90"
        @click="emit('follow')"
      >
        追蹤
      </button>
    </template>
  </div>
</template>
