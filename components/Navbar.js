'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Navbar = () => {
    const [userEmail, setUserEmail] = useState(null)
    const pathname = usePathname()
    const router = useRouter()
    const [handle, setHandle] = useState("")

    useEffect(() => {
        if (typeof window === 'undefined') return

        const stored = localStorage.getItem('linkium_user')
        setUserEmail(stored)

        if(stored){
            fetch(`/api/links?userEmail=${encodeURIComponent(stored)}`)
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
        try {
            const res = await fetch(`/api/links?userEmail=${encodeURIComponent(userEmail)}`)
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
        localStorage.removeItem('linkium_user')
        window.dispatchEvent(new Event('linkium-auth-change'))
        setUserEmail(null)
    }

    return (
        <nav className='w-[80vw] mx-auto bg-white flex justify-between items-center px-10 rounded-full p-3 fixed top-[6vh] right-[10vw] shadow-xl'>
            <div className="logo flex items-center gap-5">

                <Link href='/'>
                    <img src="logo.png" alt="logo" width={150}/>
                </Link>

                <div className='flex gap-3 font-bold'>
                    {userEmail && (
                        <Link href='/generate' className='hover:bg-gray-200 transition-all duration-200 rounded-full p-3 px-6'>Add Links</Link>
                    )}
                    <Link href='/about' className='hover:bg-gray-200 transition-all duration-200 rounded-full p-3 px-6'>About</Link>
                </div>
            </div>

            <div className='flex gap-5 bg-gray-300 rounded-full p-3 px-6 shadow-sm'>
                {userEmail ? (
                    <>
                        <span onClick={goToDashboard} className='bg-white text-gray-900 p-2 px-4 rounded-full font-bold max-w-[200px] truncate cursor-pointer hover:bg-gray-950 hover:text-white transition-all duration-200'>{userEmail}</span>
                        <button
                            onClick={handleLogout}
                            className='hover:bg-gray-950 hover:text-white hover:shadow-lg  p-2 px-4 rounded-full font-bold transition-all duration-200 cursor-pointer'
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href='/login' className='hover:bg-gray-950 hover:text-white hover:shadow-lg  p-2 px-4 rounded-full font-bold transition-all duration-200'>Log in</Link>
                        <Link href='/signup' className='hover:bg-gray-950 hover:text-white hover:shadow-lg  p-2 px-4 rounded-full font-bold transition-all duration-200'>Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar