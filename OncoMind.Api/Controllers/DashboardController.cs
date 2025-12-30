using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using OncoMind.Api.Services;
using OncoMind.Api.Models;

namespace OncoMind.Api.Controllers
{
     [ApiController]
     [Route("api/[controller]")]
     public class DashboardController : ControllerBase
     {
          private readonly MongoDbContext _context;

          public DashboardController(MongoDbContext context)
          {
               _context = context;
          }

          [HttpGet("stats")]
          public async Task<IActionResult> GetDashboardStats([FromQuery] string? doctorId)
          {
               // 1. Define Filter: Start with "Select All"
               var filterBuilder = Builders<Patient>.Filter;
               var filter = filterBuilder.Empty;

               // If a specific Doctor ID is passed, restrict the query
               if (!string.IsNullOrEmpty(doctorId))
               {
                    filter = filterBuilder.Eq(p => p.AssignedDoctorId, doctorId);
               }

               // 2. Fetch Data using the Filter
               var patients = await _context.Patients.Find(filter).ToListAsync();

               // Global stats (e.g. Total Doctors) usually stay global, 
               // but you can filter this too if you want "Doctors in my department"
               var doctors = await _context.Doctors.Find(_ => true).ToListAsync();

               // ... (The rest of your calculation logic stays exactly the same) ...

               var totalPatients = patients.Count;
               var urgentCases = patients.Count(p => p.EmergencyStatus == "Urgent" || p.EmergencyStatus == "High");

               // Note: Ensure you are using ToUniversalTime() if your server is UTC but data is saved as Local
               var cutoffDate = DateTime.UtcNow.AddHours(-72);
               var newPatients24h = patients.Count(p => p.CreatedAt.ToUniversalTime() > cutoffDate);

               var statusDistribution = patients
                   .GroupBy(p => p.EmergencyStatus)
                   .Select(g => new { Status = g.Key, Count = g.Count() })
                   .ToList();

               var recentPatients = patients
                   .OrderByDescending(p => p.CreatedAt)
                   .Take(5)
                   .Select(p => new
                   {
                        Id = p.Id,
                        Name = $"{p.FirstName} {p.LastName}",
                        Status = p.EmergencyStatus,
                        Time = p.CreatedAt.ToString("HH:mm"),
                        Date = p.CreatedAt.ToString("MMM dd")
                   })
                   .ToList();

               return Ok(new
               {
                    kpis = new
                    {
                         totalPatients,
                         urgentCases,
                         newPatients24h,
                         totalDoctors = doctors.Count
                    },
                    charts = new
                    {
                         statusDistribution
                    },
                    recentActivity = recentPatients
               });
          }
     }
}