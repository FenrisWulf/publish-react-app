(function main () {
    var S3 = require('aws-sdk/clients/s3')
    var fs = require('fs')
    var path = require('path')
    var mime = require('mime')
    var randomWords = require('random-words')
    
    var bucketName = randomWords(5).join('-')
    var awsLocation = 'us-west-1'
    var params = {
        ACL: "public-read",
        Bucket: bucketName, 
        CreateBucketConfiguration: {
            LocationConstraint: awsLocation
        }   
    }
    var s3 = new S3({apiVersion: '2006-03-01'})
    var doneFileCount = 0
    var totalFileCount = 0
    s3.createBucket(params, function(err, data) {
        if (err) console.log(err, err.stack)
        else {
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
                    s3.putBucketWebsite(websiteConfig, function (err, data) {
                        if (err) console.log(err, err.stack)
                        else {
                            s3.getBucketWebsite({ Bucket: bucketName }, function (err, website) {
                                if (err) console.log(err, err.stack)
                                else {
                                    uploadFilesToS3('./build')
                                }
                            })
                        }
                    })
                }    
            })
        }
    })
    function pathWithoutBuild(path) {
        return path.substring(6)
    }
    function uploadFilesToS3 (directory) {
        fs.readdir(directory, (err, files) => {
            if(!files || files.length === 0) {
                console.log('No built files. Did you run `npm run build`?');
                return;
            }
            totalFileCount += files.length
            files.forEach(function (file) {
                const filePath = path.join(directory, file);
                if (fs.lstatSync(filePath).isDirectory()) {
                    doneFileCount++
                    uploadFilesToS3(directory + '/' + file)
                } else {
                    var params = {
                        Bucket: bucketName,
                        Key: pathWithoutBuild(filePath),
                        Body: fs.createReadStream(filePath),
                        ContentType: mime.getType(filePath)
                    }
                    s3.putObject(params, function (err, data) {
                        if (err) console.log(err)
                        else {
                            doneFileCount++
                            if (doneFileCount === totalFileCount) {
                                console.log('Your website is now available:')
                                console.log('http://' + bucketName + '.s3-website-' + awsLocation + '.amazonaws.com/')
                            }
                        }
                    })
                    
                }
            })
        })
    }
})()
