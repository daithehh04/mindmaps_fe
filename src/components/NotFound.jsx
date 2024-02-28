import { IoIosArrowRoundForward } from "react-icons/io"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="mt-[20px] pb-[50px] relative min-h-[100vh]">
      <span className="text-[350px] font-bold text-[#3e484d] opacity-10 block text-center leading-[1.2]">
        404
      </span>
      <img
        src={"/image/404-error.svg"}
        width={500}
        height={500}
        alt="not-found"
        className="absolute top-10 object-cover w-[500px] left-[50%] -translate-x-1/2"
      />
      <h2 className="mt-10 text-center heading-1">Page not found.</h2>
      <Link
        to="/"
        className="flex items-center gap-1 px-6 py-3 mx-auto mt-4 btn-primary w-max"
      >
        Return Home
        <IoIosArrowRoundForward fontSize={"2rem"} />
      </Link>
    </div>
  )
}
