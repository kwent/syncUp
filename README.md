# syncUp

Sync your Github Releases Assets with an S3 bucket 🔄

[![npm version](https://img.shields.io/npm/v/syncup-cli.svg?style=flat)](https://www.npmjs.com/package/syncup)

[![syncup](https://github.com/kwent/syncup/blob/master/doc/syncup.gif?raw=true)](https://github.com/kwent/syncup/)

# Installation

Just install the module using npm.

```bash
$ npm install syncup --global
```

# Usage

```bash
# AWS Credentials are read from environment variables or profile located in ~/.aws/credentials.
$ syncup --user yarnpkg --repository yarn --bucket-name my-mirror-s3-bucket --bucket-prefix 'downloads/'
```

## Help

```
  Usage: syncup [options]

  Options:

    -V, --version                        output the version number
    --user <user>                        Github Username or Organisation. (Required)
    --repository <repository>            Github Repository name. (Required)
    --bucket-name <bucket-name>          Destination S3 Bucket. (Required)
    --github-user <github-user>          Github Username. Allow to access private repository and higher rate limits. (Optional)
    --github-password <github-password>  Github Password. Allow to access private repository and higher rate limits. (Optional)
    --github-token <github-token>        Github OAuth Token. Allow to access private repository and higher rate limits. (Optional)
    --bucket-prefix <bucket-prefix>      Prefix Destination S3 Bucket.
    --acl <acl>                          S3 ACL. (Optional | Default: public-read)
    --sse <sse>                          S3 Encryption Method. (Optional)
    -h, --help                           output usage information
```

# History

View the [changelog](https://github.com/kwent/syncup/blob/master/CHANGELOG.md)

# Authors

- [Quentin Rousseau](https://github.com/kwent)

# License

```plain
Copyright (c) 2020 Quentin Rousseau <contact@quent.in>
Copyright (c) 2020 Quentin Rousseau <contact@quent.in>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```
