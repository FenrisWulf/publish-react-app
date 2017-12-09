(function main () {
    var S3 = require('aws-sdk/clients/s3');
    var fs = require('fs')
    var mime = require('mime')
    
    var bucketName = 'dnichol-examplebucket16'

    var params = {
        ACL: "public-read",
        Bucket: bucketName, 
        CreateBucketConfiguration: {
            LocationConstraint: "us-west-1"
        }
    };
    var s3 = new S3({apiVersion: '2006-03-01'});
    s3.createBucket(params, function(err, data) {
        if (err) console.log(err, err.stack)
        else {
            console.log(data)
            var Location = data.Location
            var policyPublic = {
                Sid: 'AddPublicReadPermissions',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::' + bucketName + '/*'
              }

            var policy = {
                Statement: [policyPublic]
            }

            var websiteConfig = {
                Bucket: bucketName,
                WebsiteConfiguration: {
                    IndexDocument: {
                        Suffix: 'index.html'
                    }
                }
            }
            s3.putBucketPolicy({ Bucket: bucketName, Policy: JSON.stringify(policy) }, function(err, data) {
                if (err) console.log(err, err.stack)
                else {
                    console.log('data!', data)
                }
                s3.putBucketWebsite(websiteConfig, function (err, data) {
                    if (err) console.log(err, err.stack)
                    else {
                        console.log('data!', data)
                        s3.getBucketWebsite({ Bucket: bucketName }, function (err, website) {
                            if (err) return cb(err)
                            console.log('website', website)
                            var params = {
                                Bucket: bucketName,
                                Key: 'index.html',
                                Body: fs.createReadStream('build/index.html'),
                                ContentType: mime.getType('build/index.html'),
                            }
                            s3.putObject(params, function (err, data) {
                                if (err) console.log(err)
                                console.log('data', data)
                            })
                        })
                    }
                })
            })
        }
    });

})()