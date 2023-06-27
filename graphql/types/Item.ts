// @ts-nocheck

import { builder } from "@/graphql/builder";
import { c } from "@/lib/utils"



builder.prismaObject('Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    uuid: t.exposeString('uuid'),
    title: t.exposeString('title'),
    slug: t.exposeString('slug'),
    description: t.exposeString('description', { nullable: true, }),
    imageUrl: t.exposeString('imageUrl', { nullable: true, }),
    owner: t.relation('owner', {}),
    ownerId: t.exposeInt('ownerId'),
  })
})


// items query
builder.queryField("items", (t) =>
  t.prismaConnection({
    type: 'Item',
    cursor: 'id',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.item.findMany({ ...query })
  })
)


// item query
builder.queryField('item', (t) =>
  t.prismaField({
    type: 'Item',
    nullable: true,
    args: {
      id: t.arg.id({ required: true })
    },
    resolve: (query, _parent, args, _info) =>
      prisma.item.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        }
      })
  })
)


// mutation create or update
builder.mutationField("createUpdateItem", (t) =>
  t.prismaField({
    type: 'Item',
    args: {
      id: t.arg.id({ required: false }),
      title: t.arg.string({ required: true }),
      slug: t.arg.string({ required: true }),
      description: t.arg.string(),
      imageUrl: t.arg.string(),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id, title, slug, description, imageUrl } = args

      if (!(await ctx).user) {
        throw new Error("You have to be logged in to perform this action")
      }

      const user = await prisma.user.findUnique({
        where: {
          email: (await ctx).user?.email,
        }
      })

      if (!user || user.role !== "ADMIN") {
        throw new Error("You don't have permission to perform this action")
      }

      const data = {
        title,
        slug,
        description: description ? description : null,
        imageUrl: imageUrl ? imageUrl : null,
        ownerId: user.id,
      }

      if (args.id) {
        //c('update')
        return prisma.item.update({
          ...query,
          where: {
            id: Number(id),
          },
          data: data,
        })
      }
      else {
        //c('create')
        return prisma.item.create({
          ...query,
          data: data,
        })
      }
    }
  })
)
