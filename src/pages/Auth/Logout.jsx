import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

/* eslint-disable react/no-unescaped-entities */
function Logout() {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const navigate = useNavigate()
  useEffect(() => {
    if (userInfo?.id) {
      navigate("/")
    }
  }, [userInfo, navigate])
  return (
    <>
      <Helmet>
        <title>Logout | Mindmap</title>
        <meta name="description" content="logout mindmap" />
      </Helmet>
      <div className="flex flex-col items-center justify-center mt-6">
        <h3 className="text-[2.5rem] font-bold text-black">
          You've been logged out
        </h3>
        <p className="text-xl text-black">Stay productive with our web</p>
        <img src="/image/logout.png" alt="mindmap" />
        <Link to={"/signin"} className="mt-10 text-xl underline text-primary">
          Log in
        </Link>
      </div>
    </>
  )
}

export default Logout
