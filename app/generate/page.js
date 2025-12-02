'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Generate = () => {
    const [handle, setHandle] = useState('')
    const [links, setLinks] = useState([{ title: '', url: '' }])
    const [statusMessage, setStatusMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        const userEmail = localStorage.getItem('linkium_user')
        if (!userEmail) {
            router.push('/login')
            return
        }

        const fetchUserHandle = async () => {
            try {
                const response = await fetch(`/api/links?userEmail=${encodeURIComponent(userEmail)}`)
                const data = await response.json()
                if (data.success && data.data && data.data.handle) {
                    setHandle(data.data.handle)
                }
            } catch (error) {
                console.error('Failed to fetch user handle:', error)
            }
        }

        fetchUserHandle()

        const handleAuthChange = () => {
            const user = localStorage.getItem('linkium_user')
            if (!user) {
                router.push('/login')
            }
        }

        window.addEventListener('linkium-auth-change', handleAuthChange)
        return () => window.removeEventListener('linkium-auth-change', handleAuthChange)
    }, [router])

    const handleLinkChange = (index, field, value) => {
        setLinks((prev) => {
            const updated = [...prev]
            updated[index] = { 
                title: updated[index]?.title || '', 
                url: updated[index]?.url || '', 
                [field]: value 
            }
            return updated
        })
    }

    const addLinkFields = () => {
        setLinks((prev) => [...prev, { title: '', url: '' }])
    }

    const handleAddLinks = async () => {
        const userEmail = localStorage.getItem('linkium_user')
        const validLinks = links.filter(link => link.title.trim() && link.url.trim())
        
        const response = await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, handle, links: validLinks }),
        })
        
        const data = await response.json()
        if (data.success) {
            setStatusMessage('Links added successfully!')
            setLinks([{ title: '', url: '' }])
            setTimeout(() => setStatusMessage(''), 3000)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="col1 bg-[#E8B4A0] flex flex-col text-gray-950 items-center justify-center px-6 md:pl-[5vw] pt-24 md:pt-0">
                <div className='flex flex-col gap-5 my-8 w-full max-w-md'>
                    <h1 className='font-bold text-3xl md:text-4xl'>Create Your Tree</h1>

                    <div className="item flex flex-col gap-2">
                        <h2 className='text-xl font-semibold p-1'>Step 1: Claim Your Handle</h2>
                        <input 
                            className='px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full bg-white w-full' 
                            type="text" 
                            placeholder='Choose a handle'
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                        />
                        <p className='text-red-600 text-sm'>Note: Handle will be updated if changed.</p>
                    </div>

                    <div className="item flex flex-col gap-2">
                        <h2 className='text-xl font-semibold p-1'>Step 2: Add Links</h2>
                        <div className='flex flex-col gap-3'>
                            {links.map((link, index) => (
                                <div className='flex flex-col md:flex-row gap-2' key={index}>
                                    <input
                                        className='px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full bg-white w-full md:w-1/2'
                                        type="text"
                                        placeholder='Enter link title'
                                        value={link.title || ''}
                                        onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                    />
                                    <input
                                        className='px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full bg-white w-full md:w-1/2'
                                        type="text"
                                        placeholder='Enter link'
                                        value={link.url || ''}
                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                className='hover:bg-gray-700 transition-all duration-200 mt-2 p-5 py-2 bg-gray-950 text-white w-full rounded-full mx-auto font-semibold cursor-pointer'
                                type='button'
                                onClick={addLinkFields}
                            >
                                + More
                            </button>
                            <button 
                                className='hover:bg-gray-700 transition-all duration-200 mt-2 p-5 py-2 bg-gray-950 text-white w-full rounded-full mx-auto font-semibold cursor-pointer'
                                onClick={handleAddLinks}
                            >
                                Add Link
                            </button>
                        </div>
                        {statusMessage && (
                            <p className='text-sm text-green-700 mt-2'>{statusMessage}</p>
                        )}
                    </div>

                    <div className="item flex flex-col gap-2">
                        <h2 className='text-xl font-semibold p-1'>Step 3: Share Your Handle</h2>
                        
                        <button
                            className='hover:bg-gray-700 transition-all duration-200 mt-2 p-5 py-2 bg-gray-950 text-white rounded-full mx-auto font-semibold w-full cursor-pointer'
                            onClick={() => {
                                if (handle) {
                                    router.push(`/${handle}`)
                                }
                            }}
                        >
                            View Dashboard
                        </button>
                        
                    </div>
                </div>
            </div>

            <div className="col2 bg-[#E9C0E9] md:mr-[10vw] w-full overflow-y-auto hidden md:block">
                <img src="generate.png" alt="generate cover" className='h-[125vh] object-contain mx-auto' />
            </div>
        </div>

    )
}

export default Generate