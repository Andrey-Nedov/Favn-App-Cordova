# Мобильное приложение для совместного прослушивания музыки на Cordova<br/><br/>Application for sharing music listening using Cordova
<img src="/imgs/img1.png" width="800"/>

*01.07.2019 - 01.12.2019*  [![Generic badge](https://img.shields.io/badge/Status-Closed-red.svg)](https://shields.io/)<br/>

*Разработчик/Developer*
1. [Андрей Недов](https://github.com/Andrey-Nedov-is-a-human)
<br/>

Приложение является классическим музыкальным плеером с возможностью подключения нескольких устройств в одну клиент-серверную и синхронизации воспроизведения музыки.

Приложение написано под платформу Android на JavaScript/HTML/CSS при помощи фреймворка Cordova, и может быть легко портирован на IOS.

## Ядро приложения

Клиент-серверное взаимодействие реализуется на NodeJS при помощи [плагина](https://www.npmjs.com/package/nodejs-mobile-cordova) позволяющего поднимать NodeJS машину прямо на
смартфоне.

Алгоритм синхронизации воспроизведения музыки основан на пинге сервера и многократному сравнению часов. Алгоритм показал себя недостаточно хорошо, иногда выдаёт рассинхронизацию. В качестве лучшего решения следует использовать протокол синфронизации часов [NTP](https://en.wikipedia.org/wiki/Network_Time_Protocol).

## Дизайн приложения
[Скачать дизайн-проект приложения/Download application design project](https://github.com/Andrey-Nedov-is-a-human/Favn-App-Cordova/tree/main/imgs/Lookbook.pdf)

<img src="/imgs/img3.png" width="500"/>

<img src="/imgs/img2.png" width="500"/>

