import {useState, useCallback} from 'react'

export const useHttp = () => {

    const [loading, setLoading] = useState(false)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

            setLoading(true)

            try {

                if (body) {
                    body = JSON.stringify(body)
                    headers['content-Type'] = "application/json"
                }

                const response = await fetch(`https://ekreative-json-server.herokuapp.com${url}`, {method,body,headers})
                const data = await response.json()

                if (!response.ok) {
                    setLoading(false)
                    const newError = new Error(`${data}` || 'Unknown error')
                    newError.name = `Error status ${response.status}`
                    throw newError
                }

                setLoading(false)
                
                return data

            } catch (e) {
                setLoading(false)
                throw e
            }
            
    }, [])

    return {loading, request}
}