// OncoMind.Api/Controllers/PredictController.cs
using Microsoft.AspNetCore.Mvc;

namespace OncoMind.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PredictController : ControllerBase
    {
        private readonly ILogger<PredictController> _logger;
        private readonly IHttpClientFactory _factory;

        public PredictController(ILogger<PredictController> logger, IHttpClientFactory factory)
        {
            _logger = logger;
            _factory = factory;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int sample = 1)
        {
            var client = _factory.CreateClient();
            // call the Python ML service (make sure this address is where your uvicorn serves)
            var resp = await client.GetFromJsonAsync<object>($"http://localhost:8000/predict?sample={sample}");
            return Ok(new { source = "OncoMind.Api", ml = resp });
        }
    }
}
