import { FaAirbnb, FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { setGlobalState, truncate, useGlobalState } from '../store'
import { Magic } from 'magic-sdk'

const Header = () => {
  const [connectedAccount, setConnectedAccount] = useGlobalState('connectedAccount')
  const magic = new Magic('pk_live_47057EC7DC7D2202')

  const handleLogout = async () => {
    await magic.user.logout()
    setConnectedAccount(null)
  }

  return (
    <header className="flex justify-between items-center p-4 px-8 sm:px-10 md:px-14 border-b-2 border-b-slate-200 w-full">
      <Link to={'/'}>
        <p className="text-[#ff385c] flex items-center text-xl">
          <FaAirbnb className=" font-semibold" />
          DappBnb
        </p>
      </Link>

      <ButtonGroup handleLogout={handleLogout} />

      {connectedAccount ? (
        <button onClick={handleLogout} className="p-2 bg-[#ff385c] text-white rounded-full text-sm">
          {truncate(connectedAccount, 4, 4, 11)} (Logout)
        </button>
      ) : (
        <button onClick={() => magic.auth.loginWithMagicLink()} className="p-2 bg-[#ff385c] text-white rounded-full text-sm">
          Login with Magic
        </button>
      )}
    </header>
  )
}
const ButtonGroup = () => {
  const [currentUser] = useGlobalState('currentUser')
  const navigate = useNavigate()

  const handleNavigate = () => {
    if (currentUser) {
      navigate('/recentconversations')
    } else {
      setGlobalState('authModal', 'scale-100')
    }
  }

  return (
    <div
      className="md:flex hidden items-center justify-center shadow-gray-400
      shadow-sm overflow-hidden rounded-full cursor-pointer"
    >
      <div className="inline-flex" role="group">
        <button
          onClick={handleNavigate}
          className="
            rounded-l-full
            px-5
            md:py-2 py-1 
            border border-slate-200
            text-[#ff385c]
            font-medium
            text-sm
            leading-tight
            hover:bg-black hover:bg-opacity-5
            focus:outline-none focus:ring-0
            transition
            duration-150
            ease-in-out
          "
        >
          Customers
        </button>
        <Link to={'/addRoom'}>
          <button
            type="button"
            className="
              px-5
              md:py-2 py-1 
              border border-slate-200
              text-[#ff385c]
              font-medium
              text-sm
              leading-tight
              hover:bg-black hover:bg-opacity-5
              focus:outline-none focus:ring-0
              transition
              duration-150
              ease-in-out
            "
          >
            Add Rooms
          </button>
        </Link>

        <button
          onClick={handleNavigate}
          className="
            rounded-r-full
            px-5
            md:py-2 py-1 
            border border-slate-200
            text-[#ff385c]
            font-medium
            text-sm
            leading-tight
            hover:bg-black hover:bg-opacity-5
            focus:outline-none focus:ring-0
            transition
            duration-150
            ease-in-out
          "
        >
          <p className="flex items-center">Chats</p>
        </button>
      </div>
    </div>
  )
}

export default Header
