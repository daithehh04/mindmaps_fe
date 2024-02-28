/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ReactFlowProvider } from "reactflow"
import AddNodeOnEdgeDrop from "./AddNodeOnEdgeDrop"

function Flow({ id, onUpdateMaps }) {
  return (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop id={id} onUpdateMaps={onUpdateMaps} />
    </ReactFlowProvider>
  )
}

export default Flow
