import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AuthMiddleware = () => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  return userInfo?.id ? <Outlet /> : <Navigate to="/signin" />
}

export default AuthMiddleware
