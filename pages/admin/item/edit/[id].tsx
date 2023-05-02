// pages/admin.tsx
import React from 'react'
import { useState } from 'react';
import type { GetServerSideProps } from 'next'
import { gql, useMutation } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from '/lib/prisma'
import { c } from '/lib/utils'


type FormValues = {
  title: string;
  slug: string;
  description: string;
  image: FileList;
}

const UpdateItemMutation = gql`
  mutation updateItem( $id: ID!, $title: String!, $slug: String!, $description: String!, $imageUrl: String!  ) {
    updateItem( id: $id, title: $title, slug: $slug, description: $description, imageUrl: $imageUrl ) {
      title
      slug
      description
      imageUrl
    }
  }
`

const AdminUpdate = ({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  c(item, "ITEM SSP")
  const defaultDescription = item.description ?
                             item.description :
                             ''
  const defaultImage = item.imageUrl ?
                       item.imageUrl :
                       ''

  c(defaultDescription, "DESCR")
  c(defaultImage, "IMAGE")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: item.title,
      slug: item.slug,
      description: defaultDescription,
      image: defaultImage
    }
  })

  const [updateItem, { loading, error }] = useMutation(UpdateItemMutation, {
    onCompleted: () => reset()
  })

  // Upload photo function
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) return
    const file = e.target.files[0]
    const filename = encodeURIComponent(file.name)
    const res = await fetch(`/api/upload-image?file=${filename}`)
    const data = await res.json()
    const formData = new FormData()

    Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value)
      c(formData, "IMAGE FORMDATA")
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
    const id = item.id
    const { title, slug, description, image } = data

    // 'image' is a string value    # image exists in db
    // 'image' is an empty string   # no image or image cleared
    // 'image' is a filelist        # new image upload
    let imageUrl = item.imageUrl
    if (item.imageUrl === null) { imageUrl = '' }
    if (image === '') { imageUrl = '' }
    if (typeof image === 'object') {
      imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}` +
                  `.s3.amazonaws.com/${image[0]?.name}`
    }

    const variables = { id, title, slug, description, imageUrl }

    try {
      toast.promise(updateItem({ variables }), {
        loading: 'Updating item..',
        success: 'Item successfully updated!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="">
      <Toaster />
      <h1 className="">Edit Item: {item.title} ({item.id})</h1>
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
        <
        /label>
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
            onChange={uploadPhoto}
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
              <svg
                className=""
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Updating...
            </span>
          ) : (
            <span>Update Item</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default AdminUpdate


export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
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

  const id = params?.id;
  const item = await prisma.item.findUnique({
    where: {
      id: Number(id)
    },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      description: true,
    },
  });

  if (!item) return {
    notFound: true
  }

  return {
    props: {
      item,
    },
  };
};

