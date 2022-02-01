import {useState, useCallback} from 'react'

export const useHttp = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

            setLoading(true)

            try {

                if (body) {
                    body = JSON.stringify(body)
                    headers['content-Type'] = "application/json"
                }

                const responce = await fetch(`https://ekreative-json-server.herokuapp.com${url}`, {method,body,headers})
                const data = await responce.json()
                
                if (!responce.ok) {
                    console.log(responce)
                    setLoading(false)
                    throw new Error(data.message || 'error')
                }

                setLoading(false)

                return data

            } catch (e) {
                setLoading(false)
                setError(e.message)
                throw e
            }
            
    }, [])

    const clearError = () => setError(null)

    return {loading, request, error, clearError}
}