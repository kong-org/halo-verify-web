import classNames from 'classnames'
import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Card, { CardBack, CardFooter, CardPadding } from '../components/Card'
import Field from '../components/Field'
import GrayCenterBox from '../components/GrayCenterBox'
import deviceStore from '../stores/deviceStore'
import registerStore from '../stores/registerStore'
import { ReactComponent as Image } from '../svg/image.svg'
import { ReactComponent as X } from '../svg/x.svg'

export default function Register() {
  const rs = registerStore()
  const ds = deviceStore()

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    file.size < 5000001 ? rs.changeFileField(file) : alert('Image must be 5mb in size or less')
  }

  if (!ds.device) return <Navigate to="/" />
  if (rs.sigSplit && rs.block) return <Navigate to="/confirm" />

  return (
    <Card loading={rs.loading}>
      <CardPadding>
        <CardBack to="/">Register Halo</CardBack>

        <div className="relative mb-6">
          <GrayCenterBox>
            <Image />

            <div className="mt-4 mb-2">
              <input
                onChange={handleFileChange}
                id="image"
                className="hidden"
                type="file"
                accept="image/png, image/jpeg"
                name="image"
              />
              <label htmlFor="image" className="button small black">
                Upload Image
              </label>
            </div>
          </GrayCenterBox>

          <div className={classNames('register-image-preview', { previewing: rs.previewing })}>
            {rs.base64Image ? <img src={rs.base64Image} /> : <img src={rs.registerForm.imageSrc} />}

            <button className="register-image-preview-remove" onClick={rs.clearImage}>
              <X />
            </button>
          </div>
        </div>

        <Field
          onChange={rs.changeRegisterField}
          value={rs.registerForm.name}
          type="text"
          placeholder="Enter name..."
          name="name"
        />

        <Field
          onChange={rs.changeRegisterField}
          value={rs.registerForm.description}
          type="textarea"
          placeholder="Enter description..."
          name="description"
        />
      </CardPadding>
      <CardFooter>
        <CardPadding>
          {/* <Link to="/confirm">testing</Link> */}

          {rs.registerForm.image ? (
            <Button fullWidth onClick={rs.scanHalo}>
              Tap chip to mint nft
            </Button>
          ) : (
            <Button fullWidth disabled>
              Please add your image
            </Button>
          )}
        </CardPadding>
      </CardFooter>
    </Card>
  )
}
