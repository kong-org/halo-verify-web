import React from 'react'
import { ReactComponent as ChipSVG } from '../svg/chip.svg'

interface IProps {
  detected?: boolean
}

export default function Chip({ detected }: IProps) {
  return <ChipSVG />
}
