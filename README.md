# Assignment 3 - The Book Corner: Online Book Shop (Shop Owner / Employee Site)

## A) Summary 
- The goal of this project is to create an online e-commerce shop which sells books
- Create a management system for the shop’s owner / employees to perform CRUD operations on books, customer orders and related data
- Deployed URL: https://tgc-dl-the-book-corner.herokuapp.com/


## B) UI / UX
- User Stories (Shop Owner / Employees)
    1. As a shop owner / manager / employee, I want to view the available books and their related information I have in the database so that I can prepare reports / advise customers etc.
    2. As a shop owner / manager, I want to add new books and their related information so that I can provide more books to customers / make more money.
    3. As a shop owner / manager, I want to update the information about books and their related information e.g. tags , so that I can correct mistakes / update cover art / ensure the most updated information is provided to customers
    4. As a shop owner / manager, I want to delete books and their related information so that I can remove unavailable books from the database.
    5. As a shop owner / manager / employee, I want to filter books by title and other criteria so that I can view / update / delete a specific book easily.
    6. As a shop owner, I want to create new users and limit the functions available to them based on the role I assign them so that more employees can access the website while still maintaining control.
    7. As shop owner, I want my employees to be able to log in / out of the site so that all information in the database can only be accessed by those with a valid username / password.

