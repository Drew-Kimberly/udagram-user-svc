# Udagram User API
An ExpressJS API service for Udagram Users.

_This packaged is maintained via the [Udagram Monorepo](https://github.com/Drew-Kimberly/Udagram)_

## User API Usage
Current API Version: `v0`.

Interface definitions:
```typescript
interface User {
  email: string;
  password: string;
}

interface AuthenticationResponse {
  token: string; // The JWT token.
  user: Omit<User, 'password'>;
}
interface IAuthenticated {
  auth: boolean;
}

type RegistrationResponse = AuthenticationResponse;
type LoginResponse = AuthenticationResponse & IAuthenticated;
```

### Public

#### `POST /api/{version}/users/auth`
Registers a new user.
##### Parameters
`version` - The User API version.
##### Available Query Parameters
None
##### Request Body
A `User` instance with a unique `email` value.
##### Returns
A `RegistrationResponse` object.

#### `POST /api/{version}/users/auth/login`
Logs in using an existing user's information.
##### Parameters
`version` - The User API version.
##### Available Query Parameters
None
##### Request Body
A `User` object representing a user that has already registered.
##### Returns
A `LoginResponse` object.
