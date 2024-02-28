import queryString from "query-string"
import TrashIcon from "~/icons/TrashIcon"
import MapsList from "../Mindmaps/MapsList"
import useSWR from "swr"
import { fetcher } from "~/utils/fetcher"
import Loading from "~/components/Loading"
import { useSelector } from "react-redux"
import { useMemo, useState } from "react"
import Navigate from "../Mindmaps/Nav"
import { Helmet } from "react-helmet"

function Trash() {
  const [page, setPage] = useState(1)
  const key = useSelector((state) => state.maps.key)
  const [search, setSearch] = useState("")
  const query = {
    page,
    limit: 8,
    key,
    q: search,
  }
  const queryStringified = queryString.stringify(query)
  const apiServer = `/mindmaps/deleted?${queryStringified}`
  const { data, isLoading } = useSWR(apiServer, fetcher)
  const maps = data?.metadata
  const pages = useMemo(() => {
    return maps?.count ? Math.ceil(maps?.count / query.limit) : 0
  }, [maps?.count, query.limit])
  return (
    <>
      <Helmet>
        <title>Trashed Maps | Mindmap</title>
        <meta name="description" content="trashed mindmap" />
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
      {!isLoading && maps?.count > 0 ? (
        <div>
          <MapsList
            type="trash"
            maps={maps}
            loading={isLoading}
            pages={pages}
            page={page}
            apiServer={apiServer}
            onPage={setPage}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center h-[80vh] items-center text-gray">
          <TrashIcon className="w-32 h-32 text-gray1" />
          <p className="mt-6 text-black">Trash Empty</p>
          <p>There are no deleted items.</p>
        </div>
      )}
    </>
  )
}

export default Trash