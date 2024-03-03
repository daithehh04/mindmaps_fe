/* eslint-disable no-unused-vars */
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Textarea,
  Tooltip,
} from "@nextui-org/react"
import { unwrapResult } from "@reduxjs/toolkit"
import { useState } from "react"
import { Helmet } from "react-helmet"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import Loading from "~/components/Loading"
import UploadImage from "~/components/UploadImage"
import { handleChangePassword } from "~/services/auth.service"
import { requestUpdateProfile } from "~/stores/middlewares/auth.middleware"
import { api } from "~/utils/api"

export default function Profile() {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const [name, setName] = useState(userInfo.name)
  const [desc, setDesc] = useState(userInfo.desc)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const dispatch = useDispatch()
  const provider = userInfo.provider
  let picture = userInfo.picture
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    if (watch("password") !== watch("rePassword")) {
      setError("checkPassword", {
        type: "manual",
        message: "Passwords do not match",
      })
    }
    if (watch("password") === watch("rePassword")) {
      const res = await handleChangePassword({
        password: data.password,
        idUser: userInfo.id,
      })
      if (res?.status === 200) {
        toast.success("Change password success!")
        reset()
      }
    }
  }

  const handleSubmitProfile = async (e) => {
    setLoading(true)
    e.preventDefault()
    if (files?.length) {
      const formData = new FormData()
      files.forEach((file) => formData.append("file", file))
      const res = await fetch(`${api}/user/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json())
      if (res.status === 200) {
        picture = res.metadata.url
      }
    }
    const payload = {
      name,
      picture,
      desc,
      userId: userInfo.id,
    }
    const resProfile = await dispatch(requestUpdateProfile(payload))
    const dataProfile = unwrapResult(resProfile)
    setLoading(false)
    if (dataProfile.status === 200) {
      toast.success("Update profile success!")
    }
  }
  return (
    <>
      <Helmet>
        <title>Profile | Mindmap</title>
        <meta name="description" content="Profile mindmap" />
      </Helmet>
      <div className="relative px-10 pt-10">
        <h3 className="mb-4 text-2xl font-bold capitalize">{userInfo.name}</h3>
        <div className="flex flex-col w-full">
          <Tabs
            aria-label="Options"
            color="primary"
            variant="underlined"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#0af]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#0af]",
            }}
          >
            <Tab
              key="general"
              title={
                <div className="flex items-center space-x-2">
                  <span>General</span>
                </div>
              }
            >
              <Card>
                <CardBody className="px-8">
                  <h4 className="py-4 text-xl">Personal Details</h4>
                  <form
                    action=""
                    onSubmit={handleSubmitProfile}
                    className="flex items-start gap-10"
                  >
                    <div className="mt-2 w-[24rem] flex flex-col gap-4 pb-6">
                      <Input
                        type="text"
                        size="md"
                        variant="bordered"
                        label="Name"
                        onChange={(e) => setName(e.target.value)}
                        defaultValue={userInfo.name}
                      />
                      <Textarea
                        key="description"
                        variant="bordered"
                        label="Description"
                        labelPlacement="inside"
                        defaultValue={userInfo.desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Enter your description"
                      />
                      <button className="btn-primary !rounded-lg py-3">
                        Save changes
                      </button>
                    </div>
                    <UploadImage
                      userInfo={userInfo}
                      onFiles={setFiles}
                      files={files}
                    />
                  </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="account"
              title={
                <div className="flex items-center space-x-2">
                  <span>Account</span>
                </div>
              }
            >
              <Card>
                <CardBody className="px-8">
                  <h4 className="py-4 text-xl">Password</h4>
                  <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="pb-6 w-[24rem] flex flex-col">
                      <Input
                        type="password"
                        label="New Password"
                        {...register("password", {
                          pattern: /^.{6,}$/,
                          required: true,
                        })}
                        variant="bordered"
                      />
                      <p className="text-danger">
                        {errors.password &&
                          "Password must have at least 6 characters"}
                      </p>
                      <Input
                        type="password"
                        className="mt-4"
                        label="Confirm New Password"
                        {...register("rePassword", {
                          pattern: /^.{6,}$/,
                          required: true,
                        })}
                        variant="bordered"
                      />
                      <p className="text-danger">
                        {errors.rePassword &&
                          "Password must have at least 6 characters"}
                      </p>
                      <p className="text-danger">
                        {!errors.rePassword &&
                          errors.checkPassword &&
                          errors.checkPassword.message}
                      </p>
                      <button
                        type={`${provider ? "button" : "submit"}`}
                        className={`btn-primary mt-3 !rounded-lg py-3 ${
                          provider && "cursor-not-allowed"
                        }`}
                      >
                        {provider
                          ? "Account not need password"
                          : " Save changes"}
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="videos"
              title={
                <div className="flex items-center space-x-2">
                  <span>Terms & Policies</span>
                </div>
              }
            >
              <Card>
                <CardBody className="px-8">
                  <h4 className="py-4 text-xl">Terms & Policies</h4>
                  <div className="pb-6">
                    <h5 className="text-lg">Privacy Policy</h5>{" "}
                    <p>
                      At Meister, we believe you should always know what data we
                      collect from you and how we use it, and that you should
                      have meaningful control over both. Our Privacy Policy
                      provides information on the processing of personal data by
                      Meister obtained in connection with a visit to our
                      websites, use of our community platform or use of our
                      web-services and mobile applications. Whenever significant
                      changes are made to the Privacy Policy, we will post a
                      notice on our websites for a period of 30 days.
                    </p>
                    <h5 className="mt-5 text-lg">Terms of Service</h5>{" "}
                    <p>
                      When you signed up for our product(s) you agreed to our
                      Terms of Service. These act as a contract between
                      MeisterLabs and you, dictating what you are allowed to do
                      with our services, and consequently what our liability is
                      to you.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
        {loading && (
          <div className="absolute flex items-center justify-center inset-0 !z-50 bg-white opacity-60">
            <Loading />
          </div>
        )}
      </div>
    </>
  )
}
