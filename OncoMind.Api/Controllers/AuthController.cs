using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using OncoMind.Api.Models;
using OncoMind.Api.Services;

namespace OncoMind.Api.Controllers
{
     [ApiController]
     [Route("api/[controller]")]
     public class AuthController : ControllerBase
     {
          private readonly MongoDbContext _context;

          public AuthController(MongoDbContext context)
          {
               _context = context;
          }

          [HttpPost("register")]
          public async Task<IActionResult> Register([FromBody] DoctorRegisterDto dto)
          {
               // 1. Check if email exists
               var existing = await _context.Doctors.Find(d => d.Email == dto.Email).FirstOrDefaultAsync();
               if (existing != null) return BadRequest(new { message = "Email already in use." });

               // 2. Map DTO to Entity
               var doctor = new Doctor
               {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Password = dto.Password, // ⚠️ Note: In a real app, Hash this! (e.g. BCrypt)
                    Specialization = dto.Specialization,
                    DateOfBirth = dto.DateOfBirth,
                    ProfilePicture = dto.ProfilePicture,
                    CreatedAt = DateTime.UtcNow
               };

               await _context.Doctors.InsertOneAsync(doctor);

               return Ok(new { message = "Registration successful", doctorId = doctor.Id });
          }

          [HttpPost("login")]
          public async Task<IActionResult> Login([FromBody] DoctorLoginDto dto)
          {
               // 1. Find Doctor
               var doctor = await _context.Doctors
                   .Find(d => d.Email == dto.Email && d.Password == dto.Password)
                   .FirstOrDefaultAsync();

               if (doctor == null)
                    return Unauthorized(new { message = "Invalid email or password" });

               // 2. Return Success
               return Ok(new
               {
                    message = "Login successful",
                    doctorId = doctor.Id,
                    name = $"{doctor.FirstName} {doctor.LastName}",
                    specialization = doctor.Specialization
               });
          }
     }
}