- ER diagram
    - ![Screenshot 2021-11-28 at 10 09 41 AM](https://user-images.githubusercontent.com/84578312/143726167-24a17d97-a9fb-46d8-b3e7-3b7ec3e5e848.png)

- User Roles Diagram
    - ![Screenshot 2021-11-27 at 5 32 53 PM](https://user-images.githubusercontent.com/84578312/143675920-c343dd91-bb5f-4c4a-be1c-881d9e7fd28e.png)

- Choice of colour and fonts
    - Sans Serif font as it is easy to read 
    - Dark Navbar against a white background makes the text based information easy for the user to absorb and stands out to the user
    - Table format used to organise information makes it easy to contain alot of information in a organized and compact space

## C) Use Cases / Feature List
|  <br>Use Case                                                                                                                                                        |  <br>Objective (from user’s POV)                                                                                                                                                                                                                                                                                                          |  <br>Steps                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  <br>Register as the owner (landing page if there are no users, there can only be 1 owner)<br>                                                                                    |  <br>Create an account to access the website                                                                                                                                                                                                                                                                                              |  <br>1. Fill up register form <br>2. Click Submit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|  <br>Logging In and Out (Landing page if there are users)                                                                                                   |  <br>Access information on books, customer orders etc.                                                                                                                                                                                                                                                                                    |  <br>1. Key in valid email and password<br>2. Click login button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|  <br>Performing CRUD on Books<br> <br>                                                                                                                               |  <br>Create Book<br>    <br>Update Book<br>  Delete Book /  Authors / Tags / Publisher / Genre  |  <br>1. Click on the add book button above the table<br>2. Fill up the inputs <br>3. Ensure no error message is shown<br>4. Click submit<br>5. A message should be flashed indicating the outcome<br>6. Repeat the previous steps for the other tabs to add a new row (except for orders)<br><br>1. Click the update button which is available within each row of the table<br>2. Fill up the inputs with the new info<br>3. Click Submit<br>4. A message should be flashed indicating the outcome<br><br>1. Click the delete button which is available within each row of the table<br>2. Click yes to confirm delete<br>3. A message should be flashed indicating the outcome<br>2b. Click no to cancel and go back to books tab<br>NOTE: <br> <br>1. An Author / Publisher / Genre cannot be deleted if there are existing books which have those authors / publisher / genre<br>2. A book cannot be deleted if it is in a customer’s shopping cart or if there have been purchases of the book made <br>  |
|  <br>Performing CRUD on Users<br> <br>(Only available for user with a Owner role)                                                                                    |  <br>Create User<br>  Update User<br>  Delete User                                                                            |  <br>1. Click create user button in the users tab<br>2. Fill up the inputs and make sure no error messages<br>3. Submit<br>4. A message should be flashed indicating the outcome<br><br>1. Click the update button which is available within each row of the table<br>2. Fill up the inputs with the new info<br>3. Click Submit<br>4. A message should be flashed indicating the outcome<br><br>1. Click the delete button which is available within each row of the table<br>2. Click yes to confirm delete<br>3. A message should be flashed indicating the outcome<br>2b. Click no to cancel and go back to users tab                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|  <br>Filtering Books by a set criteria                                                                                                                               |  <br>Search for a book by title / keyword<br><br><br>Filter books by price range <br><br><br>Filter books by published date                                                                                                                                             |  <br>1. Go to the books tab<br>2. Type in the title / keyword of the book e.g. Harry Potter<br><br>1. Type in a minimum price<br>2. Type in a maximum price<br><br> <br>1. Type in a date range in the 2 input boxes<br>2. E.g. 12/11/2021 to 20/11/2021                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|  <br>Viewing Authors, Genres, Publishers, Tags                                                                                                                       |  <br>To see all the related information that can be inputted into a book                                                                                                                                                                                                                                                                  |  <br>1. Click on the corresponding tab in the Nav Bar at the top of the page<br>2. When the user is viewing a tab, that tab will be a light blue colour                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|  <br>Adding Authors, Genres, Publishers, Tags                                                                                                                        |  <br>To create new input selection for books                                                                                                                                                                                                                                                                                              |  <br>1. Go to the respective tab.<br>2. Click on the add button.<br>3. Type in the name.<br>4. Click Submit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|  <br>Deleting Author, Genres, Publishers, Tags, Orders<br>NOTE: Author, Genre, Publisher cannot be deleted if there are existing books with that data  |  <br>To remove the associated input selection for books<br> <br>                                                                                                                                                                                                                                                                          |  <br>1. Click the delete button which is available within each row of the table<br>2. Click yes to confirm delete<br>3. A message should be flashed indicating the outcome<br>2b. Click no to cancel and go back to the previous page<br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|  <br>Updating own user account                                                                                                                                       |  <br>Change username, email and / or password                                                                                                                                                                                                                                                                                             |  <br>1. Click on my account tab on right hand side of the Nav Bar<br>2. Chick Update account details<br>3. Fill in new information<br>4. Click Submit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|  <br>Searching for an order using a set criteria                                                                                                                     |  <br>Find a specific order / Find a specific customer’s orders                                                                                                                                                                                                                                                                            |  <br>1. Go to the orders tab<br>2. In the filter search section, key in a order ID to find an order by that order ID<br>3. Key in a customer ID to find orders with that customer ID<br>4. Key in a customer username to find orders with that username<br>5. Key in a date range to see orders created within that date range<br>6. Click submit to see the results<br>7. Click on details on each row to see the corresponding order items                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|  <br>Updating Order Status                                                                                                                                           |  <br>Update order status to shipped, processing, completed                                                                                                                                                                                                                                                                                |  <br>1. Click to the orders tab<br>2. Click update button to update a specific order<br>3. Select a correct status from the dropdown<br>4. Click update                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|  <br>Deleting an order                                                                                                                                               |  <br>Delete completed orders                                                                                                                                                                                                                                                                                                              |  <br>1. Click on the orders tab<br>2. Click delete button to delete a specific order<br>3. Click yes to confirm delete<br>4. Click no to cancel and go back to orders tab                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## D) Testing
|  <br>Test Case  |  <br>Test Case Description                                                                                                                     |  <br>Test Steps                                                                                                                                                                                                                                                                                                                                                                        |  <br>Expected Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  <br>1.         |  <br>Test that owner can create an account and log In                                                                                          |  <br>1. Fill up register form and submit<br> <br>1. Fill up login form and submit<br> <br>                                                                                                                                                                                                                                                                                    |  <br>1. User is directed to login page<br> <br>2. User is logged in and directed the books tab.<br> <br>2. An alert notifies the user he/she is logged in                                                                                                                                                                                                                                                                                                                                                                                                                             |
|  <br>2.         |  <br>Test that the shop owner can create users, update and delete other users<br> <br>NOTE: other user roles cannot do this<br> <br>  |  <br>1. Go to user tab click add user button.<br> <br>2. Fill up the form and submit                                                                                                                                                                                                                                                                                          |  <br>1. Owner is directed to create user form<br> <br>2. Owner is notified that a new user has been created<br> <br>3. The new user can then login and access the functions that are available to his/her role given                                                                                                                                                                                                                                                                                                                                                                  |
|  <br>3.         |  <br>Test that employees can only view data but do not have access to create, update and delete functions                                      |  <br>1. User with role of an employee logs in, goes to the user tab and click add user button<br> <br>2. Employee clicks on update user and delete user button                                                                                                                                                                                                                |  <br>1. The employee is not directed to the create user form, and is notified that he cannot access that function<br> <br>2. Employee is notified that he cannot access that function each time                                                                                                                                                                                                                                                                                                                                                                                                |
|  <br>4.         |  <br>Test that managers and owners can do create, update and delete operations on all data (except for users which is only for owner)          |  <br>1. Manager logs in and goes to books tab, clicks on add book button<br> <br>2. Manager submits the form<br> <br>3. Manager clicks on the update button <br> <br>4. Manager clicks on the delete button<br> <br>5. Repeat for the other data<br> <br>NOTE: some tabs do not have update function  |  <br>1. Manager is directed to create book form<br> <br>2. Manager is directed back to the previous tab and is notified that a new book has been added. The new book can be seen in the table<br> <br>3. Manager is directed to update book form and submits. He/she is directed to the previous tab and notified that the book has been updated. The update book information can been seen.<br> <br>4. Manager is directed to the confirm delete page and clicks yes.He/she is directed to the previous tab and notified that the book has been deleted.<br> <br>  |
|  <br>5.         |  <br>Test that all users can perform filter and search function on books data                                                                  |  <br>1. Go to the books tab. Type in a book title in the search filter and click submit<br> <br>2. Repeat for the rest of the criteria<br> <br>                                                                                                                                                                                                                               |  <br>1. Only the book with that title should be visible<br> <br>2. Only books with matching the criteria specified will be visible                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|  <br>6.         |  <br>Test that all users can perform filter and search function on orders data                                                                 |  <br>1. Go to the orders tab. Type in a customer username in the search filter and click submit<br> <br>2. Repeat for the rest of the criteria                                                                                                                                                                                                                                |  <br>1. Only order made by that customer should be visible<br> <br>2. Only order with matching the criteria specified will be visible                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|  <br>7.         |  <br>Test that all routes are protected except for login page                                                                                  |  <br>1. User tries to access  https://dashboard.heroku.com/apps/tgc-dl-the-book-corner/books when they are not logged in                                                                                                                                                                                                                                                               |  <br>1. User is directed back to the login page and is notifies that he cannot access that page without logging in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
## E) Technologies Used & Resources
- Express (https://expressjs.com/)
- Db-migrate (https://db-migrate.readthedocs.io/en/latest/API/SQL/)
- Bookshelf.js (https://bookshelfjs.org/)
- Caolan Form (https://github.com/caolan/forms)
- Express Handlebars (https://www.npmjs.com/package/express-handlebars)
- Stripe (https://stripe.com/en-gb-sg)
- Bootstrap 5 (https://getbootstrap.com/docs/5.0/getting-started/introduction/)

Resources:
- Navbar active styling
    - https://stackoverflow.com/questions/50875677/using-express-handlebars-how-can-i-set-an-item-to-active-from-my-navigation-bar
- Markdown Table Generator
    - https://www.tablesgenerator.com/markdown_tables

