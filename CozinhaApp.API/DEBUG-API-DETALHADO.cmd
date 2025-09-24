@echo off
echo ========================================
echo    DEBUG API - LOGS DETALHADOS
echo ========================================
echo.

echo 🔧 Configurando ambiente de debug...
set JWT_SECRET_KEY=MinhaChaveSecretaSuperSeguraParaJWT2024!@#$%%^&*()_+{}|:<>?[]\;',./
set ASPNETCORE_ENVIRONMENT=Development
set ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT=Information
set ASPNETCORE_LOGGING__LOGLEVEL__MICROSOFT=Information
set ASPNETCORE_LOGGING__LOGLEVEL__SYSTEM=Information

echo.
echo 📋 Variáveis de ambiente configuradas:
echo    JWT_SECRET_KEY=***[CONFIGURADO]***
echo    ASPNETCORE_ENVIRONMENT=%ASPNETCORE_ENVIRONMENT%
echo    ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT=%ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT%
echo.

echo 🚀 Iniciando API com logs detalhados...
echo.
echo 📝 LOGS IMPORTANTES PARA VERIFICAR:
echo    - SecurityMiddleware: Logs de requisições
echo    - JWT Events: Logs de autenticação
echo    - PedidosController: Logs de claims e usuário
echo.

dotnet run --project CozinhaApp.API.csproj

pause