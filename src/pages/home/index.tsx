import { HandPalm, Play } from 'phosphor-react'
import { createContext, useEffect, useState } from 'react'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './style'

import { useForm } from 'react-hook-form'

import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'
import { NewCycleForm } from './NewCycleForm'
import { CountDown } from './CountDown'

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface ICycleContextType {
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as ICycleContextType)

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<String | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        }
        return cycle
      }),
    )
  }

  function handleCreateNewCycle(data: INewCycleFormData) {
    const newCycle: ICycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)

    setCycles((state) => [...cycles, newCycle])
    reset()
  }

  function handleStopCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        }
        return cycle
      }),
    )
    setActiveCycleId(null)
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <CyclesContext.Provider
        value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}
      >
        <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
          <NewCycleForm />
          <CountDown />
          {activeCycle ? (
            <StopCountDownButton onClick={handleStopCycle} type="button">
              <HandPalm size={24} />
              Interromper
            </StopCountDownButton>
          ) : (
            <StartCountDownButton type="submit" disabled={isSubmitDisabled}>
              <Play size={24} />
              Começar
            </StartCountDownButton>
          )}
        </form>
      </CyclesContext.Provider>
    </HomeContainer>
  )
}
