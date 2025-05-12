export const TourHeader = ({
  title,
  location,
  coverImage,
}: {
  title: string
  location: string
  coverImage: string
}) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-500 mb-4">{location}</p>
      <div
        className="relative w-full h-40 md:h-64 rounded-md mb-4 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: coverImage
            ? `url(${coverImage})`
            : 'linear-gradient(360deg, #004080, #0073E6, #60A5FA)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  )
}
