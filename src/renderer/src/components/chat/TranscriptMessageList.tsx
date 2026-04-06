import * as React from 'react'
import { VList } from 'virtua'
import type { ToolResultContent, UnifiedMessage } from '@renderer/lib/api/types'
import { cn } from '@renderer/lib/utils'
import { MessageItem } from './MessageItem'
import { buildRenderableMessageMeta, getToolResultsLookup } from './transcript-utils'

interface TranscriptMessageListProps {
  messages: UnifiedMessage[]
  streamingMessageId?: string | null
  className?: string
}

type ToolResultsLookup = Map<string, { content: ToolResultContent; isError?: boolean }>

interface VirtualTranscriptMessageRowProps {
  rowIndex: number
  message: UnifiedMessage
  isStreaming: boolean
  isLastUserMessage: boolean
  isLastAssistantMessage: boolean
  toolResults?: ToolResultsLookup
}

const messageLookupCache = new WeakMap<UnifiedMessage[], Map<string, UnifiedMessage>>()

function getMessageLookup(messages: UnifiedMessage[]): Map<string, UnifiedMessage> {
  const cached = messageLookupCache.get(messages)
  if (cached) return cached

  const next = new Map<string, UnifiedMessage>()
  for (const message of messages) {
    next.set(message.id, message)
  }

  messageLookupCache.set(messages, next)
  return next
}

const VirtualTranscriptMessageRow = React.memo(function VirtualTranscriptMessageRow({
  rowIndex,
  message,
  isStreaming,
  isLastUserMessage,
  isLastAssistantMessage,
  toolResults
}: VirtualTranscriptMessageRowProps): React.JSX.Element {
  return (
    <div data-index={rowIndex} className="mx-auto max-w-3xl px-4 pb-6">
      <MessageItem
        message={message}
        messageId={message.id}
        isStreaming={isStreaming}
        isLastUserMessage={isLastUserMessage}
        isLastAssistantMessage={isLastAssistantMessage}
        disableAnimation
        toolResults={toolResults}
        renderMode="transcript"
      />
    </div>
  )
})

export function TranscriptMessageList({
  messages,
  streamingMessageId = null,
  className
}: TranscriptMessageListProps): React.JSX.Element {
  const toolResultsLookup = React.useMemo(() => getToolResultsLookup(messages), [messages])
  const renderableMeta = React.useMemo(
    () => buildRenderableMessageMeta(messages, streamingMessageId),
    [messages, streamingMessageId]
  )
  const messageLookup = React.useMemo(() => getMessageLookup(messages), [messages])
  const rowKeys = React.useMemo(
    () => renderableMeta.map((item) => item.messageId),
    [renderableMeta]
  )
  const metaByMessageId = React.useMemo(() => {
    const next = new Map<string, (typeof renderableMeta)[number]>()
    for (const item of renderableMeta) {
      next.set(item.messageId, item)
    }
    return next
  }, [renderableMeta])

  if (rowKeys.length === 0) {
    return <div className="text-sm text-muted-foreground/70">暂无回放</div>
  }

  return (
    <div className={cn('not-prose h-[min(60vh,40rem)] min-h-[20rem]', className)}>
      <VList
        bufferSize={typeof window !== 'undefined' ? window.innerHeight : 0}
        data={rowKeys}
        style={{ height: '100%', overflowAnchor: 'none' }}
      >
        {(rowKey, rowIndex): React.JSX.Element => {
          const message = messageLookup.get(rowKey)
          const meta = metaByMessageId.get(rowKey)

          if (!message || !meta) {
            return <div key={rowKey} />
          }

          return (
            <VirtualTranscriptMessageRow
              key={rowKey}
              rowIndex={rowIndex}
              message={message}
              isStreaming={streamingMessageId === message.id}
              isLastUserMessage={meta.isLastUserMessage}
              isLastAssistantMessage={meta.isLastAssistantMessage}
              toolResults={toolResultsLookup.get(message.id)}
            />
          )
        }}
      </VList>
    </div>
  )
}
