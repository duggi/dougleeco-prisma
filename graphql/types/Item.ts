// /graphql/types/Item.ts
import { builder } from "../builder";



builder.prismaObject('Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    uuid: t.exposeString('uuid'),
    title: t.exposeString('title'),
    slug: t.exposeString('slug'),
    description: t.exposeString('description'),
    imageUrl: t.exposeString('imageUrl'),
    owner: t.relation('owner'),
    ownerId: t.exposeInt('ownerId'),
  })
})


// query
builder.queryField("items", (t) =>
  t.prismaConnection({
    type: 'Item',
    cursor: 'id',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.item.findMany({ ...query })
  })
)


// mutation create
builder.mutationField("createItem", (t) =>
  t.prismaField({
    type: 'Item',
    args: {
      title: t.arg.string({ required: true }),
      slug: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      imageUrl: t.arg.string({}),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { title, slug, description, imageUrl } = args

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

      return prisma.item.create({
        ...query,
        data: {
          title,
          slug,
          description,
          imageUrl,
          ownerId: user.id,
        }
      })
    }
  })
)
