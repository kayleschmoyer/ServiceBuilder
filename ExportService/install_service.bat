@echo off
set SERVICE_NAME=ExportService
set EXE_PATH=%~dp0ExportService.exe

sc.exe create %SERVICE_NAME% binPath= "%EXE_PATH%" start= auto
sc.exe description %SERVICE_NAME% "SQL Export and Upload Service"
sc.exe start %SERVICE_NAME%
