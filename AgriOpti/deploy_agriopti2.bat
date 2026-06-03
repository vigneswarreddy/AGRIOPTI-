@echo off
:loop
cmd /c npx --yes firebase-tools deploy --only hosting:agriopti2 --project agriopti-b67b6
if %ERRORLEVEL% NEQ 0 (
    echo Deploy failed, retrying...
    goto loop
)
echo Deploy to agriopti2.web.app successful!
