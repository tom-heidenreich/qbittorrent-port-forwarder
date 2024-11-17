FROM oven/bun:1.1

# dependencies
RUN apt update -y
RUN apt upgrade -y
RUN apt install curl -y
RUN apt install natpmpc -y

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install
CMD ["bun", "run", "index.ts"]