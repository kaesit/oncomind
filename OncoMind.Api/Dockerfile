# OncoMind.Api/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["OncoMind.Api/OncoMind.Api.csproj", "OncoMind.Api/"]
RUN dotnet restore "OncoMind.Api/OncoMind.Api.csproj"
COPY . .
WORKDIR "/src/OncoMind.Api"
RUN dotnet publish "OncoMind.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "OncoMind.Api.dll"]
