@echo off
:loop
cmd /c npx --yes firebase-tools deploy --only hosting:agriopti
if %ERRORLEVEL% NEQ 0 (
    echo Deploy failed, retrying...
    goto loop
)
echo Deploy successful!
