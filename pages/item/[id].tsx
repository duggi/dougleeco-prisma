import React from 'react';
import prisma from '../../lib/prisma';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import toast, { Toaster } from 'react-hot-toast';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';



//const UpdateItemMutation = gql`
//  mutation ($id: ID!) {
//    updateItem(id: $id) {
//      title
//      slug
//      description
//      imageUrl
//    }
//  }
//`

const Item = ({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isLoading, setIsLoading] = useState(false);
  //const [updateItem] = useMutation(UpdateItemMutation);

  //const bookmark = async () => {
  //  setIsLoading(true);
  //  toast.promise(createBookmark({ variables: { id: link.id } }), {
  //    loading: 'working on it',
  //    success: 'Saved successfully! 🎉',
  //    error: `Something went wrong 😥 Please try again`,
  //  });
  //  setIsLoading(false);
  //};

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

export default Item;

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
