# serviceapp_api

## Instructions how to start
​
create `.env` file like the example `.env.sample`
​
start with `npm run start-dev`
​
## Description
​
It's an API that serves data  and allows the React Application to manage database. Furthermore,  it allows admin users to manage data as a Root User.
​
## Motivation
​
Connect the community of neighbours by helping each other with his knowledge.
​

​
## Backlog
​
List of other features outside of the MVPs scope
​
Backoffice: allow the root users to manage the information from a backend administrator.
​
## ROUTES:
​
### Endpoints Auth
​
​
| Method | Path      				| description      | Body                     |
| :----: | -----------------| -----------------| ------------------------ |
|  GET   | `/whoami` 				| who am i         |                          |
|  POST  | `/signup` 				| signup a user    | `{ username, password }` |
|  POST  | `/login`  				| login a user     | `{ username, password }` |
|  GET   | `/logout` 				| logout session   |                          |
|	 GET	 | `/home` 					| home        | 				                  |
|  GET   | `/search` 				| search page      | 	`{filters }`            |
|  GET   | `/ad/:id` 				| ad details       |          		        		|
|  POST   | `/ad/:id` 				| create ad       |      {adData}    		        		|
|  PUT   | `/ad/:id` 				| edit ad       |      {adData}    		        		|
|  DELETE   | `/ad/:id` 				| delete ad       |        		        		|
|  GET   | `/chats`  				| chat list        |          		            |	
|  GET   | `/chat/:id`			| chat page        |          		            |   
|  POST   | `/chat/:id`			| create chat        |          		            |   
|  PUT   | `/chat/:id`			| edit chat        |    {chatData}      		            |
|  GET   | `/appointment/:id`			| appointment details       |          		            |
|  POST   | `/appointment`			| create appointment       |          		            |
|  PUT   | `/appointment/:id`			| edit appointment       |          		            |
|  POST   | `/review/:chatId`			| add review      |          		            | 
|  POST   | `/mediation/:chatId`			| create mediation     |          		            |   
|  GET   | `/profile/:id`		| users profile    |  				   					    |
|  GET   | `/profile/edit` 	| edit user profile|                          |
|  PUT   | `/profile/edit`  | edit user profile| {userData}               |
|  PUT   | `/ad/:id/edit`   | edit ad   			 | {adData}                 |
|  PUT   | `/ad/:id/edit`   | edit ad          | {adData}                 |
|  GET   | `/rewards`       | rewards    	 |  				                |
​
### Endpoints Backoffice 
*All theese routes has /admin before route
​
| Method | Path      				| description        | Body                     |
| :----: | -----------------| -------------------| ------------------------ |
|  GET   | `/users`       	| list all users page|  											  |
|  GET   | `/user/:id`      | list user details  |    											|
|  GET   | `/user/:id/edit` | edit user details  | 													|
|  POST  | `/user/:id/edit` | edit user details  | {userData}   						|
|  GET   | `/ad/:id`        | list ad details    |                          |
|  GET   | `/ad/:id/edit`   | edit ad details    | 		                      |
|  POST  | `/ad/:id/edit`   | edit ad details    | {adData}                 |
|  POST  | `/ad/:id/delete` | deletes ad   			 |                          |
|  GET   | `/mediations`    | list all active mediations|                   |
|  GET   | `/mediation/:id` | shows mediation  |                            | 
|  POST  | `/mediation/:id/resolve`| resolve a mediation  | {mediationData} |
​
​
## Models
​
User model
​
```javascript
{
	username: String,
	password: String,
	name: String,
	role: Array,
	profile_image: String,
	description: String,
	level: Number,
	address: String,
	wallet: {
		tokens: Number,
	}
	review: {
		content: String,
		rating: Number (1-5),
		userid: ObjectId<User>,
	}
}
```
​
Ad model
​
```javascript
{
	owner: ObjectId<User>,
	name: String,
	description: String,
	coords: { 
		lat: Number,
		lng: Number,
	}
	price: Number,
	tags: Array,
	category: Array,
	image: String,
	deletedad: DateTime,

}
```

Appointment Model
{
	date: DateTime
	saler: ObjectId<User>
	buyer: ObjectId<User>
	status: String
	} 

​
Exchange model
​
```javascript
{
	seller: ObjectId<User>,
	buyer: ObjectId<User>,
	totalPrice: Number,
	timestamps : {}
}
```
​
Chat model
​
```javascript
{
	adid: ObjectId<Ad>,
	saler: ObjectId<User>,
	buyer: ObjectId<User>,
	pendingtokens: Number,
	description: String,
	Appointment: {
		type: Boolean,
		default: false, 
	}
}
```
​
Message model
​
```javascript
{
	chatid: ObjectId<Chat>,
	senderid: ObjectId<User>,
	content: String,
	type: String,
	isReaded: {
		type: Boolean,
		default: false, 
	}
}
```
​
SupportRequest model
​
```javascript
{
	saler: ObjectId<User>,
	buyer: ObjectId<User>,
}
```
​
## Links
​
### Trello
​
[Trello Link](https://trello.com/b/ELsOwVbZ/service-app)
​
​
### Git
​
The url to your repository and to your deployed project
​
[Repository Link](http://github.com/)
​
[Deploy Link](http://heroku.com/)
​
### Slides
​
[Slides Link](https://docs.google.com/presentation/d/1lnLebQ2o0SofNHN8B77YxNNC8vylQxxiyYbOebgMRSk/edit?usp=sharing)
