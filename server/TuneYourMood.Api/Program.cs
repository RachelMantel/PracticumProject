using System.Text.Json.Serialization;
using TuneYourMood.Api;
using TuneYourMood.Core.InterfaceRepository;
using TuneYourMood.Core.InterfaceService;
using TuneYourMood.Core;
using TuneYourMood.Data;
using Microsoft.EntityFrameworkCore;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Service;
using TuneYourMood.Data.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.OpenApi.Models;
using DotNetEnv;
using Microsoft.AspNetCore.Hosting;

Env.Load();
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
string connectionString = Env.GetString("DB_CONNECTION_STRING");


// ?? הוספת CORS לכל הקליינטים
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// //?? חיבור למסד הנתונים
//builder.Services.AddDbContext<DataContext>(option =>
//{
//    option.UseSqlServer("Data Source=DESKTOP-SSNMLFD;Initial Catalog=TuneYourMood;Integrated Security=True;TrustServerCertificate=True;");
//});

//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseMySql(connectionString, new MySqlServerVersion(new Version(9, 0, 0))));


builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), options => options.CommandTimeout(60)));

//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


// ?? הוספת תלויות (Dependency Injection)
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISongService, SongService>();
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<IService<SongDto>, SongService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISongRepository, SongRepository>();
builder.Services.AddScoped<IFolderRepository, FolderRepository>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<IS3Service, S3Service>();

// ?? הוספת AutoMapper
builder.Services.AddAutoMapper(typeof(MappingPostProfile));
builder.Services.AddAutoMapper(typeof(MappingProfile));

// ?? הוספת תמיכה בפורמט JSON
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // לדוגמה, עד 100MB
});

// ?? הוספת תמיכה ב-JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

//קשור לSWAGGER לJWT
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "הכנס את ה-Token בפורמט: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
// ?? הוספת הרשאות מבוססות-תפקידים
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
});

// ?? הוספת Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// מוסיף את המשתנים ל-AppSettings בצורה דינאמית
builder.Configuration["AWS:BucketName"] = Env.GetString("AWS_BUCKET_NAME");
builder.Configuration["AWS:Region"] = Env.GetString("AWS_REGION");
builder.Configuration["AWS:AccessKey"] = Env.GetString("AWS_ACCESS_KEY");
builder.Configuration["AWS:SecretKey"] = Env.GetString("AWS_SECRET_KEY");

var app = builder.Build();


// ?? סידור ה-Middleware לפי הסדר הנכון
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseCors("AllowAll"); // ?? הפעלת CORS לכל הלקוחות

app.UseAuthentication();  // ?? אימות משתמשים (JWT)
app.UseAuthorization();   // ?? הרשאות משתמשים

app.MapControllers();     // ?? מפות ה-API

app.Run();
