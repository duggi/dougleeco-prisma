// /graphql/types/Item.ts
import { builder } from "../builder";

builder.prismaObject('Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    uuid: t.exposeString('uuid'),
    title: t.exposeString('title'),
    slug: t.exposeString('slug'),
    description: t.exposeString('description'),
    user: t.relation('user')
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
