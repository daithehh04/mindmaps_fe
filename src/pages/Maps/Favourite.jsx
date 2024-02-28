/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import queryString from "query-string"
import useSWR from "swr"
import { fetcher } from "~/utils/fetcher"
import Loading from "~/components/Loading"
import { api } from "~/utils/api"
import MapsList from "../Mindmaps/MapsList"
import FavoriteIcon from "~/icons/FavoriteIcon"
import Navigate from "../Mindmaps/Nav"
import { Helmet } from "react-helmet"

function Favorite() {
  const [page, setPage] = useState(1)
  const key = useSelector((state) => state.maps.key)
  const [search, setSearch] = useState("")
  const query = {
    page,
    limit: 8,
    favorite: true,
    key,
    q: search,
  }
  const queryStringified = queryString.stringify(query)
  const apiServer = `/mindmaps?${queryStringified}`
  const { data: maps, isLoading } = useSWR(apiServer, fetcher)

  const pages = useMemo(() => {
    return maps?.metadata?.count
      ? Math.ceil(maps?.metadata?.count / query.limit)
      : 0
  }, [maps?.metadata?.count, query.limit])

  return (
    <>
      <Helmet>
        <title>Favorite Maps | Mindmap</title>
        <meta name="description" content="favorite mindmap" />
      </Helmet>
      <Navigate onSearch={setSearch} />
      <p className="text-lg">
        {search ? `${maps?.metadata?.count} results for "${search}"` : ""}
      </p>
      {isLoading && (
        <div className="w-full h-[60vh] bg-white flex items-center justify-center">
          <Loading />
        </div>
      )}
      {!isLoading && maps?.metadata?.count > 0 ? (
        <div>
          <MapsList
            type="favorite"
            maps={maps?.metadata}
            loading={isLoading}
            pages={pages}
            page={page}
            apiServer={apiServer}
            onPage={setPage}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center h-[80vh] justify-center text-gray">
          <FavoriteIcon className="w-[240px] h-36" />
          <p className="mt-2 text-black">No Favorite Maps</p>
          <p className="w-[400px] text-center">
            You can favorite maps via the context menu, or simply drag them onto
            the sidebar item.
          </p>
        </div>
      )}
    </>
  )
}

export default Favorite
