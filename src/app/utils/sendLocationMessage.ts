import { Client } from '@stomp/stompjs'

interface SendLeaveMessageParams {
  clientRef: React.MutableRefObject<Client | null>
  chatRoomId: number
  userId: string | null
  nickname: string | null
  locationLink: string
}

export const sendLocationMessage = ({
  clientRef,
  chatRoomId,
  userId,
  nickname,
  locationLink,
}: SendLeaveMessageParams) => {
  if (clientRef.current?.connected) {
    clientRef.current.publish({
      destination: `/pub/chat/room/${chatRoomId}`,
      body: JSON.stringify({
        chatRoomId,
        senderId: userId,
        content: `📍${nickname} 님의 실시간 위치 : ${locationLink}`,
      }),
    })
  }
}
