import React from 'react'
import Navbar from './Navbar'
import OptionList from './OptionList'

const MovieListLayout = ({ children }) => {
  return (
    <div 
    style={{ backgroundColor: '#978CF9', width: '100vw', height: '100vh' }}
    className=''
    >
      <div className='navbar h-1/12   flex justify-start items-center '>
        <Navbar/>
      </div>
      <div className='display-section  grid grid-cols-12 h-11/12'>
        <div className='option-section col-span-2 bg-[#B9B5FD]'>
          <OptionList/>  
        </div>
        <div className='movielist-display col-span-10 bg-[#D7D6FE]'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default MovieListLayout