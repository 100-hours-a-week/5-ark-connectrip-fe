import { sendLocationMessage } from '@/app/utils/sendLocationMessage'
import { leaveChatRoom } from '@/app/utils/fetchUtils'
import { sendLeaveMessage } from './sendLeaveMessage'

interface FetchLocationParams {
  chatRoomId: number
  trackingEnabled: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setCompanionLocations: React.Dispatch<React.SetStateAction<any[]>>
  showError: (msg: string) => void
  showSuccess: (msg: string) => void
}

export const fetchLocation = async ({
  chatRoomId,
  trackingEnabled,
  setLoading,
  setCompanionLocations,
  showError,
  showSuccess,
}: FetchLocationParams) => {
  if (!navigator.geolocation) {
    showError('위치 정보를 가져올 수 없습니다.')
    setLoading(false)
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude: lat, longitude: lng } = position.coords
      // API call and state updates
      setLoading(false)
      showSuccess('위치 공유가 활성화되었습니다.')
    },
    (error) => {
      console.error('Error fetching location:', error)
      showError('팝업에서 위치 정보를 허용해주세요.')
      setLoading(false)
    }
  )
}

interface SendLocationParams {
  nickname: string
  chatRoomId: number
  userId: number
  trackingEnabled: boolean
  clientRef: any
  showError: (msg: string) => void
  showSuccess: (msg: string) => void
}

export const handleSendLocation = ({
  nickname,
  chatRoomId,
  userId,
  trackingEnabled,
  clientRef,
  showError,
  showSuccess,
}: SendLocationParams) => {
  if (!navigator.geolocation) {
    showError('위치 정보를 가져올 수 없습니다.')
    return
  }

  if (!trackingEnabled) {
    showError('내 위치 추적을 허용해주세요.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      const kakaoMapLink = `https://map.kakao.com/link/map/${nickname},${latitude},${longitude}`

      sendLocationMessage({
        clientRef,
        chatRoomId,
        userId: userId.toString(),
        nickname,
        locationLink: kakaoMapLink || '',
      })

      showSuccess('위치 정보가 채팅방에 전송되었습니다.')
    },
    (error) => {
      console.error('Error fetching location:', error)
      showError('팝업에서 위치 정보를 허용해주세요.')
    }
  )
}

interface LeaveGroupParams {
  clientRef: any
  chatRoomId: number
  userId: number
  nickname: string
  showSuccess: (msg: string) => void
}

export const handleLeaveGroup = async ({
  clientRef,
  chatRoomId,
  userId,
  nickname,
  showSuccess,
}: LeaveGroupParams) => {
  try {
    sendLeaveMessage({
      clientRef,
      chatRoomId,
      userId: userId.toString(),
      nickname,
    })
    await leaveChatRoom(chatRoomId)
    showSuccess('채팅방에서 나가셨습니다.')
  } catch (error) {
    console.error('채팅방 나가기 중 오류 발생:', error)
  }
}
