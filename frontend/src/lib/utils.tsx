import dayjs from 'dayjs'

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