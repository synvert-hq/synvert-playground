FROM node:22.13.0 as build-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
ENV REACT_APP_JAVASCRIPT_BASE_URL https://api-javascript.synvert.net
ENV REACT_APP_RUBY_BASE_URL https://api-ruby.synvert.net
ENV GENERATE_SOURCEMAP false
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build-deps /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
