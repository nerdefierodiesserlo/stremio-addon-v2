FROM node:22-bookworm-slim

WORKDIR /app

COPY . .
COPY config/domains.json data/domains.json

RUN apt update

RUN apt update && apt install -y \
    ca-certificates curl \
    fonts-liberation libasound2 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgbm1 \
    libglib2.0-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libx11-xcb1 \
    libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libxrender1 libxkbcommon0 libxcb1 \
    libxcursor1 libxi6 libxss1 libxtst6

RUN npm i

RUN chmod +x scripts/*.sh
RUN chmod +x data/*

EXPOSE 8000

ENTRYPOINT [ "./scripts/start.sh" ]