import React from 'react'
import useInterval from '@use-it/interval'
import { isEqual } from 'lodash'

const useRequest = (promise, options, interval = null) => {
  const [state, setState] = React.useState({
    status: 'loading',
    error: null,
    data: null,
    refetch: request
  })
  const prevOptions = React.useRef(null)
  const isCancelled = React.useRef(false)

  const request = async options => {
    let data
    try {
      !isCancelled.current &&
        setState({ status: 'loading', error: null, data: null })
      data = await promise(options)
      !isCancelled.current &&
        setState({ status: 'complete', error: null, data })
    } catch (exception) {
      !isCancelled.current &&
        setState({ status: 'error', error: exception, data: null })
    }
  }

  React.useEffect(() => {
    isCancelled.current = false
    if (!isEqual(prevOptions.current, options)) {
      request(options)
    }
    return () => {
      isCancelled.current = true
    }
  })

  useInterval(() => {
    request(options)
  }, interval)

  React.useEffect(() => {
    prevOptions.current = options
  })

  return { ...state, refetch: () => request(options) }
}

export default useRequest
