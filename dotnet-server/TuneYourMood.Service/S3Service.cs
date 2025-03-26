using Microsoft.Extensions.Configuration;
using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Amazon.S3.Model;
using TuneYourMood.Core.InterfaceService;


namespace TuneYourMood.Service
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        public string BucketName()
        {
            return _bucketName;
        }

        public S3Service(IConfiguration configuration)
        {   
            var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
            var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
            var region = Environment.GetEnvironmentVariable("AWS_REGION");
            _bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");


            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) ||
                string.IsNullOrEmpty(region) || string.IsNullOrEmpty(_bucketName))
            {
                throw new ArgumentException("One or more AWS environment variables are missing.");
            }

            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
        }

        public async Task<string> GeneratePresignedUrlAsync(string fileName, string contentType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = contentType
            };
            var url = _s3Client.GetPreSignedURL(request);

            return url;
        }


        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddDays(7) // תוקף של 7 ימים
            };

            string url = _s3Client.GetPreSignedURL(request);

            return url;
        }



    }
}



