<script setup lang="ts">
interface Comment {
  _id: string
  comment: string
  user: { _id: string; name: string; photo: string }
  createdAt: string
}

interface Post {
  _id: string
  content: string
  photo?: string
  image?: string
  user: { _id: string; name: string; photo?: string } | string
  likes: string[]
  comments: Comment[]
  createdAt?: string
}

const props = defineProps<{
  post: Post
  fallbackUser?: { _id: string; name: string; photo?: string }
}>()

const emit = defineEmits<{
  liked: []
  unliked: []
  commented: [comment: string]
  deleted: []
  commentDeleted: [commentId: string]
}>()

const authStore = useAuthStore()
const commentText = ref('')
const showComments = ref(false)

const postUser = computed(() => {
  const u = props.post.user
  if (typeof u === 'string') return props.fallbackUser || { _id: u, name: '使用者', photo: '' }
  return u
})

const postImage = computed(() => props.post.image || props.post.photo || '')

const isLiked = computed(() => {
  return props.post.likes?.includes(authStore.user?._id || '')
})

const timeFromObjectId = (id: string) => {
  const timestamp = Number.parseInt(id.substring(0, 8), 16) * 1000
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const timeAgo = (dateStr: string, objectId?: string) => {
  let time = new Date(dateStr).getTime()
  if (Number.isNaN(time) && objectId) time = timeFromObjectId(objectId)
  if (!time) return ''
  const diff = Date.now() - time
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '剛剛'
  if (mins < 60) return `${mins} 分鐘前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小時前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} 個月前`
  const years = Math.floor(days / 365)
  const remainDays = days - years * 365
  const remainMonths = Math.floor(remainDays / 30)
  if (remainMonths > 0) return `${years} 年 ${remainMonths} 個月前`
  return `${years} 年前`
}

const handleComment = () => {
  if (!commentText.value.trim()) return
  emit('commented', commentText.value)
  commentText.value = ''
}
</script>

<template>
  <div class="rounded-lg border-2 border-dark bg-white shadow-[3px_3px_0_#1B3E4F]">
    <!-- Post Header -->
    <div class="flex items-center gap-3 p-4">
      <NuxtLink :to="`/user/${postUser._id}`">
        <img
          :src="postUser.photo || '/default-avatar.svg'"
          class="size-10 rounded-full border-2 border-primary object-cover"
          alt="avatar"
        />
      </NuxtLink>
      <div class="flex-1">
        <NuxtLink :to="`/user/${postUser._id}`" class="text-sm font-bold text-dark hover:underline">
          {{ postUser.name }}
        </NuxtLink>
        <p class="text-xs text-gray-border">
          {{ timeAgo(post.createdAt || '', post._id) }}
        </p>
      </div>
      <button
        v-if="postUser._id === authStore.user?._id"
        class="text-gray-border hover:text-red-500"
        title="刪除貼文"
        @click="emit('deleted')"
      >
        <Icon name="material-symbols:delete-outline" size="20" />
      </button>
    </div>

    <!-- Post Content -->
    <div class="px-4 pb-3">
      <p class="whitespace-pre-wrap text-sm text-dark">
        {{ post.content }}
      </p>
    </div>

    <!-- Post Image -->
    <div v-if="postImage" class="px-4 pb-3">
      <img :src="postImage" class="w-full rounded-lg object-cover" alt="post image"/>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4 border-t border-gray-200 px-4 py-3">
      <button
        v-if="authStore.isLoggedIn"
        class="flex items-center gap-1 text-sm transition-colors"
        :class="isLiked ? 'text-primary font-bold' : 'text-gray-border hover:text-primary'"
        @click="isLiked ? emit('unliked') : emit('liked')"
      >
        <Icon :name="isLiked ? 'material-symbols:thumb-up' : 'material-symbols:thumb-up-outline'" size="18" />
        {{ post.likes?.length || 0 }}
      </button>
      <span v-else class="flex items-center gap-1 text-sm text-gray-border">
        <Icon name="material-symbols:thumb-up-outline" size="18" />
        {{ post.likes?.length || 0 }}
      </span>
      <button
        class="flex items-center gap-1 text-sm text-gray-border hover:text-primary"
        @click="showComments = !showComments"
      >
        <Icon name="material-symbols:chat-bubble-outline" size="18" />
        {{ post.comments?.length || 0 }}
      </button>
    </div>

    <!-- Comments Section -->
    <div v-if="showComments" class="border-t border-gray-200">
      <!-- Comment List -->
      <div v-if="post.comments?.length" class="max-h-60 space-y-3 overflow-y-auto p-4">
        <div v-for="c in post.comments" :key="c._id" class="flex gap-2">
          <img
            :src="c.user.photo || '/default-avatar.svg'"
            class="size-7 shrink-0 rounded-full border border-primary object-cover"
            alt="avatar"
          />
          <div class="flex-1 rounded-lg bg-accent p-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-dark">{{ c.user.name }}</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-border">{{ timeAgo(c.createdAt, c._id) }}</span>
                <button
                  v-if="c.user._id === authStore.user?._id"
                  class="text-gray-border hover:text-red-500"
                  @click="emit('commentDeleted', c._id)"
                >
                  <Icon name="material-symbols:close" size="14" />
                </button>
              </div>
            </div>
            <p class="mt-1 text-xs text-dark">
              {{ c.comment }}
            </p>
          </div>
        </div>
      </div>

      <!-- Comment Input -->
      <div v-if="authStore.isLoggedIn" class="flex gap-2 border-t border-gray-200 p-4">
        <input
          v-model="commentText"
          type="text"
          placeholder="留言..."
          class="flex-1 rounded-lg border border-gray-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          @keyup.enter="handleComment"
        />
        <button
          class="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
          :disabled="!commentText.trim()"
          @click="handleComment"
        >
          送出
        </button>
      </div>
    </div>
  </div>
</template>
