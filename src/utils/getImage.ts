export const getImage = (imageName: string) => {
  return `${process.env.NEXT_PUBLIC_ASSET_URI}/mutari/image/upload/${imageName}`
}
