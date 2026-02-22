#!/bin/bash
cd server && cargo build --release && cd .. && chmod +x ./server/target/release/sammwy-web-server