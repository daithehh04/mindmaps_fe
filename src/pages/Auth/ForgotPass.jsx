/* eslint-disable no-unused-vars */
import { Input } from "@nextui-org/react"
import { useState } from "react"
import toast from "react-hot-toast"
import Header from "~/layouts/DefaultLayout/Header"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { handleForgotPassword } from "~/services/auth.service"
import { FaCheckCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Loading from "~/components/Loading"
function ForgotPass() {
  const [valueEmail, setValueEmail] = useState("")
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }
  const handleChange = (e) => {
    const email = e.target.value
    if (validateEmail(email) === null || valueEmail === "") {
      setErrors(true)
    } else {
      setErrors(false)
    }
    setValueEmail(email)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valueEmail) {
      toast.error("Please enter your email!")
    } else if (!errors) {
      try {
        setLoading(true)
        const res = await handleForgotPassword({ email: valueEmail })
        if (res.status === 200) {
          onOpen()
          setValueEmail("")
        } else {
          toast.error("Account not exist!")
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }
  return (
    <div className="relative">
      <Header />
      <div className="w-[36rem] h-[100vh] flex flex-col justify-center mx-auto">
        <form
          className="p-6 border border-solid rounded-lg shadow-xl border-blue1"
          onSubmit={handleSubmit}
        >
          <h3 className="pb-4 text-2xl">Find your account.</h3>
          <p className="py-2 text-lg">
            Please enter your email to search for your account.
          </p>
          <Input
            type="text"
            placeholder="Enter your email!"
            variant="bordered"
            onChange={handleChange}
            value={valueEmail}
            radius="sm"
          />
          <p className="text-danger">
            {errors && "Please enter the correct email format!"}
          </p>
          <div className="flex justify-end mt-4">
            <button className="px-8 py-3 !rounded-lg btn-primary">
              Search
            </button>
          </div>
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
                  <p className="text-lg">
                    Please check your email to refresh your password!
                  </p>
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
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white opacity-70">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default ForgotPass
