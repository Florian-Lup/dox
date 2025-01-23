import { WebSocketStatus } from '@hocuspocus/provider'
import { memo } from 'react'
import { EditorUser } from '../types'
import { cn } from '../../../lib/utils'
import { getConnectionText } from '../../../lib/utils/getConnectionText'
import Tooltip from '../../ui/Tooltip'
import { Avatar } from '../../ui/Avatar'

export type EditorInfoProps = {
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
  limit: number
}

export const EditorInfo = memo(({ characters, collabState, users, words }: EditorInfoProps) => {
  return (
    <div className="flex items-center gap-x-1 sm:gap-x-2">
      {/* Word/Character count - Compact on mobile */}
      <div className="flex flex-col justify-center text-right">
        <div className="text-[10px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center">
          <span className="hidden sm:inline">
            {words} {words === 1 ? 'word' : 'words'}
          </span>
          <span className="hidden sm:inline mx-2 text-neutral-400 dark:text-neutral-500">/</span>
          <span className="hidden sm:inline">
            {characters} {characters === 1 ? 'character' : 'characters'}
          </span>
          <span className="sm:hidden">{characters}c</span>
        </div>
      </div>

      {/* Connection status */}
      <div className="flex items-center gap-x-1 sm:gap-x-1.5">
        <div className="w-6 sm:w-8 h-8 flex items-center justify-center">
          <div
            className={cn('w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-colors', {
              'bg-yellow-500 dark:bg-yellow-400': collabState === 'connecting',
              'bg-green-500 dark:bg-green-400': collabState === 'connected',
              'bg-red-500 dark:bg-red-400': collabState === 'disconnected',
            })}
          />
        </div>
        <span className="hidden sm:inline max-w-[4rem] text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          {getConnectionText(collabState)}
        </span>
      </div>

      {/* Collaborators */}
      {collabState === 'connected' && (
        <div className="flex items-center">
          <div className="relative flex items-center">
            {users.slice(0, 2).map((user: EditorUser) => (
              <div key={user.clientId} className="-ml-1 sm:-ml-1.5 first:ml-0">
                <Tooltip title={user.name}>
                  <div className="w-6 sm:w-8 h-8 flex items-center justify-center">
                    <Avatar
                      name={user.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 border border-white rounded-full dark:border-black"
                      backgroundColor={user.color}
                    />
                  </div>
                </Tooltip>
              </div>
            ))}
            {users.length > 2 && (
              <div className="-ml-1 sm:-ml-1.5">
                <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 font-medium text-[10px] sm:text-xs leading-none border border-white dark:border-black bg-[#FFA2A2] rounded-full">
                  +{users.length - 2}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

EditorInfo.displayName = 'EditorInfo'
