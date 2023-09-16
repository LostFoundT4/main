# CS203 Django Application


**Installation Steps for Local Virtual environment**
1) Ensure [Python](https://www.python.org/downloads/) has been installed on your local system before proceeding.

2) Ensure [pip3](https://cloudzy.com/blog/pip-upgrade/) has been installed on your local systsm before proceeding any further. 

3) Ensure [npm](https://kinsta.com/blog/how-to-install-node-js/)has been installed on your local systsm before proceeding any further. 

4) Create a new directory on your system so that it is easier to locate the files when developing the application.

5) Open a cmd/terminal on your local system and type the following command to create an isolated development environment on your system. Doing this step would create a directory named ".venv".
    ```bash
    python -m venv .venv
    ```

6) Next step would be to execute this command,
   For Windows:
     ```bash
     .venv\Scripts\activate.bat
      ```
    For Mac/Linux:
    ```bash
    source .venv/bin/activate
    ```
7) Before proceeding look for the (.venv) sign on your command line before proceeding.

8) Once the steps have been completed, type the following commands to install the needed dependencies on your system from the "requirements.txt". Once the installation is complete you can proceed to run the application
    ```bash
   pip install -r requirements.txt
    ```

9) Navigate into the `frontend` folder and run the command. This ensure frontend dependencies are installed.
  ```bash
  npm install
  ```

10) In a seperate commandline , in the same folder, run the command to update `bundle.js` which will run webpack with babel.
  ```bash
  npm run dev
  ```

**Database setup**
1) Type the following commands to activate the models and create the models tables in database (sqlite3).
  ```bash
  python manage.py migrate
  ```

**Running The Application**
1) Type the following commands to run the server as needed:
    "python manage.py runserver 8080".
    If all systems are running as intended you should see the following in your command line:
    <img width="1217" alt="image" src="https://github.com/LostFoundT4/main/assets/116057891/fce55caf-ba34-42d5-a56d-20beaf54f256">
2) Navigating to the website at 127.0.0.1:8080 and you should see the following:
    <img width="1047" alt="image" src="https://github.com/LostFoundT4/main/assets/116057891/d6f83cf2-9046-49f4-a8c2-fa75841ffebf">

**Temporary Notes (Frontend)**
1) If you run into an error relating to axios (edit-profile page does not render), try running
```npm install axios```
then
```npm run dev``` in a separate terminal to ensure that all necessary packages are installed.
2) If you run into an error relating to recharts (especially for the dashboard), try running 
```npm install recharts```
then
```npm run dev``` in a separate terminal.









     
