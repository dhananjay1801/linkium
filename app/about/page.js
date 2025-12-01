'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const About = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('linkium_user');
    if (user) setLoggedIn(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F4FF] pt-42 pb-16">
      <section className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">What is Linkium?</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Linkium is your single home on the internet for everything you create, share, and care about.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-3">Why Linkium exists</h2>
            <p className="text-gray-700 leading-relaxed">
              Today your audience sees you in many places — Instagram, YouTube, X, portfolios,
              shops, newsletters, and more. Linkium brings all of that into one simple, beautiful
              page you can share anywhere.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-3">What you can do</h2>
            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li>Claim a short, memorable handle (like <span className="font-mono">@yourname</span>).</li>
              <li>Add as many links as you like — socials, websites, stores, documents.</li>
              <li>Share your Linkium page once and update links whenever you want.</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Built for creators, teams, and anyone with links.</h2>
            <p className="text-gray-200 max-w-xl">
              Whether you&apos;re just starting out or already have an audience, Linkium makes it
              easy to keep all your important links in one place.
            </p>
          </div>
          <Link
            href={loggedIn ? '/generate' : '/signup'}
            className="text-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200"
          >
            Get started for free
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About