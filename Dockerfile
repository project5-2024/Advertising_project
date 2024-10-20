FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install joi
RUN npm install express
RUN npm install dotenv
RUN npm install mongodb
RUN npm install bcrypt
COPY . /app
CMD ["node","app.js"]
