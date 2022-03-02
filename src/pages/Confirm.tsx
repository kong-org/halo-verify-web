import React from 'react'
import { Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Card, { CardBack, CardFooter, CardPadding } from '../components/Card'
import Chip from '../components/Chip'
import deviceStore from '../stores/deviceStore'
import registerStore from '../stores/registerStore'
import walletStore from '../stores/walletStore'

export default function Confirm() {
  const form = registerStore((s) => s.registerForm)
  const base64Image = registerStore((s) => s.base64Image)
  const loading = registerStore((s) => s.loading)
  const signHalo = registerStore((s) => s.signHalo)
  const signed = registerStore((s) => s.signed)
  const device = deviceStore((s) => s.device)

  if (!device) return <Navigate to="/" />
  if (signed) return <Navigate to="/success" />

  return (
    <Card className="relative" loading={loading}>
      <CardPadding>
        <CardBack to="/register">Confirm Minting</CardBack>
        <img className="rounded-md" src={base64Image ? base64Image : form.imageSrc} />
        <h2 className="text-xl mt-4">{form.name || 'Untitled'}</h2>
        <p className="text-sm">{form.description || 'No description'}</p>
      </CardPadding>
      <CardFooter>
        <CardPadding>
          <Button fullWidth onClick={signHalo}>
            {loading ? 'Loading...' : 'Sign to finalize'}
          </Button>
        </CardPadding>
      </CardFooter>
    </Card>
  )
}
