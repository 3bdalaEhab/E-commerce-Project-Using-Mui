import { createContext, useState } from "react"

 


 export let tokenContext= createContext({})


 export default function TokenContextProvider(params:any) {
  const [userToken, setUserToken] = useState(null)


  return <tokenContext.Provider value={{userToken,setUserToken}}>
    {params.children}

  </tokenContext.Provider>


 }