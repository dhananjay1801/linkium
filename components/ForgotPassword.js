'use client'

import React, { useState } from 'react'

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    if (newPassword.length < 4) {
      setMessage('Password must be at least 4 characters.')
      return
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to reset password.')
      }

      setMessage('Password updated. You can log in with your new password now.')
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className='flex flex-col gap-4 mt-4'>
      <h1 className='text-4xl font-bold'>Reset your password</h1>
      <p className='text-sm text-gray-700'>
        Enter your email and a new password.
      </p>

      <div className='flex flex-col gap-3'>
        <div className='items-center gap-2'>
          <div className='text-lg font-semibold'>Email:</div>
          <input
            className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
            type='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='items-center gap-2'>
          <div className='text-lg font-semibold'>New password:</div>
          <input
            className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
            type='password'
            placeholder='Enter new password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className='items-center gap-2'>
          <div className='text-lg font-semibold'>Confirm password:</div>
          <input
            className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <div className='flex gap-3 mt-4'>
        <button
          className='hover:bg-gray-200 bg-gray-950 text-white transition-all duration-200 rounded-full p-3 px-6 hover:text-black font-semibold cursor-pointer'
          type='button'
          onClick={handleSubmit}
        >
          Set new password
        </button>
        {onBack && (
          <button
            className='text-sm text-pink-600 font-semibold hover:underline cursor-pointer'
            type='button'
            onClick={onBack}
          >
            Back to login
          </button>
        )}
      </div>

      {message && (
        <p className='text-sm mt-2 text-gray-800'>
          {message}
        </p>
      )}
    </div>
  )
}

export default ForgotPassword

