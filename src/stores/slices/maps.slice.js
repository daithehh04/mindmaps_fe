import { createSlice } from "@reduxjs/toolkit"
import {
  requestCreateMindmap,
  requestDeleteAllMindmap,
  requestDeleteForceMindmap,
  requestDeleteMindmap,
  requestGetAllMindmap,
  requestGetAllMindmapDeleted,
  requestGetMindmapDetail,
  requestRestoreAllMindmap,
  requestRestoreMindmap,
  requestUpdateMindmap,
} from "../middlewares/maps.middleware"

const initialState = {
  maps: {},
  mapsDeleted: {},
  key: null,
  mapsDetail: null,
  loading: true,
}

export const mapsSlice = createSlice({
  name: "maps",
  initialState,
  reducers: {
    setKey: (state, action) => {
      state.key = action.payload
    },
  },
  extraReducers: (builder) => {
    const actionList = [
      requestCreateMindmap,
      requestDeleteAllMindmap,
      requestGetAllMindmapDeleted,
      requestDeleteForceMindmap,
      requestDeleteMindmap,
      requestGetAllMindmap,
      requestGetMindmapDetail,
      requestRestoreMindmap,
      requestRestoreAllMindmap,
      requestUpdateMindmap,
    ]
    actionList.forEach((action) => {
      builder.addCase(action.pending, (state) => {
        state.loading = true
      })
    })
    actionList.forEach((action) => {
      builder.addCase(action.rejected, (state) => {
        state.loading = false
      })
    })

    /**
     * requestGetAllMindmap
     */
    builder.addCase(requestGetAllMindmap.fulfilled, (state, action) => {
      state.maps = action.payload.metadata
      state.loading = false
    })
    /**
     * requestCreateMindmap
     */
    builder.addCase(requestCreateMindmap.fulfilled, (state, action) => {
      state.maps = [action.payload, ...state.maps]
      state.loading = false
    })
    /**
     * requestGetAllMindmapDeleted
     */
    builder.addCase(requestGetAllMindmapDeleted.fulfilled, (state, action) => {
      state.mapsDeleted = action.payload.metadata
      state.loading = false
    })
    /**
     * requestDeleteAllMindmap
     */
    builder.addCase(requestDeleteAllMindmap.fulfilled, (state, action) => {
      const arrId = action.payload.metadata
      state.maps = {
        count: state.maps.count - arrId.length,
        mindmaps: state.maps.mindmaps.filter((m) => !arrId.includes(m.id)),
      }
      state.loading = false
    })
    /**
     * requestDeleteMindmap
     */
    builder.addCase(requestDeleteMindmap.fulfilled, (state, action) => {
      const idDel = action.payload.metadata
      state.maps = {
        count: state.maps.count - 1,
        mindmaps: state.maps.mindmaps.filter((m) => m.id !== idDel),
      }
      state.loading = false
    })
    /**
     * requestGetMindmapDetail
     */
    builder.addCase(requestGetMindmapDetail.fulfilled, (state, action) => {
      state.mapsDetail = action.payload.metadata
      state.loading = false
    })
    /**
     * requestUpdateMindmap
     */
    builder.addCase(requestUpdateMindmap.fulfilled, (state, action) => {
      state.mapsDetail = action.payload.metadata
      state.loading = false
    })
    /**
     * requestRestoreMindmap
     */
    builder.addCase(requestRestoreMindmap.fulfilled, (state, action) => {
      const idMap = action.payload.metadata
      state.mapsDeleted = {
        count: state.mapsDeleted.count - 1,
        mindmaps: state.mapsDeleted.mindmaps.filter((m) => m.id !== idMap),
      }
      state.loading = false
    })

    /**
     * requestRestoreAllMindmap
     */
    builder.addCase(requestRestoreAllMindmap.fulfilled, (state, action) => {
      console.log("restore all::", action.payload)
      state.loading = false
    })
  },
})
export const { setKey } = mapsSlice.actions
export default mapsSlice.reducer
