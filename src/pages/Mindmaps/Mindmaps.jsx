/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import MapsIcon from "~/icons/MapsIcon"
import MapsList from "./MapsList"
import queryString from "query-string"
import useSWR from "swr"
import { fetcher } from "~/utils/fetcher"
import Loading from "~/components/Loading"
import Navigate from "./Nav"
import { Helmet } from "react-helmet"

function Mindmaps() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const key = useSelector((state) => state.maps.key)
  const [search, setSearch] = useState("")
  const query = {
    page,
    limit: 5,
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
    <div className="relative">
      <Helmet>
        <title>My mindmap | Mindmap</title>
        <meta name="description" content="my mindmap" />
      </Helmet>
      <Navigate onSearch={setSearch} onLoading={setLoading} />
      {!isLoading && (
        <p className="text-lg">
          {search ? `${maps?.metadata?.count} results for "${search}"` : ""}
        </p>
      )}
      {(isLoading || loading) && (
        <div className="absolute inset-0 z-20 h-[100vh] flex items-center justify-center w-full bg-white opacity-70">
          <Loading />
        </div>
      )}
      {maps?.metadata?.count > 0 ? (
        <div>
          <MapsList
            type="maps"
            maps={maps?.metadata}
            loading={isLoading}
            pages={pages}
            page={page}
            apiServer={apiServer}
            onPage={setPage}
          />
        </div>
      ) : (
        !isLoading && (
          <div className="flex flex-col justify-normal h-[50vh] items-center text-gray">
            <MapsIcon className="w-32 h-32 text-gray1" />
            <p className="text-black">
              This is your map listing ... but it empty.
            </p>
            <p>
              You can find all your maps here once you have some. Start creating
              and come back later!
            </p>
          </div>
        )
      )}
    </div>
  )
}

export default Mindmaps
