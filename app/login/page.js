'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ForgotPassword from '@/components/ForgotPassword'
import Link from 'next/link'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [statusError, setStatusError] = useState(false)
    const [showForgot, setShowForgot] = useState(false)
    const router = useRouter()

    const handleLogin = async () => {
        if (!email || !password) {
            setStatusMessage('Please fill in both email and password.')
            setStatusError(true)
            return
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to log in.')
            }

            if (typeof window !== 'undefined') {
                // Store JWT token and user email
                localStorage.setItem('linkium_token', data.token)
                localStorage.setItem('linkium_user', data.email)
                window.dispatchEvent(new Event('linkium-auth-change'))
            }
            setStatusMessage('Welcome back!')
            setStatusError(false)
            router.push('/')
        } catch (error) {
            setStatusMessage(error.message || 'Something went wrong. Please try again.')
            setStatusError(true)
        }
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen md:h-screen">
                <div className='col1 bg-indigo-300 flex flex-col justify-center px-6 md:pl-[13vw] md:pr-15 gap-6 pt-28 md:pt-27 pb-10 md:pb-0'>
                    {!showForgot && (
                        <div>
                            <h1 className='text-3xl md:text-4xl font-bold'>Log in</h1>
                            <p className='text-base md:text-lg text-gray-700 mt-2'>Pick up where you left off and keep every link in sync.</p>
                        </div>
                    )}

                    <div>
                        {!showForgot ? (
                            <>
                                <div className='flex flex-col gap-4'>
                                    <div className='items-center gap-2'>
                                        <div className='text-lg font-semibold'>Email:</div>
                                        <input
                                            className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto'
                                            type="email"
                                            placeholder='you@example.com'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className='items-center gap-2'>
                                        <div className='text-lg font-semibold'>Password:</div>
                                        <input
                                            className='bg-white rounded-full px-4 pr-15 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto'
                                            type="password"
                                            placeholder='Enter your password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mt-4 text-sm text-gray-700'>
                                    <button
                                        type="button"
                                        className='text-pink-600 font-semibold hover:underline cursor-pointer'
                                        onClick={() => setShowForgot(true)}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <button
                                    className='hover:bg-gray-200 bg-gray-950 text-white transition-all duration-200 rounded-full p-3 px-6 mt-6 hover:text-black font-semibold cursor-pointer'
                                    onClick={handleLogin}
                                >
                                    Log In
                                </button>
                                {statusMessage && (
                                    <p className={`text-sm mt-3 ${statusError ? 'text-red-600' : 'text-green-700'}`}>
                                        {statusMessage}
                                    </p>
                                )}
                                <p className='text-sm text-gray-700 mt-3'>Need an account? <Link href="/signup" className='text-pink-600 font-semibold hover:underline'>Create one in seconds.</Link></p>
                            </>
                        ) : (
                            <ForgotPassword onBack={() => setShowForgot(false)} />
                        )}
                    </div>
                </div>

                <div className='col2 overflow-y-auto'>
                    <Image className="w-full h-[50vh] md:h-auto object-cover" src="/login_banner.png" alt="login" width={1200} height={1000}/>
                </div>
            </div>
        </div>
    )
}

export default Login

