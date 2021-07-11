# 👥 Meet-Up
#### Meet-Up is a "Microsoft Teams Clone" Web Application built under Microsoft Engage Mentorship Program 2021.

## Features of "Meet-Up"
- Video conferencing with no limit on the number of participants
- **Create Rooms** by generating random Room Code & **Copy Room Code** for sharing with people
- **Join a Room** by entering the Room Code
- **Audio Toggle** - Mute / Unmute Mic 🎤
- **Video Toggle** - Hide / Unhide Video 📷
- **Text Chat** with all participants ( messages sent are all saved and the conversation can be continued anytime ✌️ )
- **Download Chat** 📥 ( All chat messages along with sender’s name & date-time can be downloaded in .TXT file with just one click )
- Joining / Leaving of participants is **notified** in the Chat by "Bot" 🤖
- **Screen Sharing** - Share your screen / chrome tab / window with all the participants 💻
- **Video Stream ( with audio ) Recording** - automatic download to system upon stopping recording 📹
- **Entire Screen Recording** - automatic download to system upon stopping recording ⏺️
- **Raise Hand** ✋ ( Notifies all the participants with a beep along with the hand visible in your video stream )
- **Whiteboard** - A collaborative whiteboard which can be erased, entirely cleared and even downloaded as an image ✏️ 
- **Mute Incoming Audios** 🎧 ( All other participants' audio will be muted for you but not for others )
- **Hide Incoming Videos** ❌ ( All other participants' video will be hidden for you but not for others )
- **Send Reactions** ( Notifies all the participants with a beep and Your reaction ( ❤️, 👍 , 👏 ) is visible to all the participants for few seconds and then disappears )
- **Download Attendees Activity** 📥 ( Information about which participant joined the current conference at what time and left at what time can be downloaded as a .txt file )
- Completely **responsive** for mobile devices ✔️

## Deployment 
🚀 Here's the link of the web application ( deployed on heroku ) 🚀
- https://meetsmadeeasy.herokuapp.com/

## Video Demonstration 
🚀 Here's the link to the video demonstration of Meet-Up 🚀

# Approach Towards Building the Project
### Development Methodology - Scrum Methodology
**Agile Scrum Methodology** is basically incremental development i.e. we build the product in iterations, step by step.
We work in “Sprints” where each sprint lasts for a week or two, and focus on building the important features first and 
then improve the product to make it more potential.

### Here are the sprints I had set for myself for the 4 week journey 😄

#### INITIAL DAYS ( WEEK 0 )
1. Learning more about Backend Development
2. Researching about how video conferencing apps work ; what technologies / APIs / SDKs are used
3. Deciding the Tech Stack and finding suitable resources
4. Designing my product (using [Canva](https://www.canva.com/) )

#### WEEK 1
1. Setting up the server and adding the functionality to access the webcam and microphone to stream my own video
2. Connecting other clients to have a simple video call ( MINIMUM REQUIRED FUNCTIONALITY )
3. Adding Video/Audio Toggle Buttons
4. Designing Landing Page
5. Learning about how random Room IDs can be generated

#### WEEK 2
1. Adding Create Room / Copy Room code / Leave Room Functionality
2. Setting a custom Room Name corresponding to Room Code every time a new Room is created **( not implemented as of now, But sure of doing it in near future )**
3. Adding Ability to set username before entering a room
4. Styling the room page according to the design planned
5. Adding Chat Feature - send and view messages along with the sender’s name and the time at which message is sent.
6. Adding EmojiPicker in Chat **( not implemented as of now, But sure of doing it in near future )**

#### WEEK 3
1. Adding features which are included in almost all video conferencing apps – Screen Sharing, 'Screen / Video Stream' Recording
2. Adding Hand Raise Feature
3. Adding Whiteboard Feature ( A really useful feature which can be used to clear friends’ doubts or simply play scribble )
4. Taking inspiration from Microsoft Teams – Adding ability to send reactions, Mute incoming videos / audios
5. Making the product mobile responsive and improving UI/UX

#### WEEK 4
1. Adding easy yet useful features – Saving whiteboard as an image / downloading chat messages / downloading attendees activity
2. Attaching database ( [MongoDB Atlas](https://www.mongodb.com/) ) to persist messages in order to continue conversation anytime later ( TRYING TO IMPLEMENT SURPRISE FEATURE )
3. Adding user authentication ➡️ displaying the list of Rooms a user is part of on the Landing page itself
**( not implemented as of now, But sure of doing it in near future )**
4. Deploying the application on Heroku – Main motive being, taking inputs from family members, friends and mentors - What improvements can be made
5. Improving UI/UX on the basis of reviews from family members, friends and mentors.
6. Working on making Video Demo & updating README.md

## Scope Of Improvement
- *Screen Sharing can be improved to be visible on full screen*
- *Share Room link / Room Code directly from the app*
- ***"Download Attendees Activity"** downloads only the activities prior to you joining, can be further extended to downloading the activities since the beginning of meeting*

## Libraries and Dependencies
The project “Meet-Up” is built in HTML, CSS, Javascript & NodeJS using webRTC
- [socket.io](https://www.npmjs.com/package/socket.io)
-	[moment-timezone](https://www.npmjs.com/package/moment-timezone)
- [nodemon](https://www.npmjs.com/package/nodemon)
-	[express](https://www.npmjs.com/package/express)
-	[dotenv](https://www.npmjs.com/package/dotenv)
-	[mongoose](https://www.npmjs.com/package/mongoose)

## How to Run this Project Locally
- Clone the given repository
```bash
$ git clone https://github.com/Shivanjali-12/Meet-Up.git
```
- Run the command npm install in your terminal in the root directory of the project to install the various dependencies
```bash
npm install
```
- You'll have to setup your mongoDB database for the project. For that create an account on [MongoDB Atlas](https://www.mongodb.com/). 
  Remember your credentials like **Username** & **Password**.
- Create a database. Remember the name of your **Database**.
- Create a .env file in the root directory of the project using the touch command.
```bash
touch .env
```
- Add the following code in the .env file
```bash
ADMIN = <YOUR USERNAME>
PASSWORD = <YOUR PASSWORD>
DBNAME = <NAME OF YOUR DATABASE>
```
- Use the commant node server.js to run the app locally.
```bash
node server.js
```

## Next plans for "Meet-Up"
#### Try to refine the features from ***"Improvement"*** point of view and work on implementing the features planned earlier ( listed below )
- Adding EmojiPicker in chat
- Feature for Setting a custom Room Name corresponding to Room Code every time a new Room is created
- Adding user authentication ➡️ displaying the list of Rooms a user is part of on the Landing page itself