using Microsoft.AspNetCore.Mvc;
using OncoMind.Api.Models;
using OncoMind.Api.Services;
using MongoDB.Driver;

namespace OncoMind.Api.Controllers
{
     [ApiController]
     [Route("api/[controller]")]
     public class DrugCandidateController : ControllerBase
     {
          private readonly PythonMLService _mlService;
          private readonly MongoDbContext _context;

          public DrugCandidateController(PythonMLService mlService, MongoDbContext context)
          {
               _mlService = mlService;
               _context = context;
          }

          [HttpGet]
          public async Task<IActionResult> GetAll()
          {
               var list = await _context.DrugCandidates.Find(_ => true).SortByDescending(x => x.CreatedAt).ToListAsync();
               return Ok(list);
          }

          [HttpPost("generate")]
          public async Task<IActionResult> GenerateAI()
          {
               try
               {
                    // 1. Call Python
                    var result = await _mlService.GenerateMoleculeAsync("C");

                    // 2. Create Database Record
                    var candidate = new DrugCandidates
                    {
                         Smiles = result.Smiles,
                         QedScore = result.Qed,
                         MwScore = result.Mw,
                         MoleculeImage = result.ImageBase64, // Saving Base64 directly
                         CreatedAt = DateTime.UtcNow
                    };

                    // 3. Save to MongoDB
                    await _context.DrugCandidates.InsertOneAsync(candidate);

                    return Ok(candidate);
               }
               catch (Exception ex)
               {
                    return StatusCode(500, new { error = "AI Generation Failed: " + ex.Message });
               }
          }
     }
}