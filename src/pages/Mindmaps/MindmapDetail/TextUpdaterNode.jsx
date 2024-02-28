/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Handle, Position, useReactFlow } from "reactflow"
export default function TextUpdaterNode({ data, isConnectable, ...rest }) {
  const [isClicked, setIsClicked] = useState(false)
  const [isEditing, setEditing] = useState(false)
  const { setNodes } = useReactFlow()
  const type = useSelector((state) => state.maps.type)
  const refNode = useRef(null)
  const onDoubleClick = () => {
    setEditing(true)
  }
  const onChange = useCallback(
    (evt) => {
      const { id } = rest
      setNodes((nodes) => {
        return nodes.map((node) => {
          if (node.id === id) {
            const updatedNode = {
              ...node,
              data: { ...node.data, value: evt.target.value },
            }
            return updatedNode
          }
          return node
        })
      })
    },
    [rest, setNodes]
  )
  const onBlur = () => {
    setEditing(false)
  }
  const handleClick = () => {
    setIsClicked(true)
  }
  const handleOutsideClick = (e) => {
    if (refNode.current && !refNode.current.contains(e.target)) {
      setIsClicked(false)
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick)
    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [])

  return (
    <div
      ref={refNode}
      className={`text-updater-node-${type} ${isClicked && "clicked"}`}
      onDoubleClick={onDoubleClick}
      onClick={handleClick}
    >
      {+rest.id !== 0 && (
        <Handle
          type="target"
          position={type === "1" ? Position.Top : Position.Left}
          isConnectable={isConnectable}
        />
      )}
      <div className="node-item">
        {isEditing ? (
          <input
            id="text"
            name="text"
            onChange={onChange}
            onBlur={onBlur}
            className="nodrag"
            value={data.value}
          />
        ) : (
          <span>{data.value}</span>
        )}
      </div>
      <Handle
        type="source"
        position={type === "1" ? Position.Bottom : Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  )
}
