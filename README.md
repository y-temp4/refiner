# Refiner

The open-source Refraction alternative.

## Build with

- [OpenAI GPT3 API](https://openai.com/product)
- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Mantine](https://mantine.dev)
- [Tailwind CSS](https://tailwindcss.com)

## Development

Prerequisites:

- Node.js
- Docker
- Yarn

```sh
# Clone the repo
y

# Go to the project folder
cd refiner

# Install packages
yarn

# Set up .env files
# Please setup github keys and OpenAPI keys
cp .env.sample .env

# Set up DB
docker compose up
yarn prisma db push

# Start dev server
yarn dev
```

Then you can access [http://localhost:3000](http://localhost:3000).
