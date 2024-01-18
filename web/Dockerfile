FROM node:20-bookworm

WORKDIR /web

COPY package.json ./

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3000

# CMD ./main

CMD npm run dev