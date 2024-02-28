/* eslint-disable react/prop-types */
import { DeleteIcon } from "~/icons/DeleteIcon"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { MdRestore } from "react-icons/md"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"
import { IoIosWarning } from "react-icons/io"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"

import { useCallback, useState } from "react"
import moment from "moment"
import { LuPencil } from "react-icons/lu"
import { FiTrash2 } from "react-icons/fi"
import { FaLink } from "react-icons/fa6"
import { LuArchiveRestore } from "react-icons/lu"
import Loading from "~/components/Loading"
import { Link } from "react-router-dom"
import {
  deleteAllMindmap,
  deleteForceMindmap,
  deleteMindmap,
  restoreAllMindmap,
  restoreMindmap,
} from "~/services/mindmap.service"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import ModalShare from "~/components/ModalShare"
const statusColorMap = {
  true: "success",
  false: "danger",
}

function MapsList({ maps, loading, onPage, page, pages, type, apiServer }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenM,
    onOpen: onOpenM,
    onOpenChange: onOpenChangeM,
  } = useDisclosure()
  const [isDel, setIsDel] = useState(false)
  const [isDelForce, setIsDelForce] = useState(false)
  const { mutate } = useSWRConfig()
  const [mapSelected, setMapSelected] = useState(null)
  const [listIds, setListIds] = useState(maps?.mindmaps?.map((m) => m.id))
  const ids = Array.from(selectedKeys).map((id) => id)
  const handleOpenModalDeleteAll = () => {
    setIsDel(true)
    if (selectedKeys !== "all") {
      setListIds(ids)
    }
    onOpen()
  }
  const handleOpenModalDelete = (id) => {
    setMapSelected(id)
    onOpen()
  }
  const handleOpenModalDeleteForce = (id) => {
    setMapSelected(id)
    setIsDelForce(true)
    onOpen()
  }
  const handleDelete = async () => {
    try {
      const res = await deleteMindmap(mapSelected)
      if (res.response.ok) {
        mutate(apiServer)
        toast.success("Remove to Trash success!")
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleDeleteForce = async () => {
    try {
      const res = await deleteForceMindmap(mapSelected)
      if (res.response.ok) {
        mutate(apiServer)
        toast.success("Deleted mindmap!")
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleRemoveAll = async () => {
    try {
      const res = await deleteAllMindmap({ ids: listIds })
      if (res.response.ok) {
        mutate(apiServer)
        toast.success("Remove all success!")
      }
    } catch (error) {
      console.error(error)
    }
  }
  /**
   * Handle restore
   */
  const handleOpenModalRestore = (id) => {
    setMapSelected(id)
    onOpen()
  }
  const handleRestore = async () => {
    try {
      const res = await restoreMindmap(mapSelected)
      if (res.response.ok) {
        mutate(apiServer)
        toast.success("Restore success!")
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleRestoreAll = async () => {
    try {
      const res = await restoreAllMindmap({ ids: listIds })
      if (res.response.ok) {
        mutate(apiServer)
        toast.success("Restore all success!")
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Handle modal share
   */
  const handleOpenModalShare = async (id) => {
    onOpenM()
    setMapSelected(id)
  }
  const renderCell = useCallback((map, columnKey) => {
    const cellValue = map[columnKey]
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-sm text-bold">{cellValue}</p>
          </div>
        )
      case "share":
        return (
          <Tooltip content="Share" color="danger" delay={0} closeDelay={0}>
            {type !== "trash" && (
              <button
                className="flex flex-col"
                onClick={() => handleOpenModalShare(map.id)}
              >
                <FaLink color="#333" fontSize={"1.1rem"} />
              </button>
            )}
          </Tooltip>
        )
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[map.status]}
            size="sm"
            variant="flat"
          >
            {cellValue ? "public" : "private"}
          </Chip>
        )
      case "updated_at":
        return (
          <div className="flex flex-col">
            <p className="text-sm text-bold">
              {moment(cellValue).format("MMM DD, YYYY")}
            </p>
          </div>
        )
      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown className="rounded-lg bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <HiOutlineDotsHorizontal fontSize={"1.4rem"} color="#aaa" />
                </Button>
              </DropdownTrigger>
              {type !== "trash" && (
                <DropdownMenu aria-label="Static Actions Maps">
                  <DropdownItem startContent={<LuPencil />} key="view">
                    <Link
                      to={`/my-mindmap/${map.id}`}
                      className="block w-full h-full"
                    >
                      View
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    startContent={<FiTrash2 />}
                    onClick={() => handleOpenModalDelete(map.id)}
                    key="trash"
                  >
                    Move to trash
                  </DropdownItem>
                </DropdownMenu>
              )}
              {type === "trash" && (
                <DropdownMenu aria-label="Static Actions Trashed">
                  <DropdownItem
                    startContent={<MdRestore />}
                    key="restore"
                    onClick={() => handleOpenModalRestore(map.id)}
                  >
                    Restore
                  </DropdownItem>
                  <DropdownItem
                    startContent={<FiTrash2 />}
                    onClick={() => handleOpenModalDeleteForce(map.id)}
                    key="delete"
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          </div>
        )
      default:
        return cellValue
    }
  }, [])
  const columns = [
    { name: "NAME", uid: "title" },
    { name: "", uid: "share" },
    { name: "STATUS", uid: "status" },
    { name: "MODIFIED", uid: "updated_at" },
    { name: "", uid: "actions" },
  ]

  const loadingState = loading || maps?.count === 0 ? "loading" : "idle"
  return (
    <div className="relative mt-6">
      <div className="absolute z-10 left-16 top-[26px]">
        {ids.length > 1 ? (
          <Tooltip
            color="danger"
            content={`${type !== "trash" ? "Move to trash" : "Restore all"}`}
          >
            <span
              className="text-xl cursor-pointer text-danger active:opacity-50"
              onClick={handleOpenModalDeleteAll}
            >
              {type !== "trash" ? <DeleteIcon /> : <LuArchiveRestore />}
            </span>
          </Tooltip>
        ) : (
          ""
        )}
      </div>
      <Table
        aria-label="Example table with custom cells"
        selectionMode="multiple"
        isStriped
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        bottomContent={
          pages > 0 ? (
            <div className="flex justify-center w-full">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => onPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={maps.mindmaps ?? []}
          loadingContent={<Loading />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-start gap-1">
                <IoIosWarning fontSize={"1.6rem"} color="red" />
                Confirm
              </ModalHeader>
              <ModalBody>
                <p>Are you sure?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={onClose}
                  onClick={() => setIsDel(false)}
                >
                  Close
                </Button>
                {isDel && type !== "trash" && (
                  <Button
                    color="danger"
                    onPress={onClose}
                    variant="bordered"
                    onClick={handleRemoveAll}
                  >
                    Remove all to trash
                  </Button>
                )}
                {!isDel && type !== "trash" && (
                  <Button
                    color="danger"
                    onPress={onClose}
                    variant="bordered"
                    onClick={handleDelete}
                  >
                    Remove
                  </Button>
                )}
                {isDel && !isDelForce && type === "trash" && (
                  <Button
                    color="danger"
                    onPress={onClose}
                    variant="bordered"
                    onClick={handleRestoreAll}
                  >
                    Restore all
                  </Button>
                )}{" "}
                {!isDel && !isDelForce && type === "trash" && (
                  <Button
                    color="danger"
                    onPress={onClose}
                    variant="bordered"
                    onClick={handleRestore}
                  >
                    Restore
                  </Button>
                )}
                {isDelForce && type === "trash" && (
                  <Button
                    color="danger"
                    onPress={onClose}
                    variant="bordered"
                    onClick={handleDeleteForce}
                  >
                    Delete
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ModalShare
        apiServerUpdate={apiServer}
        isOpen={isOpenM}
        onOpenChange={onOpenChangeM}
        idMap={mapSelected}
      />
    </div>
  )
}

export default MapsList
