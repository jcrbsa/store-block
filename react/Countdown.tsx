import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'

//Importe o hook useCssHandles
import { useCssHandles } from 'vtex.css-handles'

//importe o FormattedMessage
//import { FormattedMessage } from 'react-intl'

import { useQuery } from 'react-apollo'

import useProduct from 'vtex.product-context/useProduct'

import productReleaseDate from './queries/productReleaseDate.graphql'

interface CountdownProps {
  //Adicione uma nova prop 
  //title: string,
  targetDate: string
}

//defina em um Array todos os handles que serão necessários 
const CSS_HANDLES = ['countdown']
//const CSS_HANDLES = ["container", "countdown", "title"]


const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()



const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ }) => {

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  //Adicione uma constante que será o seu título
  // const titleText = title || <FormattedMessage id="countdown.title" />

  //utilize o useCssHandles no componente Countdown para definir o handle do countdown
  const handles = useCssHandles(CSS_HANDLES)

  //const { product: { linkText } } = useProduct()
  /*const productContext = useProduct()
  const product = productContext?.product
  const linkText = product?.linkText*/

  const { product: { linkText } } = useProduct()
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false

  })
  // checando os valores dos dados
  //console.log({ data })

  // tratar os casos de loading e error antes de retornar o componente principal do contador ao utilizar o hook useQuery
  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }




  //tick(targetDate, setTime)
  //o Countdown marque as horas para o releaseDate do produto
  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)



  return (
    //utilizar o handle no componente a fim de ver a customização. 
    // utilizar a prop className com as classes a serem utilizadas 
    //E as classes de Tachyons, para os estilos globais.

    /*
      <div className={`${handles.title} db tc`}>{titleText}</div>*/

    <div className={`${handles.container} t-heading-2 fw3 w-100 c-muted-1`}>
      <div className={`${handles.countdown} db tc`}>
        {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
      </div>

    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {

    targetDate: {
      title: 'Data final',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null
    }
  }
}

export default Countdown
