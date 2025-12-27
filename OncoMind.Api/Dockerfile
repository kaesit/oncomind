FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY OncoMind.Api/OncoMind.Api.csproj OncoMind.Api/
RUN dotnet restore OncoMind.Api/OncoMind.Api.csproj

COPY OncoMind.Api/ OncoMind.Api/
WORKDIR /src/OncoMind.Api

RUN dotnet publish -c Release -o /app/publish --no-restore
ENV ASPNETCORE_URLS=http://+:80

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "OncoMind.Api.dll"]
