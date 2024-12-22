import { Result } from "@nathanstephenson/result-ts"

type ServerFunctionParams<T> = {
    fn: () => Promise<Result<T>>
}
export const serverFunction = async <T>({ fn }: ServerFunctionParams<T>) => {
    "use server"
    return (await fn()).serialize()
}
