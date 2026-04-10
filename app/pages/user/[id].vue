<script setup lang="ts">
import type { PostsResponse, FollowingResponse, User } from '~/types/api'

const route = useRoute()
const { apiFetch } = useApi()
const authStore = useAuthStore()

const userId = route.params.id as string
const emptyFollowingResponse: FollowingResponse = {
  status: 'success',
  data: {
    following: [],
  },
}

const { data: postsData, refresh: refreshPosts } = await useAsyncData(`user-posts-${userId}`, async () => {
  const res = await apiFetch<PostsResponse>('/posts/')
  return res.data?.filter((p) => {
    const u = p.user as unknown as { _id: string }
    return u?._id === userId
  }) || []
})

const userInfo = computed<Pick<User, '_id' | 'name' | 'photo'> | null>(() => {
  const posts = postsData.value
  if (posts?.length && posts[0]) {
    const u = posts[0].user as Pick<User, '_id' | 'name' | 'photo'>
    return u
  }
  return null
})

const { data: followingData, refresh: refreshFollowing } = await useAsyncData<FollowingResponse>(
  'my-following',
  () => authStore.isLoggedIn
    ? apiFetch<FollowingResponse>('/users/following')
    : Promise.resolve(emptyFollowingResponse),
)

const isFollowing = computed(() => {
  const list = followingData.value?.data.following ?? []
  return list.some((f) => f.user._id === userId)
})

const isSelf = computed(() => userId === authStore.user?._id)

const handleFollow = async () => {
  await apiFetch(`/users/${userId}/follow`, { method: 'POST' })
  refreshFollowing()
}

const handleUnfollow = async () => {
  await apiFetch(`/users/${userId}/unfollow`, { method: 'DELETE' })
  refreshFollowing()
}

const handleLike = async (postId: string) => {
  await apiFetch(`/posts/${postId}/likes`, { method: 'POST' })
  refreshPosts()
}

const handleUnlike = async (postId: string) => {
  await apiFetch(`/posts/${postId}/likes`, { method: 'DELETE' })
  refreshPosts()
}

const handleComment = async (postId: string, comment: string) => {
  await apiFetch(`/posts/${postId}/comment`, {
    method: 'POST',
    body: { comment },
  })
  refreshPosts()
}

const handleDeleteComment = async (commentId: string) => {
  if (!confirm('確定要刪除這則留言嗎？')) return
  await apiFetch(`/posts/comment/${commentId}`, { method: 'DELETE' })
  refreshPosts()
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <!-- User Info -->
    <div v-if="userInfo" class="mb-4 rounded-lg border-2 border-dark bg-white p-6 shadow-[3px_3px_0_#1B3E4F]">
      <div class="flex items-center gap-4">
        <img
          :src="userInfo.photo || '/default-avatar.svg'"
          class="size-16 rounded-full border-2 border-primary object-cover"
          alt="avatar"
        />
        <div class="flex-1">
          <h2 class="text-lg font-bold text-dark">
            {{ userInfo.name }}
          </h2>
          <p class="text-sm text-gray-border">
            {{ postsData?.length || 0 }} 則貼文
          </p>
        </div>
        <template v-if="authStore.isLoggedIn && !isSelf">
          <button
            v-if="isFollowing"
            class="rounded-lg border-2 border-gray-border px-4 py-2 text-sm text-gray-border hover:border-red-400 hover:text-red-400"
            @click="handleUnfollow"
          >
            取消追蹤
          </button>
          <button
            v-else
            class="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
            @click="handleFollow"
          >
            追蹤
          </button>
        </template>
      </div>
    </div>

    <!-- User Posts -->
    <div v-if="postsData?.length" class="space-y-4">
      <PostCard
        v-for="post in postsData"
        :key="post._id"
        :post="post"
        :fallback-user="userInfo || undefined"
        @liked="handleLike(post._id)"
        @unliked="handleUnlike(post._id)"
        @commented="(c) => handleComment(post._id, c)"
        @comment-deleted="(cId) => handleDeleteComment(cId)"
      />
    </div>
    <div v-else class="rounded-lg border-2 border-dark bg-white p-12 text-center shadow-[3px_3px_0_#1B3E4F]">
      <p class="text-sm text-gray-border">
        此用戶還沒有任何貼文
      </p>
    </div>
  </div>
</template>
