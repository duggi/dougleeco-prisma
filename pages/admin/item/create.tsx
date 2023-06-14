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

const CreateItemMutation = gql`
  mutation createItem( $title: String!,
                       $slug: String!,
                       $description: String!,
                       $imageUrl: String! ) {
    createItem( title: $title,
                slug: $slug,
                description: $description,
                imageUrl: $imageUrl ) {
      title
      slug
      description
      imageUrl
    }
  }
`

const AdminItemCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const [createItem, { loading, error }] = useMutation(CreateItemMutation, {
    onCompleted: () => reset()
  })

  // Upload photo function
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        loading: 'Uploading...',
        success: 'Image successfully uploaded!🎉',
        error: `Upload failed 😥 Please try again ${error}`,
      },
    )
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { title, slug, description, image } = data
    let imageUrl = ''
    if (typeof image === 'object' && image.length > 0) {
      imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}` +
                 `.s3.amazonaws.com/${image[0]?.name}`
    }
    const variables = { title, slug, description, imageUrl }
    console.log(data, typeof image, variables)
    try {
      toast.promise(createItem({ variables }), {
        loading: 'Creating new item..',
        success: 'Item successfully created!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="">
      <Toaster />
      <h1 className="">Create a new item</h1>
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
        <label className="block">
          <span className="text-gray-700">Upload a .png or .jpg image (max 1MB).</span>
          <input
            {...register('image')}
            onChange={uploadPhoto}
            type="file"
            accept="image/png, image/jpeg"
            name="image"
          />
        </label>

        <button
          disabled={loading}
          type="submit"
          className=""
        >
          {loading ? (
            <span className="">
              Creating...
            </span>
          ) : (
            <span>Create Item</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default AdminItemCreate


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/login',
      },
      props: {},
    }
  }
  return {
    props: {},
  };
}
