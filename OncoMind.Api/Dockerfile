# 1. Base Stage (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
# 👇 ADD THIS HERE (Forces .NET 8 to use Port 80)
ENV ASPNETCORE_HTTP_PORTS=80

# 2. Build Stage (SDK)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY OncoMind.Api/OncoMind.Api.csproj OncoMind.Api/
RUN dotnet restore OncoMind.Api/OncoMind.Api.csproj
COPY OncoMind.Api/ OncoMind.Api/
WORKDIR /src/OncoMind.Api
RUN dotnet publish -c Release -o /app/publish

# 3. Final Stage
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "OncoMind.Api.dll"]