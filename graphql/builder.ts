// graphql/builder.ts

import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import prisma from "../lib/prisma";

// create schemabuilder instance
export const builder = new SchemaBuilder<{
  // define static types
  PrismaTypes: PrismaTypes
}>({
  // schemabuilder options
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  }
})

// create ok query
builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true,
    }),
  }),
});
