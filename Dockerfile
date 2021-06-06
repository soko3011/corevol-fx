# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
# ARG VUE_APP_VOLENGINE_API
# ARG VUE_APP_PYTHON_API
# ARG VUE_APP_AUTH_API
# ARG VUE_APP_DAYWGTS_API
# ENV VUE_APP_VOLENGINE_API=http://localhost:5002/
# ENV VUE_APP_PYTHON_API=http://localhost:5001
# ENV VUE_APP_AUTH_API=http://localhost:5003
# ENV VUE_APP_DAYWGTS_API=http://localhost:5005
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/docs /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]