#!/bin/sh

echo "Please enter your username";
read USER;

echo "Please enter your password";
stty -echo
read PW;
stty echo

casperjs "$( dirname "${BASH_SOURCE[0]}" )"/casper_dkb.js $USER $PW $1

