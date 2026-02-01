'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Navbar = () => {
    const [userEmail, setUserEmail] = useState(null)
    const pathname = usePathname()
    const router = useRouter()
    const [handle, setHandle] = useState("")
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const stored = localStorage.getItem('linkium_user')
        setUserEmail(stored)

        if(stored){
            const token = localStorage.getItem('linkium_token')
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
            
            fetch(`/api/links?userEmail=${encodeURIComponent(stored)}`, {
                headers
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data?.handle){
                    setHandle(data.data.handle)
                }
            })
            .catch((err) => {
                console.error('Failed to fetch handle:', err);
            })
        }

        const handleAuthChange = () => {
            const user = localStorage.getItem('linkium_user')
            setUserEmail(user)
        }

        window.addEventListener('linkium-auth-change', handleAuthChange)
        window.addEventListener('storage', handleAuthChange)

        return () => {
            window.removeEventListener('linkium-auth-change', handleAuthChange)
            window.removeEventListener('storage', handleAuthChange)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = localStorage.getItem('linkium_user')
        setUserEmail(stored)
    }, [pathname])

    const goToDashboard = async () => {
        if (!userEmail) return

        // If we already have the handle in state, just go there
        if (handle) {
            router.push(`/${handle}`)
            return
        }

        // Otherwise, fetch the handle for this user and then navigate
        const token = localStorage.getItem('linkium_token')
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

        try {
            const res = await fetch(`/api/links?userEmail=${encodeURIComponent(userEmail)}`, {
                headers
            })
            const data = await res.json()
            if (data.success && data.data?.handle) {
                setHandle(data.data.handle)
                router.push(`/${data.data.handle}`)
            }
        } catch (err) {
            console.error('Failed to fetch handle for dashboard:', err)
        }
    }

    const handleLogout = () => {
        if (typeof window === 'undefined') return
        localStorage.removeItem('linkium_token')
        localStorage.removeItem('linkium_user')
        window.dispatchEvent(new Event('linkium-auth-change'))
        setUserEmail(null)
    }

    return (
        <>
            <nav className='w-[95vw] md:w-[80vw] mx-auto bg-white flex justify-between items-center px-4 md:px-10 rounded-full p-2 md:p-3 fixed top-2 md:top-[6vh] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[10vw] shadow-xl z-50'>
                {/* Logo */}
                <div className="logo flex items-center gap-2 md:gap-5">
                    <Link href='/'>
                        <img src="logo.png" alt="logo" className='w-[100px] md:w-[150px]'/>
                    </Link>

                    {/* Desktop nav links */}
                    <div className='hidden md:flex gap-3 font-bold'>
                        {userEmail && (
                            <Link href='/generate' className='hover:bg-gray-200 transition-all duration-200 rounded-full p-3 px-6'>Add Links</Link>
                        )}
                        <Link href='/about' className='hover:bg-gray-200 transition-all duration-200 rounded-full p-3 px-6'>About</Link>
                    </div>
                </div>

                {/* Desktop auth buttons */}
                <div className='hidden md:flex gap-5 bg-gray-300 rounded-full p-3 px-6 shadow-sm'>
                    {userEmail ? (
                        <>
                            <span onClick={goToDashboard} className='bg-white text-gray-900 p-2 px-4 rounded-full font-bold max-w-[200px] truncate cursor-pointer hover:bg-gray-950 hover:text-white transition-all duration-200'>{userEmail}</span>
                            <button
                                onClick={handleLogout}
                                className='hover:bg-gray-950 hover:text-white hover:shadow-lg p-2 px-4 rounded-full font-bold transition-all duration-200 cursor-pointer'
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href='/login' className='hover:bg-gray-950 hover:text-white hover:shadow-lg p-2 px-4 rounded-full font-bold transition-all duration-200'>Log in</Link>
                            <Link href='/signup' className='hover:bg-gray-950 hover:text-white hover:shadow-lg p-2 px-4 rounded-full font-bold transition-all duration-200'>Sign up</Link>
                        </>
                    )}
                </div>

                {/* Hamburger button - mobile only */}
                <button 
                    className='md:hidden p-2 hover:bg-gray-200 rounded-full transition-all'
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div className='mt-5 md:hidden fixed top-14 right-[2.5vw] w-[60vw] bg-white rounded-2xl shadow-xl p-4 z-40'>
                    <div className='flex flex-col gap-1 font-bold'>
                        {userEmail && (
                            <Link 
                                href='/generate' 
                                className='hover:bg-gray-200 transition-all duration-200 rounded-full p-3 px-4'
                                onClick={() => setMenuOpen(false)}
                            >
                                Add Links
                            </Link>
                        )}
                        <Link 
                            href='/about' 
                            className='hover:bg-gray-200 transition-all duration-200 rounded-full p-3 px-4'
                            onClick={() => setMenuOpen(false)}
                        >
                            About
                        </Link>
                        
                        <hr className='my-2 border-gray-200' />
                        
                        {userEmail ? (
                            <>
                                <span 
                                    onClick={() => { goToDashboard(); setMenuOpen(false); }} 
                                    className='p-3 px-4 rounded-full truncate cursor-pointer hover:bg-gray-200 transition-all duration-200'
                                >
                                    {userEmail}
                                </span>
                                <button
                                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                                    className='text-left hover:bg-gray-200 p-3 px-4 rounded-full transition-all duration-200 cursor-pointer'
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href='/login' 
                                    className='hover:bg-gray-200 p-3 px-4 rounded-full transition-all duration-200'
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link 
                                    href='/signup' 
                                    className='hover:bg-gray-200 p-3 px-4 rounded-full transition-all duration-200'
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar