// Item UPDATE
import React from 'react'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import prisma from '@/lib/prisma'
import { getSession } from '@auth0/nextjs-auth0'
import { type SubmitHandler, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import AdminItemCreateUpdate from '@/components/admin/item/create-update-item'
import { c } from '@/lib/utils'



const AdminItemUpdate = ({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="">
      <Toaster />
      <h1 className="">Update Item: {item.title} ({item.id})</h1>
      <AdminItemCreateUpdate item={item} />
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
