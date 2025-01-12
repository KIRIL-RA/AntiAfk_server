### Инструкция по запуску на linux ###

1. Выполните обновление пакетов: 
    - sudo apt-get update
    - sudo apt-get upgrade

2. Установите NVM
    - wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    - source ~/.bashrc
    - Перезапустите консоль

3. Установите nodejs v22 через NVM:
    - nvm install v22.12.0

4. Скопируйте исходный файлы на сервер
5. Зайдите в директория с исходниками
6. Выполните:
    - npm i
    - npm run build
    - cp -r ./src/public ./dist
    - cp -r ./src/configs/*.json ./dist/configs
    - npm i -g pm2

7. Запустите сервер используя команды
    - pm2 start ./dist/app.js
    - НИЖНИЕ КОМАНДЫ НУЖНЫ ДЛЯ АВТОМАТИЧЕСКОГО ЗАПУСКА АДМИН ПАНЕЛИ ВМЕСТЕ С СЕРВЕРОМ   
    - pm2 startup
    - pm2 save

После этого админ панель запустилась и доступ к ней можно получить введя в браузере ip:port/index
Чтобы изменять параметры сервера необходимо:
1. Внести изменения в файл ./dist/configs/config.json
2. Перезапустить сервер:
    - pm2 restart app