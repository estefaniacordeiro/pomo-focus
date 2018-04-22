# Pomo Timer
This is Qianchen He’s final project for class INFO6250 Web Development Tools & Methods. 

The basic idea of this app is using [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique) to boost our studying or working efficiency.

I have deployed the app on Heroku.com. Please try the demo here: [Pomo Timer](https://ptimer.herokuapp.com/)

At the moment, the app has only been developed and tested in Chrome. So plese run the app in Chrome.

Please sign in the demo account to see the demo data. email: demo@demo.com,  password: sdfjkl

## Features
1. Sign up & Sign in

    This feature is yet very simple. You can sign up or sign in using the links on the left of the banner or hovering your cursor on the profile icon, then you could also see the links.

    Use email as account name and any password would be fine.  At the sign up, I have only set up the validations to check the email format, whether existed already,  and the passwords user input two time must match. At the sign in, email and password user input would match the data in database.

    In the future,  will force users to set up stronger password, send verification email to users for signing up. And set up oAuth for quick sign up and sign in.

2. Timer

    Timer would count down the time and display the time left. When timer is not running, it will show a play button when user hovers cursor on it. It will show a stop button instead if the timer is running. There is no pause button like some other similar app. Only one stop button meaning interrupt. When you come back, you should restart the whole focus session.

    When timer finished on focus session, it will record the task and how long user has focused in the stats automatically.

    When timer ends, the browser will play a sound and pop out a notification.

3. To do tasks

    It’s a very simple implementation on to-do tasks. The purpose is to record the time that user has spent on each task. So the user could have an idea about how the time have been distributed for the day. This could help the user to make daily summary about his/her performance.

    User could quickly input new task and select tasks in the box above the timer.

    Accessing the tasks management page through the button on the topright corner, user could see the overall tasks list, re-edit task name, check the total hours have been spent on each task.

4. Settings

    User could customize the time of each session.
    
    Auto starts break means after each focus, break will start automatically.

5. Statistics

    Stats has two type of charts.
    
    The first one is the daily time distributing bar charts. In this chart, user could check the task, and when and how long he/she is doing it.

    The second chart is about the total time the user has spent on each task.

    Please check the demo stats from date 04-19-2018 to 04-21-2018.

## Meet some specifical requirements
- On the task management page, when tasks exceeds the height of the frame, infinite scrolling will be implemented. 
- Settings is implemented using modal window.
- Using spinning to indicate waiting for asynchronous activities.
- Using query string parameter in change the input of date in stats page.
- Used 1 HTTP call generated from a direct `fetch()` call in file `agent.js`.
- Using whitelisting input in settings window