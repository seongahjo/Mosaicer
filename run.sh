#!/bin/bash
pkill -9 -ef node
pkill -9 -ef python
cd mosaicer && python web.py &
cd mosaicer/node && npm start &
