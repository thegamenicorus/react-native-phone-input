#!/bin/bash
# This script runs before pushing a commit with git

set -e

# Get color variables for output messages
pushd bin
source ./lib/colorize.sh
popd

# Make sure test coverage passes locally before push since CI/CD pipeline doesn't run integ tests
is_pre_check_success()
{
    npm test
}

if is_pre_check_success; then
    printMessageNeutral "-- PRE PUSH SUCCESS --"
else
    printMessageError "-- PRE PUSH ERROR --"
    exit 1
fi