import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { Protect } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import {
  FileIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from 'lucide-react'
import { useState } from 'react'

import { api } from '../../../../convex/_generated/api.js'
import { Doc, Id } from '../../../../convex/_generated/dataModel.js'

export function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<'files'> & { url: string | null }
  isFavorited: boolean
}) {
  const deleteFile = useMutation(api.files.deleteFile)
  const restoreFile = useMutation(api.files.restoreFile)
  const toggleFavorite = useMutation(api.files.toggleFavorite)
  const { toast } = useToast()
  const me = useQuery(api.users.getMe)
  const [isConfirmeOpen, setIsConfirmeOpen] = useState(false)
  return (
    <>
      <AlertDialog open={isConfirmeOpen} onOpenChange={setIsConfirmeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id })
                toast({
                  variant: 'default',
                  title: 'File marked for deletion',
                  description: 'Your file will be deleted soon',
                })
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              if (!file.url) return
              window.open(file.url, '_blank')
            }}
            className="flex cursor-pointer items-center gap-1"
          >
            <FileIcon className="h-4 w-4" /> Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({ fileId: file._id })
            }}
            className="flex cursor-pointer items-center gap-1"
          >
            {isFavorited ? (
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4" /> Unfavorite
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <StarHalf className="h-4 w-4" /> Favorite
              </div>
            )}
          </DropdownMenuItem>
          <Protect
            condition={(check) => {
              return (
                check({
                  role: 'org:admin',
                }) || file.userId === me?._id
              )
            }}
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({
                    fileId: file._id,
                  })
                } else {
                  setIsConfirmeOpen(true)
                }
              }}
              className="flex cursor-pointer items-center gap-1"
            >
              {file.shouldDelete ? (
                <div className="flex cursor-pointer items-center gap-1 text-green-500">
                  <UndoIcon className="h-4 w-4" /> Restore
                </div>
              ) : (
                <div className="flex cursor-pointer items-center gap-1 text-red-500">
                  <TrashIcon className="h-4 w-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function getFileUrl(fileId: Id<'_storage'>): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}
