#!/bin/bash
pkill -9 -ef node
pkill -9 -ef python 
python web.py &
cd node && npm start &
