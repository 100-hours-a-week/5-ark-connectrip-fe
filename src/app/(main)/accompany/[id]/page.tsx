// components/AccompanyDetailPage.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShareAltOutlined } from '@ant-design/icons'
import ProfileIcon from '@/app/components/common/ProfileIcon'
import {
  formatShortDate,
  formatToUtcDate,
  formatCreatedAt,
  formatShortDateFromUtc,
} from '@/app/utils/dateUtils'
import CalendarIcon from '@/app/components/Icon/CalendarIcon'
import PinIcon from '@/app/components/Icon/PinIcon'
import InfoRow from '@/app/components/accompany/InfoRow'
import { useCustomMessage } from '@/app/utils/alertUtils'
import { mockComments } from '@/app/data/mockDataComments'
import useShareModal from '@/app/hooks/useShareModal'
import { useHandleDeleteClick } from '@/app/hooks/useHandleDeleteClick'
import { api } from '@/app/utils/api'
import LoadingSpinner from '@/app/components/common/LoadingSpinner'
interface Post {
  id: number
  title: string
  profileImagePath: string
  nickname: string
  createdAt: string
  accompanyArea: string
  startDate: string
  endDate: string
  content: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DEFAULT'
  customUrl: string
  urlQrPath: string
}

export default function AccompanyDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const postId = parseInt(id as string, 10)
  const [post, setPost] = useState<Post | null>(null)
  const comments = mockComments.filter((comment) => comment.postId === postId)

  const { contextHolder, showSuccess, showWarning } = useCustomMessage()
  const { openModal, ShareModalComponent } = useShareModal() // 공유 모달 관련 훅 사용

  const handleCardDeleteClick = useHandleDeleteClick()

  useEffect(() => {
    console.log(1111)
    // API 호출하여 모든 게시글 정보를 가져옴
    const fetchPostData = async () => {
      try {
        // /api/v1/accompany/{accompanyId}로 요청 보냄
        const data = await api.get(`/api/v1/accompany/posts/${postId}`)
        // 날짜 포맷 적용
        const formattedData = {
          ...data,
          createdAt: formatToUtcDate(data.createdAt),
          startDate: formatShortDateFromUtc(data.startDate),
          endDate: formatShortDateFromUtc(data.endDate),
        }

        setPost(formattedData)
        console.log('Formatted post data:', formattedData)
      } catch (error) {
        console.error('Failed to fetch post data:', error)
      }
    }

    fetchPostData()
  }, [postId])

  if (!post) {
    return <LoadingSpinner />
  }

  const handleButtonClick = async () => {
    try {
      if (post.status === 'PENDING') {
        showWarning('현재 동행 승인 대기 중입니다.')
      } else if (post.status === 'ACCEPTED') {
        showSuccess('동행 그룹방으로 입장합니다.')
      } else {
        // await api.post(`/api/accompany/${postId}/apply`)
        setPost((prevPost) =>
          prevPost ? { ...prevPost, status: 'PENDING' } : null
        )
        showSuccess('동행 신청이 완료되었습니다.')
      }
    } catch (error) {
      console.error('Failed to apply for accompany:', error)
      showWarning('동행 신청에 실패했습니다.')
    }
  }
  return (
    <>
      {contextHolder}
      {/* 공유 모달에 custom_url과 custom_url_qr_path를 프롭스로 전달 */}
      <ShareModalComponent
        customUrl={post.customUrl}
        customUrlQrPath={post.urlQrPath}
      />

      <div className='w-full p-5 flex flex-col justify-start items-start mb-[80px]'>
        <div className='flex items-center justify-between w-full mb-2'>
          <h1 className='text-lg font-bold text-main'>동행 게시판</h1>
          <button onClick={openModal} className='cursor-pointer'>
            <ShareAltOutlined />
          </button>
        </div>
        <h2 className='text-lg font-semibold mb-3'>{post.title}</h2>

        {/* 프로필 섹션 */}
        <div className='flex items-center mb-1 w-full'>
          <ProfileIcon
            src={post.profileImagePath}
            size={40}
            nickname={post.nickname}
          />
          <div className='ml-3 flex-1'>
            <p className='font-semibold'>{post.nickname}</p>
            <p className='text-sm text-gray-500'>{post.createdAt}</p>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => router.push(`/accompany/edit/${id}`)}
              className='text-sm text-main'
            >
              수정
            </button>
            <button
              className='text-sm text-main'
              onClick={() => handleCardDeleteClick('게시글', '/accompany')}
            >
              삭제
            </button>
          </div>
        </div>

        {/* 동행 지역 및 날짜 정보 */}
        <div className='w-full overflow-x-auto no-scrollbar mb-4 mt-2'>
          <div className='flex items-center space-x-3'>
            <div className='flex-shrink-0'>
              <InfoRow
                icon={<PinIcon />}
                text={`동행 지역 : ${post.accompanyArea}`}
                customStyle={true}
              />
            </div>
            <div className='flex-shrink-0'>
              <InfoRow
                icon={<CalendarIcon />}
                text={`동행 날짜 : ${post.startDate} ~ ${post.endDate}`}
                customStyle={true}
              />
            </div>
          </div>
        </div>

        <div className='text-gray-700 mb-4 whitespace-pre-wrap text-justify p-1'>
          {post.content}
        </div>

        {post.status !== 'REJECTED' && (
          <button
            className='w-full bg-main text-white py-2 px-3 rounded-full text-sm'
            onClick={handleButtonClick}
          >
            {post.status === 'PENDING' ? '동행 승인 대기' : '동행 신청'}
          </button>
        )}

        <div className='mt-8 w-full'>
          <h2 className='text-lg font-bold mb-4'>댓글</h2>

          {comments.map((comment) => (
            <div key={comment.id} className='flex items-start mb-4 flex-1'>
              <ProfileIcon
                src={comment.profile_image_path}
                size={35}
                nickname={comment.nickname}
              />
              <div className='ml-3 w-full'>
                <p className='font-semibold'>{comment.nickname}</p>
                <div className='flex justify-between items-center '>
                  <p className='text-sm text-gray-500'>
                    {formatCreatedAt(comment.created_at)}
                  </p>

                  <div className='flex gap-2'>
                    <button className='text-sm text-main'>수정</button>
                    <button
                      className='text-sm text-main'
                      onClick={() => handleCardDeleteClick('댓글', '')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className='text-gray-700 mt-2'>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='px-4 py-2 fixed  w-full bg-white bottom-[60px] z-10'>
        <div className='flex items-center'>
          <input
            type='text'
            placeholder='댓글을 입력하세요.'
            className='flex-1 h-[35px] p-2 px-4 border border-gray-300 rounded-full focus:border-main focus:border-2 outline-none'
          />
          <button
            className='ml-3 h-[35px] bg-main text-white py-0 px-5 rounded-full'
            onClick={() => showSuccess('댓글이 등록되었습니다.')}
          >
            등록
          </button>
        </div>
      </div>
    </>
  )
}
