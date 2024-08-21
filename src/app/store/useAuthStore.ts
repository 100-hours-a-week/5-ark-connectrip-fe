import { create } from 'zustand'
import { api } from '../utils/api'
import { useRouter } from 'next/router'

interface AuthState {
  userId: string | null
  nickname: string | null
  profileImage: string | null
  setUser: (userData: {
    userId: string
    nickname: string
    profileImage: string
  }) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
}

const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  nickname: null,
  profileImage: null,

  // 유저 정보를 한번에 설정
  setUser: ({ userId, nickname, profileImage }) =>
    set({
      userId,
      nickname,
      profileImage,
    }),

  // 유저 정보를 한번에 삭제
  clearUser: () =>
    set({
      userId: null,
      nickname: null,
      profileImage: null,
    }),

  // 서버에서 유저 정보를 가져와 설정
  fetchUser: async () => {
    const router = useRouter()
    try {
      const response = await api.get('/api/v1/members/me')
      const { message, data } = response

      if (message === 'FIRST_LOGIN') {
        router.push('/signup')
      } else if (message === 'SUCCESS') {
        const { userId, nickname, profileImage } = data
        get().setUser({ userId, nickname, profileImage })
      }
    } catch (error) {
      console.error('유저 정보를 가져오는 중 오류 발생:', error)
    }
  },
}))

export default useAuthStore
