```
--------------------------------
██████  ██       ██████  ██████
██   ██ ██      ██      ██    ██
██   ██ ██      ██      ██    ██
██████  ███████  ██████  ██████
---------- douglee.co ----------
```

- Personal/professional website
- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- Based on [this Prisma sample project](https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw) project here

----

## Tech Notes

### Construction
- NextJS 13
- GraphQL
- Prisma
- Postgres

### Vendors
- Auth0
- ngrok

### Setup
```
npm run dev
npx prisma studio
npx ngrok http 3000 --authtoken "<TOKEN>"
Update login action at Auth0 with ngrok forwarding URL
```
