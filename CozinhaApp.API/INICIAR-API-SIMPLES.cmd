@echo off
echo ========================================
echo    INICIAR API COM LOGS
echo ========================================
echo.

echo Configurando variaveis de ambiente...
set JWT_SECRET_KEY=MinhaChaveSecretaSuperSeguraParaJWT2024
set ASPNETCORE_ENVIRONMENT=Development
set ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT=Information

echo.
echo Variaveis configuradas:
echo    JWT_SECRET_KEY=***[CONFIGURADO]***
echo    ASPNETCORE_ENVIRONMENT=%ASPNETCORE_ENVIRONMENT%
echo.

echo Iniciando API...
echo.
echo LOGS IMPORTANTES:
echo    - SecurityMiddleware: Logs de requisicoes
echo    - JWT Events: Logs de autenticacao
echo    - PedidosController: Logs de claims e usuario
echo.

dotnet run

pause
