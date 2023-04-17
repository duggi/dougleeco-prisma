// /graphql/types/User.ts
import { builder } from "../builder";



builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    uuid: t.exposeString('uuid'),
    email: t.exposeString('email'),
    imageUrl: t.exposeString('imageUrl'),
    role: t.expose('role', { type: Role, }),
    items: t.relation('items'),
  })
})


const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
})


// query
builder.queryField("users", (t) =>
  t.prismaField({
    type: ['User'],
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.user.findMany({ ...query })
  })
)
