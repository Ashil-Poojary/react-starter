import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import RouteBuilder from "./routes/RouteBuilder";
import { useUserContext } from "./context/UserContext";

function App() {

  const { isLoggedIn } = useUserContext()

  const [afterInit, setAfterInit] = useState(false)

  const routing = useRoutes(RouteBuilder(isLoggedIn))

  useEffect(() => {
    setAfterInit(true)
  }, [])

  /*
      NOTE :
        userContext has defaukt value false
        when page reloads authgaurd redirects to login page since initial value is false
        to avoid this issue rendering components until we get actual value from userContext
        this also can be fixed using 3 values instead of boolean in userContext and having loader or entry screen for default value which will be more safer
  */
  if (!afterInit)
    return (
      <></>
    )


  return (
    <>
   
        {routing}
    
    </>



  )
}

export default App;
