import { createContext, useState } from 'react'

export const emailContext = createContext()

export const EmailProvider = (props) => {

  const [email, setEmail] = useState('')

  const val = {
    email,
    setEmail,
  }

  return (
    <emailContext.Provider value={val}>
      {props.children}
    </emailContext.Provider>
  )
}
