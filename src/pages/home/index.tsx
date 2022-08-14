import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './style'

import { FormProvider, useForm } from 'react-hook-form'

import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewCycleForm } from './NewCycleForm'
import { CountDown } from './CountDown'
import { useContext } from 'react'
import { CyclesContext } from '../../context/CyclesContexts'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod
    .number()
    .min(5, 'O intervalo precisa ser no minimo de 05 minutos')
    .max(60, 'O intervalo precisa ser no maximo de 60 minutos'),
})

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { createNewCyle, interrupetedCurrentCycle, activeCycle } =
    useContext(CyclesContext)
  const newCycleForm = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: INewCycleFormData) {
    createNewCyle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />
        {activeCycle ? (
          <StopCountDownButton onClick={interrupetedCurrentCycle} type="button">
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
    </HomeContainer>
  )
}
