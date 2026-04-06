<script setup lang="ts">
import type { PostsResponse } from '~/types/api'

const { apiFetch } = useApi()
const authStore = useAuthStore()

const search = ref('')
const timeSort = ref('desc')
const postFormRef = ref()

const { data: posts, refresh } = await useAsyncData('posts', () =>
  apiFetch<PostsResponse>('/posts/', {
    query: {
      timeSort: timeSort.value,
      q: search.value || undefined,
    },
  }), {
  watch: [timeSort],
})

const handleSearch = () => {
  refresh()
}

const handleCreatePost = async (data: { content: string; photo: string }) => {
  try {
    await apiFetch('/posts/', {
      method: 'POST',
      body: data,
    })
    postFormRef.value?.reset()
    refresh()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    alert(e?.data?.message || '發文失敗')
  }
}

const handleLike = async (postId: string) => {
  await apiFetch(`/posts/${postId}/likes`, { method: 'POST' })
  refresh()
}

const handleUnlike = async (postId: string) => {
  await apiFetch(`/posts/${postId}/likes`, { method: 'DELETE' })
  refresh()
}

const handleComment = async (postId: string, comment: string) => {
  await apiFetch(`/posts/${postId}/comment`, {
    method: 'POST',
    body: { comment },
  })
  refresh()
}

const handleDeletePost = async (postId: string) => {
  if (!confirm('確定要刪除這則貼文嗎？')) return
  await apiFetch(`/posts/${postId}`, { method: 'DELETE' })
  refresh()
}

const handleDeleteComment = async (commentId: string) => {
  if (!confirm('確定要刪除這則留言嗎？')) return
  await apiFetch(`/posts/comment/${commentId}`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Post Form -->
    <PostForm
      v-if="authStore.isLoggedIn"
      ref="postFormRef"
      @submitted="handleCreatePost"
    />

    <!-- Search & Filter -->
    <div class="flex flex-col gap-3 sm:flex-row">
      <form class="flex flex-1 gap-2" @submit.prevent="handleSearch">
        <input
          v-model="search"
          type="text"
          placeholder="搜尋貼文內容"
          class="flex-1 rounded-lg border-2 border-dark px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          class="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
        >
          搜尋
        </button>
      </form>
      <select
        v-model="timeSort"
        class="rounded-lg border-2 border-dark px-3 py-2 text-sm focus:border-primary focus:outline-none"
      >
        <option value="desc">
          最新貼文
        </option>
        <option value="asc">
          最舊貼文
        </option>
      </select>
    </div>

    <!-- Posts List -->
    <div v-if="posts?.data?.length" class="space-y-4">
      <PostCard
        v-for="post in posts.data"
        :key="post._id"
        :post="post"
        @liked="handleLike(post._id)"
        @unliked="handleUnlike(post._id)"
        @commented="(c) => handleComment(post._id, c)"
        @deleted="handleDeletePost(post._id)"
        @comment-deleted="(cId) => handleDeleteComment(cId)"
      />
    </div>
    <div v-else class="rounded-lg border-2 border-dark bg-white p-12 text-center shadow-[3px_3px_0_#1B3E4F]">
      <Icon name="material-symbols:article-outline" size="48" class="mx-auto text-gray-border" />
      <p class="mt-3 text-sm text-gray-border">
        {{ search ? '找不到相關貼文' : '目前還沒有任何貼文' }}
      </p>
    </div>
  </div>
</template>
