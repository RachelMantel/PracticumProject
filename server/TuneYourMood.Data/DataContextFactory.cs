//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Design;
//using System;
//using System.IO;
//using DotNetEnv;
//using TuneYourMood.Data;

//namespace TuneYourMood.Data
//{
//    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
//    {
//        public DataContext CreateDbContext(string[] args)
//        {
//            // Load environment variables from .env
//            //var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../TuneYourMood.Api");
//            var evnPath = "C:\\Users\\user1\\Desktop\\פרויקט פרקטיקום\\server\\TuneYourMood.Api\\.env";

//            //var envPath = Path.Combine(basePath, ".env");

//            if (File.Exists(evnPath))
//            {
//                Env.Load(evnPath);
//            }
//            else
//            {
//                throw new FileNotFoundException($".env file not found at {evnPath}");
//            }

//            // Get connection string from environment variables
//            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

//            if (string.IsNullOrEmpty(connectionString))
//            {
//                throw new InvalidOperationException("DATABASE_CONNECTION is not set in .env file");
//            }

//            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
//            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

//            return new DataContext(optionsBuilder.Options);
//        }
//    }
//}

