/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import { FaSave } from "react-icons/fa"
import { FaShare } from "react-icons/fa"
import { BsThreeDots } from "react-icons/bs"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Tooltip,
} from "@nextui-org/react"
import toast from "react-hot-toast"
import ContentEditable from "react-contenteditable"
import { IoIosArrowBack } from "react-icons/io"
import ModalShare from "~/components/ModalShare"
import Avatar from "~/components/Avatar"
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  requestGetMindmapDetail,
  requestUpdateMindmap,
} from "~/stores/middlewares/maps.middleware"
import Flow from "./Flow"
import { unwrapResult } from "@reduxjs/toolkit"
import { useDisclosure } from "@nextui-org/react"
import Loading from "~/components/Loading"
import NotFound from "~/components/NotFound"
import { Helmet } from "react-helmet"
import { setType } from "~/stores/slices/maps.slice"

function Detail() {
  const params = useParams()
  const id = params.id
  const type = id.split("~")[1]
  const dataMapDetail = useSelector((state) => state.maps.mapsDetail)
  const loadingDetailMap = useSelector((state) => state.maps.loading)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const checkUser = dataMapDetail?.user_id === userInfo?.id
  const status = dataMapDetail?.status
  const titleRef = useRef("")
  const descRef = useRef("")
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setType(type))
  }, [type])

  const [updateMaps, setUpdateMaps] = useState(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  useEffect(() => {
    try {
      dispatch(requestGetMindmapDetail(id))
    } catch (error) {
      console.log(error)
    }
  }, [id, dispatch])
  useEffect(() => {
    titleRef.current = dataMapDetail?.title
    descRef.current = dataMapDetail?.desc
  }, [dataMapDetail])
  useEffect(() => {
    document.title = dataMapDetail?.title || "Loading..."
  }, [dataMapDetail])
  const handleUpdate = async () => {
    setLoadingUpdate(true)
    const payload = {
      ...updateMaps,
      title: titleRef.current,
      desc: descRef.current,
    }
    try {
      const res = await dispatch(requestUpdateMindmap({ id, payload }))
      const data = unwrapResult(res)
      if (data.status === 200) {
        toast.success("Update success!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeTitle = (evt) => {
    titleRef.current = evt.target.value
    if (evt.target.value !== "") {
      document.title = formattedContent(titleRef.current)
    } else {
      document.title = "Không có tiêu đề mindmap"
    }
  }

  const handleChangeDesc = (evt) => {
    descRef.current = evt.target.value
  }
  if (loadingDetailMap && !loadingUpdate) {
    return (
      <div className="w-full h-[100vh] flex flex-col items-center justify-center">
        <Loading />
      </div>
    )
  }
  if (!status && !checkUser) {
    return <NotFound />
  }
  const formattedContent = (content) => {
    return content?.replaceAll("&nbsp;", " ")
  }
  return (
    <>
      <Helmet>
        <title>{dataMapDetail.title} | Mindmap</title>
        <meta name="description" content={dataMapDetail.desc} />
        <meta property="og:title" content={dataMapDetail.title} />
        <meta property="og:description" content={dataMapDetail.desc} />
        <meta property="og:image" content={dataMapDetail.img} />
      </Helmet>
      <div className="flex items-start mt-5 px-[35px] gap-6">
        <div className="w-[90%] flex items-start gap-8">
          <Link
            to={"/my-mindmap"}
            className="flex items-center gap-1 px-6 py-3 mb-3 text-black bg-white border border-solid rounded-full border-[#ddd] shadow-md w-max whitespace-normal min-w-[180px] hover:shadow-xl transition-all"
          >
            <IoIosArrowBack fontSize={"1.3rem"} />
            my mindmap
          </Link>
          {!userInfo || (userInfo && !checkUser) ? (
            <div className="flex flex-col">
              <h4 className="heading-1 !text-2xl outline-none">
                {titleRef.current}
              </h4>
              <h5 className="mt-2 text-xl font-thin text-black outline-none">
                {descRef.current}
              </h5>
            </div>
          ) : (
            <div className="flex flex-col">
              <ContentEditable
                className="heading-1 !text-2xl outline-none"
                html={titleRef.current || ""}
                disabled={false}
                onChange={handleChangeTitle}
              />
              <ContentEditable
                html={descRef.current || ""}
                className="mt-2 text-xl font-thin text-black outline-none"
                onChange={handleChangeDesc}
              />
            </div>
          )}
        </div>
        {!userInfo || (userInfo && !checkUser) ? (
          <></>
        ) : (
          <div className="flex gap-6 ml-auto w-[40%] justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="bg-white rounded-full min-w-10"
                >
                  <BsThreeDots fontSize={"1.6rem"} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                variant="flat"
                aria-label="Dropdown menu with shortcut"
              >
                <DropdownItem key="new" shortcut={`drag and drop ▅`}>
                  New node
                </DropdownItem>
                <DropdownItem key="edit" shortcut="Double click node">
                  Edit node
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  shortcut="Press Del key"
                  className="text-danger"
                  color="danger"
                >
                  Delete node
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <button
              className="btn-primary !rounded-full h-10 px-4 flex gap-2 items-center"
              onClick={handleUpdate}
            >
              <FaSave fontSize={"1.2rem"} />
              Save
            </button>
            <button
              className="btn-secondary !rounded-full h-10 px-4 flex gap-2 items-center"
              onClick={onOpen}
            >
              <FaShare fontSize={"1.2rem"} />
              Share
            </button>
            <Avatar user={userInfo} />
          </div>
        )}
      </div>

      <div className="h-[calc(100vh-6.5rem)]">
        <Flow id={id} onUpdateMaps={setUpdateMaps} />
      </div>
      <ModalShare isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  )
}

export default Detail
