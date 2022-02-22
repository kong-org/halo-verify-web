import classNames from 'classnames'
import React from 'react'
import Button from '../components/Button'
import Card, { CardBack, CardFooter, CardPadding } from '../components/Card'
import Field from '../components/Field'
import GrayCenterBox from '../components/GrayCenterBox'
import registerStore from '../stores/registerStore'
import { ReactComponent as Image } from '../svg/image.svg'
import { ReactComponent as X } from '../svg/x.svg'

export default function Register() {
  const urlMode = registerStore((s) => s.urlMode)
  const setUrlMode = registerStore((s) => s.setUrlMode)
  const changeRegisterField = registerStore((s) => s.changeRegisterField)
  const form = registerStore((s) => s.registerForm)
  const changeFileField = registerStore((s) => s.changeFileField)
  const base64Image = registerStore((s) => s.base64Image)
  const previewing = registerStore((s) => s.previewing)
  const imageSrcSubmit = registerStore((s) => s.imageSrcSubmit)
  const clearImage = registerStore((s) => s.clearImage)

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    file.size < 5000001 ? changeFileField(file) : alert('Image must be 5mb in size or less')
  }

  return (
    <Card>
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

            <Button size="small" color="black-line" onClick={() => setUrlMode(true)}>
              Insert Url
            </Button>
          </GrayCenterBox>

          <div className={classNames('register-url-block', { active: urlMode })}>
            <Field value={form.imageSrc} onChange={changeRegisterField} type="textarea" name="imageSrc" />

            <Button
              onClick={() => setUrlMode(false)}
              className="register-url-block-cancel"
              size="small"
              color="black-line"
            >
              Cancel
            </Button>
            <Button onClick={imageSrcSubmit} className="register-url-block-upload" size="small">
              Upload
            </Button>
          </div>

          <div className={classNames('register-image-preview', { previewing })}>
            {base64Image ? <img src={base64Image} /> : <img src={form.imageSrc} />}

            <button className="register-image-preview-remove" onClick={clearImage}>
              <X />
            </button>
          </div>
        </div>

        <Field onChange={changeRegisterField} value={form.name} type="text" placeholder="Enter name..." name="name" />
        <Field
          onChange={changeRegisterField}
          value={form.description}
          type="textarea"
          placeholder="Enter description..."
          name="description"
        />
      </CardPadding>
      <CardFooter>
        <CardPadding>
          <Button fullWidth to={'/confirm'}>
            Tap chip to mint nft
          </Button>
        </CardPadding>
      </CardFooter>
    </Card>
  )
}
