import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery } from 'convex/react'
import { formatRelative } from 'date-fns'
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image.js'
import { ReactNode } from 'react'

import { api } from '../../../../convex/_generated/api.js'
import { Doc } from '../../../../convex/_generated/dataModel.js'
import { FileCardActions } from './file-actions'

export function FileCard({
  file,
}: {
  file: Doc<'files'> & { isFavorited: boolean; url: string | null }
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  })

  const typesIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<'files'>['type'], ReactNode>

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typesIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute right-2 top-2">
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="flex h-[200px] items-center justify-center">
        {file.type === 'image' && file.url && (
          <Image alt={file.name} width="200" height="100" src={file.url} />
        )}
        {file.type === 'csv' && <GanttChartIcon className="h-20 w-20" />}
        {file.type === 'pdf' && <FileTextIcon className="h-20 w-20" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex w-40 items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          <Avatar className="h-6 w-6">
            <AvatarImage className="object-cover" src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700 dark:text-gray-300">
          Uploaded {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  )
}
