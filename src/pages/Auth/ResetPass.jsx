/* eslint-disable no-unused-vars */
import { Input } from "@nextui-org/react"
import { FaCheckCircle } from "react-icons/fa"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "~/components/Loading"
import NotFound from "~/components/NotFound"
import { handleResetPassword } from "~/services/auth.service"
import { checkUserFromIdReset } from "~/services/user.service"
import { Helmet } from "react-helmet"
function ResetPass() {
  const [code, setCode] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const idReset = params.id
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const checkUser = async (idReset) => {
    try {
      setLoading(true)
      const res = await checkUserFromIdReset({ idReset })
      setCode(res.data.code || res.data.status)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUser(idReset)
  }, [idReset])

  if (loading) {
    return <Loading />
  }
  if (code !== 200 && !loading) {
    return <NotFound />
  }
  const errMatch = watch("password") !== watch("rePassword")
  const onSubmit = async (data) => {
    if (watch("password") === watch("rePassword")) {
      const res = await handleResetPassword({
        password: data.password,
        idReset,
      })
      if (res?.status === 200) {
        onOpen()
        reset()
      }
    }
  }
  return (
    <>
      <Helmet>
        <title>Reset Password | Mindmap</title>
        <meta name="description" content="reset password mindmap" />
      </Helmet>
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <div className="p-4 shadow-xl">
          <h3 className="text-2xl text-center">Reset Password</h3>
          <form
            action=""
            className="p-6 w-[36rem] mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="password"
              label="New password"
              {...register("password", { pattern: /^.{6,}$/, required: true })}
              variant="bordered"
              name="password"
            />
            <p className="text-danger">
              {errors.password && "Password must have at least 6 characters"}
            </p>
            <Input
              type="password"
              {...register("rePassword", {
                pattern: /^.{6,}$/,
                required: true,
              })}
              label="Confirm New password"
              variant="bordered"
              className="mt-4"
              name="rePassword"
            />
            <p className="text-danger">
              {errors.rePassword && "Password must have at least 6 characters"}
            </p>
            <p className="text-danger">
              {!errors.rePassword && errMatch && "Passwords do not match!"}
            </p>
            <button className="px-6 py-3 w-full !rounded-lg btn-primary mt-3">
              Confirm
            </button>
          </form>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xl">Success</p>
                    <FaCheckCircle fontSize={"1.3rem"} color="#2ecc71" />!
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="flex items-center gap-1">
                    <p className="text-lg">Change password success</p>!
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      navigate("/")
                    }}
                  >
                    Go home
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  )
}

export default ResetPass
