import React from 'react'
import { Type, Languages, BookOpen, Maximize2, GraduationCap, Users } from 'lucide-react'
import { QuickAction } from './types'

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'grammar',
    icon: React.createElement(Type, { className: 'w-4 h-4 text-blue-500' }),
    color: 'text-blue-500',
    label: 'Fix Grammar',
    description: 'Correct grammar, punctuation and spelling',
  },
  {
    id: 'translate',
    icon: React.createElement(Languages, { className: 'w-4 h-4 text-green-500' }),
    color: 'text-green-500',
    label: 'Translate',
    description: 'Translate text to another language',
  },
  {
    id: 'readability',
    icon: React.createElement(BookOpen, { className: 'w-4 h-4 text-purple-500' }),
    color: 'text-purple-500',
    label: 'Improve Clarity',
    description: 'Enhance sentence flow and refine word choice',
  },
  {
    id: 'length',
    icon: React.createElement(Maximize2, { className: 'w-4 h-4 text-amber-500' }),
    color: 'text-amber-500',
    label: 'Adjust Length',
    description: 'Expand and condense text while preserving key information',
  },
  {
    id: 'readingLevel',
    icon: React.createElement(GraduationCap, { className: 'w-4 h-4 text-emerald-500' }),
    color: 'text-emerald-500',
    label: 'Reading Level',
    description: 'Analyze and adjust text complexity',
  },
  {
    id: 'audience',
    icon: React.createElement(Users, { className: 'w-4 h-4 text-indigo-500' }),
    color: 'text-indigo-500',
    label: 'Target Audience',
    description: 'Adapt text for a specific audience or expertise level',
  },
]
