# Инструкция по настройке сервера (Ubuntu/Debian)

Предполагается, что вы загрузили всю папку проекта на сервер (например, через `git clone`).

## 1. Первичная настройка Nginx

1. Установите Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Скопируйте конфиг:
   ```bash
   sudo cp server-deploy/nginx.conf /etc/nginx/sites-available/school.sport.mos.ru
   ```

3. Активируйте сайт:
   ```bash
   sudo ln -s /etc/nginx/sites-available/school.sport.mos.ru /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 2. Вариант А: Ставим ЗАГЛУШКУ (пока домен обновляется)

Запустите скрипт из папки `server-deploy`:
```bash
cd server-deploy
chmod +x deploy-stub.sh
./deploy-stub.sh
```
**Результат:** По адресу открывается страница "Сайт скоро откроется".

## 3. Вариант Б: РЕЛИЗ (открываем сайт)

Когда пора открывать сайт, запустите скрипт релиза:
```bash
cd server-deploy
chmod +x deploy-release.sh
./deploy-release.sh
```
**Результат:** По адресу открывается полная версия сайта.
