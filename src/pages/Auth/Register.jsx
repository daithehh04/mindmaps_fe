import { Button, Input } from "@nextui-org/react"
import { unwrapResult } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { MdEmail, MdOutlineDriveFileRenameOutline } from "react-icons/md"
import { RiLockPasswordFill } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { handleLoginWithGoogle } from "~/services/auth.service"
import { requestRegister } from "~/stores/middlewares/auth.middleware"
function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const userInfo = useSelector((state) => state.auth.userInfo)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const dispatch = useDispatch()
  useEffect(() => {
    if (userInfo?.id) {
      navigate("/")
    }
  }, [userInfo, navigate])
  const onSubmit = async (data) => {
    try {
      const actionResult = await dispatch(requestRegister(data))
      const res = unwrapResult(actionResult)
      if (res.status === 201) {
        Cookies.set("accessToken", res.metadata.tokens.accessToken, {
          expires: 60 * 60 * 24 * 7,
        })
        Cookies.set("idUser", res.metadata.user.id, {
          expires: 60 * 60 * 24 * 30,
        })
        Cookies.set("refreshToken", res.metadata.tokens.refreshToken, {
          expires: 60 * 60 * 24 * 30,
        })
        toast.success("Register success!")
        navigate("/")
      } else {
        toast.error("Email or Password incorrect!")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleRedirect = async () => {
    const res = await handleLoginWithGoogle()
    if (res.status === 200) {
      window.location.href = res.metadata
    }
  }
  return (
    <>
      <Helmet>
        <title>Register | Mindmap</title>
        <meta name="description" content="register mindmap" />
      </Helmet>
      <div className="flex justify-center gap-6 mt-16">
        <div>
          <h3 className="text-[2.5rem] mb-2 font-bold text-black">
            Get started
          </h3>
          <p className="text-lg text-gray">with one of these services</p>
          <div>
            <Button
              size="lg"
              color="default"
              variant="bordered"
              className="flex items-center w-full my-4"
              radius="sm"
              onClick={handleRedirect}
            >
              <FcGoogle fontSize={"1.7rem"} />
              <p className="font-semibold text-primary">Sign up with Google</p>
            </Button>
          </div>
        </div>
        <div className="flex flex-col border-l-2 border-solid border-blue1 pl-6 bg-white !z-[199] relative items-center justify-center">
          <h3 className="mb-2 text-xl font-semibold">
            with your email address
          </h3>
          <form
            action=""
            className="w-[20rem] mx-auto flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              name="name"
              label="Name"
              {...register("name", {
                required: true,
              })}
              placeholder="Enter your name"
              variant="bordered"
              startContent={
                <MdOutlineDriveFileRenameOutline className="flex-shrink-0 text-xl pointer-events-none text-default-400" />
              }
            />
            <p className="text-danger">
              {errors.name && "Please enter this field!"}
            </p>
            <Input
              type="email"
              name="email"
              label="Email"
              {...register("email", {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                required: true,
              })}
              className="mt-5"
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
              name="password"
              label="Password"
              {...register("password", { pattern: /^.{6,}$/, required: true })}
              placeholder="Enter your password"
              variant="bordered"
              className="mt-5"
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
              {errors.password && "Password must have at least 6 characters"}
            </p>

            <Button
              radius="sm"
              size="lg"
              type="submit"
              className="w-full h-12 mt-4"
              color="secondary"
            >
              Sign Up
            </Button>
            <p className="mt-4 text-center text-black">
              Do you have account?{" "}
              <Link to={"/signin"} className="text-danger">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
