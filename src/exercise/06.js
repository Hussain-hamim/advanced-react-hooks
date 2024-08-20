// useDebugValue: useMedia
// 💯 use the format function
// http://localhost:3000/isolated/final/06.extra-1.js

import * as React from 'react'

const formatDebugValue = ({query, state}) => `\`${query}\` => ${state}`

function useMedia(query, initialState = false) {
  const [state, setState] = React.useState(initialState)
  React.useDebugValue({query, state}, formatDebugValue)

  // console.log(state)
  // console.log(query)

  React.useEffect(() => {
    // this ensure to update state only if the component is mounted, prevent memory leak
    let mounted = true

    // it setup mediaQueriesList object (mql)
    // check if the current media query is true or false by mql.matches method
    const mql = window.matchMedia(query)
    console.log(mql)

    // triggered if the media query matches or stop matching
    function onChange() {
      if (!mounted) {
        return
      }
      // update the state with current match status (mql.matches)
      setState(Boolean(mql.matches))
    }

    mql.addListener(onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeListener(onChange)
    }
  }, [query])

  return state
}

function Box() {
  const isBig = useMedia('(min-width: 1000px)')
  const isMedium = useMedia('(max-width: 999px) and (min-width: 700px)')
  const isSmall = useMedia('(max-width: 699px)')
  const color = isBig ? 'green' : isMedium ? 'yellow' : isSmall ? 'red' : null

  return <div style={{width: 200, height: 200, backgroundColor: color}} />
}

function App() {
  return <Box />
}

export default App
