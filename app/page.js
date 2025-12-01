'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('linkium_user');
        if (user) setLoggedIn(true);
    }, []);

    return (
        <main>
            <section className="grid grid-cols-2 items-center">
                <div className="bg-amber-300 h-screen flex flex-col justify-center items-center pt-20">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center gap-5">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 to-orange-400 flex flex-col items-center justify-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="w-14 h-6 rounded-full bg-gray-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">@yourhandle</p>
                            <h2 className="text-2xl font-semibold text-gray-900">Your Linkium page</h2>
                        </div>

                        <div className="w-full flex flex-col gap-3 mt-2">
                            <button className="w-full bg-gray-900 text-white rounded-full py-2.5 px-4 text-sm font-semibold hover:bg-gray-800 transition-colors">
                                Latest YouTube upload
                            </button>
                            <button className="w-full bg-gray-100 text-gray-900 rounded-full py-2.5 px-4 text-sm font-semibold hover:bg-gray-200 transition-colors">
                                Portfolio website
                            </button>
                            <button className="w-full bg-gray-100 text-gray-900 rounded-full py-2.5 px-4 text-sm font-semibold hover:bg-gray-200 transition-colors">
                                Shop / products
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-green-600 pr-[10vw] pl-10 h-screen flex flex-col justify-center">
                    <h1 className="text-5xl font-bold text-black mb-6">All your links. One place.</h1>
                    <p className="text-xl mb-5">Linkium helps you organize, manage, and share all your important links with ease. Stay organized. Stay connected.</p>

                    <div className="flex gap-4">
                        <Link href={loggedIn ? '/generate' : '/signup'}>
                            <button className="hover:bg-gray-200 bg-white transition-all duration-200 rounded-full p-3 px-6 font-semibold cursor-pointer">Get Started for free!</button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
