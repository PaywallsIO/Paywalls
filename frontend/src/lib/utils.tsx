import dayjs from 'dayjs'
import equal from 'fast-deep-equal'

export function toParams(obj: Record<string, any>, explodeArrays: boolean = false): string {
    if (!obj) {
        return ''
    }

    function handleVal(val: any): string {
        if (dayjs.isDayjs(val)) {
            return encodeURIComponent(val.format('YYYY-MM-DD'))
        }
        val = typeof val === 'object' ? JSON.stringify(val) : val
        return encodeURIComponent(val)
    }

    return Object.entries(obj)
        .filter((item) => item[1] != undefined && item[1] != null)
        .reduce((acc, [key, val]) => {
            /**
             *  query parameter arrays can be handled in two ways
             *  either they are encoded as a single query parameter
             *    a=[1, 2] => a=%5B1%2C2%5D
             *  or they are "exploded" so each item in the array is sent separately
             *    a=[1, 2] => a=1&a=2
             **/
            if (explodeArrays && Array.isArray(val)) {
                val.forEach((v) => acc.push([key, v]))
            } else {
                acc.push([key, val])
            }

            return acc
        }, [] as [string, any][])
        .map(([key, val]) => `${key}=${handleVal(val)}`)
        .join('&')
}

export function fromParamsGivenUrl(url: string): Record<string, any> {
    return !url
        ? {}
        : url
            .replace(/^\?/, '')
            .split('&')
            .reduce((paramsObject, paramString) => {
                const [key, value] = paramString.split('=')
                paramsObject[key] = decodeURIComponent(value)
                return paramsObject
            }, {} as Record<string, any>)
}

export function fromParams(): Record<string, any> {
    return fromParamsGivenUrl(window.location.search)
}

export function prepareUrl(url: string): string {
    function normalizeUrl(url: string): string {
        if (url.indexOf('http') !== 0) {
            if (!url.startsWith('/')) {
                url = '/' + url
            }

            url = url + (url.indexOf('?') === -1 && url[url.length - 1] !== '/' ? '/' : '')
        }
        return url
    }

    let output = normalizeUrl(url)

    return "http://localhost:8000" + output +
        (output.indexOf('?') === -1 ? '?' : '&')
}

/** Compare objects deeply. */
export function objectsEqual(obj1: any, obj2: any): boolean {
    return equal(obj1, obj2)
}

export function isString(candidate: unknown): candidate is string {
    return typeof candidate === 'string'
}

export function isObject(candidate: unknown): candidate is Record<string, unknown> {
    return typeof candidate === 'object' && candidate !== null
}


export function isEmptyObject(candidate: unknown): boolean {
    return isObject(candidate) && Object.keys(candidate).length === 0
}

// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
export function objectClean<T extends Record<string | number | symbol, unknown>>(obj: T): T {
    const response = { ...obj }
    Object.keys(response).forEach((key) => {
        if (response[key] === undefined) {
            delete response[key]
        }
    })
    return response
}
export function objectCleanWithEmpty<T extends Record<string | number | symbol, unknown>>(
    obj: T,
    ignoredKeys: string[] = []
): T {
    const response = { ...obj }
    Object.keys(response)
        .filter((key) => !ignoredKeys.includes(key))
        .forEach((key) => {
            // remove undefined values
            if (response[key] === undefined) {
                delete response[key]
            }
            // remove empty arrays i.e. []
            if (
                typeof response[key] === 'object' &&
                Array.isArray(response[key]) &&
                (response[key] as unknown[]).length === 0
            ) {
                delete response[key]
            }
            // remove empty objects i.e. {}
            if (
                typeof response[key] === 'object' &&
                !Array.isArray(response[key]) &&
                response[key] !== null &&
                Object.keys(response[key] as Record<string | number | symbol, unknown>).length === 0
            ) {
                delete response[key]
            }
        })
    return response
}

/** Returns "response" from: obj2 = { ...obj1, ...response }  */
export function objectDiffShallow(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
    const response: Record<string, any> = { ...obj2 }
    for (const key of Object.keys(obj1)) {
        if (key in response) {
            if (obj1[key] === response[key]) {
                delete response[key]
            }
        } else {
            response[key] = undefined
        }
    }
    return response
}