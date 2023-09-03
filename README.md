# CS203 Django Application

Installation Steps****
1) Ensure Python has been installed on your local system before proceeding.
2) Ensure pip3 has been installed on your local systsm before proceeding any further.
3) Create a new directory on your system so that it is easier to locate the files when developing the application.
4) Open a cmd/terminal on your local system and type the following command to create an isolated development environment on your system.
  "python -m venv [Any name will do, ie.: Application_Main]". Doing this step would create a directory named "Application_Main" in my case, but the name will differ.
5) Next step would be to execute this command
  "[Application_Main Or Whatever name you specified in the previous step]\Scripts\activate.bat" --  For Windows
  "source [Application_Main Or Whatever name you specified in the previous step]/bin/activate" -- For Mac/Linux
6) Before proceeding look for the (venv) sign on your command line before proceeding.
7) Once the steps have been completed, type the following commands to install the needed dependencies on your system from the "requirements.txt".
   "pip install -r requirements.txt". 
   Once the installation is complete you can proceed to run the application

**Running The Application**
1) Type the following commands to run the server as needed:
    "python manage.py runserver 8080".
    If all systems are running as intended you should see the following in your command line:
    <img width="1217" alt="image" src="https://github.com/LostFoundT4/main/assets/116057891/fce55caf-ba34-42d5-a56d-20beaf54f256">
2) Navigating to the website at 127.0.0.1:8080 and you should see the following:
    <img width="1047" alt="image" src="https://github.com/LostFoundT4/main/assets/116057891/d6f83cf2-9046-49f4-a8c2-fa75841ffebf">











     
