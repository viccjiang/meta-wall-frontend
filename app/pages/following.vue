<script setup lang="ts">
import type { FollowingResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const { apiFetch } = useApi()

const { data: followingData, refresh } = await useAsyncData('following', () =>
  apiFetch<FollowingResponse>('/users/following'),
)

const handleUnfollow = async (userId: string) => {
  await apiFetch(`/users/${userId}/unfollow`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h2 class="mb-4 text-lg font-bold text-dark">
      追蹤名單
    </h2>

    <div v-if="followingData?.data?.following?.length" class="space-y-3">
      <UserCard
        v-for="item in followingData.data.following"
        :key="item.user._id"
        :user="item.user"
        show-follow
        is-following
        @unfollow="handleUnfollow(item.user._id)"
      />
    </div>
    <div v-else class="rounded-lg border-2 border-dark bg-white p-12 text-center shadow-[3px_3px_0_#1B3E4F]">
      <Icon name="material-symbols:group-off" size="48" class="mx-auto text-gray-border" />
      <p class="mt-3 text-sm text-gray-border">
        還沒有追蹤任何人
      </p>
    </div>
  </div>
</template>
