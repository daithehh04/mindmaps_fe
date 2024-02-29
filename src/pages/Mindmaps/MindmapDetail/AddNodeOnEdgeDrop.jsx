/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { v4 as uuidv4 } from "uuid"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import { useSelector } from "react-redux"
import TextUpdaterNode from "./TextUpdaterNode.jsx"
let initialNodes = [
  {
    id: "0",
    type: "textUpdater",
    data: { value: "My mindmap" },
    position: { x: 0, y: 0 },
  },
]

const AddNodeOnEdgeDrop = ({ onUpdateMaps }) => {
  const mindmap = useSelector((state) => state.maps.mapsDetail)
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), [])
  const reactFlowWrapper = useRef(null)
  const connectingNodeId = useRef(null)
  const [selectedIdNode, setSelectedIdNode] = useState(null)
  const [selectedIdEdge, setSelectedIdEdge] = useState(null)

  const [nodes, setNodes, onNodesChange] = useNodesState(
    mindmap?.nodes || initialNodes
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(mindmap?.edges || [])
  const generateRandomId = () => {
    return uuidv4()
  }
  const { screenToFlowPosition } = useReactFlow()

  useEffect(() => {
    setNodes(mindmap?.nodes || initialNodes)
    setEdges(mindmap?.edges || [])
  }, [mindmap, setNodes, setEdges])

  useEffect(() => {
    onUpdateMaps({
      nodes,
      edges,
    })
  }, [nodes, edges, onUpdateMaps])

  const onConnect = useCallback(
    (params) => {
      // reset the start node on connections
      connectingNodeId.current = null
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId
  }, [])

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return

      const targetIsPane = event.target.classList.contains("react-flow__pane")
      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = generateRandomId()
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { value: `New node` },
          origin: [0.5, 0.0],
          type: "textUpdater",
        }
        setNodes((nds) => nds.concat(newNode))
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id })
        )
      }
    },
    [screenToFlowPosition, setEdges, setNodes]
  )

  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Delete" && selectedIdNode && selectedIdNode !== "0") {
        setNodes((nodes) => nodes.filter((node) => node.id !== selectedIdNode))
      }

      if (e.key === "Delete" && selectedIdEdge) {
        setEdges((edges) => edges.filter((edge) => edge.id !== selectedIdEdge))
      }
    })
  }, [selectedIdNode, setNodes, selectedIdEdge, setEdges])

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        deleteKeyCode={null}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => {
          setSelectedIdNode(node.id)
        }}
        onEdgeClick={(_, edge) => {
          setSelectedIdEdge(edge.id)
        }}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={[0.5, 0]}
      >
        <Background variant="dots" />
        <MiniMap nodeColor={nodeColor} />

        <Controls />
      </ReactFlow>
    </div>
  )
}
function nodeColor(node) {
  if (node.id === "0") {
    return "#00aaff"
  } else {
    return "#ff0072"
  }
}

export default AddNodeOnEdgeDrop
