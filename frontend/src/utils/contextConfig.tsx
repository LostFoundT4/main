import { createContext } from "react";

//UseContext for Global Variable for userID and userName

export const UserIDContext = createContext<{
    contextID: string | null,
    setContextID: (newValue:string) => void
  }>({
    contextID: null,
    setContextID: () => undefined
  })

export const UserNameContext = createContext<{
    contextName: string | null,
    setContextName: (newValue:string) => void
  }>({
    contextName: null,
    setContextName: () => undefined
  })
