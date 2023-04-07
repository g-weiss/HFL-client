#!/bin/bash
read -p "Enter Edge ip: " ip
read -p "Enter edge port to connect to: " port
chromium-browser "$ip":2999/#"$port"
