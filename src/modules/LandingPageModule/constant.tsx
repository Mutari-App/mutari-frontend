import { Bell, Map, Pencil } from 'lucide-react'

export const HERO_IMAGES = [
  {
    name: 'Candi Borobudur',
    imgName: 'borobudur.jpg',
    city: 'Magelang, Jawa Tengah',
  },
  {
    name: 'Pulau Padar',
    imgName: 'padar.jpg',
    city: 'Manggarai Barat, NTT',
  },
  {
    name: 'Pantai Kelingking',
    imgName: 'kelingking_beach.jpg',
    city: 'Nusa Penida, Bali',
  },
  {
    name: 'Pura Bratan',
    imgName: 'pura_ulun_danu_bratan.jpg',
    city: 'Tabanan, Bali',
  },
]

export const FEATURES = [
  {
    icon: 'Itinerary-icon.png',
    title: 'Itinerary Planner',
    description:
      'Plan your perfect trip effortlessly with our intuitive itinerary maker. Customize your schedule, add destinations, and get optimized routes to make the most of your journey.',
  },
  {
    icon: 'Binoculars.png',
    title: 'Discover New Experiences',
    description:
      'Not sure where to go? Get personalized travel suggestions based on your interests, budget, and past trips. Discover hidden gems and must-visit locations tailored just for you.',
  },
  {
    icon: 'Thumbs_up.png',
    title: 'Destination Recommendation',
    description:
      'Not sure where to go? Get personalized travel suggestions based on your interests, budget, and past trips. Discover hidden gems and must-visit locations tailored just for you.',
  },
  {
    icon: 'Medal.png',
    title: 'Loyalty Program',
    description:
      'Earn points every time your itinerary published and used by others. Redeem rewards for discounts, exclusive deals, and VIP perks to enhance your travel experience.',
  },
]

export const CAPABILITIES = [
  {
    icon: <Map className="w-20 h-20 " />,
    title: 'Dapatkan Fleksibilitas, Integrasi dengan Google Maps',
    desc: 'Pilih destinasi lebih dengan lebih fleksibel langsung dari Google Maps. Navigasi jadi lebih mudah! bisa melihat rute terbaik, estimasi waktu tempuh, hingga alternatif transportasi dalam sekali klik.',
  },
  {
    icon: <Bell className="w-20 h-20 " />,
    title: 'Notifikasi Real-Time tentang Keadaan Destinasi',
    desc: 'Mutari memberikan update real-time tentang cuaca, kondisi lalu lintas, hingga perubahan jam operasional tempat wisata. Dengan notifikasi ini, kamu bisa langsung menyesuaikan itinerary tanpa repot.',
  },
  {
    icon: <Pencil className="w-20 h-20 " />,
    title: 'Duplikasi & Edit Itinerary User Lain',
    desc: 'Lihat itinerary keren dari traveler lain dan sesuaikan kebutuhanmu! Dengan fitur ini, kamu bisa menghemat waktu dalam menyusun rencana liburan, cukup pilih itinerary yang sudah ada, edit sesuai kebutuhan, dan langsung siap berangkat!',
  },
]
