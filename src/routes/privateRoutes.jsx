import { Route } from "react-router-dom"
import Profile from "../pages/Auth/Profile"
import AuthMiddleware from "../middlewares/AuthMiddleware"
import MapsLayout from "~/layouts/MapsLayout/MapsLayout"
import Mindmaps from "~/pages/Mindmaps/Mindmaps"
import MindmapDetail from "~/pages/Mindmaps/MindmapDetail/Detail"
import Public from "~/pages/Maps/Public"
import Trash from "~/pages/Maps/Trash"
import MapDetailLayout from "~/layouts/MapDetailLayout/MapDetailLayout"
import Favorite from "~/pages/Maps/Favourite"
export const privateRoutes = (
  <>
    <Route element={<MapsLayout />}>
      <Route element={<AuthMiddleware />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-mindmap" element={<Mindmaps />} />
        <Route path="/maps/favorite" element={<Favorite />} />
        <Route path="/maps/public" element={<Public />} />
        <Route path="/maps/trashed" element={<Trash />} />
      </Route>
    </Route>
    <Route element={<MapDetailLayout />}>
      <Route element={<AuthMiddleware />}>
        <Route path="/my-mindmap/:id" element={<MindmapDetail />} />
      </Route>
    </Route>
  </>
)
