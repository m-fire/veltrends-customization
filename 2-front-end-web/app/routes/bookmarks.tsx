import React from 'react'
import TabLayout from '~/common/component/layout/TabLayout'
import { json, LoaderFunction, redirect } from '@remix-run/node'
import { Authenticator } from '~/core/api/auth'
import { getBookmarkItemList } from '~/core/api/bookmarks'
import { useLoaderData } from '@remix-run/react'

function Bookmarks() {
  const initialData = useLoaderData<BookmarkItemList>()

  return <TabLayout>Bookmarks route</TabLayout>
}
export default Bookmarks

export const loader: LoaderFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkAuthenticated(request)
  if (!isAuthenticated) return redirect(`/auth/login?next=/bookmarks`)

  const bookmarkList = await getBookmarkItemList()
  return json(bookmarkList)
}

// Inner Components

// types

type BookmarkItemList = Awaited<ReturnType<typeof getBookmarkItemList>>
