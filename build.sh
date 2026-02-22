#!/bin/bash
cd server && cargo build --release && cd .. && chmod +x ./target/release/sammwy.com && ./target/release/sammwy-web-server