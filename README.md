# Экпорт Дзен-мани 
## [zenmoney.ru](https://zenmoney.ru)

### Образец запуска с помощью докера

```
docker run --rm \
-v /etc/localtime:/etc/localtime:ro \
-v /home/backup/zenmoney:/app/export \
tagplus5/zenmoney-backup sh -c "node app.js --login=LOGIN --pass=PASSWORD"
```
