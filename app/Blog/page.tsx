"use client"
import Navbar from '../components/Navbar'
import BounceAnimation from '../components/UI/BounceAnimation'
import { blogData , categories } from '../../blogData'
import Footer from '../components/Footer'
const page = () => {
  return (

    <div className=' flex items-center  flex-col'>
 <Navbar />
    <div className='mt-25 h-full' >
        <h1 className='text-3xl font-bold text-center mt-10'>Blog Page</h1>
        <BounceAnimation tagline1 = "From curiosity to creation."  tagline2 = "Words, code, and the craft in between." tag1color='EB4C4C' tag2color='FFA6A6' />
    </div>
    <div className='flex items-center justify-center p-4  ' >
      {categories.map((cat,idx)=>{
        return(
          <span key={idx} style={{backgroundColor: cat.color}} className='text-gray-800 px-4 py-2 rounded-full text-sm font-medium mr-2 mb-2'>{cat.name}</span>
        )
      })}

    </div>
    <div className='grid grid-cols-3 gap-3 mb-10'>
      {blogData.map((post,idx)=>{
        return(
          <div key={idx} className='w-96  h-96 rounded-b-2xl border border-white ' >
            
          </div>
        )
      })}
    </div>
    <Footer  />
    </div>
  )
}

export default page