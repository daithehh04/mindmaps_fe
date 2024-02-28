/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react"
import Avatar from "~/components/Avatar"
import { v4 as uuidv4 } from "uuid"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react"
import { Input } from "@nextui-org/react"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { IoSearch } from "react-icons/io5"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiPlus } from "react-icons/fi"
import { createMindmap } from "~/services/mindmap.service"
import { setKey } from "~/stores/slices/maps.slice"
import { useDebouncedCallback } from "use-debounce"

const heading = {
  "/my-mindmap": "My Maps",
  "/maps/favorite": "Favorite Maps",
  "/maps/public": "Public Maps",
  "/maps/trashed": "Trashed Maps",
}
const edges = [
  { id: "0-1", source: "0", target: "1" },
  { id: "0-2", source: "0", target: "2" },
]

const node_1 = [
  {
    id: "0",
    data: { value: "My mindmap" },
    position: { x: 0, y: 0 },
    type: "textUpdater",
  },
  {
    id: "1",
    data: { value: "New node" },
    position: { x: 130, y: 100 },
    type: "textUpdater",
  },
  {
    id: "2",
    data: { value: "New node" },
    position: { x: -130, y: 100 },
    type: "textUpdater",
  },
]
const node_2 = [
  {
    id: "0",
    data: { value: "My mindmap" },
    position: { x: -500, y: 155 },
    type: "textUpdater",
  },
  {
    id: "1",
    data: { value: "New node" },
    position: { x: -220, y: 60 },
    type: "textUpdater",
  },
  {
    id: "2",
    data: { value: "New node" },
    position: { x: -220, y: 220 },
    type: "textUpdater",
  },
]
function Navigate({ onSearch, onLoading }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["new"]))
  const key = Array.from(selectedKeys).map((k) => k)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setKey(key[0]))
  }, [key[0]])
  const userInfo = useSelector((state) => state.auth.userInfo)
  const type = useSelector((state) => state.maps.type)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const [searchValue, setSearchValue] = useState("")
  const handleClear = () => {
    setSearchValue("")
    onSearch("")
  }
  const debounced = useDebouncedCallback((value) => {
    onSearch(value)
  }, 1000)
  const handleChange = (e) => {
    setSearchValue(e.target.value)
    debounced(e.target.value)
  }

  const handleCreateMindmap = async (type) => {
    const idMap = uuidv4()
    const payload = {
      id: `${idMap}~${type}`,
      user: userInfo,
      title: "Tiêu đề mindmap không tên",
      desc: "Chưa có mô tả",
      img: "https://cdn5.mindmeister.com/assets/library/general/mm-logout-illustration_220727-f35a7063c1cb3191481037c2e66edc4999ec2e6e83f4b4f15c3af6ca43753682.png",
      status: pathname === "/maps/public",
      nodes: node_1,
      edges: edges,
    }
    try {
      onLoading(true)
      const res = await createMindmap(payload)
      if (res.response.ok) {
        navigate(`/my-mindmap/${idMap}~${type}`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      onLoading(false)
    }
  }
  const handleCreateMindmap2 = async (type) => {
    const idMap = uuidv4()
    const payload = {
      id: `${idMap}~${type}`,
      user: userInfo,
      title: "Tiêu đề mindmap không tên",
      desc: "Chưa có mô tả",
      img: "https://cdn5.mindmeister.com/assets/library/general/mm-logout-illustration_220727-f35a7063c1cb3191481037c2e66edc4999ec2e6e83f4b4f15c3af6ca43753682.png",
      status: pathname === "/maps/public",
      nodes: node_2,
      edges: edges,
    }
    try {
      onLoading(true)
      const res = await createMindmap(payload)
      if (res.response.ok) {
        navigate(`/my-mindmap/${idMap}~${type}`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      onLoading(false)
    }
  }
  return (
    <>
      <div className="flex items-center justify-between w-full rounded-tl-xl">
        <h3 className="text-2xl">{heading[pathname]}</h3>
        <div className="flex items-center gap-3">
          <Dropdown>
            <DropdownTrigger>
              <Button className="w-16 min-w-0 p-0 bg-white rounded-full hover:bg-blue1">
                <BiDotsHorizontalRounded fontSize={"1.6rem"} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <DropdownItem key="sort" isDisabled className="opacity-100">
                <span className="font-bold">Sort By</span>
              </DropdownItem>
              <DropdownItem key="top">A to Z</DropdownItem>
              <DropdownItem key="bottom">Z to A</DropdownItem>
              <DropdownItem key="new">Newest first</DropdownItem>
              <DropdownItem key="old">Oldest first</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* Search */}
          <Input
            isClearable
            variant="underlined"
            radius="sm"
            placeholder="Type to search..."
            onClear={handleClear}
            onChange={handleChange}
            value={searchValue}
            startContent={<IoSearch fontSize={"1.6rem"} />}
          />
          <Avatar user={userInfo} />
        </div>
      </div>
      <div className="flex gap-4">
        {(pathname === "/my-mindmap" || pathname === "/maps/public") && (
          <button
            className="px-12 mt-4 mb-6 flex gap-1 w-max items-center btn-primary py-2 !rounded-xl"
            onClick={onOpen}
          >
            <FiPlus fontSize={"3rem"} />
          </button>
        )}
        {(pathname === "/my-mindmap" || pathname === "/maps/public") && (
          <button
            className="px-6 mt-4 mb-6 flex-col flex gap-1 w-max items-center bg-[#0000000D] hover:bg-[#1d1d1d1f] py-5 !rounded-xl"
            onClick={() => handleCreateMindmap(1)}
          >
            <img src="/image/chart-map.svg" alt="" />
            <p className="text-sm text-black">Org chart</p>
          </button>
        )}
        {(pathname === "/my-mindmap" || pathname === "/maps/public") && (
          <button
            className="px-6 mt-4 mb-6 flex flex-col gap-1 w-max items-center bg-[#0000000D] hover:bg-[#1d1d1d1f] py-5 !rounded-xl"
            onClick={() => handleCreateMindmap2(2)}
          >
            <img src="/image/project-retrospective.svg" alt="" />
            <p className="text-sm text-black">Retrospective</p>
          </button>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choose Type Maps
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4">
                  {(pathname === "/my-mindmap" ||
                    pathname === "/maps/public") && (
                    <button
                      className="px-6 mt-4 mb-6 flex flex-col gap-1 w-max items-center bg-[#0000000D] hover:bg-[#1d1d1d1f] py-5 !rounded-xl"
                      onClick={() => {
                        onClose()
                        return handleCreateMindmap(1)
                      }}
                    >
                      <img src="/image/chart-map.svg" alt="" />
                      <p className="text-sm text-black">Org chart</p>
                    </button>
                  )}
                  {(pathname === "/my-mindmap" ||
                    pathname === "/maps/public") && (
                    <button
                      className="px-6 mt-4 mb-6 flex flex-col gap-1 w-max items-center bg-[#0000000D] hover:bg-[#1d1d1d1f] py-5 !rounded-xl"
                      onClick={() => {
                        onClose()
                        return handleCreateMindmap2(2)
                      }}
                    >
                      <img src="/image/project-retrospective.svg" alt="" />
                      <p className="text-sm text-black">Retrospective</p>
                    </button>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Navigate
