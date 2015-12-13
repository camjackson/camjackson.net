[camjackson.net](http://camjackson.net)
===========
[![Build Status](https://snap-ci.com/camjackson/camjackson.net/branch/master/build_image)](https://snap-ci.com/camjackson/camjackson.net/branch/master)

My personal website. Includes a landing page with bio/skills, and blogging with markdown, complete with code highlighting!

### Dependencies:

1. node.js + npm
2. mongodb

### Setup
1. `npm install`
2. Start `mongod` in a separate terminal.
3. `bin/seed` (seeds localhost by default, override with env DB_CONNECTION_STRING)

### Tests:
`npm test`

### Run:
`npm start`

Default login is admin/admin

### Setting up TLS

1. Install letsencrypt:
```sh
cd ~/code
git clone git@github.com:letsencrypt/letsencrypt
cd letsencrypt
./letsencrypt-auto --help --debug
```

2. Request a cert for manual installation:
```sh
./letsencrypt-auto certonly --manual --email <me@me.com> --agree-tos --debug -d camjackson.net
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
  --certificate-chain file:///etc/letsencrypt/live/camjackson.net/chain.pem \
```

5. Note down the expiration date!

6. Log in to the web console and configure the cloudfront distribution manually.
Ideally this would be automated, but for now it's in the too-hard basket.
