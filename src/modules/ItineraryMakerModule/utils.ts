import { FeedbackItem } from './interface'

export function feedbackForField(
  feedbackItems: FeedbackItem[] = [],
  sectionIndex: number,
  blockIndex: number,
  blockType: 'LOCATION' | 'NOTE',
  field: string
): string | null {
  const item = feedbackItems.find((f) => {
    return (
      f.target.sectionIndex === sectionIndex &&
      f.target.blockIndex === blockIndex &&
      f.target.blockType === blockType &&
      f.target.field === field
    )
  })

  return item?.suggestion ?? null
}
