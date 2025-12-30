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
          public async Task<IActionResult> GetDashboardStats()
          {
               // 1. Fetch Raw Data
               var patients = await _context.Patients.Find(_ => true).ToListAsync();
               var doctors = await _context.Doctors.Find(_ => true).ToListAsync();

               // 2. Calculate KPIs
               var totalPatients = patients.Count;
               var urgentCases = patients.Count(p => p.EmergencyStatus == "Urgent" || p.EmergencyStatus == "High");
               var newPatients24h = patients.Count(p => p.CreatedAt > DateTime.UtcNow.AddHours(-24));

               // 3. Prepare Chart Data: Patients by Status
               var statusDistribution = patients
                   .GroupBy(p => p.EmergencyStatus)
                   .Select(g => new { Status = g.Key, Count = g.Count() })
                   .ToList();

               // 4. Prepare List: 5 Most Recent Patients
               var recentPatients = patients
                   .OrderByDescending(p => p.CreatedAt)
                   .Take(5)
                   .Select(p => new
                   {
                        Id = p.Id,
                        Name = $"{p.FirstName} {p.LastName}",
                        Status = p.EmergencyStatus,
                        Time = p.CreatedAt.ToString("HH:mm"), // Format time
                        Date = p.CreatedAt.ToString("MMM dd"),
                        RawCreated = p.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),

                        // 👇 DEBUG LINE: Check if it matches your filter
                        IsNew = p.CreatedAt > DateTime.UtcNow.AddHours(-72)
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