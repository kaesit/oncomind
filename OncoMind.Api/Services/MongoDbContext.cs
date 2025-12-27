using Microsoft.Extensions.Options;
using MongoDB.Driver;
using OncoMind.Api.Models;

namespace OncoMind.Api.Services
{
     public class MongoDbContext
     {
          private readonly IMongoDatabase _database;

          public MongoDbContext(IConfiguration config)
          {
               // Gets connection string from Docker Environment variables
               var connectionString = config["ConnectionStrings:Mongo"];
               var mongoUrl = MongoUrl.Create(connectionString);
               var client = new MongoClient(mongoUrl);
               _database = client.GetDatabase("OncoMindDB");
          }

          // Typed Collections
          public IMongoCollection<Doctors> Doctors => _database.GetCollection<Doctors>("doctors");
          public IMongoCollection<Patients> Patients => _database.GetCollection<Patients>("patients");
          public IMongoCollection<Analysis> Analyses => _database.GetCollection<Analysis>("analyses");
     }
}