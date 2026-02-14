import Image from 'next/image'
import React from 'react'
const PlaceHolderImage = "/assests/Placeholder.png"
const page = () => {
  return (
    <div>
        <h1 className="mt-8 text-4xl absolute  left-20 -tracking-tight font-thin">
        My Projects{" "}
        <span className="px-2 absolute top-2 text-sm">
          (2)
        </span>{" "}
      </h1>
      <div className="projects absolute top-32 left-20">

      <div className="project1">
        <Image src={PlaceHolderImage} width={500} height={400} alt='' />
        <h1 className="text-lg mt-2">Project 1</h1>
        <div className="disc flex w-64">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro, quos animi? Sequi odio repellat, voluptas corrupti fugit quibusdam veritatis ex minus.
        </div>

      </div>
      </div>
    </div>
  )
}

export default page