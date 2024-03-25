#!/bin/bash

# installs NVM (Node Version Manager)

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

#### need to install git-all

sudo apt install git-all

# download application 

git clone https://github.com/Anton718/nestjs-authentication1.git

# Create the file repository configuration for postgres:
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Install the latest version of PostgreSQL.
sudo apt -y install postgresql

# creating password for user 'postgres'

sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# create database

sudo -u postgres psql -c 'create database "nest-data"'

#######################################
#######################################
#Below commands need to be installed manually:

# nvm install 21

# cd /home/user/nest*

# npm install

# npm i -g pm2

# start app

# pm2 start /home/user/nest*/dist/main.js