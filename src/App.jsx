import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import MyWeek from './pages/MyWeek.jsx'
import WhosFree from './pages/WhosFree.jsx'
import Hangouts from './pages/Hangouts.jsx'
import CampusMap from './pages/Map.jsx'
import Feed from './pages/Feed.jsx'
import Friends from './pages/Friends.jsx'
import CreateHangoutModal from './components/CreateHangoutModal.jsx'
import { useApp } from './lib/AppContext.jsx'

export default function App() {
  const { createModal, closeCreateHangout } = useApp()

  return (
    <div className="flex h-screen bg-surface-muted">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-6xl px-10 py-8">
          <Routes>
            <Route path="/" element={<MyWeek />} />
            <Route path="/whos-free" element={<WhosFree />} />
            <Route path="/hangouts" element={<Hangouts />} />
            <Route path="/map" element={<CampusMap />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
        </div>
      </main>
      {createModal.open && (
        <CreateHangoutModal prefill={createModal.prefill} onClose={closeCreateHangout} />
      )}
    </div>
  )
}
