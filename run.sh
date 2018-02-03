#!/bin/bash
pkill -9 -ef node
pkill -9 -ef python 
python3 web.py &
cd node && npm start
