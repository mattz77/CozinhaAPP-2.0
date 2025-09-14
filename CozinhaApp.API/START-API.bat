@echo off
echo 🚀 Iniciando CozinhaApp API...
echo.

REM Define a variável de ambiente JWT_SECRET_KEY com a chave correta (mais de 256 bits)
set JWT_SECRET_KEY=MinhaChaveSuperSecretaParaDesenvolvimento123456789!@#$%%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%%^&*()

echo ✅ JWT_SECRET_KEY configurada (256+ bits)
echo.

REM Executa dotnet run
echo 🔄 Executando dotnet run...
echo.
dotnet run

echo.
echo 🛑 API finalizada
pause
