/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import queryString from "query-string"
import useSWR from "swr"
import { fetcher } from "~/utils/fetcher"
import Loading from "~/components/Loading"
import PublicIcon from "~/icons/PublicIcon"
import MapsList from "../Mindmaps/MapsList"
import Navigate from "../Mindmaps/Nav"
import { Helmet } from "react-helmet"

function Public() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const key = useSelector((state) => state.maps.key)
  const [search, setSearch] = useState("")
  const query = {
    page,
    limit: 5,
    key,
    status: true,
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
    <div className="relative">
      <Helmet>
        <title>Public Maps | Mindmap</title>
        <meta name="description" content="public mindmap" />
      </Helmet>
      <Navigate onSearch={setSearch} onLoading={setLoading} />
      <p className="text-lg">
        {search ? `${maps?.metadata?.count} results for "${search}"` : ""}
      </p>
      {isLoading ||
        (loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center w-full bg-white opacity-70">
            <Loading />
          </div>
        ))}
      {!isLoading && maps?.metadata?.count > 0 ? (
        <div>
          <MapsList
            type="public"
            maps={maps?.metadata}
            loading={isLoading}
            pages={pages}
            page={page}
            apiServer={apiServer}
            onPage={setPage}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center h-[50vh] justify-center text-gray">
          <PublicIcon className="w-[240px] h-36" />
          <p className="mt-2 text-black">No Public Maps</p>
          <p className="w-[400px] text-center">
            You can make maps public via the context menu. Share your creation
            with the world.
          </p>
        </div>
      )}
    </div>
  )
}

export default Public
