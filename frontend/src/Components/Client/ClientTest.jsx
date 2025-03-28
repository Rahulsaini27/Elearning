import React from 'react'

export default function ClientTest() {
  return (
    <div>
      <div className=' relative'>
      <div className=" absolute top-[280px] left-1/2 transform -translate-x-1/2 -translate-y-1/2  shadow-2xl rounded-2xl p-8 max-w-md text-center border-l-8 border-[#45b7aa]">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#ff6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Oops! Something went wrong</h2>
        <p className="text-[#7f8c8d] mb-6"> Currently we are working on it</p>
        <button
          className="px-6 py-3 bg-[#4ecdc4] text-white rounded-full hover:bg-[#45b7aa] transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
    </div>
  )
}
