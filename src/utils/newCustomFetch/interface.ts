export interface CustomFetchRequestInit extends RequestInit {
  uploadFile?: boolean
}

export interface CustomFetchBaseResponse {
  statusCode: number
  success: boolean
  message: string
  detail?: unknown
}
