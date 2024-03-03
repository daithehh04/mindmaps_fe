/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  User,
  Switch,
  Tooltip,
} from "@nextui-org/react"
import { memo, useCallback, useEffect, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import toast from "react-hot-toast"
import { FiClipboard } from "react-icons/fi"
import { useSelector } from "react-redux"
import { IoIosStar } from "react-icons/io"
import { updateMindmap } from "~/services/mindmap.service"
import { api } from "~/utils/api"
import { fetcher } from "~/utils/fetcher"
import useSWR, { useSWRConfig } from "swr"
import { useLocation } from "react-router-dom"

function ModalShare({ isOpen, onOpenChange, idMap, apiServerUpdate }) {
  const { mutate } = useSWRConfig()
  let dataMapDetail = useSelector((state) => state.maps.mapsDetail)
  const apiServer = idMap ? `/mindmaps/${idMap}` : null
  const { data: maps, isLoading } = useSWR(apiServer, fetcher)
  let currentPath = window.location.href
  const [isSelected, setIsSelected] = useState(dataMapDetail?.status)
  const [isFavorite, setIsFavorite] = useState(dataMapDetail?.favorite)
  const location = useLocation()
  const pathname = location.pathname
  if (pathname === "/my-mindmap") {
    currentPath = `${currentPath}/${idMap}`
  }
  if (!isLoading && idMap) {
    dataMapDetail = maps?.metadata
  }
  useEffect(() => {
    setIsSelected(dataMapDetail?.status)
    setIsFavorite(dataMapDetail?.favorite)
  }, [idMap, dataMapDetail])
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(() => {
    setCopied(true)
    toast.success("Copied !")
  }, [])
  const handleUpdate = async () => {
    const payload = {
      status: !isSelected,
    }
    try {
      const res = await updateMindmap({ id: dataMapDetail.id, payload })
      if (res.data.status === 200) {
        mutate(apiServerUpdate)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleUpdateFavorite = async () => {
    setIsFavorite(!isFavorite)
    const payload = {
      favorite: !isFavorite,
    }
    try {
      const res = await updateMindmap({ id: dataMapDetail.id, payload })
      if (res.data.status === 200) {
        mutate(apiServerUpdate)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-between gap-1">
                <div>
                  {" "}
                  <p>{dataMapDetail?.title}</p>
                  <p className="font-normal text-black">
                    {dataMapDetail?.desc}
                  </p>
                </div>
                <Tooltip
                  content={`${
                    !isFavorite ? "add your favorite" : "remove your favorite"
                  }`}
                  delay={0}
                  closeDelay={0}
                  color="warning"
                >
                  <span className="pr-8">
                    <button
                      onClick={handleUpdateFavorite}
                      className={`${
                        isFavorite ? "bg-[#f39c12]" : "bg-blue1"
                      } p-1 rounded-full `}
                    >
                      <IoIosStar color={`${isFavorite ? "#fff" : "gray"}`} />
                    </button>
                  </span>
                </Tooltip>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#eaf1f7]">
                  <User
                    name={dataMapDetail?.user?.name}
                    description={dataMapDetail?.user?.email}
                    avatarProps={{
                      src: `${
                        dataMapDetail?.user?.picture ||
                        "/image/fallback-avt.jpg"
                      }`,
                    }}
                  />
                  <span className="mr-5 text-gray">Administrator</span>
                </div>
                <div className="relative flex w-full px-2 my-6 border border-solid rounded-lg border-blue1">
                  <Switch
                    color="success"
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
                    onClick={handleUpdate}
                  ></Switch>
                  <div
                    className={`relative flex items-center w-full ${
                      isSelected ? "opacity-100" : "opacity-0 invisible"
                    }`}
                  >
                    <input
                      defaultValue={currentPath}
                      type="text"
                      readOnly
                      className="w-full p-2 my-2 pr-8 rounded outline-none bg-[#f6f9fc] font-normal transition-all "
                    />
                    <CopyToClipboard onCopy={onCopy} text={currentPath}>
                      <button className="absolute cursor-default right-1">
                        <FiClipboard
                          fontSize={"1.2rem"}
                          className={`clipboard cursor-pointer ${
                            copied && "text-blue"
                          }`}
                        />
                        <p className="copy absolute right-[-10px] opacity-0 transition-all p-1 px-2 text-xs text-white bg-black rounded-md whitespace-nowrap bottom-6">
                          {copied ? "Copied success !" : "Copy to clipboard !"}
                        </p>
                      </button>
                    </CopyToClipboard>
                  </div>
                  <span className="absolute text-sm top-[-12px] left-[12px] bg-white">
                    Share link
                  </span>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
export default memo(ModalShare)
