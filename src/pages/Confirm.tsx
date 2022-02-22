import React from 'react'
import Button from '../components/Button'
import Card, { CardBack, CardFooter, CardPadding } from '../components/Card'
import Chip from '../components/Chip'
import registerStore from '../stores/registerStore'
import walletStore from '../stores/walletStore'

export default function Confirm() {
  const form = registerStore((s) => s.registerForm)
  const base64Image = registerStore((s) => s.base64Image)
  const loading = registerStore((s) => s.loading)
  const setLoading = registerStore((s) => s.setLoading)

  return (
    <Card className="relative" loading={loading}>
      <CardPadding>
        <CardBack to="/register">Confirm Minting</CardBack>
        <img className="rounded-md" src={base64Image ? base64Image : form.imageSrc} />
        <h2 className="text-xl mt-4">{form.name}</h2>
        <p className="text-sm">{form.description}</p>
      </CardPadding>
      <CardFooter>
        <CardPadding>
          <Button fullWidth onClick={() => setLoading(true)}>
            {loading ? 'Loading...' : 'Sign to finalize'}
          </Button>
        </CardPadding>
      </CardFooter>
    </Card>
  )
}
