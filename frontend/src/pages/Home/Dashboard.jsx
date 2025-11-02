import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import SummaryCard from '../../components/Cards/SummaryCard'
import { LucidePlus } from 'lucide-react'
import Modal from "../../components/modal/Modal"
import CreateSessionForm from "./CreateSessionForm"
import DeleteAlertContent from '../../components/content/DeleteAlertContent'

function Dashboard() {
  const navigate = useNavigate()

  const [openCreateModel, setOpenCreateModel] = useState(false)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null
  })

  const fetchAllSessions = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL)
      // console.log(response.data.data.sessions);

      setSessions(response.data.data.sessions)
    } catch (error) {
      toast.error('Failed to fetch sessions')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData._id))
      toast.success('Session deleted successfully')
      setOpenDeleteAlert({ open: false, data: null })
      fetchAllSessions()
    } catch (error) {
      toast.error('Failed to delete session')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAllSessions()
  }, [])

  return (
    <DashboardLayout>
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.length === 0 ?
              <div className="col-span-full text-center py-12 ">
                <div className="text-gray-500 text-lg mb-4">No sessions available</div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setOpenCreateModel(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer text-sm sm:text-base flex items-center gap-2"
                  >
                    <LucidePlus className="w-5 h-5" /> Create your first session
                  </button>
                </div>
              </div>
              :
              sessions?.map((session) => (
                <SummaryCard
                  key={session._id}
                  session={session}
                  onSelect={() => {
                    navigate(`/interview-prep/${session._id}`)
                  }}
                  onDelete={() => {
                    setOpenDeleteAlert({ open: true, data: session })
                  }}
                />
              ))}
          </div>
        )}

        <button
          className=' cursor-pointer fixed bottom-6 right-6 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2'
          onClick={() => setOpenCreateModel(true)}
        >
          <LucidePlus /> Add New
        </button>

      </div>

      <Modal
        isOpen={openCreateModel}
        onClose={() => {
          setOpenCreateModel(false)
        }}

      >
        <CreateSessionForm />
      </Modal>

      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null })
        }}
        hideHeader
      >
        <DeleteAlertContent
          content="Are you sure you want to delete this session?"
          onDelete={() => {
            deleteSession(openDeleteAlert.data)
          }}

          onCancel={() => {
            setOpenDeleteAlert({ open: false, data: null })
          }}
        />
      </Modal>


    </DashboardLayout>
  )
}

export default Dashboard