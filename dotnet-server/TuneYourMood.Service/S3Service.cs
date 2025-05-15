using Microsoft.Extensions.Configuration;
using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Amazon.S3.Model;
using TuneYourMood.Core.InterfaceService;
using System.Web;

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

                // טיפול בשמות קבצים בעברית
                string encodedFileName = fileName;

                // בדיקה אם הקובץ קיים
                try
                {
                    var metadata = await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
                    {
                        BucketName = _bucketName,
                        Key = fileName
                    });
                }
                catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    // אם הקובץ לא נמצא, ננסה לקודד את שם הקובץ
                    encodedFileName = HttpUtility.UrlDecode(fileName);

                    try
                    {
                        // בדיקה אם הקובץ קיים עם השם המקודד
                        await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
                        {
                            BucketName = _bucketName,
                            Key = encodedFileName
                        });
                    }
                    catch
                    {
                        // אם עדיין לא מוצא, ננסה אפשרות נוספת
                        encodedFileName = fileName.Replace(" ", "+");
                    }
                }

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = encodedFileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(15), // זמן קצר יותר מומלץ
                };

                if (!string.IsNullOrEmpty(contentType))
                {
                    request.ResponseHeaderOverrides = new ResponseHeaderOverrides
                    {
                        ContentType = contentType
                    };
                }

                var url = _s3Client.GetPreSignedURL(request);
                return url;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating pre-signed URL: {ex.Message}");
                throw;
            }
        }

        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            try
            {
                if (fileName.StartsWith("http"))
                {
                    Console.WriteLine($"Warning: fileName appears to be a full URL: {fileName}");

                    try
                    {
                        Uri uri = new Uri(fileName);
                        string path = uri.AbsolutePath;
                        string actualFileName = path.Split('/').Last();

                        Console.WriteLine($"Extracted actual filename: {actualFileName}");
                        fileName = actualFileName;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to parse URL: {ex.Message}");
                    }
                }

                string encodedFileName = fileName;
                try
                {
                    var metadata = await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
                    {
                        BucketName = _bucketName,
                        Key = fileName
                    });
                }
                catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    Console.WriteLine($"File not found with original name: {fileName}");

                    try
                    {
                        encodedFileName = System.Web.HttpUtility.UrlDecode(fileName);
                        Console.WriteLine($"Trying with decoded name: {encodedFileName}");

                        await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
                        {
                            BucketName = _bucketName,
                            Key = encodedFileName
                        });
                    }
                    catch (Exception innerEx)
                    {
                        Console.WriteLine($"Still not found with decoded name: {innerEx.Message}");
                        encodedFileName = fileName.Replace(" ", "+");
                        Console.WriteLine($"Trying with spaces replaced: {encodedFileName}");
                    }
                }

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = encodedFileName,
                    Verb = HttpVerb.GET,
                    Expires = DateTime.UtcNow.AddMinutes(15), // זמן קצר יותר
                    ResponseHeaderOverrides = new ResponseHeaderOverrides
                    {
                        ContentType = GetContentTypeFromFileName(fileName),
                        ContentDisposition = "inline"
                    }
                };

                string url = _s3Client.GetPreSignedURL(request);
                Console.WriteLine($"Generated pre-signed URL: {url}");

                return url;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting download URL: {ex.Message}");
                throw;
            }
        }

        private string GetContentTypeFromFileName(string fileName)
        {
            string extension = Path.GetExtension(fileName).ToLowerInvariant();

            return extension switch
            {
                ".mp3" => "audio/mpeg",
                ".wav" => "audio/wav",
                ".ogg" => "audio/ogg",
                ".m4a" => "audio/mp4",
                ".flac" => "audio/flac",
                _ => "application/octet-stream"
            };
        }
    }
}