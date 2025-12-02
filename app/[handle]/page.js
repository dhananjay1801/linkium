'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function HandlePage() {
    const params = useParams()
    const handle = params.handle
    const [linkData, setLinkData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isOwner, setIsOwner] = useState(false)
    const [userEmail, setUserEmail] = useState('')

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await fetch(`/api/links?handle=${encodeURIComponent(handle)}`)
                const data = await response.json()
                
                if (!response.ok || !data.success) {
                    setError(data.message || 'Handle not found.')
                } else {
                    setLinkData(data.data)
                    
                    // Check if current user owns this handle
                    const storedEmail = localStorage.getItem('linkium_user')
                    if (storedEmail) {
                        setUserEmail(storedEmail)
                        if (data.data.userEmail === storedEmail) {
                            setIsOwner(true)
                        }
                    } else {
                        setIsOwner(false)
                    }
                }
            } catch (err) {
                setError('Failed to load links.')
            } finally {
                setLoading(false)
            }
        }

        if (handle) {
            fetchLinks()
        }

        // listen for logout
        const handleAuthChange = () => {
            const user = localStorage.getItem('linkium_user')
            if (!user) {
                setIsOwner(false)
                setUserEmail('')
            }
        }

        window.addEventListener('linkium-auth-change', handleAuthChange)
        return () => window.removeEventListener('linkium-auth-change', handleAuthChange)
    }, [handle])

    const handleDeleteLink = async (index) => {
        try {
            const response = await fetch('/api/links', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, linkIndex: index }),
            })
            const data = await response.json()
            if (data.success) {
                setLinkData(prev => ({ ...prev, links: data.links }))
            }
        } catch (err) {
            console.error('Failed to delete link:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#A8D8EA]">
                <p className="text-xl">Loading...</p>
            </div>
        )
    }

    if (error || !linkData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#A8D8EA]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Handle not found</h1>
                    <p className="text-gray-700">{error || 'This handle does not exist.'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#A8D8EA] pt-28 md:pt-42">
            <div className="max-w-2xl mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">@{handle}</h1>
                    <p className="text-gray-700 text-base md:text-lg">All my links in one place</p>
                </div>

                <div className="flex flex-col gap-4">
                    {linkData.links && linkData.links.length > 0 ? (
                        linkData.links.map((link, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white rounded-full px-6 py-4 hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg text-center"
                                >
                                    <p className="text-lg font-semibold text-gray-900">{link.title}</p>
                                </a>
                                {isOwner && (
                                    <button
                                        onClick={() => handleDeleteLink(index)}
                                        className="bg-red-500 hover:bg-red-600 rounded-full p-3 transition-all duration-200 cursor-pointer"
                                    >
                                        <img src="/Trash2.svg" alt="Delete" className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-700">No links available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

