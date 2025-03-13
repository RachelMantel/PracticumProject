using Microsoft.Extensions.Configuration;
using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Amazon.S3.Model;
using TuneYourMood.Core.InterfaceService;


namespace TuneYourMood.Service
{
    //public class S3Service
    //{
    //    private readonly string _bucketName;
    //    private readonly IAmazonS3 _s3Client;

    //    public S3Service(IConfiguration configuration)
    //    {
    //        var awsOptions = configuration.GetSection("AWS");
    //        _bucketName = awsOptions["BucketName"];
    //        var accessKey = awsOptions["AccessKey"];
    //        var secretKey = awsOptions["SecretKey"];
    //        var region = RegionEndpoint.GetBySystemName(awsOptions["Region"]);

    //        _s3Client = new AmazonS3Client(accessKey, secretKey, region);
    //    }

    //    public async Task<string> UploadFileAsync(IFormFile file)
    //    {
    //        using var stream = file.OpenReadStream();
    //        var uploadRequest = new TransferUtilityUploadRequest
    //        {
    //            InputStream = stream,
    //            Key = file.FileName,
    //            BucketName = _bucketName,
    //            ContentType = file.ContentType
    //        };

    //        var transferUtility = new TransferUtility(_s3Client);
    //        await transferUtility.UploadAsync(uploadRequest);

    //        return $"https://{_bucketName}.s3.amazonaws.com/{file.FileName}";
    //    }
    //}
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
            var awsOptions = configuration.GetSection("AWS");
            var accessKey = awsOptions["AccessKey"];
            var secretKey = awsOptions["SecretKey"];
            var region = awsOptions["Region"];
            _bucketName = awsOptions["BucketName"];

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
                Expires = DateTime.UtcNow.AddMinutes(30) // תוקף של 30 דקות
            };

            return _s3Client.GetPreSignedURL(request);
        }

        public async Task<bool> UploadFileAsync(IFormFile file, string fileName)
        {
            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var putRequest = new PutObjectRequest
                    {
                        BucketName = _bucketName,
                        Key = fileName,  // השם הייחודי של הקובץ
                        InputStream = stream,
                        ContentType = file.ContentType
                    };

                    var response = await _s3Client.PutObjectAsync(putRequest);
                    return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
                }
            }
            catch (Exception)
            {
                // במקרה של שגיאה בהעלאת הקובץ
                return false;
            }
        }

    }
}


