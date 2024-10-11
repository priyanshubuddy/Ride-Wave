   @echo off

   REM Get the IPv4 address using PowerShell
   for /f "tokens=*" %%i in ('powershell -command "((Get-NetIPAddress -AddressFamily IPv4).IPAddress)[0]"') do set IP=%%i

   REM Output the IP address to config.js
   echo module.exports = { IP_ADDRESS: "%IP%" }; > Frontend\config.js

   REM Open a new Command Prompt window and run the frontend
   start cmd /k "cd Frontend && npm start"

   REM Open another new Command Prompt window and run the backend
   start cmd /k "cd Backend && npm run dev"