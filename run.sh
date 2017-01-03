#!/bin/bash
python web.py &
cd node && yarn start &
