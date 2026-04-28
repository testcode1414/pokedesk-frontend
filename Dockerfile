FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

# remove default nginx files (IMPORTANT)
RUN rm -rf /usr/share/nginx/html/*

# copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]