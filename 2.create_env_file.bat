@echo off
setlocal

:: Prompt the user for the Discord token and API key
set /p discord_token=Enter your DISCORD_TOKEN: 
set /p api_key=Enter your API_KEY: 

:: Create the .env file with the provided values
echo Creating .env file...
(
echo DISCORD_TOKEN=%discord_token%
echo API_KEY=%api_key%
) > .env

echo .env file created with the provided values.
pause
