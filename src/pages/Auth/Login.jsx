/* eslint-disable no-unused-vars */
import { Button, Input } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaRegEyeSlash, FaGithub, FaRegEye } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { RiLockPasswordFill } from "react-icons/ri"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { requestLogin } from "~/stores/middlewares/auth.middleware"
import { unwrapResult } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"
import { handleLoginWithGoogle } from "~/services/auth.service"
import { client } from "~/utils/clientUtils"
import { Helmet } from "react-helmet"
// import Cookies from "js-cookie"
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const toggleVisibility = () => setIsVisible(!isVisible)
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.userInfo)

  useEffect(() => {
    if (userInfo?.id) {
      navigate(-1)
    }
  }, [userInfo, navigate])
  const onSubmit = async (data) => {
    try {
      const actionResult = await dispatch(requestLogin(data))
      const res = unwrapResult(actionResult)
      if (res.status === 200) {
        Cookies.set("accessToken", res.metadata.tokens.accessToken, {
          expires: 60 * 60 * 24 * 7,
        })
        Cookies.set("idUser", res.metadata.user.id, {
          expires: 60 * 60 * 24 * 30,
        })
        Cookies.set("refreshToken", res.metadata.tokens.refreshToken, {
          expires: 60 * 60 * 24 * 30,
        })
        client.setToken(res.metadata.tokens.accessToken)
        client.setIdUser(res.metadata.user.id)
        toast.success("Login success!")
      } else {
        toast.error("Email or Password incorrect!")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleRedirect = async () => {
    const res = await handleLoginWithGoogle()
    if (res?.status === 200) {
      window.location.href = res.metadata
    }
  }
  return (
    <>
      <Helmet>
        <title>Login | Mindmap</title>
        <meta name="description" content="login mindmap" />
      </Helmet>
      <div className="flex flex-col mt-16 bg-white !z-[199] relative items-center justify-center">
        <h3 className="text-[2.5rem] mb-2 font-semibold">Log In</h3>
        <form
          action=""
          className="w-[24rem] mx-auto flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type="email"
            label="Email"
            {...register("email", {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              required: true,
            })}
            placeholder="Enter your email"
            variant="bordered"
            startContent={
              <MdEmail className="flex-shrink-0 text-xl pointer-events-none text-default-400" />
            }
          />
          <p className="text-danger">
            {errors.email && "Please enter the correct email format"}
          </p>
          <Input
            label="Password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
            variant="bordered"
            className="mt-4"
            startContent={
              <RiLockPasswordFill className="flex-shrink-0 text-xl pointer-events-none text-default-400" />
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaRegEyeSlash className="text-xl pointer-events-none text-default-400" />
                ) : (
                  <FaRegEye className="text-xl pointer-events-none text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <p className="text-danger">
            {errors.password && "Please enter your password!"}
          </p>
          <Link
            to={"/account/forgot"}
            className="mt-2 ml-auto text-end hover:text-secondary w-max"
          >
            Forgot password?
          </Link>
          <Button
            color="secondary"
            radius="sm"
            size="lg"
            type="submit"
            className="w-full h-12 mt-4"
          >
            Login
          </Button>
          <p className="text-center font-[500] mt-4"> OR </p>
          <div>
            <Button
              size="lg"
              color="default"
              variant="bordered"
              className="flex items-center w-full my-4 font-semibold text-primary"
              radius="sm"
              onClick={handleRedirect}
            >
              <FcGoogle fontSize={"1.4rem"} />
              Sign in with Google
            </Button>
          </div>
          <p className="text-center text-black">
            Do not you have account?{" "}
            <Link className="text-secondary" to={"/signup"}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}

export default Login
