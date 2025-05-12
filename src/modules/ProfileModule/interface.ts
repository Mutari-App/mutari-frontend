export interface ProfileProps {
  id: string
  photoProfile: string | null
  firstName: string
  lastName: string
  referralCode: string
  loyaltyPoints: number
  totalReferrals: number
  totalItineraries: number
  totalLikes: number
}

export interface ProfileModuleProps {
  profile: ProfileProps
}

export interface ItineraryProps {
  id: string
  title: string
  description: string | null
  coverImage?: string | null
  startDate: string
  endDate: string
  totalLikes: number
  totalDestinations: number
}

export interface GetItinerariesProps {
  itineraries: ItineraryProps[]
}

export interface GetItineraryLikesProps {
  itineraryLikes: ItineraryProps[]
}

export interface FormProps {
  closeDialog: () => void
}

export interface ChangeEmailFormProps extends FormProps {
  setNewEmail: (email: string) => void
  enableSubmitOtpMode: () => void
  editProfileButtonHandler: () => void
}

export interface EditProfileFormProps extends FormProps {
  changeEmailButtonHandler: () => void
}

export interface SubmitOtpFormProps extends FormProps {
  backButtonHandler: () => void
  newEmail: string
}

export interface GetTransactionProps {
  transactions: TransactionProps[]
}

export interface TransactionProps {
  id: string
  createdAt: string
  quantity: number
  totalPrice: number
  paymentStatus: PAYMENT_STATUS
  tour: TourProps
  guests: GuestProps[]
}

export enum PAYMENT_STATUS {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum PAYMENT_STATUS_COLOR {
  UNPAID = 'text-red-500',
  PAID = 'text-green-500',
  REFUNDED = 'text-yellow-500',
}

interface TourProps {
  title: string
  location: string
}

interface GuestProps {
  id: string
  title: GUEST_TITLE
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}

export enum GUEST_TITLE {
  MR = 'MR',
  MRS = 'MRS',
  MS = 'MS',
}

export const GUEST_TITLE_DISPLAY = {
  [GUEST_TITLE.MR]: 'Tn.',
  [GUEST_TITLE.MRS]: 'Ny.',
  [GUEST_TITLE.MS]: 'Nn.',
}

export interface TransactionCardProps {
  transaction: TransactionProps
}

export interface TransactionDetailModalProps {
  transaction: TransactionProps
}
