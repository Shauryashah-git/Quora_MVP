// Flexible signature: allow either the original full-args call or a curried helper via an options object.
// This prevents runtime errors when a consuming component accidentally calls with only topicId.
export function handleTopicClick(
  topicId: string,
  selectedTopicIds?: string[],
  setSelectedTopicIds?: (ids: string[]) => void,
  setViewMode?: (mode: string) => void,
): void {
  if (!selectedTopicIds || !setSelectedTopicIds) {
    // Silent no-op if insufficient data; could log in dev.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[handleTopicClick] called without selection state arguments')
    }
    return
  }

  const alreadySelected = selectedTopicIds.includes(topicId)
  const next = alreadySelected
    ? selectedTopicIds.filter((id) => id !== topicId)
    : [...selectedTopicIds, topicId]
  setSelectedTopicIds(next)
  setViewMode && setViewMode('home')
}
