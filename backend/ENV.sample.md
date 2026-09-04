Admin and auth-related environment variables (create a `.env` file in `backend` based on these):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dance_school

JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d

ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@danceschool.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@12345
```


