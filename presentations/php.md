# A Blogging System

You will learn to design and develop a personal blogging system from scratch, using PHP/MySQL. In the process, you will learn about clean code architecture and design patterns.

## Building the Entry Manager

- At this point, you know enough to start building your personal blogging system.
- We wille be developing and improving a personal blog.
- Deze les: build the backbone of your blogging application: the blog entry manager.

The pieces you’ll build include the following:
• A view, which is an HTML form to accept entry input
• A controller, to handle input from the form
• A model, to save and retrieve the entry in the database By the end of this chapter, you will have a basic entry manager for your personal blog system. In the process of building the entry manager, you will get to revisit previously covered topics, such as basic database design, SQL, organizing your PHP with MVC, and connecting to a database.

### Creating the blog_entry Database Table

One of the most important steps with any new application is the planning of the tables that will hold data. This has a huge impact on the ease of scaling the application later. Scaling is the expansion of an application to handle more information and/or users, and it can be a tremendous pain, if you don’t look ahead when starting a new project. At first, your blog needs to store several types of entry information to function, including the following:

- entry_id: A unique number identifying the entry. This will be a positive integer, and it makes sense for this number to increment automatically, because that ensures the number is unique. Because each entry has a unique entry_id, you can use the number to identify one entry. The entry_id will be the primary key for the table.
- title: An alphanumeric string that should be relatively short. You’ll limit the string to 150 characters.
- entry_text: An alphanumeric string of indeterminate length. You won’t limit the length of this field (within reason).
- date_created: The timestamp generated automatically at the original creation date of the entry. You’ll use this to sort your entries chronologically, as well as for letting your users know when an entry was posted originally.

```
CREATE DATABASE mijn_blog CHARSET utf8
```

```
CREATE TABLE blog_entry (
  entry_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR( 150 ),
  entry_text TEXT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ( entry_id )
)
```

### Planning the PHP Scripts

You have created a database for your blog. A logical next step would be to create a blog entry editor with PHP, so that you can create new blog entries. The blog entry editor is only meant for you as blog author. Ordinary site visitors should not be able to create new entries. Normal site visitors should simply see your blog entries, without being able to edit existing entries or create new ones.

One approach to such a task is to create two main site entrances: index.php for regular visitors and admin.php for your eyes only. In MVC terminology, index.php and admin.php will both be front controllers. Later in this book, I show you how to restrict access to admin.php, with a login.

The admin page should be able to list all blog entries, and it should give you access to an entry editor, so that you can create new entries and edit or delete existing entries. You will require separate views: one for listing all entries and one for showing the editor.

The script admin.php should output an HTML5 page. It will be your front controller, and it will decide whether to show the editor or list all entries. Figure 7-1 uses the MVC idea to develop a schematic overview of the blog administration module.

Note how every view has a corresponding controller. Note, too, that the entry model is used by entries to display all entries and reused by the editor to save a new entry. Let’s just go over the separation of concerns proposed by the MVC approach (see Figure 7-2). A view is something that can be seen by users. A model holds content. The controller is responsible for hooking up the right view with the right model and returning the resulting output to users. The controller is also responsible for responding to user input; often this means updating the model.

### Creating the Blog Site => folder blog

### Creating the Entry Manager Navigation => folder blog-v2

### Loading Admin Module Controllers

### Creating the Entry Input Form => folder blog-v3

### Styling the Editor

### Connecting to the Database

### Using Design Patterns

### The Table Data Gateway Design Pattern

Your code will have to communicate extensively with database tables. There are a number of approaches to managing such communication consistently. One approach is to implement a table data gateway design pattern.

The table data gateway design pattern is not the most commonly seen approach to dealing with database access in larger MVC frameworks. Many popular PHP MVC frameworks use an active record pattern. I propose that you use a table data gateway, because it is a relatively simple design pattern to understand. The table data gateway pattern specifies that you create one (PHP) class for every one table in your database. The idea is that all communication between your system and that one table happens through one such object. The table data gateway encapsulates data communication between your system and the specific database table.

That means that all SQL statements needed for this communication will be declared in the table data gateway class definition. This has a couple of advantages: One is that you know where to write your SQL statements. Consequently, you also know where to find your SQL statements related to the particular database table.

Database design and development is a profession in and of itself. If you as a PHP developer keep all your SQL encapsulated in relatively few class definitions, then any database expert on your team would only have to work with these few classes. That is a huge advantage over having your SQL statements scattered all through your code base.

