/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
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
function Navigate({ onSearch, onLoading }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["new"]))
  const key = Array.from(selectedKeys).map((k) => k)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setKey(key[0]))
  }, [key[0]])
  const userInfo = useSelector((state) => state.auth.userInfo)
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
  const handleCreateMindmap = async () => {
    const idMap = uuidv4()
    const payload = {
      id: idMap,
      user: userInfo,
      title: "Tiêu đề mindmap không tên",
      desc: "Chưa có mô tả",
      img: "https://cdn5.mindmeister.com/assets/library/general/mm-logout-illustration_220727-f35a7063c1cb3191481037c2e66edc4999ec2e6e83f4b4f15c3af6ca43753682.png",
      status: pathname === "/maps/public",
      nodes: [
        {
          id: "0",
          type: "textUpdater",
          data: { value: "My mindmap" },
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    }
    try {
      onLoading(true)
      const res = await createMindmap(payload)
      if (res.response.ok) {
        navigate(`/my-mindmap/${idMap}`)
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
      {(pathname === "/my-mindmap" || pathname === "/maps/public") && (
        <button
          className="px-8 mt-4 mb-6 flex gap-1 w-max items-center btn-primary py-5 !rounded-xl"
          onClick={handleCreateMindmap}
        >
          <FiPlus fontSize={"3rem"} />
        </button>
      )}
    </>
  )
}

export default Navigate
