# Users API

A simple REST API to manager users in a database using Node js.

This API has authentication middleware by JWT in some routes and validation middleware to routes that need parameters from client.

## Technologies used in this project

- Express
- Express validator
- JWT
- Knex
- MySQL

## Endpoints

### **GET** /user
return every user recorded in DB.

```
// return array object:User

[{
  id: int,
  email: string,
  name: string,
  age: int,
  occupation: string
}]
```

---

### **GET** /user/:page/:perPage
return all users sorted by pages

`params: page: int, perPage: int`

```
// return array object:User

[{
  id: int,
  email: string,
  name: string,
  age: int,
  occupation: string
}]
```

---

### **GET** /user/:id
return specific user

**❗ This route required authentication ❗**

`params: id: int`

```
// return object:User

{
  id: int,
  email: string,
  name: string,
  password: string, // encrypted password
  age: int,
  occupation: string,
  role: int
}
```

---

### **POST** /user
it creates a new user

```
// body

{
  email: string, // valid email
  name: string?,
  password: string, // at least 6 characters
  age: int?,
  occupation: string?
}
```

```
// return

{
  message: string,
  err: error?
}
```

---

### **PUT** /user
it edits a user

**❗ This route required authentication ❗**

```
// body

{
  id: int,
  name: string?,
  age: string?,
  occupation: string?
}
```

```
// return

{
  message: string,
  err: error?
}
```

---

### **DELETE** /user/:id
it deletes a user

**❗ This route required authentication ❗**

`params: id: int`

```
// return

{
  message: string,
  err: error?
}
```

---

### **POST** /login
it authenticates a user

```
// body

{
  email: string, // valid email
  password: string // at least 6 characters
}
```

```
// return

{
  token: string // encrypted key to be used as bearer token
}
```

---

### **POST** /recoverpassword
it creates a key to change user's password

```
// body

{ email: string }
```

```
// return

{
  message: string,
  token: string, // encrypted key to be used to change the password
  err: error?
}
```

---

### **POST** /changepassword
it validates token and change user's password

```
// body

{
  token: string,
  password: string // new password with at least 6 characters
}
```

```
// return

{
  message: string,
  err: error?
}
```