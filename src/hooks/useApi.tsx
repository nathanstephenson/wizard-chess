"use client"

import { createContext, useContext } from "react"
import { Api } from "../../server"

const ApiContext = createContext<Api | undefined>(undefined)

export const ApiProvider = ({ api, children }: { api: Api; children: React.ReactNode }) => {
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export const useApi = () => {
    const api = useContext(ApiContext)
    if (api === undefined) {
        throw new Error("Couldn't find api from context")
    }
    return api
}
