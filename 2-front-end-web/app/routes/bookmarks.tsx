import React from 'react'
import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useInfiniteQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { Authenticator } from '~/core/api/auth'
import TabLayout from '~/common/component/layout/TabLayout'
import LinkCardList from '~/core/component/home/LinkCardList'
import { getBookmarkItemList } from '~/core/api/bookmarks'

function Bookmarks() {
  const initialData = useLoaderData<BookmarkItemList>()

  const { data } = useInfiniteQuery(
    ['bookmarks'],
    ({ pageParam }) => getBookmarkItemList(pageParam),
    {
      initialData: {
        pageParams: [undefined],
        pages: [initialData],
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined
        // next cursor 를 getBookmarkItemList(..) 에 pageParam 인자로 전달
        return lastPage.pageInfo.nextOffset
      },
    },
  )

  const bookmarkItemList = data?.pages.flatMap((page) =>
    page.list.map((bookmark) => bookmark.item),
  )

  return (
    <StyledTabLayout>
      {bookmarkItemList ? <LinkCardList items={bookmarkItemList} /> : null}
    </StyledTabLayout>
  )
}
export default Bookmarks

export const loader: LoaderFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkAuthenticated(request)
  if (!isAuthenticated) return redirect(`/auth/login?next=/bookmarks`)

  const bookmarkList = await getBookmarkItemList()
  return json(bookmarkList)
}

// Inner Components

const StyledTabLayout = styled(TabLayout)``

// types

type BookmarkItemList = Awaited<ReturnType<typeof getBookmarkItemList>>
