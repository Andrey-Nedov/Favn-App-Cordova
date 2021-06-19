# Мобильное приложение для совместного прослушивания музыки на Cordova / Application for sharing music listening using Cordova
<img src="/imgs/img1.png" width="800"/>

*01.07.2019 - 01.12.2019*  [![Generic badge](https://img.shields.io/badge/Status-Closed-red.svg)](https://shields.io/)<br/>

*Разработчик/Developer*
1. [Андрей Недов](https://github.com/Andrey-Nedov-is-a-human)
<br/>

Приложение является классическим музыкальным плеером с возможностью подключения нескольких устройств в одну клиент-серверную сеть и синхронизации воспроизведения музыки.

Приложение написано под платформу Android на JavaScript/HTML/CSS при помощи фреймворка Cordova, может быть быстро портирован на IOS и другие платформы, поддерживаемые фреймворком.

## Ядро приложения

Клиент-серверное взаимодействие реализуется на NodeJS при помощи [плагина](https://www.npmjs.com/package/nodejs-mobile-cordova), позволяющего поднимать NodeJS машину прямо на
смартфоне. Приложение поднимает сервер на устройстве раздающем музыку, остальные же пользователи подключаются к нему как клиенты. Далее происходит скачивание проигрываемого трека на устройства клиентов и синхронизация воспроизведения.

Алгоритм синхронизации воспроизведения музыки основан на пинге сервера и многократному сравнению часов на устройствах. Алгоритм показал себя недостаточно хорошо, иногда выдаёт рассинхронизацию. В качестве лучшего решения следует использовать протокол синхронизации часов [NTP](https://en.wikipedia.org/wiki/Network_Time_Protocol).


## Дизайн приложения
[Скачать дизайн-проект приложения/Download application design project](https://github.com/Andrey-Nedov-is-a-human/Favn-App-Cordova/tree/main/imgs/Lookbook.pdf)

<img src="/imgs/img3.png" width="500"/>
<img src="/imgs/img2.png" width="500"/>
<img src="/imgs/img6.jpg" width="500"/>

## Рабочий прототип


<img src="/imgs/img.gif" width="300"/>

В прототипе был реализован функционал музыкального плеера и алгоритмы объединения устройств в клиент-серверную сеть и синхронизации воспроизведения музыки.


## Выводы

_Проект был завершён по нескольким причинам:_
1. Выбранный алгоритм и технология не оправдали ожиданий
2. Отсутствие достаточно понятных перспекив выхода на рынок музыкальных приложений
3. Большая параллельная загрузка по учёбе

_Позитивный опыт:_
1. Прокачался в быстром прототипировании мобильных приложений для тестирования будущих бизнес-идей
2. Послушал музыку вместе с другом через созданное демо-приложеине
