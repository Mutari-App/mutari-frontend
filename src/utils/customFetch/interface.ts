export interface CustomFetchRequestInit extends RequestInit {
  isAuthorized?: boolean
  uploadFile?: boolean
}

export interface CustomFetchBaseResponse {
  code: number
  success: boolean
  message: string
  detail?: unknown
}
