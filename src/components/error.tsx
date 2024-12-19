import { SerializableResult } from "@nathanstephenson/result-ts"

type ErrorSerializableResult<T> = Extract<SerializableResult<T>, { status: "error" }>

export const Error = (params: ErrorSerializableResult<unknown>) => {
    return (
        <div className="flex flex-col gap-5 w-full h-full items-center justify-center">
        <h1>{getErrorCode(params)}</h1>
        <p>{params.message}</p>
        </div>
    )
}

const getErrorCode = (error: ErrorSerializableResult<unknown>) => {
    switch (error.errorType) {
        case "unexpected":
            return 503
        case "unauthorized":
            return 401
        case "user-validation":
            return 400
    }
}
