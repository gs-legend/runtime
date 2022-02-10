import { MutableRefObject } from "react"

type RefType = MutableRefObject<unknown> | ((instance: unknown) => void)

type CommonObjectType<T = any> = Record<string, T>

export const customizeTimer = {
    intervalTimer: <any>null,
    timeoutTimer: <any>null,
    setTimeout(cb: () => void, interval: number) {
        const { now } = Date
        const stime = now()
        let etime = stime
        const loop = () => {
            this.timeoutTimer = requestAnimationFrame(loop)
            etime = now()
            if (etime - stime >= interval) {
                cb()
                cancelAnimationFrame(this.timeoutTimer)
            }
        }
        this.timeoutTimer = requestAnimationFrame(loop)
        return this.timeoutTimer;
    },
    clearTimeout() {
        cancelAnimationFrame(this.timeoutTimer)
    },
    setInterval(cb: () => void, interval: number) {
        const { now } = Date
        let stime = now()
        let etime = stime
        const loop = () => {
            this.intervalTimer = requestAnimationFrame(loop)
            etime = now()
            if (etime - stime >= interval) {
                stime = now()
                etime = stime
                cb()
            }
        }
        this.intervalTimer = requestAnimationFrame(loop)
        return this.intervalTimer
    },
    clearInterval() {
        cancelAnimationFrame(this.intervalTimer)
    }
}

export const deepClone = (obj: CommonObjectType) => {
    if (
        obj === null ||
        typeof obj !== 'object' ||
        obj instanceof Date ||
        obj instanceof Function
    ) {
        return obj
    }
    const cloneObj = Array.isArray(obj) ? [] : {}
    Object.keys(obj).map((key) => {
        cloneObj[key] = deepClone(obj[key])
        return cloneObj
    })
    return cloneObj
}

export const getQuery = (): CommonObjectType<string> => {
    const { href } = window.location
    const query = href.split('?')
    if (!query[1]) return {}

    const queryArr = decodeURI(query[1]).split('&')
    const queryObj = queryArr.reduce((prev, next) => {
        const item = next.split('=')
        return { ...prev, [item[0]]: item[1] }
    }, {})
    return queryObj
}

export const flattenRoutes = (arr: CommonObjectType<unknown>[]) =>
    arr.reduce(
        (prev: CommonObjectType<unknown>[], item: CommonObjectType<unknown>) => {
            if (Array.isArray(item.routes)) {
                prev.push(item)
            }
            return prev.concat(
                Array.isArray(item.routes) ? flattenRoutes(item.routes) : item
            )
        },
        []
    )

export const asyncAction = (action: unknown) => {
    const wait = new Promise((resolve) => {
        resolve(action)
    })
    return (cb: () => void) => {
        wait.then(() => setTimeout(() => cb()))
    }
}
 
