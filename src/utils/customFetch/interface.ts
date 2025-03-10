export interface CustomFetchRequestInit extends RequestInit {
  isAuthorized?: boolean
  uploadFile?: boolean
}

export interface CustomFetchBaseResponse {
  statusCode: number
  success: boolean
  message: string
  detail?: unknown
}
