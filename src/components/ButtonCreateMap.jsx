/* eslint-disable react/prop-types */
function ButtonCreateMap({ src, name, onClick, className }) {
  return (
    <button
      className={`px-4 mt-4 mb-6 flex-col flex gap-1 w-max items-center bg-[#0000000D] hover:bg-[#1d1d1d1f] py-3 !rounded-xl ${className}`}
      onClick={onClick}
    >
      <img src={src} alt="" />
      <p className="text-sm text-black">{name}</p>
    </button>
  )
}

export default ButtonCreateMap
