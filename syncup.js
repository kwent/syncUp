#!/usr/bin/env node

const https = require('follow-redirects').https; // eslint-disable-line prefer-destructuring
const program = require('commander');
const GitHub = require('github-api');
const S3 = require('aws-sdk/clients/s3');

program
  .version('1.0.1')
  .option('--user <user>', 'Github Username or Organisation. (Required)')
  .option('--repository <repository>', 'Github Repository name. (Required)')
  .option('--bucket-name <bucket-name>', 'Destination S3 Bucket. (Required)')
  .option('--github-user <github-user>', 'Github Username. Allow to access private repository and higher rate limits. (Optional)')
  .option('--github-password <github-password>', 'Github Password. Allow to access private repository and higher rate limits. (Optional)')
  .option('--github-token <github-token>', 'Github OAuth Token. Allow to access private repository and higher rate limits. (Optional)')
  .option('--bucket-prefix <bucket-prefix>', 'Prefix Destination S3 Bucket.', '')
  .option('--acl <acl>', 'S3 ACL. (Optional | Default: public-read)', 'public-read')
  .option('--sse <sse>', 'S3 Encryption Method. (Optional)')
  .parse(process.argv);

if (!program.user) {
  console.log('\n  You need to specify a username or organisation via --user option'); // eslint-disable-line no-console
  program.help();
  process.exit(1);
}

if (!program.repository) {
  console.log('\n  You need to specify a repository --repository option'); // eslint-disable-line no-console
  program.help();
  process.exit(1);
}

if (!program.bucketName) {
  console.log('\n  You need to specify a bucket name --bucket-name option'); // eslint-disable-line no-console
  program.help();
  process.exit(1);
}


// clients initialization
let ghParams = {};

if (program.githubUser && program.githubPassword) {
  ghParams = { username: program.githubUser, password: program.githubPassword };
} else if (program.githubToken) {
  ghParams = { token: program.githubToken };
}

const gh = new GitHub(ghParams);
const s3 = new S3();

const repository = gh.getRepo(program.user, program.repository);
const promise = repository.listReleases();

promise.then((releases) => {
  const assets = {};
  releases.data.forEach((r) => {
    r.assets.forEach((a) => {
      assets[`${program.bucketPrefix}${a.name}`] = a.browser_download_url;
    });
  });

  s3.listObjectsV2({ Bucket: program.bucketName }, (err, data) => {
    if (err) {
      console.log(`Something went wrong with ${program.bucketName}:`, err.message); // eslint-disable-line no-console
      process.exit(1);
    } else {
      const s3Keys = data.Contents.map((obj => obj.Key));
      const diff = Object.keys(assets).filter(x => s3Keys.indexOf(x) < 0);

      diff.forEach((key, idx) => {
        const url = assets[key];
        https.get(url, (redirect) => {
          https.get(redirect.responseUrl, (response) => {
            const buffers = [];
            response.on('data', (chunk) => {
              buffers.push(chunk);
            });
            response.on('end', () => {
              const body = Buffer.concat(buffers);
              const params = {
                Bucket: program.bucketName,
                Key: key,
                Body: body,
                ServerSideEncryption: program.sse,
                ACL: program.acl,
                ContentLength: response.headers['content-length'],
                ContentType: response.headers['content-type'],
                ContentDisposition: response.headers['content-disposition'],
              };
              s3.putObject(params, (s3Err) => {
                if (s3Err) {
                  console.log(`Something went wrong with ${url}:`, s3Err.message); // eslint-disable-line no-console
                } else {
                  console.log('Upload succeeded:', url); // eslint-disable-line no-console
                }
                if (diff.length - 1 === idx) {
                  console.log('Synced done!'); // eslint-disable-line no-console
                  process.exit(0);
                }
              });
            });
          });
        });
      });
    }
  });
}).catch((e) => {
  console.log(e.message); // eslint-disable-line no-console
});
