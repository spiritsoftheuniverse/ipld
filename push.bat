@echo off
echo.
echo ==== GIT PUSH TO MAIN BRANCH ====

:: Go to the folder of this script
cd /d %~dp0

:: Add all changes
git add .

:: Commit with a message (or default if you didn’t pass one)
if "%1"=="" (
    set commitmsg=Update
) else (
    set commitmsg=%*
)

git commit -m "%commitmsg%"

:: Push to main
git push origin main

echo.
echo ==== DONE ====
pause