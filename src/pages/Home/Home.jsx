import React, { useContext } from 'react'
import { tokenContext } from '../../Context/tokenContext'

export default function Home() {

  const {userToken,setUserToken} = useContext(tokenContext)
  console.log(userToken)
  return (
    <div>Home</div>
  )
}
