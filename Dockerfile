FROM rust:1.87-alpine3.21 AS builder

WORKDIR /app

RUN apk add --no-cache musl-dev

COPY server ./server
RUN cargo build --release --manifest-path server/Cargo.toml

FROM alpine:3.21 AS runtime

WORKDIR /app

RUN apk add --no-cache libgcc

COPY web ./web
COPY --from=builder /app/server/target/release/sammwy-web-server ./server/target/release/sammwy-web-server

RUN chmod +x ./server/target/release/sammwy-web-server

ENV PORT=9550
ENV WEB_PATH=./web
ENV TRUSTED_PROXY=true

EXPOSE 9550

CMD ["sh", "-c", "if [ \"$TRUSTED_PROXY\" = \"true\" ] || [ \"$TRUSTED_PROXY\" = \"1\" ]; then exec ./server/target/release/sammwy-web-server --path \"$WEB_PATH\" --port \"$PORT\" --trusted-proxy; else exec ./server/target/release/sammwy-web-server --path \"$WEB_PATH\" --port \"$PORT\"; fi"]
