// Item CREATE OR UPDATE
import React from 'react'
import type { GetServerSideProps } from 'next'
import prisma from '/lib/prisma'
import { getSession } from '@auth0/nextjs-auth0'
import { gql, useMutation } from '@apollo/client'
import { type SubmitHandler, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { c } from '/lib/utils'



type FormValues = {
  title: string;
  slug: string;
  description: string;
  image: FileList;
}

const uploadMessages = {
  update: {
    loading: 'Uploading...',
    success: 'Image successfully uploaded!🎉',
    error: `Upload failed 😥 Please try again`,
  },
  create: {
    loading: 'Uploading...',
    success: 'Image successfully uploaded!🎉',
    error: `Upload failed 😥 Please try again`,
  },
}

const submitMessages = {
  update: {
    loading: 'Updating item..',
    success: 'Item successfully updated!🎉',
    error: `Something went wrong 😥 Please try again`,
    button: {
      copy: 'Update Item',
      progress: 'Updating item',
    }
  },
  create: {
    loading: 'Creating item..',
    success: 'Item successfully created!🎉',
    error: `Something went wrong 😥 Please try again`,
    button: {
      copy: 'Create New Item',
      progress: 'Creating item',
    }
  },
}



const AdminItemCreateUpdate = (props) => {
  const item = props?.item
  const mode = item ? 'update' : 'create'

  let typeArgs = `
    $title: String!,
    $slug: String!,
    $description: String!,
    $imageUrl: String!
  `
  let valueArgs = `
    title: $title,
    slug: $slug,
    description: $description,
    imageUrl: $imageUrl
  `
  if (mode === 'update') {
    typeArgs = `$id: ID!,` + typeArgs
    valueArgs = `id: $id,` + valueArgs
  }
  const CreateUpdateItemMutation = gql`
    mutation createUpdateItem(${typeArgs}) {
      createUpdateItem(${valueArgs}) {
        title
        slug
        description
        imageUrl
      }
    }
  `

  let uploadMsgs = uploadMessages.update
  let submitMsgs = submitMessages.update
  if (mode === 'create') {
    uploadMsgs = uploadMessages.create
    submitMsgs = submitMessages.create
  }

  let defaultVals = {}
  let defaultDescription = item?.description ?  item.description : ''
  let defaultImage = item?.imageUrl ?  item.imageUrl : ''
  if (mode === 'update') {
    defaultVals = {
      defaultValues: {
        title: item.title,
        slug: item.slug,
        description: defaultDescription,
        image: defaultImage
      }
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>(defaultVals)

  const [createUpdateItem, { loading, error }] = useMutation(CreateUpdateItemMutation, {
    onCompleted: () => reset()
  })


  // -- UPLOAD
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) return
    const file = e.target.files[0]
    const filename = encodeURIComponent(file.name)
    const res = await fetch(`/api/upload-image?file=${filename}&content_type=${file.type}`)
    const data = await res.json()
    const formData = new FormData()

    Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value)
    })

    toast.promise(
      fetch(data.url, {
        method: 'POST',
        body: formData,
      }),
      {
        loading: uploadMsgs.loading,
        success: uploadMsgs.success,
        error: `${uploadMsgs.error}: ${error}`,
      },
    )
  }


  // -- SUBMIT
  // `data`       submitted from form
  // `variables`  posted to mutation
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { title, slug, description, image } = data
    let imageUrl = defaultImage

    // if image is a FileList, user has uploaded a new image
    if (typeof image === 'object' && image.length > 0) {
      imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${image[0]?.name}`
    }

    let variables = { title, slug, description, imageUrl }
    if(mode === 'update') {
      const id = item.id
      variables = { id, ...variables }
    }

    try {
      toast.promise(createUpdateItem({ variables }), {
        loading: submitMsgs.loading,
        success: submitMsgs.success,
        error: `${submitMsgs.error}: ${error}`,
      })
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className="">
      <Toaster />
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <label className="">
          <span className="">Title</span>
          <input
            placeholder="Title"
            {...register('title', { required: true })}
            name="title"
            type="text"
            className=""
          />
        </label>
        <label className="">
          <span className="">Slug</span>
          <input
            placeholder="TODO: Autogen"
            {...register('slug', { required: true })}
            name="slug"
            type="text"
            className=""
          />
        </label>
        <label className="">
          <span className="">Description</span>
          <input
            placeholder="Description"
            {...register('description')}
            name="description"
            type="text"
            className=""
          />
        </label>
        <label className="">
          <span className="">Upload a .png or .jpg image (max 1MB).</span>
          <input
            {...register('image')}
            onChange={uploadImage}
            name="image"
            type="file"
            accept="image/png, image/jpeg"
          />
        </label>

        <button
          disabled={loading}
          type="submit"
          className=""
        >
          {loading ? (
            <span className="">
              {submitMsgs.button.progress}
            </span>
          ) : (
            <span>{submitMsgs.button.copy}</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default AdminItemCreateUpdate
