import { createContext, ReactNode, useReducer, useState } from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  finishedCycleAction,
  interruptCycleAction,
} from '../reducers/cycles/actions'
import { cyclesReducer, ICycle } from '../reducers/cycles/reducer'

interface ICreateCycleData {
  task: string
  minutesAmount: number
}

interface ICycleContextType {
  cycles: ICycle[]
  activeCycle: ICycle | undefined
  activeCycleId: String | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCyle: (data: ICreateCycleData) => void
  interrupetedCurrentCycle: () => void
}
export const CyclesContext = createContext({} as ICycleContextType)

interface ICyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: ICyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    dispatch(finishedCycleAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCyle(data: ICreateCycleData) {
    const newCycle: ICycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setAmountSecondsPassed(0)

    dispatch(addNewCycleAction(newCycle))
  }

  function interrupetedCurrentCycle() {
    dispatch(interruptCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCyle,
        interrupetedCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
