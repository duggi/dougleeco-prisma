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

const UpdateItemMutation = gql`
  mutation updateItem( $id: ID!,
                       $title: String!,
                       $slug: String!,
                       $description: String!,
                       $imageUrl: String! ) {
    updateItem( id: $id,
                title: $title,
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

const AdminItemUpdate = ({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const defaultDescription = item.description ?
                             item.description :
                             ''
  const defaultImage = item.imageUrl ?
                       item.imageUrl :
                       ''
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

export default AdminItemUpdate


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

