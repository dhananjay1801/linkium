'use client'

import Image from 'next/image'
import React, { useState } from 'react'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [statusError, setStatusError] = useState(false)
    const passwordTooShort = password.length > 0 && password.length < 4
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword
    const canSubmit = Boolean(
        email &&
        password.length >= 4 &&
        confirmPassword.length >= 4 &&
        !passwordsMismatch
    )

    const handleSignup = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to create account.')
            }

            setStatusMessage('Account created! Check your inbox to get started.')
            setStatusError(false)
            setEmail('')
            setPassword('')
            setConfirmPassword('')
        } catch (error) {
            setStatusMessage(error.message || 'Something went wrong. Please try again.')
            setStatusError(true)
        }
    }

    return (
        <div>
            <div className="grid grid-cols-2 h-screen">
                <div className='col1 bg-rose-200 flex flex-col justify-center pl-[13vw] pr-15 gap-6 pt-27'>
                    <div>
                        <h1 className='text-4xl font-bold'>Sign Up for free!</h1>
                        <p className='text-lg text-gray-700 mt-2'>Launch your Linkium tree in under a minute and turn followers into clicks.</p>
                    </div>

                    <form className='' onSubmit={handleSignup}>
                        <div className='flex flex-col gap-4'>
                            <div className='items-center gap-2'>
                                <div className='text-lg font-semibold'>Email:</div>
                                <input
                                    className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
                                    type="email"
                                    placeholder='test@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='items-center gap-2'>
                                <div className='text-lg font-semibold'>Password:</div>
                                <input
                                    className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
                                    type="password"
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {passwordTooShort && (
                                    <p className='text-sm text-red-600 mt-1'>Password must be at least 4 characters.</p>
                                )}
                            </div>
                            <div className='items-center gap-2'>
                                <div className='text-lg font-semibold'>Confirm Password:</div>
                                <input
                                    className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
                                    type="password"
                                    placeholder='Confirm your password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {passwordsMismatch && (
                                    <p className='text-sm text-red-600 mt-1'>Passwords do not match.</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            className='hover:bg-gray-200 bg-gray-950 text-white transition-all duration-200 rounded-full p-3 px-6 mt-8 hover:text-black font-semibold cursor-pointer'
                            disabled={!canSubmit}
                            onClick={handleSignup}
                        >
                            Create Account
                        </button>
                        <p className={`text-sm mt-3 ${statusError ? 'text-red-600' : 'text-gray-700'}`}>
                            {statusMessage || 'Trusted by creators who want a vibrant home for every link they share.'}
                        </p>
                    </form>
                </div>

                <div className='col2 overflow-y-auto'>
                    <Image className="w-full h-[125vh] object-cover" src="/signup_banner.webp" alt="signup" width={1200} height={1000} />
                </div>
            </div>
        </div>
    )
}

export default Signup