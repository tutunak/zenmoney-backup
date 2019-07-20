# Экпорт Дзен-мани 
## [zenmoney.ru](https://zenmoney.ru)

- Экспорт CSV
- Экспорт JSON с помощью zenmoney api

### Образец запуска с помощью docker

```
docker run --rm \
-v /etc/localtime:/etc/localtime:ro \
-v /home/backup/zenmoney:/app/export \
-v /home/conf/zenmoney.json:/app/zenmoney.json \
tagplus5/zenmoney-backup
```

### zenmoney.json

Зарегистрировать свой клиент можно с помощью скрипта на странице http://developers.zenmoney.ru/index.html. После этого используем полученные consumer_key, consumer_secret.

```
{
    "username": "USERNAME",
    "password": "PASSWORD",
    "consumerKey": "CONSUMER KEY",
    "consumerSecret": "CONSUMER SECRET"
}
```
