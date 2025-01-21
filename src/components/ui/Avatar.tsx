import { createAvatar } from '@dicebear/core'
import * as notionists from '@dicebear/notionists-neutral'
import { useMemo } from 'react'

type AvatarProps = {
  name: string
  size?: number
  className?: string
  backgroundColor?: string
}

export const Avatar = ({ name, size = 64, className = '', backgroundColor }: AvatarProps) => {
  const avatar = useMemo(() => {
    return createAvatar(notionists, {
      seed: name,
      size: size,
      backgroundColor: backgroundColor ? [backgroundColor.replace('#', '')] : undefined,
    }).toDataUri()
  }, [name, size, backgroundColor])

  return <img src={avatar} alt={`Avatar for ${name}`} className={className} width={size} height={size} />
}
