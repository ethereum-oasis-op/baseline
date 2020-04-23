FROM zokrates/zokrates:0.5.2 as builder

FROM node:11.15

RUN mkdir /app
WORKDIR /app

COPY --from=builder /home/zokrates/zokrates /app/zokrates
COPY --from=builder /home/zokrates/.zokrates* /app/stdlib

COPY . .
RUN npm ci
RUN curl https://sh.rustup.rs -sSf -y | sh

EXPOSE 80
CMD npm run dev
