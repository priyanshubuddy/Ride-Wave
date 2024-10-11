@echo off
setlocal

REM Get the IPv4 address
for /f "tokens=14" %%i in ('ipconfig ^| findstr /r /c:"IPv4 Address"') do set IP=%%i

REM Remove any carriage return characters
set IP=%IP:~0,-1%

REM Output the IP address to config.js
echo module.exports = { IP_ADDRESS: "%IP%" }; > Frontend/config.js

REM Close the terminal
exit