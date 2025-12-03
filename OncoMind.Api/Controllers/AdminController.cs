// OncoMind.Api/Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace OncoMind.Api.Controllers
{
     [ApiController]
     [Route("api/admin")]
     public class AdminController : ControllerBase
     {
          private readonly ILogger<AdminController> _logger;
          private readonly IWebHostEnvironment _env;

          public AdminController(ILogger<AdminController> logger, IWebHostEnvironment env)
          {
               _logger = logger;
               _env = env;
          }

          [HttpGet("model_info")]
          public async Task<IActionResult> ModelInfo()
          {
               // You can call the ML service here or inspect model files on disk
               // Example: call the python ML service
               try
               {
                    using var client = new HttpClient();
                    client.Timeout = TimeSpan.FromSeconds(3);
                    var resp = await client.GetAsync("http://localhost:8000/model_info");
                    var txt = await resp.Content.ReadAsStringAsync();
                    return Content(txt, "application/json");
               }
               catch (Exception ex)
               {
                    return Ok(new { model_loaded = false, error = ex.Message });
               }
          }

          [HttpPost("reload_model")]
          public async Task<IActionResult> ReloadModel()
          {
               // Proxy to ML service admin reload endpoint
               try
               {
                    using var client = new HttpClient();
                    var resp = await client.PostAsync("http://localhost:8000/admin/reload", null);
                    var txt = await resp.Content.ReadAsStringAsync();
                    return Content(txt, "application/json");
               }
               catch (Exception ex)
               {
                    return BadRequest(new { ok = false, error = ex.Message });
               }
          }

          [HttpPost("upload_model")]
          public async Task<IActionResult> UploadModel()
          {
               var file = Request.Form.Files.FirstOrDefault();
               if (file == null) return BadRequest(new { ok = false, error = "No file" });

               var uploads = Path.Combine(_env.ContentRootPath, "models");
               Directory.CreateDirectory(uploads);
               var filePath = Path.Combine(uploads, file.FileName);

               using (var fs = new FileStream(filePath, FileMode.Create))
               {
                    await file.CopyToAsync(fs);
               }

               // Optionally: signal ML service to reload after upload
               _logger.LogInformation("Uploaded model to {0}", filePath);
               return Ok(new { ok = true, path = filePath });
          }

          [HttpGet("predictions")]
          public IActionResult Predictions([FromQuery] int limit = 100)
          {
               // Return last N predictions; here we return synthetic data or read from a file/db
               // For now, return empty list or read from a file logs/predictions.json if you implement logging in ML
               return Ok(new { predictions = new object[] { } });
          }

          [HttpGet("logs")]
          public IActionResult Logs([FromQuery] int lines = 200)
          {
               // If you keep a log file for ML or API, tail it. For demo we try to tail a log file in repository.
               var logPath = Path.Combine(_env.ContentRootPath, "logs", "ml.log");
               if (!System.IO.File.Exists(logPath)) return Content("Log file not found.");
               var all = System.IO.File.ReadAllLines(logPath);
               var start = Math.Max(0, all.Length - lines);
               var selected = all.Skip(start).ToArray();
               return Content(string.Join("\n", selected));
          }

          [HttpPost("clear_cache")]
          public IActionResult ClearCache()
          {
               // Implement cache clearing logic if ML side supports it.
               return Ok(new { ok = true });
          }

          [HttpGet("health")]
          public async Task<IActionResult> Health()
          {
               return Ok("ok");
          }
     }
}
