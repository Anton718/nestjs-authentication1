A backend application: a user can register, create a profile, create a wallet, fill balance in USD, get current quotes of several cryptocurrencies, exchange the amount of USD into coins and sell coins converting them back into USD.
![alt text](<screenshots/Screenshot from 2024-03-16 21-09-52.png>)
![alt text](<screenshots/Screenshot from 2024-03-16 21-10-07.png>)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment
# installs NVM (Node Version Manager)

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# installs git

sudo apt install git-all

# download application from GitHub

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

# nvm install 21

# cd /home/user/nest*

# npm install
