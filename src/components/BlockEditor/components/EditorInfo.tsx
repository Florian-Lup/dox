import { WebSocketStatus } from '@hocuspocus/provider'
import { memo } from 'react'
import { EditorUser } from '../types'
import { cn } from '../../../lib/utils'
import { getConnectionText } from '../../../lib/utils/getConnectionText'
import Tooltip from '../../ui/Tooltip'

export type EditorInfoProps = {
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
  limit: number
}

export const EditorInfo = memo(({ characters, collabState, users, words, limit }: EditorInfoProps) => {
  const percentage = Math.max(0, Math.min((characters / limit) * 100, 100))
  const radius = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex flex-col justify-center text-right">
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center">
          <span>
            {words} {words === 1 ? 'word' : 'words'}
          </span>
          <span className="mx-2 text-neutral-400 dark:text-neutral-500">/</span>
          <span>
            {characters} {characters === 1 ? 'character' : 'characters'}
          </span>
        </div>
      </div>
      <div className="flex items-center border-r border-neutral-200 dark:border-neutral-800 pr-4">
        <Tooltip title={`${characters}/${limit} characters (${percentage.toFixed(1)}%)`}>
          <svg width="20" height="20" className="transform -rotate-90">
            <circle
              cx="10"
              cy="10"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              className="text-neutral-200 dark:text-neutral-800"
            />
            <circle
              cx="10"
              cy="10"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={cn('transition-all duration-300', {
                'text-green-500 dark:text-green-400': percentage <= 70,
                'text-yellow-500 dark:text-yellow-400': percentage > 70 && percentage <= 90,
                'text-red-500 dark:text-red-400': percentage > 90,
              })}
              style={{
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
        </Tooltip>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <div
          className={cn('w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full', {
            'bg-yellow-500 dark:bg-yellow-400': collabState === 'connecting',
            'bg-green-500 dark:bg-green-400': collabState === 'connected',
            'bg-red-500 dark:bg-red-400': collabState === 'disconnected',
          })}
        />
        <span className="hidden sm:inline max-w-[4rem] text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
          {getConnectionText(collabState)}
        </span>
      </div>
      {collabState === 'connected' && (
        <div className="flex flex-row items-center">
          <div className="relative flex flex-row items-center">
            {users.slice(0, 3).map((user: EditorUser) => (
              <div key={user.clientId} className="-ml-2 sm:-ml-3 first:ml-0">
                <Tooltip title={user.name}>
                  <img
                    className="w-6 h-6 sm:w-8 sm:h-8 border border-white rounded-full dark:border-black"
                    src={`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${
                      user.name
                    }&backgroundColor=${user.color.replace('#', '')}`}
                    alt="avatar"
                  />
                </Tooltip>
              </div>
            ))}
            {users.length > 3 && (
              <div className="-ml-2 sm:-ml-3">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 font-bold text-[10px] sm:text-xs leading-none border border-white dark:border-black bg-[#FFA2A2] rounded-full">
                  +{users.length - 3}
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
