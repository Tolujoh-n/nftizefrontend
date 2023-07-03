import React from 'react'
import { AiOutlineCaretDown } from 'react-icons/ai'

type props = {
  field: string
  dropDown: boolean
}

const InputField = (props: props) => {
  return (
    <div className="text-md flex flex-col items-start gap-4 font-semibold">
      <h4>{props.field}</h4>
      <div className="relative rounded-xl border border-gray-400 p-3 px-4">
        <input
          type="text"
          className="h-full w-full text-gray-700 outline-none"
        />
        <AiOutlineCaretDown
          className={`absolute ${props.dropDown ? 'visible' : 'invisible'}
        right-2 top-[40%] cursor-pointer text-gray-600 
        `}
        />
      </div>
    </div>
  )
}

export default InputField
