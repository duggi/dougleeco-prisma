// graphql/schema.ts

import "@/graphql/types/Item"
import "@/graphql/types/User"
import { builder } from "./builder";

export const schema = builder.toSchema()



//export const typeDefs = `
//  type Item {
//    id: ID
//    title: String
//    slug: String
//    description: String
//    user: String
//    userID: String
//  }
//
//  type User {
//    id: ID
//    role: String
//    email: String
//    name: String
//    items: [String]
//  }
//
//  type Query {
//    items: [Item]!
//  }
//
//  type Query {
//    users: [User]!
//  }
//`
