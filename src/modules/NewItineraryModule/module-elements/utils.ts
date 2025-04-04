export const generatePageNumbers = (
  page: number,
  totalPages: number,
  range = 1
) => {
  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - range && i <= page + range)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
}
