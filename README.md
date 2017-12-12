# publish-react-app
Tool for automatically publishing a react app to the internet via S3

## Exampe usage

```bash
npm install -g create-react-app publish-react-app
create-react-app myapp
cd myapp/
npm run build
AWS_ACCESS_KEY_ID={Your AWS key ID here} AWS_SECRET_ACCESS_KEY={Your AWS secret here} publish-react-app
# Your website is now available: [your url will be here]
```

## What it does

So you've created a React app. Now you want to get it off of `localhost` and put it on the real internet. But you don't want to think about how cloud hosting works. You just want to run a command. This tool does just that. Given a users AWS credentials, this tool will upload all of the contents generated by a project started by create-react-app and get a sharable link to the final product. Since S3 is free for the first year, and then cheap after that, it is an ideal way to share your React apps.

In short, this package will take the contents of your `./build` folder and upload them to S3. The package will create bucket in your account. You will be given a randomly generated URL of where the S3 bucket is.

##  What are AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY?

If you do not have your own AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY here is how you can get one:

1. Create an account by signing up to https://aws.amazon.com/
2. Add a user by going to https://console.aws.amazon.com/iam/home?#/users$new?step=details
    * Select __Programmatic access__ as __Access Type__
    * Hit the __Next: Permissions__ button
    * Hit __Create group__
    * Make group name something like "Admin" and select `AdministratorAccess` as the policy name
    * Hit the __Create policy button.__
    * Hit the __Next: Review__ button
    * Hit the __Create user__
3. At the final screen, the Access key ID and Secret access key strings will be visible.
