#!/bin/bash

rm -rf ./dist && \
mkdir dist && mkdir dist/resources && mkdir dist/resources/flags &&  \
cp -r ./src/resources/flags/images ./dist/resources/flags && \
mkdir dist/typings && cp -r ./src/typings ./dist \
&& tsc