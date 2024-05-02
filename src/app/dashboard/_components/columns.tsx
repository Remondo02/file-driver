'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from 'convex/react'
import { formatRelative } from 'date-fns'

import { api } from '../../../../convex/_generated/api'
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { FileCardActions } from './file-actions'

function UserCell({ userId }: { userId: Id<'users'> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  })
  return (
    <div className="flex w-40 items-center gap-2 text-xs text-gray-700">
      <Avatar className="h-6 w-6">
        <AvatarImage className="object-cover" src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  )
}

export const columns: ColumnDef<
  Doc<'files'> & { url: string; isFavorited: boolean }
>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    header: 'User',
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />
    },
  },
  {
    header: 'Uploaded On',
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      )
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div>
          <FileCardActions
            file={row.original}
            isFavorited={row.original.isFavorited}
          />
        </div>
      )
    },
  },
]
