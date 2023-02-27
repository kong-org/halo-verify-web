import classNames from 'classnames'
import { Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Card, { CardBack, CardFooter, CardPadding } from '../components/Card'
import Loading from '../components/Loading'
import deviceStore from '../stores/deviceStore'
import registerStore from '../stores/registerStore'

export default function Confirm() {
  const form = registerStore((s) => s.registerForm)
  const base64Image = registerStore((s) => s.base64Image)
  const loading = registerStore((s) => s.loading)
  const signHalo = registerStore((s) => s.signHalo)
  const signed = registerStore((s) => s.signed)
  const device = deviceStore((s) => s.device)
  const message = registerStore((s) => s.message)

  if (!device) return <Navigate to="/" />
  if (signed) return <Navigate to="/success" />

  return (
    <Card className={classNames('relative', { 'confirm-loading': loading })}>
      <CardPadding>
        <CardBack to="/register">Confirm Minting</CardBack>
        {loading ? (
          <div className="loading-image-message text-center">
            <div>
              <Loading />
              <p className="text-sm">{message}</p>
            </div>
          </div>
        ) : (
          <>
            <img className="rounded-md" src={base64Image ? base64Image : form.imageSrc} />
          </>
        )}

        <h2 className="text-xl mt-4">{form.name || 'Untitled'}</h2>
        <p className="text-sm">{form.description || 'No description'}</p>
      </CardPadding>
      <CardFooter>
        <CardPadding>
          {loading ? (
            <Button fullWidth>Loading...</Button>
          ) : (
            <Button fullWidth onClick={signHalo}>
              Sign to finalize
            </Button>
          )}
        </CardPadding>
      </CardFooter>
    </Card>
  )
}
