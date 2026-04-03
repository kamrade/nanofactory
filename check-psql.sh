#!/usr/bin/env bash

psql -h 127.0.0.1 -p 5433 -U nanofactory-db-dev -d nanofactory-db-dev -c '\dt'
