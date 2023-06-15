// Item READ
import React from 'react';
import prisma from '../../../lib/prisma';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import toast, { Toaster } from 'react-hot-toast';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';



const AdminItemRead = ({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="prose container mx-auto px-8">
        <Toaster />
        <h1>{item.title}</h1>
        <img src={item.imageUrl} className="" />
        <p>{item.description}</p>
      </div>
    </div>
  );
};

export default AdminItemRead;



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
