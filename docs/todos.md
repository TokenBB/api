# todos when creating a new instance in production

input:

- 10-char lowercase tokenbb $account_name
- make sure all account names are available

steem:

- create app account with $account_name 
  (tkbb. + $account_name)
- create base topics
  - tokenbb- + $account_name + -topics

steemconnect:

- use app account to create steem connect app account
  (tkbc. + $account_name)

s3:

- create bucket (tokenbb-$account_name)
- make bucket static website
- http://tokenbb-$account_name.s3-website-us-east-1.amazonaws.com/

dns:

- create new CNAME for subdomain
- point new CNAME to api server

mysql:

1. `create database $account_name`
2. `grant all privileges on $account_name.* TO '$account_name + -service'@'%' identified by 'password';`

http on host:

- add proxy configuration for new subdomain
- setup https
