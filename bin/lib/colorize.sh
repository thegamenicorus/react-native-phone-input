#!/bin/bash

set -e

# Variables
NO_FORMAT="\033[0m"
F_BOLD="\033[1m"
C_GREEN="\033[38;5;2m"
C_BLUE="\033[38;5;26m"
C_YELLOW="\033[38;5;11m"
C_RED="\033[38;5;9m"

# Methods
printMessageSuccess() {
    echo -e "${F_BOLD}${C_GREEN}$1${NO_FORMAT}"
}

printMessageNeutral() {
    echo -e "${F_BOLD}${C_BLUE}$1${NO_FORMAT}"
}

printMessageWarning() {
    echo -e "${F_BOLD}${C_YELLOW}$1${NO_FORMAT}"
}

printMessageError() {
    echo -e "${F_BOLD}${C_RED}$1${NO_FORMAT}"
}