[camjackson.net](http://camjackson.net)
===========
[![Build Status](https://snap-ci.com/camjackson/camjackson.net/branch/master/build_image)](https://snap-ci.com/camjackson/camjackson.net/branch/master)

My personal website. Includes a landing page with bio/skills, and blogging with markdown, complete with code highlighting!

### Dependencies:

1. node.js + npm
2. DynamoDB

### Setup
1. `npm install`
2. Start dynamodb in a separate terminal
3. `npm run init` (creates tables in local DynamoDB)
4. `npm run seed` (seeds local DynamoDB with some useful data)

### Tests:
`npm test`

### Run with file watching:
`npm run dev`

### Run in prod:
`npm start`

### Setting up TLS

1. Install letsencrypt:
```sh
cd ~/code
git clone git@github.com:letsencrypt/letsencrypt
cd letsencrypt
./letsencrypt-auto --help --debug
```

2. Request a cert for manual installation (don't forget to fix the email address!):
```sh
./letsencrypt-auto certonly --manual --email <me@me.com> --agree-tos --debug \
  -d camjackson.net \
  -d www.camjackson.net
```

3. Copy the specified route and data into the app

4. Upload the certs to AWS IAM:

```sh
sudo su
source ~cjacks/bin/load_aws_personal.sh
aws iam upload-server-certificate \
  --path /cloudfront/camjackson.net/ \
  --server-certificate-name camjackson.net \
  --certificate-body file:///etc/letsencrypt/live/camjackson.net/cert.pem \
  --private-key file:///etc/letsencrypt/live/camjackson.net/privkey.pem \
  --certificate-chain file:///etc/letsencrypt/live/camjackson.net/chain.pem
exit
```

5. Note down the expiration date!

6. Log in to the web console and configure the cloudfront distribution manually.
Ideally this would be automated, but for now it's in the too-hard basket.
