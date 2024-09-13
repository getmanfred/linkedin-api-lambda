## 👉 build stage
FROM node:20.17.0-alpine AS builder

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app
RUN npm run build

## 👉 runner stage
FROM public.ecr.aws/lambda/nodejs:20 AS runner

WORKDIR /var/task

COPY --from=builder /app/dist/ ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

CMD ["index.handler"]