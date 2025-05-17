import { useResetPasswordContext } from '../contexts/ResetPasswordContext'
import { CodeVerificationForm } from '../module-elements/codeVerificationForm'
import { RequestPasswordResetForm } from '../module-elements/requestPasswordResetForm'
import { ResetPasswordForm } from '../module-elements/resetPasswordForm'

export const ResetPasswordFormSection = () => {
  const { page } = useResetPasswordContext()
  const resetPasswordFormPages = [
    RequestPasswordResetForm,
    CodeVerificationForm,
    ResetPasswordForm,
  ]

  const DisplayedFormpage = resetPasswordFormPages[page]

  return <DisplayedFormpage />
}
