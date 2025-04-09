import { FeedbackItem } from './interface'

export function feedbackForField(
  feedbackItems: FeedbackItem[] = [],
  sectionIndex: number,
  blockId: string,
  blockType: 'LOCATION' | 'NOTE',
  field: string
): string | null {
  const item = feedbackItems.find((f) => {
    return (
      f.target.sectionIndex === sectionIndex &&
      f.target.blockId === blockId &&
      f.target.blockType === blockType &&
      f.target.field === field
    )
  })

  return item?.suggestion ?? null
}

export function decodePolyline(encoded: string) {
  const polyline = []
  let index = 0,
    lat = 0,
    lng = 0

  while (index < encoded.length) {
    let shift = 0,
      result = 0

    let byte
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const dlat = result & 1 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const dlng = result & 1 ? ~(result >> 1) : result >> 1
    lng += dlng

    polyline.push({ lat: lat * 1e-5, lng: lng * 1e-5 })
  }

  return polyline
}
