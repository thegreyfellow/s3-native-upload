 var crypto = require('crypto-js');

var s3Config = {
    accessKey: "AKIAJVDX2VXAPHMBGF5Q",
    secretKey: "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",

};

var dateG = "";

function s3Credentials(bucket, region, filename, fileContent) {
    dateG = dateString();
    return {
        endpoint_url: "https://" + bucket + ".s3.amazonaws.com",
        params: s3Params(bucket, region, filename, fileContent)
    }
}


// Returns the parameters that must be passed to the API call
function s3Params(bucket, region, filename, fileContent) {
    var policy = s3UploadPolicy(bucket, filename, fileContent);
    var policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');
    return {
        AccessKey: s3Config.accessKey,
        Policy: policyBase64,
        Signiture: s3UploadSignature(policyBase64),
    }
}

// Constructs the policy
function s3UploadPolicy(bucket, filename, fileContent) {
    return {
        "expiration": new Date((new Date).getTime() + (5 * 60 * 1000)).toISOString(),
        "conditions": [
            { "bucket": bucket },
            { "acl": "public-read" },
            ["eq", "$key", filename],
            ["starts-with", "$Content-Type", fileContent],
        ]
    }
}

// Signs the policy with the credential

function s3UploadSignature(policyBase64) {
    var CryptoJS = require('crypto-js');
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(policyBase64, s3Config.secretKey));
}

function dateString() {
    var date = new Date().toISOString();
    return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
}

module.exports = {
    s3Credentials: s3Credentials
}