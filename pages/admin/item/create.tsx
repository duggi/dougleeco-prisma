// Item CREATE
import React from 'react'
import type { GetServerSideProps } from 'next'
import prisma from '@/lib/prisma'
import { getSession } from '@auth0/nextjs-auth0'
import { gql, useMutation } from '@apollo/client'
import { type SubmitHandler, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import AdminItemCreateUpdate from '@/components/admin/item/create-update-item'
import { c } from '@/lib/utils'



const AdminItemCreate = () => {
  return (
    <div className="">
      <Toaster />
      <h1 className="">Create a new item</h1>
      <AdminItemCreateUpdate item={null} />
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
