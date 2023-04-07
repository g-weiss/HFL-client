#!/bin/bash
read -p "Enter Edge ip: " ip
read -p "Enter edge port to connect to: " port
google-chrome "$ip":2999/#"$port"
