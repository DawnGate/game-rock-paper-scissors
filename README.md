# Develop

### Prisma

Change .env local with DATABASE_URL

npx prisma migrate develop --name [???]

# Deploy

### Prisma

Change .env production with POSTGRES_URL_NON_POOLING
npx prisma migrate deploy
npx prisma generate dev

# READ MORE:

https://viblo.asia/p/docker-image-in-production-cau-chuyen-1gb-hay-100mb-LzD5dXyE5jY

# Deploy to server (VM)

1. Add ssh-key
   - eval "$(ssh-agent -s)"
   - ssh-add ~/.ssh/git_ssh
   - add git_deploy key, pull git repo
2. Install node, npm (can using nvm)
3. Install docker

- ubuntu is bookworm

```
    curl -sSL https://get.docker.com/ | sh
```

4. docker compose up -d
5. Config firewall and done

# Deploy to Containers

1. github and authen
2. Create App container
3. Create vm for db with config firewall to export port
4. Git hub ci/cd

# Deploy with Google App Engine

1. Build local
2. Connect github
3. Setting ci/cd

# Issues:

- With PEM File as env key, some other service (docker-compose --env-file or google cloud run will replace it with something strange) => so you need convert PEM FIle to string, and change to default with the code
- Add double quote to PEM value, change newline to \n
- With github action remember you should change "\n" to "\\n" and add "${{ secrets.KEY }}"
