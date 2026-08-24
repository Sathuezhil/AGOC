Site data (services, texts, enquiries, **admin users**, **images**) is stored in **MongoDB**.

## Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) **or** run MongoDB locally on `27017`.
2. Put the connection string in `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/agoc
MONGODB_DB=agoc
ADMIN_EMAIL=admin@agocsecurity.ae
ADMIN_PASSWORD=AgocAdmin2026
AUTH_SECRET=change-this-to-a-long-random-string
```

`ADMIN_EMAIL` / `ADMIN_PASSWORD` are used **once** to create the first admin in the `users` collection (password is hashed). After that, login reads MongoDB only.

3. Seed defaults (also runs automatically on first API/page hit):

```bash
npm run seed
```

## Collections

| Collection     | Purpose                                      |
|----------------|----------------------------------------------|
| `services`     | Service catalogue (slug unique)              |
| `content`      | Single site document `_id: "site"`           |
| `enquiries`    | Contact form leads                           |
| `users`        | Admin login (hashed password)                |
| `media.files` / `media.chunks` | Images in GridFS              |

Admin saves immediately refresh the public site (`force-dynamic` + path revalidation).
Images are served from `/api/media/...`.
