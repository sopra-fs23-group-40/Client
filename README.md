# SoPra FS23 Group 40 - TacBlock

## Introduction
### Motivation
Our idea was to create a game that would be fun to play, which keeps us motivated for the whole semester.
We decided to create "TacBlock", which is similar as the original game ["Blokus" from Bernard Tavitian](https://de.wikipedia.org/wiki/Blokus), but as a nice online game version.

### Game Mechanism
The game is played by 4 players, who have to place their blocks on the board. The goal is to place as many blocks as possible. The game ends when no player can place any more blocks on the board. The winner is the player with the most blocks on the board.
You can find a "Rules" section in the game, which explains the game in more detail.

## Technologies
- We use **JavaScript** as the main programming Language for the Client.
- With **REST**, the Client can interact with the Server.
- We use **React** as the main framework for the Client.
- With **SCSS**, we do the styling.
- The Client is built with **npm**.
- Both Client and Server are deployed on **Google Cloud** and the code is stored **GitHub**.
- **SonarCloud** checks our code every time we push to GitHub and deploy it.

_For the Server's technologies, please refer to the Client's README.md._

## High-level components
- [Game](https://github.com/sopra-fs23-group-40/Client/blob/8f227414681f2075cfc79b761a732c516880c0fc/src/components/views/Game.js) for the whole game View and its logic which allows users to actually play the game
- [Lobby](https://github.com/sopra-fs23-group-40/Client/blob/8f227414681f2075cfc79b761a732c516880c0fc/src/components/views/Lobby.js) for the lobby logic View which allows users to create and join lobbies
- [Overview](https://github.com/sopra-fs23-group-40/Client/blob/8f227414681f2075cfc79b761a732c516880c0fc/src/components/views/Overview.js) is the view which lists all open lobbies and lets users create new ones
- [AppRouter](https://github.com/sopra-fs23-group-40/Client/blob/8f227414681f2075cfc79b761a732c516880c0fc/src/components/routing/routers/AppRouter.js) is the main router which handles all the routing in the application

## Launch & Deployment
### How to run the application
1. Clone the repository and navigate in the terminal to its location
2. With the command `npm install`, you install all dependencies.
3. Using `npm run dev`, you start and run the application.
4. The application is now running on localhost:3000.
5. To run only the tests, use the command `npm run test`.

### How to deploy the application
1. To deploy the application, push it to the main branch of the GitHub repository.
2. The application will be automatically deployed on Google Cloud and checked by SonarCloud.
3. The Client is now deployed on http://sopra-fs23-group-40-client.oa.r.appspot.com.<br>
   _(the Server will be deployed on http://sopra-fs23-group-40-server.oa.r.appspot.com)_

_Please note that Google Cloud checks are very strict.
It is possible that the deployment fails for example because of unused import statements,
so make sure to chat that beforehand._

## Illustrations
### 1. Login & Registration

#### Login
<img width="1728" alt="Login" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/4d457d4b-3cf7-4e17-80b5-2f09a889d34c">

#### Registration
<img width="1728" alt="Register" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/eac08458-2f40-4810-a612-e8586ea8c410">

### 2. Rules
<img width="1728" alt="Rules" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/15633c0d-8936-4a34-a117-0d196556fc02">

### 3. Finding & Creating a Lobby

#### Lobby Overview
<img width="1728" alt="LobbyOverview" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/c018d2ab-5742-4358-818c-f94d5cfdcc25">

#### Lobby
<img width="1728" alt="Lobby" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/8b55561b-6eea-4e35-bd1c-bcf1e2f66216">

### 4. Playing the game

#### Welcome Information
<img width="1728" alt="WelcomeInfo" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/c36b14b4-2069-4653-9da2-d112061c2fc1">

#### Empty Board
<img width="1728" alt="EmptyBoard" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/7a060b04-5f12-49be-ac51-ef8886b3e5eb">

#### No moves possible
<img width="1728" alt="NoMovesPossible" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/b501b536-b6bf-423b-a056-f7586d51d4bf">

#### Resigning from placing blocks
<img width="1728" alt="Resign" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/f0231519-0818-4999-8dad-a776f39e3d3c">

#### Leaving the game
<img width="1728" alt="Leaving" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/7943e1ce-006c-49c7-8191-a7c8e6e87cf1">

### 5. Game over screen
<img width="1728" alt="GameOver" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/e2af8eef-51e0-4d17-809a-9366d39dacab">

### 6. Statistics
<img width="1728" alt="Statistics" src="https://github.com/sopra-fs23-group-40/Client/assets/10245334/e9c973d4-7d8d-4ef9-8a3c-c2a5c5be19b0">

## Roadmap
### Possible features for the future:
- a game version with less than 4 Players (or more).
- the players can see the other players' moves in real-time
- a rating / ELO system
- a chat in the lobby or game
- a game history in the statistics
- the possibility to play against a computer/AI
- the functionality to see another player's profile/statistics

## Authors

### Authors
- [thomi100](https://github.com/thomi100)
- [Karo2222](https://github.com/Karo2222)
- [turbodumba](https://github.com/turbodumba)
- [PaulPerpetual](https://github.com/PaulPerpetual)
- [jverho](https://github.com/jverho)
- Group's Coach / Teaching Assistant [luis-tm](https://github.com/luis-tm)

_no acknowledgements_

## License
MIT License

Copyright © (2023) (thomi100, Karo2222, turbodumba, PaulPerpetual, jverho)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
