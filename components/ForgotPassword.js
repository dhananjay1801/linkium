'use client'

import React, { useState } from 'react'

const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async () => {
    if (!email) {
      setMessage('Please enter your email.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to send code.')
      }
      setMessage('If an account exists, a code was sent to your email.')
      setStep(2)
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      setMessage('Please fill in code and both password fields.')
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
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to reset password.')
      }
      setMessage('Password updated. You can log in with your new password now.')
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4 mt-4'>
      <h1 className='text-2xl md:text-4xl font-bold'>Reset your password</h1>

      {step === 1 ? (
        <>
          <p className='text-sm text-gray-700'>
            Enter your email and we’ll send you a 6-digit code.
          </p>
          <div className='flex flex-col gap-3'>
            <div className='items-center gap-2'>
              <div className='text-lg font-semibold'>Email:</div>
              <input
                className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className='flex gap-3 mt-4'>
            <button
              className='hover:bg-gray-200 bg-gray-950 text-white transition-all duration-200 rounded-full p-3 px-6 hover:text-black font-semibold cursor-pointer disabled:opacity-50'
              type='button'
              onClick={handleSendCode}
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Send code'}
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
        </>
      ) : (
        <>
          <p className='text-sm text-gray-700'>
            Enter the code from your email and choose a new password.
          </p>
          <div className='flex flex-col gap-3'>
            <div className='items-center gap-2'>
              <div className='text-lg font-semibold'>Code:</div>
              <input
                className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto'
                type='text'
                placeholder='6-digit code'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className='items-center gap-2'>
              <div className='text-lg font-semibold'>New password:</div>
              <input
                className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto'
                type='password'
                placeholder='Enter new password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className='items-center gap-2'>
              <div className='text-lg font-semibold'>Confirm password:</div>
              <input
                className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto'
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className='flex gap-3 mt-4'>
            <button
              className='hover:bg-gray-200 bg-gray-950 text-white transition-all duration-200 rounded-full p-3 px-6 hover:text-black font-semibold cursor-pointer disabled:opacity-50'
              type='button'
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
            <button
              className='text-sm text-pink-600 font-semibold hover:underline cursor-pointer'
              type='button'
              onClick={() => { setStep(1); setMessage(''); setCode(''); setNewPassword(''); setConfirmPassword(''); }}
            >
              Use different email
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
        </>
      )}

      {message && (
        <p className='text-sm mt-2 text-gray-800'>
          {message}
        </p>
      )}
    </div>
  )
}

export default ForgotPassword
