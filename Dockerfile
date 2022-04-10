FROM node:slim

WORKDIR /root/home/

COPY . .

RUN npm ci

CMD ["node", "api.js"]
