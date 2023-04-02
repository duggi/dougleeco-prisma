// graphql/builder.ts

import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import prisma from "../lib/prisma";
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay'

// create schemabuilder instance
export const builder = new SchemaBuilder<{
  // define static types
  PrismaTypes: PrismaTypes
}>({
  // schemabuilder options
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {},
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
