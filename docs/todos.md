# todos when creating a new instance in production

input:

- 10-char lowercase tokenbb $account_name
- make sure all account names are available


steem:

- create app account with $account_name 
  (tkbb_ + $account_name)


steemconnect:

- use app account to create steem connect app account
  (tkbc_ + $account_name)


mysql:

- create a new mysql user
- set and save mysql user password
- create a new mysql database for that user


dns:

- create new CNAME for subdomain
- point new CNAME to api server


http on host:

- add proxy configuration for new subdomain
