/* eslint-disable react/prop-types */
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

const initialNodes = [
  {
    id: "0",
    type: "textUpdater",
    data: { label: "My mindmap" },
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
      console.log(nodes)
      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = `${nodes.length}`
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { value: `Node ${id}` },
          origin: [0.5, 0.0],
          type: "textUpdater",
        }
        setNodes((nds) => nds.concat(newNode))
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id })
        )
      }
    },
    [screenToFlowPosition, setEdges, nodes, setNodes]
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

  // if (isLoading)
  //   return (
  //     <div className="flex items-center justify-center h-[70vh]">
  //       <Loading />
  //     </div>
  //   )
  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        deleteKeyCode={null}
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
  switch (node.type) {
    case "input":
      return "#6ede87"
    case "output":
      return "#6865A5"
    default:
      return "#ff0072"
  }
}

export default AddNodeOnEdgeDrop
