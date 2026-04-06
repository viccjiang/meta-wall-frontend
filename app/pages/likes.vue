<script setup lang="ts">
import type { LikesResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const { apiFetch } = useApi()

const { data: likesData, refresh } = await useAsyncData('likes', () =>
  apiFetch<LikesResponse>('/users/getLikeList'),
)

const handleUnlike = async (postId: string) => {
  await apiFetch(`/posts/${postId}/likes`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h2 class="mb-4 text-lg font-bold text-dark">
      我按讚的貼文
    </h2>

    <div v-if="likesData?.data?.length" class="space-y-3">
      <div
        v-for="post in likesData.data"
        :key="post._id"
        class="flex items-center gap-3 rounded-lg border-2 border-dark bg-white p-4 shadow-[3px_3px_0_#1B3E4F]"
      >
        <NuxtLink :to="`/user/${post.user._id}`">
          <img
            :src="post.user.photo || '/default-avatar.svg'"
            class="h-10 w-10 rounded-full border-2 border-primary object-cover"
            alt="avatar"
          />
        </NuxtLink>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold text-dark">
            {{ post.user.name }}
          </p>
          <p class="truncate text-xs text-gray-border">
            {{ post.content }}
          </p>
        </div>
        <button
          class="shrink-0 text-primary hover:text-red-400"
          title="取消按讚"
          @click="handleUnlike(post._id)"
        >
          <Icon name="material-symbols:thumb-up" size="20" />
        </button>
      </div>
    </div>
    <div v-else class="rounded-lg border-2 border-dark bg-white p-12 text-center shadow-[3px_3px_0_#1B3E4F]">
      <Icon name="material-symbols:thumb-up-outline" size="48" class="mx-auto text-gray-border" />
      <p class="mt-3 text-sm text-gray-border">
        還沒有按讚任何貼文
      </p>
    </div>
  </div>
</template>
