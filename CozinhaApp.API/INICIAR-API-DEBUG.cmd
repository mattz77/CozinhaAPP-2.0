@echo off
echo ========================================
echo    INICIAR API COM DEBUG E LOGS
echo ========================================
echo.

echo 🔧 Configurando variáveis de ambiente...
set JWT_SECRET_KEY=MinhaChaveSecretaSuperSeguraParaJWT2024!@#$%%^&*()_+{}|:<>?[]\;',./
set ASPNETCORE_ENVIRONMENT=Development
set ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT=Information
set ASPNETCORE_LOGGING__LOGLEVEL__MICROSOFT=Information
set ASPNETCORE_LOGGING__LOGLEVEL__SYSTEM=Information

echo.
echo 📋 Variáveis configuradas:
echo    JWT_SECRET_KEY=***[CONFIGURADO]***
echo    ASPNETCORE_ENVIRONMENT=%ASPNETCORE_ENVIRONMENT%
echo.

echo 🚀 Iniciando API com logs detalhados...
echo.
echo 📝 LOGS IMPORTANTES PARA VERIFICAR:
echo    - SecurityMiddleware: Logs de requisições
echo    - JWT Events: Logs de autenticação  
echo    - PedidosController: Logs de claims e usuário
echo.

dotnet run

pause