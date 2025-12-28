// OncoMind.Api/Program.cs
using OncoMind.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Add Framework Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<PatientService>();
builder.Services.AddHttpClient<PythonMLService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173") // Your Frontend URL
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// --- 5. Middleware Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ❌ Keep commented out for Docker compatibility
// app.UseHttpsRedirection(); 

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();