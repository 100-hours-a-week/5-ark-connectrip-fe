import dayjs from 'dayjs'
import { RecruitmentStatus } from '@/types'
import { Stringifier } from 'postcss'
import { Client } from '@stomp/stompjs'

export interface Chat {
  chatRoomId: number
  accompanyPostId: number
  accompanyPostTitle: string
  accompanyArea: string
  startDate: string
  endDate: string
  lastChatMessage: string
  lastChatMessageTime: string
  memberNumber: number
}

export interface GroupCardProps {
  accompanyPostTitle: string
  accompanyArea: string
  startDate: string
  endDate: string
  lastChatMessage: string
  lastChatMessageTime: string
  memberNumber: number
}

export interface Post {
  id: number
  memberId: number
  leaderId: number
  title: string
  profileImagePath: string
  nickname: string
  createdAt: string
  accompanyArea: string
  startDate?: string
  endDate?: string
  content: string
  customUrl: string
  urlQrPath: string
}

export interface EditPost {
  title: string
  accompanyArea: string
  startDate: string
  endDate: string
  content: string
}

export interface PostCardProps {
  title: string
  content: string
  startDate?: string
  endDate?: string
  accompanyArea: string
  createdAt: string
  nickname: string
  profileImagePath: string | null
}

export interface PrevPost {
  id: number
  title: string
  content: string
  startDate: string
  endDate: string
  accompanyArea: string
  createdAt: string
  nickname: string
  profileImagePath: string | null
}

export interface Comment {
  id: number
  memberId: number
  accompanyPostId: number
  content: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  memberProfileImage: string
  memberNickname: string
}

// 게시글 데이터 인터페이스
export interface PostForm {
  title: string
  accompanyArea: string
  startDate: string | null
  endDate: string | null
  content: Stringifier
}

// 폼 초기값 인터페이스
export interface FormValues {
  title: string
  accompanyArea: string
  startDate: dayjs.Dayjs | null
  endDate: dayjs.Dayjs | null
  content: string
}

// 커뮤니티 초기값 인터페이스
export interface CommunityFormValues {
  title: string
  content: string
}

// AccompanyForm 컴포넌트에 전달되는 props 인터페이스
export interface AccompanyFormProps {
  initialValues: FormValues
  onSubmit: (values: FormValues) => void
  submitText: string
}

// 캘린더 아이콘 인터페이스
export interface CalendarIconProps {
  width?: number
  height?: number
  fill?: string
}

// 회원가입 폼 값 인터페이스
export interface SignupFormValues {
  nickname: string
  birthDate: string
  gender: 'male' | 'female'
  privacyPolicy: boolean // 개인정보 처리방침 동의 여부
  termsOfService: boolean // 이용약관 동의 여부
}

// ApplyUsers 인터페이스 정의
export interface ApplyUsers {
  accompanyPostId: number
  memberId: number
  memberNickname: string
  profileImagePath: string
}

// CompanionUsers 인터페이스 정의
export interface CompanionUsers {
  chatRoomId: number
  memberId: number
  memberEmail?: string
  memberNickname: string
  memberProfileImage: string | null
  memberChatRoomStatus?: string
}

// ChatRoomEntryData 인터페이스 정의
export interface ChatRoomEntryData {
  accompanyPostId: number
  chatRoomId: number
  leaderId: number
  status: RecruitmentStatus
  isPostExists: boolean
}

// ChatMessage 인터페이스 정의
export interface Message {
  id: string
  chatRoomId: number
  senderId: string
  content: string
  createdAt: string
  senderNickname: string
  senderProfileImage: string
  infoFlag: boolean
}

// CompanionLocations 인터페이스 정의
export interface CompanionLocation {
  lat: number
  lng: number
  nickname: string | undefined
  profileImagePath: string | undefined
}

// lastLocation에 대한 인터페이스 정의
export interface LastLocation {
  lat: number
  lng: number
}

// chatRoomMemberLocations 배열의 각 객체에 대한 인터페이스 정의
export interface ChatRoomMemberLocation {
  lastLocation: LastLocation
  memberId: number
  profileImagePath: string | null
  nickname: string
}

// GuestContentProps 인터페이스 정의
export interface GuestContentProps {
  companionUsers: CompanionUsers[]
  postId: number
  isPostExists: boolean
  leaderId: number
  companionLocations: CompanionLocation[]
  setCompanionLocations: React.Dispatch<
    React.SetStateAction<CompanionLocation[]>
  >
  isLocationSharingEnabled?: boolean
  accompanyStatus: RecruitmentStatus
}

// MenuDrawerProps 인터페이스 정의
export interface LeaveChatButtonProps {
  handleDeleteClick: (
    entityName: string,
    redirectPath: string,
    deleteFunction: () => Promise<void>
  ) => Promise<void>
  chatRoomId: number
  userId: number
  nickname: string
  clientRef: React.MutableRefObject<Client | null>
  showSuccess: (msg: string) => void
}

// LocationActionsProps 인터페이스 정의
export interface LocationActionsProps {
  nickname: string
  chatRoomId: number
  userId: number
  trackingEnabled: boolean
  setTrackingEnabled: React.Dispatch<React.SetStateAction<boolean>>
  clientRef: React.MutableRefObject<Client | null>
  showError: (msg: string) => void
  showSuccess: (msg: string) => void
  setCompanionLocations: React.Dispatch<
    React.SetStateAction<CompanionLocation[]>
  >
}

// MapContainerProps 인터페이스 정의
export interface SendLocationParams {
  nickname: string
  chatRoomId: number
  userId: number
  trackingEnabled: boolean
  clientRef: React.MutableRefObject<Client | null>
  showError: (msg: string) => void
  showSuccess: (msg: string) => void
}

// LeaveGroupParams 인터페이스 정의
export interface LeaveGroupParams {
  clientRef: React.MutableRefObject<Client | null>
  chatRoomId: number
  userId: number
  nickname: string
  showSuccess: (msg: string) => void
}

// ReviewModalProps 인터페이스 정의
export interface ReviewModalProps {
  open: boolean
  targetNickname: string
  content: string
  onOk: () => void
  onCancel: () => void
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

// ReviewModalProps 인터페이스 정의
export interface Review {
  reviewId: number
  content: string
  reviewerNickname: string
  reviewerProfile: string | null
  reviewerId: number
  createdAt: string
}

// ReviewModalProps 인터페이스 정의
export interface ProfileData {
  memberId: number
  profileImagePath: string | null
  nickname: string
  gender: string | null
  recentReviews: Review[]
  description: string
  ageGroup: string
  // 필요 없는 필드들은 제거하지 않고 타입에 포함해 둡니다.
  accompanyCount?: number // 불필요하지만, 혹시나 포함되는 경우 옵션으로 설정
  reviewCount?: number // 불필요하지만, 포함되는 경우 옵션으로 설정
}
