import { Outlet } from "react-router-dom"
import "./AuthLayout.scss"
import LogoIconHome from "~/icons/LogoIconHome"
const AuthLayout = () => {
  return (
    <div className="auth">
      <LogoIconHome className="w-[120px] ml-6 mt-6" />
      <Outlet />
    </div>
  )
}

export default AuthLayout
