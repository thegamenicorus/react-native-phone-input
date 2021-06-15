#!/bin/bash
# This script runs before making a commit with git

set -e

# Get color variables for output messages
pushd bin
source ./lib/colorize.sh
popd

is_pre_check_success()
{
    npm run lint
}

if is_pre_check_success; then
    printMessageNeutral "-- PRE COMMIT SUCCESS --"
else
    printMessageError "-- PRE COMMIT ERROR --"
    exit 1
fi