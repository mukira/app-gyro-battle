# GyroBattle

Try it on http://liwe.github.io/app-gyro-battle

This app is a game made with Liwe, built in pure JavaScript.

If you're novice about Liwe, please have a look to the [basic app](https://github.com/liwe/app-pushthebutton) first

## Rules

The goal of the game is to move your connected smartphone to find the gyroscope position generated randomly by the app. After 5 score, you won the game. If you're two players, the first one who reach 5 score wins.

## Design

The app is splitted in different components:

### `GyroBattle`

Complete wrapper of the game. It take an option object as parameter (which contain the Liwe key) then handle everything else. It create the Liwe instance and manage the interaction between the different objects (: `player`, `promptr`, `player`).

### `Game`

Object representing a game. It take player(s) and promptr as parameter for the constructor then manage the interactions in between. Each instance is for single use only.

### `Player`

Object representing a player. It's a combinaison of a Remote object and a DOM. 

### `Promptr`

Object to display instructions and information to users.

## Sources

### QRCodeJS

[QRCodeJS](https://github.com/davidshimjs/qrcodejs) by [davidshimjs](https://github.com/davidshimjs)
