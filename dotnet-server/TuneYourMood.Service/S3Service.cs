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
            try
            {
                if (string.IsNullOrEmpty(_bucketName))
                    throw new Exception("Bucket name is missing.");
                if (string.IsNullOrEmpty(fileName))
                    throw new Exception("File name is missing.");
                if (_s3Client == null)
                    throw new Exception("S3 client is not initialized.");

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMonths(12),
                    ContentType = contentType
                };

                var url = _s3Client.GetPreSignedURL(request);
                return url;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating pre-signed URL: {ex.Message}");
                throw; // כדי שה-Controller יתפוס ויחזיר שגיאה עם הודעה
            }
        }


        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMonths(12) 
            };

            string url = _s3Client.GetPreSignedURL(request);

            return url;
        }



    }
}



