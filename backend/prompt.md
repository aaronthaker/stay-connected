I am developing a MEAN stack app with Ionic, it is an app that allows visually impaired people to meet each other. Below is the tree structure of my project's src folder and the backend.

backend:
¦   app.js
¦   socket.js
¦   
+---controllers
¦       messages.controller.js
¦       
+---images
+---middleware
¦       check-auth.js
¦       
+---models
¦       event.js
¦       message.js
¦       user.js
¦       
+---routes
        events.js
        messages.js
        user.js
        users.js
        

¦   global.scss
¦   index.html
¦   main.ts
¦   polyfills.ts
¦   test.ts
¦   tree.txt
¦   zone-flags.ts
¦   
+---app
¦   ¦   app-routing.module.ts
¦   ¦   app.component.html
¦   ¦   app.component.scss
¦   ¦   app.component.ts
¦   ¦   app.module.ts
¦   ¦   
¦   +---auth
¦   ¦   ¦   auth-data.model.ts
¦   ¦   ¦   auth-interceptor.ts
¦   ¦   ¦   auth.guard.ts
¦   ¦   ¦   auth.service.ts
¦   ¦   ¦   
¦   ¦   +---login
¦   ¦   ¦       login.component.html
¦   ¦   ¦       login.component.scss
¦   ¦   ¦       login.component.ts
¦   ¦   ¦       
¦   ¦   +---signup
¦   ¦           signup.component.html
¦   ¦           signup.component.scss
¦   ¦           signup.component.ts
¦   ¦           
¦   +---events
¦   ¦   ¦   event.model.ts
¦   ¦   ¦   events.service.ts
¦   ¦   ¦   
¦   ¦   +---create-event
¦   ¦   ¦       create-event.component.html
¦   ¦   ¦       create-event.component.scss
¦   ¦   ¦       create-event.component.ts
¦   ¦   ¦       
¦   ¦   +---events-list
¦   ¦           events-list.component.html
¦   ¦           events-list.component.scss
¦   ¦           events-list.component.ts
¦   ¦           
¦   +---home
¦   ¦   ¦   home.component.html
¦   ¦   ¦   home.component.scss
¦   ¦   ¦   home.component.ts
¦   ¦   ¦   
¦   ¦   +---user-details
¦   ¦           user-details.component.html
¦   ¦           user-details.component.scss
¦   ¦           user-details.component.ts
¦   ¦           
¦   +---messages
¦   ¦   ¦   message.model.ts
¦   ¦   ¦   messages.component.html
¦   ¦   ¦   messages.component.scss
¦   ¦   ¦   messages.component.ts
¦   ¦   ¦   messages.service.ts
¦   ¦   ¦   
¦   ¦   +---conversation
¦   ¦           conversation.component.html
¦   ¦           conversation.component.scss
¦   ¦           conversation.component.ts
¦   ¦           conversation.module.ts
¦   ¦           
¦   +---profile
¦   ¦       profile.component.html
¦   ¦       profile.component.scss
¦   ¦       profile.component.ts
¦   ¦       
¦   +---users
¦           user.model.ts
¦           users.service.ts
¦           
+---assets
¦   ¦   image.png
¦   ¦   shapes.svg
¦   ¦   
¦   +---faces
¦   ¦       face1.jpg
¦   ¦       face2.jpg
¦   ¦       face3.jpg
¦   ¦       
¦   +---icon
¦           favicon.png
¦           
+---environments
¦       environment.prod.ts
¦       environment.ts
¦       
+---theme
        variables.scss


How do I add a feature to the profile component that allows a user to upload a profile picture? Which files do I need to edit?