### Writing the Entry_Table Class

The Blog_Entry_Table will not do anything until it is used from another script. I’d like to take a look at this code before using it. As you can see, the Blog_Entry_Table has one property db and two methods: the constructor and saveEntry(). This constructor takes a PDO object as argument. The received PDO object will be stored in the db property. This way, all methods of Blog_Entry_Table will have access to the PDO object and, through that, access to the simple_blog database.

In object-oriented terminology, Blog_Entry_Table and PDO are now associated through a has-a relationship. The Blog_Entry_Table has-a PDO object.

At this early stage of development, you’ll only be saving new entries. So, the Blog_Entry_Table class has just one method besides the constructor. The saveEntry() method takes two arguments: the title and the blog_entry to save in the database.

The variable $entrySQL holds an SQL string to insert a new blog_entry using the received title and blog_entry. The $entryStatement is a PDOStatement object, which you can then try() to execute() to actually insert a new blog_entry.

If this operation fails, it will throw an Exception object, which your code catches. In case an exception occurs, your code will trigger an error showing the SQL string that caused the exception and a more detailed look at the exception.

### Processing Form Input and Saving the Entry

### Which Button Was Clicked?

See how the two different buttons have the same name attribute. The only difference between buttons are their value attributes. You can use that knowledge to identify which button was clicked. Actually, you already did it in controllers/admin/editor.php:
```
$buttonClicked = $_POST['action'];
```

### Security Alert: SQL Injection Attacks

But it’s also a gaping security hole. SQL injection attacks are possibly the single most common attack on database-driven web applications. Your entry editor is wide open for such attacks now.
learn more about SQl injections at http://en.wikipedia.org/wiki/SQL_injection.

```
$entrySQL = "INSERT INTO blog_entry ( title, entry_text ) VALUES ( '$title', '$entry' )";
```

```
attack'); DROP TABLE blog_entry;--
```
wordt dan:
```
$entrySQL = "INSERT INTO blog_entry ( title, entry_text ) VALUES ( '$title', ' attack'); DROP TABLE blog_entry;--' )";
```

### Usability Alert: Blog Entries with Quote Characters

Brennan's child said: "I want some breakfast!"

PDO throws an exception. The culprit is the single-quote character:

//the code that makes your form submission break $entrySQL = "INSERT INTO blog_entry ( title, entry_text ) VALUES ( '$title', '$entry' )";

### Solution: Prepared Statements

It should be evident that the code where the SQL string is generated dynamically gives you a lot of grief. It leaves you vulnerable to SQL injection attacks, and because of it, your blog entries must be written without single- or double-quote characters. Graciously, PDO supports a feature that will fix both problems at once. PDO supports prepared statements.
Note

here’s a good tutorial for further information about pdO and prepared statements:
http://net.tutsplus.com/tutorials/php/why-you-should-be-using-phps-pdo-for-database-access.

A prepared statement is an SQL statement prepared for dynamic content. Instead of dropping your PHP variables directly in the SQL statement, you can declare placeholders in the SQL and subsequently replace those placeholders with actual values. If you use PDO prepared statements, you will be safe from SQL injection attacks and from any trouble with special characters such as single and double quotes. Here’s how to do it in models/Blog_Entry_Table.class.php:

There are three equally important changes, as follows:
1. characters are used as placeholders in the SQL string.
2. An array is created with the dynamic data. The order of items must match the order used in the SQL string.
3. Pass the array with dynamic data as an argument to the execute() method.

## Showing Blog Entries => folder blog-v5

In this chapter, you will learn how to display all blog entries on your index.php page. In the process, you will revisit much of what you have seen or learned so far. I will also introduce the following new topics:
• Making a new front controller
• Updating your table data gateway: adding a method to your Blog_Entry_Table class
• Iterating through a data set from a database table
• Creating a model, view, and controller for showing blog entries

### Creating a Public Blog Front Page

### Creating a Blog Controller

### Getting Data for All Blog Entries => folder blog-v6

### Using an SQL SUBSTRING Clause

### Using an SQL Alias

### Preparing a View for All Blog Entries => folder blog-v7

### Hooking Up View and Model

### Responding to User Requests => folder blog-v8

### Getting Entry Data => folder blog-v9

### Creating a Blog View

### Displaying an Entry

### Code Smell: Duplicate Code
