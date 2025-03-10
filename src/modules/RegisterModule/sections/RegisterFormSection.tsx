import { useRegisterContext } from '../contexts/RegisterContext'
import { CodeVerificationForm } from '../module-elements/codeVerificationForm'
import { CreateUserForm } from '../module-elements/createUserForm'
import { RegisterForm } from '../module-elements/registerForm'

export const RegisterFormSection = () => {
  const { page } = useRegisterContext()
  const registerFormPages = [CreateUserForm, CodeVerificationForm, RegisterForm]

  const DisplayedFormpage = registerFormPages[page]

  return <DisplayedFormpage />
}
