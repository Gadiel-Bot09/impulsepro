@echo off
echo ========================================
echo   Abriendo PulsePro en Navegador
echo ========================================
echo.
echo Verifica que el servidor este corriendo (npm start)
echo.
timeout /t 2 >nul
start http://localhost:3000
echo.
echo ✅ Pagina abierta en: http://localhost:3000
echo.
pause
