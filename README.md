# Master-Code

Application to showcase concepts and ideas for event-based data processing.
Incorporates concepts of NodeRED and ApacheNiFi and focuses on user-interaction and user-feedback to improve the understanding of the data flow.

 
![example](docs/img/S7frblKawa.gif)

![context-menu](docs/img/chrome_E71RDSP2mw.png)




## Backend
Data processing backend written in JavaScript/TypeScript executed by NodeJS.
## Frontend
Written in VueJS.
Node-Editor based on [BaklavaJS](https://github.com/newcat/baklavajs).


# Deployment

The application is fully dockerized and ca be started with ```docker-compose up```.
The frontend and the backend are built. Redis and MongoDB are pulled from DockerHub.
