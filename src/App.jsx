import Layout from "./core/Layout"
import "../src/assets/css/style.css"
import { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useLayoutEffect } from "react"
import { requestGetUserFromToken } from "./stores/middlewares/auth.middleware"
import { unwrapResult } from "@reduxjs/toolkit"
import Loading from "./components/Loading"
const App = () => {
  const dispatch = useDispatch()
  const loadingLogin = useSelector((state) => state.auth.loadingLogin)
  useLayoutEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async () => {
    try {
      const res = await dispatch(requestGetUserFromToken())
      unwrapResult(res)
    } catch (error) {
      console.log(error)
    }
  }
  if (loadingLogin) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loading />
      </div>
    )
  }
  return (
    <>
      <Layout />
      <Toaster />
    </>
  )
}

export default App
