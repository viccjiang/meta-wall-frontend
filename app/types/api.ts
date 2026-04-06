export interface User {
  _id: string
  name: string
  email: string
  photo: string
  sex: string
  followers: { user: string }[]
  following: { user: string }[]
}

export interface Comment {
  _id: string
  comment: string
  user: Pick<User, '_id' | 'name' | 'photo'>
  createdAt: string
}

export interface Post {
  _id: string
  content: string
  photo: string
  user: Pick<User, '_id' | 'name' | 'photo'>
  likes: string[]
  comments: Comment[]
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface PostsResponse {
  status: string
  data: Post[]
}

export interface ProfileResponse {
  status: string
  data: User
}

export interface FollowingResponse {
  status: string
  data: {
    following: { user: Pick<User, '_id' | 'name' | 'photo'> }[]
  }
}

export interface LikesResponse {
  status: string
  data: Post[]
}
