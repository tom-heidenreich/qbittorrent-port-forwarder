FROM oven/bun:1

# dependencies
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl natpmpc \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install
CMD ["bun", "run", "index.ts"]