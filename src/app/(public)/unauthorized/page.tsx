import React from 'react'
import Link from "next/link";

const Page = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
                <p className="text-lg mb-4">You do not have permission to view this page.</p>
                <Link href="/" className="text-blue-500 hover:underline">Go back to Home</Link>
            </div>
        </div>
    )
}
export default Page
