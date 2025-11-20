import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }){
  const { user } = useLibrary()
  if(!user) return <Navigate to="/login" replace />
  return children
}