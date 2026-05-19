@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@setlocal

@set ERROR_CODE=0

@REM To isolate internal variables from possible wrapper scripts, use a predefined prefix.
@set PREFIX=MAVEN_WRAPPER

@REM ==== START VALIDATION ====
@if not "%JAVA_HOME%" == "" goto OkJHome

@echo.
@echo Error: JAVA_HOME not found in your environment. >&2
@echo Please set the JAVA_HOME variable in your environment to match the >&2
@echo location of your Java installation. >&2
@echo.
@goto error

:OkJHome
@if exist "%JAVA_HOME%\bin\java.exe" goto chkMHome

@echo.
@echo Error: JAVA_HOME is set to an invalid directory. >&2
@echo JAVA_HOME = "%JAVA_HOME%" >&2
@echo Please set the JAVA_HOME variable in your environment to match the >&2
@echo location of your Java installation. >&2
@echo.
@goto error

:chkMHome
@set "BASE_DIR=%~dp0"
@set "MAVEN_PROJECTBASEDIR=%BASE_DIR%"

@set "MAVEN_APP_BASE=%MAVEN_PROJECTBASEDIR%"

:findArgs
@if ""%1""=="""" goto runm
@set "MAVEN_ARGS=%MAVEN_ARGS% %1"
@shift
@goto findArgs

:runm
@set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

@REM Download the wrapper jar if it doesn't exist
@if exist "%WRAPPER_JAR%" goto runm_with_jar

@echo Downloading Maven Wrapper...
@set "DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
@powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%') }"
@if %ERRORLEVEL% neq 0 goto error

:runm_with_jar
@set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
"%JAVA_EXE%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %MAVEN_ARGS%

@if %ERRORLEVEL% neq 0 goto error
@goto end

:error
@set ERROR_CODE=1

:end
@exit /B %ERROR_CODE%
