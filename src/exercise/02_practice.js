import * as React from 'react'
import {
  fetchPokemon,
  PokemonErrorBoundary,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending':
      return {status: 'pending', data: null, error: null}
      break
    case 'resolved':
      return {status: 'resolved', data: action.data, error: null}
      break
    case 'rejected':
      return {status: 'rejected', data: null, error: action.error}
      break
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

function useAsync(asyncCallback, initialState, dependencies) {
  const [state, dispatch] = useReducer(
    asyncReducer,
    {status: 'idle', data: null, error: null, ...initialState},
    third,
  )

  React.useEffect(() => {
    const promise = asyncCallback()
    if (!promise) {
      return
    }

    dispatch({type: 'pending'})
    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => dispatch({type: 'rejected', error}),
    )
  }, [dependencies])

  return state
}

function PokemonInfo({pokemonName}) {
  const state = useAsync(() => {
    if (!pokemonName) {
      return
    }
    return (
      fetchPokemon(pokemonName),
      {status: pokemonName ? 'pending' : 'idle'},
      [pokemonName]
    )
  })

  const {data: pokemon, status, error} = state

  switch (status) {
    case 'idle':
      return <span>submit a pokemon</span>

      break
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
      break
    case 'rejected':
      throw error
      break
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
      break
    default:
      throw new error('this should be impossible')
  }
}

function App(params) {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemon) {}

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />

      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
