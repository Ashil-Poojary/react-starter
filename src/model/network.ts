import { SUCCESS_RESPONSE } from "../constants/api-constants"

export interface HttpGetParam {
    path: string,
    queryParams?: any
}

export interface HttpPostParam {
    path: string,
    queryParams?: any,
    body?: any
}

export interface FileUploadParams {
    path: string,
    queryParams?: any,
    body: FormData
}

export class ResponseType {
    status: number
    data: any
    description: string
    recordCount: number

    constructor({
        status = -1,
        data = null,
        description = '',
        recordCount = 0
    }) {
        this.status = status
        this.data = data
        this.description = description
        this.recordCount = recordCount
    }

    get isSuccess() {
        return this.status === SUCCESS_RESPONSE
    }
}