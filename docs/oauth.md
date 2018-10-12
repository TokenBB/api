## oauth notes

#### statuses

1. draft
2. publish
3. trash


#### OAuth defines four roles 

1. `Resource Owner` (the steemit user account)
2. `Client` (a tokenbb instance)
3. `Resource Server` (steemd)
4. `Authorization Server` (SteemConnect)

### Implicit grant flow

1. the user is asked to authorize the application. the user is 
presented with an authorization link, that requests a token from 
the API.

`/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&scope=SCOPE`

2. you click the link
3. you log in to the service (unless you are already logged in)
4. you're prompted by the service to authorize the application to post on your behalf.
5. the service redirects you to the application redirect URI along with an access token. 
6. the client may use the token to access the user's account or broadcast 
posting operation via the API, limited to the scope of access, until the token expires 
or is revoked.


### Tokens

1. one-time use
  - 1 request per 30 minutes
  - lifetime of 30 minutes
  - no refresh token

2. refreshable
  - 1 request per minute
  - lifetime of one hour
  - refresh token


---


## Resources


- [steemconnect-python-client documentation](https://steemconnect-python-client.readthedocs.io/en/latest/)
- [OAuth 2.0 Token Introspection RFC](https://tools.ietf.org/html/rfc7662)
