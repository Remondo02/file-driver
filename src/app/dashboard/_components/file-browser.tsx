'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { GridIcon, Loader2, RowsIcon } from 'lucide-react'
import Image from 'next/image.js'
import { useState } from 'react'

import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel.js'
import { columns } from './columns'
import { FileCard } from './file-card'
import { DataTable } from './file-table'
import { SearchBar } from './search-bar'
import { UploadButton } from './upload-button'

function Placeholder() {
  return (
    <div className="mt-24 flex w-full flex-col items-center gap-8">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl text-primary">
        You have no files, upload one now
      </div>
      <UploadButton />
    </div>
  )
}

export function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string
  favoritesOnly?: boolean
  deletedOnly?: boolean
}) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState('')
  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all')

  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : 'skip',
  )

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === 'all' ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : 'skip',
  )
  const isLoading = files === undefined

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id,
      ),
    })) ?? []

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between">
          <TabsList className="mb-4">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              {' '}
              <RowsIcon />
              Table
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <label htmlFor="type-select">Type Filter</label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any)
              }}
            >
              <SelectTrigger
                id="type-select"
                className="w-[180px]"
                defaultValue={'all'}
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="mt-24 flex w-full flex-col items-center gap-8">
            <Loader2 className="h-32 w-32 animate-spin text-primary" />
            <div className="text-2xl text-primary">Loading your files...</div>
          </div>
        )}
        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder />}
    </div>
  )
}
