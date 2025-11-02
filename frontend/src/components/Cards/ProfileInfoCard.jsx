import React, { useContext } from 'react'
import { LogOut } from 'lucide-react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'

function ProfileInfoCard() {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        clearUser()
        navigate('/')
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.profileImageUrl ? 
                        <img 
                            src={user.profileImageUrl} 
                            alt={user?.name || 'User'} 
                            className="w-full h-full rounded-full object-cover"
                        /> :
                        user?.name?.charAt(0)?.toUpperCase() || 'U'
                    }
                </div>
                <div className="hidden md:block">
                    <div className="font-medium text-gray-800">{user?.name || 'User'}</div>
                    <div className="text-sm text-gray-500">{user?.email || 'user@example.com'}</div>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
            >
                <LogOut className="w-5 h-5 text-gray-600 cursor-pointer " />
            </button>
        </div>
    )
}

export default ProfileInfoCard