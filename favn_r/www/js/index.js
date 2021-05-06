var firstStart
var firstSlide = true

var rawTrackCount = -1                           //кол-во всех аудиофайлов на устройстве
var quantityBase = -1

var easyBase = []                             //первый массив путей всех аудиофайлов
var durMaskArray = []                         //маска длительности треков/ длина массива равна кол-вву треков (0 - length-1)/ 1 если трек длинный, 0 если нет
var trackBase = [[],[],[],[],[],[],[],[],[],[],[]]     //массив мета о треках  [path, fullname, author, name, album, playlist, duration, dateOfAdding]

var auList = []
var albList = []
var playList = []

var auMass =[[]]
var albMass =[[]]
var playMass =[[]]

var auListQuan =[[]]
var albListQuan =[[]]
var playListQuan =[[]]

var allQuan = -1
var playQuan = -1
var auQuan = -1
var albQuan = -1

var allDone = false
var playDone = false
var auDone = false
var albDone = false

var place = "mainPage"

var slider

var preload = true
var rec_num = 0

var playPanelOpen = 0
var nowNumber = -1

var nowNumberInList = -1

var greenPlayCount = 0



var playlistMix = []

var allPlaylists = []

var playPlaylists = []

var artistsPlaylists = []

var albumsPlaylists = []



var upPlaying = false
var repeat = false

var notAuto = false     //переменная которая взводится если трек переключается пользоваетлем а не автовоспроизведением 
var itIsMore = false    //переменная которая взводится если нажата кнопка "показать доп. информацию о треке"



var getTags
var tags

var newLength
var checkedLength = 0

var playing = false;                    //играет музыка или нет
var music

var showDurationForOne = false          //переменная нужна для запуска проверки текущего времени воспроизведения чтобы выводить время в ползунок
//протокол: треки разделены "*", ячейки треков "

//window.localStorage.setItem("trackBaseSave", "")

var savedString = window.localStorage.getItem("trackBaseSave").split("*")   //тут храним всю базу наших треков, точнее последнего снимка треков

//////////////////////////////////////////
//
//  тут объявление конфигурации





//
//////////////////////////////////////////

var savedBase = [[]]          //сюда мы распаковываем треки из localStorage

var pressTimer

var newArrayCount

var toTagCount = -1
var toTag = ""


var durMouseDowned = false;

/*последовательность такая:

    1. достаем и парсим в savedBase треки из localStorage, параллельно ищем треки на устройстве, заливаем их пути в easyBase, 
        из него составляем массив длительностей durMaskArray
    2. Потом в savedPath загоняем пути сохраненных ранее треков для тего чтобы их сравнивать с easyBase
    3. Собственно проходимся по easyBase и если путь совпадает с ранее сохраненным путем, то просто вносим все данные о треке в trackBase из savedBase,
        если не совпадает, то если он проходит по времени, то создаем новый трек, смотря на его путь в easyBase и так же вносим в trackBase.

*/


function clear()
{
    window.localStorage.setItem("trackBaseSave", "")
    alert("All clear")
}

$('broadcast').addEventListener("click", clear, false)
document.addEventListener("deviceready", initialization, false)
document.addEventListener("backbutton", backButton, false)


///////////////////////////////////////////////////////////////////////////////////////
//  реакции на нажатия внутри карточки


function tapCard(number)      //нажатие на катрочку
{
    //alert("Card!")
    // slider.slideTo(nowNumber)
}

function more(number)         //нажатие на три точки на карточке
{
    // alert("More: " + number)
    itIsMore = true
}

function directionCard()
{
    if(upPlaying)
    {
        setTimeout(function()
        {

            upPlaying = false
            $("directionCard").style.backgroundImage = "url(css/img/player_buttons/down.png)"

        }, 200)
    }
    else
    {
        setTimeout(function()
        {

            upPlaying = true
            $("directionCard").style.backgroundImage = "url(css/img/player_buttons/up.png)"
            
        }, 200)
    }
}

function sequenceCard()
{
    
}

function repeatCard()
{
    if(repeat)
    {
        setTimeout(function()
        {

            repeat = false
            $("repeatCard").style.backgroundImage = "url(css/img/player_buttons/all.png)"

        }, 200)
    }
    else
    {
        setTimeout(function()
        {

            repeat = true
            $("repeatCard").style.backgroundImage = "url(css/img/player_buttons/repeate_one.png)"
            
        }, 200)
    }
}

function openCard()      // поднимаем панель с карточками
{
    $("bottom").style.display = "none"
    $('bottomCard').style.display = "block"
    place = "card"
    $("peppermint").innerHTML = ""

    for(var i = quantityBase; i >= 0; i--)              // отрисовываем карточки как кнопки в списке
    {
        for(var j = quantityBase; j >= 0; j--)
        {
            if(parseInt(trackBase[10][j]) == parseInt(i))
            {
                addCard(j, trackBase[3][j], trackBase[2][j])

                try
                {
                    if((j == nowNumber)&&(playing == true))
                        $("playCard" + j).style.backgroundImage = "url(css/img/pause.png)"
                }
                catch(e)
                {
                    // alert(e)
                }
            }
        }
    }
    
    try
    {
        slider = Peppermint(document.getElementById('peppermint'), {speed: 200})  //запускаем слайдер карточек треков (используется отдельная библиотека)

        // alert($("allTracks").children[10].id)
        
        setTimeout(function()
        {
            // alert("nowNumberInList: " + nowNumberInList)
            slider.slideTo(nowNumberInList)        // переключаем список карточек на текущую карточку
        }, 0)

        setTimeout(function()                   // поднимаем список на показ пользователю 
        {
            $("cardsLayer").style.marginTop = "-71vh"
        }, 200)
    }
    catch(e)
    {
        // alert(e)
    }

    // try
    // {

    //     // alert(Object.getOwnPropertyNames(slider))
    //     // alert(slider.getCurrentPos())
    //     // slider.slideTo(nowNumber, 100)

    //     slider.slideTo(nowNumber)
    //     slider.slideTo(nowNumber)

    //     // if(nowNumber > slider.getCurrentPos())
    //     //     for(var i = 0; i < nowNumber - slider.getCurrentPos(); i++)
    //     //         slider.next()
    //     // else
    //     //     for(var i = 0; i < slider.getCurrentPos() - nowNumber; i++)
    //     //         slider.prev()
    // }
    // catch(e)
    // {
    //     alert(e)
    // }
}


///////////////////////////////////////////////////////////////////////////////////////







function initialization()       //инициализация
{

    ///////////////////////////////////////////////////////////////////////////////////////

    //проверяем первый ли раз запускается приложение, если да, то firstStart = ture
    //если нет, то firstStart = false

    if(window.localStorage.getItem("first_start") != "42")      
    {                                                           
        window.localStorage.setItem("first_start", "42")
        firstStart = true
    }
    else
        firstStart = false

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    StatusBar.backgroundColorByHexString("#00b050")

    nodejs.start('server.js', startupCallback)   //запускаем Node.js

    // var slider = Peppermint(document.getElementById('peppermint'));  //запускаем слайдер карточек треков (используется отдельная библиотека)

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    var showString = "Saved base:\n---------\n"

    //[path_0, fullname_1, name_2, author_3, author_num_4, album_5, album_num_6, playlist_7, playlist_num_8, duration_9, all_num_10]

    for(var i = 0; i < savedString.length - 1; i++)         //парсим localStorage во временную базу savedBase
    {
        savedBase[i] = []
        for(var j = 0; j <= 10; j++)
        {
            savedBase[i][j] = savedString[i].split('"')[j]
            //alert("Album: " + savedBase[i][5] + "\nNumber: " + savedBase[i][6])
        }

        showString = showString + "Name: " + savedBase[i][2] + "\nAuthor: " + savedBase[i][3] + "\nAuthor num: " + savedBase[i][4]
            + "\nAlbum: " + savedBase[i][5] + "\nAlbum num: " + savedBase[i][6] + "\nPlaylist: " + savedBase[i][7] + "\nPlaylist num: " + savedBase[i][8]
                + "\nDuration: " + savedBase[i][9] + "\nNum: " + savedBase[i][10]  + "\n-------------\n"
    }


    FindTrack(cordova.file.externalRootDirectory)       //начинаем рекурсивный поиск всех аудиофайлов на устройстве
    var rec_check = 0
    
    setTimeout(                         //функция запускается асинхронно и проверяет не закончила ли рекурсия FindTrack поиск
        function run()
        {
            if(rec_check == rec_num)
            {
                $("greenscreen").style.display = "none"
                // $("cardsLayer").style.display = "none"
                $("cardsLayer").style.marginTop = "100vh"
                durMask(0)
            }
            else
            {
                rec_check = rec_num
                setTimeout(run, 300)
            }
        }, 300)
}



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//      NodeJS


function startupCallback(err)       //callback запуска Node.js
{
    nodejs.channel.setListener(NodeListener) //слушаем сообщения с node стороны
}

function NodeListener(msg)          //читаем сообщения с NodeJs
{
    switch(msg[0])
    {
        case "t":
            checkedLength++                         //колиество пришедших с обработки треков
            var tracks = msg.substr(1)              //вся строка жез вводного байта
            
            var num = tracks.split("^")[0]          //номер трека в trackBase
            var alb = tracks.split("^")[1]          //альбом
            var alb_num = tracks.split("^")[2]      //номер в альбоме

            if((alb != "nt")&&(alb != "undefined")&&(alb_num != undefined)&&(alb != ""))
                trackBase[5][num] = alb
            else
                trackBase[5][num] = "-null"

            if((alb_num != "nt")&&(alb_num != "undefined")&&(alb_num != undefined)&&(alb_num != ""))
                trackBase[6][num] = alb_num
            else
                trackBase[6][num] = "-null"

            if(checkedLength == newLength)      //если количество новых треков и пришедших с обработки одинаково, то сохраняем базу
            {
                saveItFunc()
            }

            //alert("Album: " + trackBase[5][num] + "\nNumber: " + trackBase[6][num])
        break

        case "m":
            //alert("NodeJs: " + msg.substr(1))
        break

        default:
            alert("7: Default")
        break
    }
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////





function FindTrack(path)                            //рекурсивная ф-ия
{
    rec_num++
    window.resolveLocalFileSystemURL(path, function (dirEntry)      //получаем доступ к директориям (неведомая херь какая-то)
        {
            var FindTrackReader = dirEntry.createReader()           //создаем объект ридера директории
            FindTrackReader.readEntries(DoneFind,ErrorFind)         //и ищем все папки в этой директории
        }
    )

    function DoneFind(entries)                          //если все прошло хорошо и если нашли папки
    {
        //$("body").innerHTML = $("body").innerHTML+"Number of files: "+entries.length+"  Rec_num = "+rec_num+"<br>"
        for(var i = 0; i < entries.length; i++)           //просматриваем все папки по очереди
        {
            if(entries[i].name.indexOf(".")==-1)        //если в названии нет точек (т.е. если файл - папка)
                FindTrack(path+entries[i].name+"/")

            if(entries[i].name.indexOf(".mp3")!=-1)     //если у файла есть ".mp3"
            {
                rawTrackCount++
                easyBase[rawTrackCount] = path+entries[i].name            //и вгоняем в массив ссылок ссылку по номеру трека
            }
        }
    }

    function ErrorFind(error)                           //если сканирование дериктории прошло с ошибкой, то выводим имя ошибки и плачем
    {
        alert("6: Reload the app\nError: " + error.name)
    }
}



function durMask(num)                   //делаем маску по длительности для каждого трека
{
    var myAudio = new Audio(easyBase[num].replace("file:",""))
    myAudio.addEventListener('loadedmetadata', function() {
            
        durMaskArray[num] = myAudio.duration

        if((num+1) == rawTrackCount)     //если прошлись по всем треками, то выводим пользователю
            toBase()
        else
        {
            try
            {
                // alert(num)
                durMask(num+1)
            }
            catch(e){}
        }
    });

    myAudio.addEventListener('error' , function() 
    {
        // alert('5: Ошибка загрузки файла')
        if((num+1) == rawTrackCount)     //если прошлись по всем треками, то выводим пользователю
            toBase()
        else
        {
            try
            {
                // alert(num)
                durMask(num+1)
            }
            catch(e){}
        }
    }, false)
}


function toBase()   //заполняем базу trackBase
{
    //[path_0, fullname_1, name_2, author_3, author_num_4, album_5, album_num_6, playlist_7, playlist_num_8, duration_9, all_num_10]

    var trackBaseString = "TrackBase:\n---------\n"

    var savedPaths = []               //формируем массив путей сохраненных ранее треков, чтобы сравнивать его с найденными путями на смартфоне (easyBase)

    var newArray = []
    newArrayCount = -1

    for(var i = 0; i < savedBase.length; i++)
        savedPaths[i] = savedBase[i][0]

    var oldCount = "Old tracks"
    var newCount = "New tracks"

    var indexOfOld

    for(var i = 0; i < easyBase.length; i++)                    //проходим по easyBase и ищем одинаковые пути с savedPath, если нашли, 
    {                                                           //то значит просто добавляем трек в trackBase, из сохраненной базы, 
        indexOfOld = savedPaths.indexOf(easyBase[i])            //если нет, то проходим цикл анализа трека и добавляем что получилось

        if(indexOfOld != -1)
        {
            //alert("Old path:\n" + easyBase[i])
            //oldCount = oldCount + "\n-----------\n" + easyBase[i]

            quantityBase++

            trackBase[0][quantityBase] = savedBase[indexOfOld][0]
            trackBase[1][quantityBase] = savedBase[indexOfOld][1]
            trackBase[2][quantityBase] = savedBase[indexOfOld][2]
            trackBase[3][quantityBase] = savedBase[indexOfOld][3]
            trackBase[4][quantityBase] = savedBase[indexOfOld][4]
            trackBase[5][quantityBase] = savedBase[indexOfOld][5]
            trackBase[6][quantityBase] = savedBase[indexOfOld][6]
            trackBase[7][quantityBase] = savedBase[indexOfOld][7]
            trackBase[8][quantityBase] = savedBase[indexOfOld][8]
            trackBase[9][quantityBase] = savedBase[indexOfOld][9]
            trackBase[10][quantityBase] = savedBase[indexOfOld][10]

            // if(trackBase[2][quantityBase].indexOf("Life (Axia-Audio.ru)") != -1)
            //     alert("indexOfOld: " + indexOfOld + "\nName: " + savedBase[indexOfOld][2] + "\nNum: " + savedBase[indexOfOld][10])
                //alert(trackBase[10][quantityBase])

            if((trackBase[5][quantityBase] == "undefined")&&(trackBase[5][quantityBase] == undefined))
                trackBase[5][quantityBase] = "-null"

            if((trackBase[6][quantityBase] == "undefined")&&(trackBase[6][quantityBase] == undefined))
                trackBase[6][quantityBase] = "-null"

            //trackBaseString = trackBaseString + "Name: " + trackBase[2][quantityBase] + "\nNum:" + trackBase[10][quantityBase] + "\n-------------\n"

            trackBaseString = trackBaseString + "Name: " + trackBase[2][quantityBase] + "\nAuthor: " + trackBase[3][quantityBase] + "\nAuthor num: " + trackBase[4][quantityBase]
            + "\nAlbum: " + trackBase[5][quantityBase] + "\nAlbum num: " + trackBase[6][quantityBase] + "\nPlaylist: " + trackBase[7][quantityBase] 
                + "\nPlaylist num: " + trackBase[8][quantityBase] + "\nDuration: " + trackBase[9][quantityBase] 
                    + "\nNum: " + trackBase[10][quantityBase] + "\n-------------\n"

            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Path: " + trackBase[0][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Fullname: " + trackBase[1][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Name: " + trackBase[2][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Author: " + trackBase[3][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Author num: " + trackBase[4][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Album: " + trackBase[5][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Album num: " + trackBase[6][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Playlist: " + trackBase[7][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Playlist num: " + trackBase[8][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Duration: " + trackBase[9][quantityBase])
            // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "All num: " + trackBase[10][quantityBase])
        }
        else
        {
            newArrayCount++                     //заносим трек в массив для новых треков, чтобы потом их в список дописать
            //newCount = newCount + "\n-----------\n" + easyBase[i]
            newArray[newArrayCount] = i
            //alert(easyBase[i])
        }
    }

    // alert(oldCount)
    // alert(newCount)
    // alert("quantityBase 1: " + quantityBase)
    // alert("Old: " + oldCount + "\nNew: " + newCount)

    var optimCount = -1     //редактируем номера очередности в общем плейлисте, чтобы дыр не было

    var seenTrack = []

    var find

    ///////////////////////alert("До:\n--------------------\n" + trackBase[10])     //алгоритм должен работать так:
                                                                                    //берет 0, и ищет ноль среди номеров, если не нашел, то присваивает ноль наименьшему и т.д.
    while(optimCount < quantityBase)
    {
        optimCount++

        find = false

        // for(var i = 0; i <= quantityBase; i++)
        // {
        //     if((min >= parseInt(trackBase[10][i]))&&(seenTrack.indexOf(i) == -1))
        //     {
        //         //alert(min + " >= " + parseInt(trackBase[10][i]) + "\n" + (min >= parseInt(trackBase[10][i])) )
        //         //alert("optimCount: " + optimCount  + "\ni: " + i + "\nmin: " + min + "\nnum: " + trackBase[10][i])
        //         min = parseInt(trackBase[10][i])
        //         index = i
        //         //alert("optimCount: " + optimCount  + "\ni: " + i + "\nmin: " + min)
        //     }
        // }

        // for(var i = 0; i <= quantityBase; i++)
        //     if(optimCount == trackBase[10][i])
        //         find = true

        // if(!find)
        // {
            var min = 1000000
            var index

            for(var i = 0; i <= quantityBase; i++)
            {
                if((min >= parseInt(trackBase[10][i]))&&(seenTrack.indexOf(i) == -1))
                {
                    //alert(min + " >= " + parseInt(trackBase[10][i]) + "\n" + (min >= parseInt(trackBase[10][i])) )
                    //alert("optimCount: " + optimCount  + "\ni: " + i + "\nmin: " + min + "\nnum: " + trackBase[10][i])
                    min = parseInt(trackBase[10][i])
                    index = i
                    //alert("optimCount: " + optimCount  + "\ni: " + i + "\nmin: " + min)
                }
            }

            seenTrack[optimCount] = index
            trackBase[10][index] = optimCount
        //}
    }

     ///////////////////////////alert("После:\n--------------------\n" + trackBase[10])

    //alert(trackBase)

    var toTag = ""        //в этоу строку мы собираем все новыен треки: "номер в trackBase" + ^ + "путь" + "номер в trackBase" + ...
                          //потом это cтроку отправляем на обработку ридеру ID3

    for(var i = 0; i <= newArrayCount; i++)         //дописываем новые треки в список
    {   
        try
        {
            if(durMaskArray[newArray[i]] >= 120)
            {  
                quantityBase++  //добавляем строку в базу

                trackBase[0][quantityBase] = easyBase[newArray[i]]
                trackBase[1][quantityBase] = easyBase[newArray[i]].split("/")[easyBase[i].split("/").length-1].replace(".mp3","")

                if(trackBase[1][quantityBase].replace(/_/g," ").indexOf(" - ") != -1)
                {
                    trackBase[2][quantityBase] = trackBase[1][quantityBase].replace(/_/g," ").split(" - ")[1]
                    trackBase[3][quantityBase] = trackBase[1][quantityBase].replace(/_/g," ").split(" - ")[0]
                }
                else
                if(trackBase[1][quantityBase].replace(/_/g," ").indexOf(" — ") != -1)
                {
                    trackBase[2][quantityBase] = trackBase[1][quantityBase].replace(/_/g," ").split(" — ")[1]
                    trackBase[3][quantityBase] = trackBase[1][quantityBase].replace(/_/g," ").split(" — ")[0]
                }
                else
                {
                    trackBase[3][quantityBase] = "-null"
                    trackBase[2][quantityBase] = trackBase[1][quantityBase].replace(/_/g," ")
                }

                //alert(trackBase[0][quantityBase])

                if(trackBase[3][quantityBase] != "-null")
                {
                    if(auList.indexOf(trackBase[3][quantityBase]) == -1)
                    {
                        auList[auList.length] = trackBase[3][quantityBase]
                        //alert(auList[auList.length - 1])
                        auListQuan[auList.length - 1] = 0
                        trackBase[4][quantityBase] = 0
                    }
                    else
                    {
                        auListQuan[auList.indexOf(trackBase[3][quantityBase])] = auListQuan[auList.indexOf(trackBase[3][quantityBase])] + 1
                        trackBase[4][quantityBase] = auListQuan[auList.indexOf(trackBase[3][quantityBase])]
                        //alert("Есть совпадения авторов!\n" + trackBase[4][quantityBase])
                    }
                }

                //alert(1 + ": " + newArrayCount)

                //nodejs.channel.send("t" + quantityBase + "^" + trackBase[0][quantityBase])      //если IP определено, то ставим на него сервер

                //toTagCount++
                toTag = toTag + quantityBase + "^" + trackBase[0][quantityBase] +  "*"        //добавляем новые треки к строке

                //alert(toTag)

                trackBase[7][quantityBase] = "-null"
                trackBase[8][quantityBase] = "-null"   
                trackBase[9][quantityBase] = durMaskArray[i]
                trackBase[10][quantityBase] = quantityBase

                trackBaseString = trackBaseString + "Name: " + trackBase[2][quantityBase] + "\nAuthor:" + trackBase[3][quantityBase] + "\nAuthor num:" + trackBase[4][quantityBase]
                    + "\nAlbum:" + trackBase[5][quantityBase] + "\nAlbum num:" + trackBase[6][quantityBase] + "\nPlaylist:" + trackBase[7][quantityBase] 
                        + "\nPlaylist num:" + trackBase[8][quantityBase] + "\nDuration:" + trackBase[9][quantityBase] 
                            + "\nNum:" + trackBase[10][quantityBase] + "\n-------------\n"

                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Path: " + trackBase[0][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Fullname: " + trackBase[1][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Name: " + trackBase[2][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Author: " + trackBase[3][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Author num: " + trackBase[4][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Album: " + trackBase[5][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Album num: " + trackBase[6][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Playlist: " + trackBase[7][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Playlist num: " + trackBase[8][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "Duration: " + trackBase[9][quantityBase])
                // alert(trackBase[1][quantityBase] + "\n"+" "+"\n" + "All num: " + trackBase[10][quantityBase])

                //alert("New tracks: " + trackBase[2][quantityBase])
            }
        }
        catch(err)
        {
            // alert(err)
        }
    }

    //alert("quantityBase 2: " + quantityBase)
    //alert("t" + toTag)

    if(toTag != "")                             //если строка не пуста
        nodejs.channel.send("t" + toTag)      //то отправляем ее ридеру ID3  (t - по протоколу для передачи строки ридеру)

    newLength = toTag.substr(1, toTag.length - 2).split("*").length     //это число новых треков, нужно для подсчета пришедших с обработки треков 

    quantityBaseShow = quantityBase + 1

    if((quantityBaseShow >= 11)&&(quantityBaseShow <= 19))
        $("kolAll").innerHTML = quantityBaseShow + " композиций"
    else
    if((quantityBaseShow % 10 == 1)&&(quantityBaseShow != 11))
        $("kolAll").innerHTML = quantityBaseShow + " композиция"
    else
    if((quantityBaseShow % 10 == 2)||(quantityBaseShow % 10 == 3)||(quantityBaseShow % 10 == 4))
        $("kolAll").innerHTML = quantityBaseShow + " композиции"
    else
        $("kolAll").innerHTML = quantityBaseShow + " композиций"

    //alert(saveString);

    setTimeout(function()
    {
        printAll()      //печатаем треки в список всех треков

        var countOfAllTracks = -1

        // alert($("allTracks").children.length)

        for(var i = 0; i < $("allTracks").children.length; i++)                 // этот алгоритм записывает в nowNumberInList номер текущего трека в AllTracks
        {
            if($("allTracks").children[i].id.indexOf("trackButton") != -1)      //если элемент в списке AllTracks в id имеет trackButton, то это кнопка
            {
                countOfAllTracks++
                allPlaylists[countOfAllTracks] = parseInt($("allTracks").children[i].id.replace("trackButton", ""))
                // alert("i: " + i + "\n" + "num: " + $("allTracks").children[i].id.indexOf("trackButton"))
            }
        }                                                                                           // на него слайд переключить

        // alert(allPlaylists)

    }, 5)

    //////////////////////////////////////////allPlaylists          тут запузырь обработку

}

function saveItFunc()       //эта функция сохраняет базу trackBase в localStorages
{
    try
    {  
        var saveString = ""

        var saveItString = "Save it:\n---------\n"

        for(var i = 0; i <= quantityBase; i++)
            for(var j = 0; j <= 10; j++)
            {
                // if(j == 5)
                //     alert("Album: " + trackBase[5][i])
                // if(j == 6)
                //     alert("Number: " + trackBase[6][i])
                if(j == 5)
                    saveItString = saveItString + "Album: " + trackBase[5][i]

                if(j == 6)
                    saveItString = saveItString + "\nAlbumnum: " + trackBase[6][i] + "\n-------------\n"
                
                if(j != 10)
                    saveString = saveString + trackBase[j][i] + '"'
                else
                    saveString = saveString + trackBase[j][i] + '*'
            }

        window.localStorage.setItem("trackBaseSave", saveString);
        //alert(saveItString)
    }
    catch(e)
    {
        alert("4: " + e)
    }
}


function printAll()     //отрисовывает кнопки из trackBase в листе
{
    // $("cardsLayer").innerHTML = '<div class="peppermint peppermint-inactive" id="peppermint"></div>'    //отрисовываем div, (предписанный библиотекой peppermint) 
    //                                                                                                     //в который будем записывать слайды
    for(var i = quantityBase; i >= 0; i--)
    {
        for(var j = quantityBase; j >= 0; j--)
        {
            //if((trackBase[10][j] == i)&&(trackBase[10][j] != quantityBase))
            if(parseInt(trackBase[10][j]) == parseInt(i))
            {
                addButton("allTracks", j, trackBase[3][j], trackBase[2][j], trackBase[0][j])       //созданной ф-ией для создания кнопки, создаем кнопку
                // $("peppermint").innerHTML
                // addCard(j, trackBase[3][j], trackBase[2][j])
            }
        }
    }        // alert(document.getElementById('peppermint').innerHTML)
}

function onfocusSearch()                //строка поиска раскройся
{
    if($('search').value == "поиск")
        $('search').value = ""; 
    $('searchButton').style.display = "block"
}

function onfocusoutSearch()             //строка поиска скройся
{
    if($('search').value == "")
        $('search').value = "поиск"
    $('searchButton').style.display = "none"
}




function showSmallPanel()       //решение бага с отображением мини-панели воспроизведения
{
    try                                            //это таблетка от бага с текстом на панели воспроизведения при выходе в меню
    {
        $("mainPanels").removeChild($("bottom"))    //мы перерисовываем панель воспроизведения каждый раз когда заходим в раздел
    
        var bottom = document.createElement("div")
        bottom.className = "bottom"
        bottom.id = "bottom"
        $("mainPanels").appendChild(bottom)

        var button = document.createElement("button")
        button.className = "playButton"
        button.id = "playButton"
        button.addEventListener("click", function(){playPause()})
        $("bottom").appendChild(button)

        var bigText = document.createElement("p")
        bigText.className = "bigButtonTextPanel"
        bigText.id = "bigButtonTextPanel"
        $("bottom").appendChild(bigText)

        var smallText = document.createElement("p")
        smallText.className = "smallButtonTextPanel"
        smallText.id = "smallButtonTextPanel"
        $("bottom").appendChild(smallText)

        var input = document.createElement("input")
        input.className = "duration"
        input.id = "duration"
        input.type = "range"
        input.min = "0"
        input.max = "1000"
        input.step = "1"
        input.value = "0"
        input.disabled = "true"
        $("bottom").appendChild(input)

        var toCard = document.createElement("button")
        toCard.className = "toCardButton"
        toCard.id = "toCardButton"
        toCard.addEventListener("click", function(){openCard()})
        $("bottom").appendChild(toCard)

        //if(!playPanelOpen)
            $("bottom").style.display = "block"

        $('bigButtonTextPanel').innerHTML = trackBase[2][nowNumber]

        if(trackBase[3][nowNumber] == "-null")
            $('smallButtonTextPanel').innerHTML = "Неизвестный автор"
        else
            $('smallButtonTextPanel').innerHTML = trackBase[3][nowNumber]

        if(!playing)
            $("playButton").style.backgroundImage = "url(css/img/play.png)"
        else
            $("playButton").style.backgroundImage = "url(css/img/pause.png)"
    }
    catch(err){alert("3: " + err)}
}




function allTracksFunc()    //реакция на нажатие "все треки"
{
    place = "allTracks"
    $('cards').style.display = "none"
    $('statusPanel').style.boxShadow =  "none"
    $('dopStatusPanel').style.display = "block"
    $('allTracks').style.display = "block"

    showSmallPanel();

    //alert(trackBase[0][3])
    //nodejs.channel.send("t" + trackBase[0][3])      //если IP определено, то ставим на него сервер
}


function addButton(space, number, author, name)   //ф-ия создания кнопки трека
{
    if(preload == true)
    {
        $("allTracksSpace").style.display = "block"
        $("preloader").style.display = "none"
        preload = false
    }
    var button = document.createElement("button")                              //ля-ля создаем объект элемента
    button.className = "trackButton"                                             //даем прописанный класс
    button.id = "trackButton" + number                                             //даем прописанный id
    button.addEventListener("click", function(){playNotAuto(number)}, false)             //ставим на event функцию и параметром номера трека
    // button.addEventListener("mousedown", function(){tap(number)}, false)             //ставим на event функцию и параметром номера трека
    // button.addEventListener("mouseup", function(){up(number)}, false)             //ставим на event функцию и параметром номера трека

    var bigText = document.createElement("p")
    bigText.className = "bigButtonText"
    bigText.id = "bigButtonText" + number

    var smallText = document.createElement("p")
    smallText.className = "smallButtonText"
    
    bigText.innerHTML = name

    if(author == "-null")
        smallText.innerHTML = "Неизвестный автор"
    else
        smallText.innerHTML = author

    $(space).appendChild(button)                                           //добавьте элемент в DOM и вы прекрасны!
    button.appendChild(bigText)
    button.appendChild(smallText)
}

function addCard(number, author, name)   //ф-ия создания карточки трека
{
    if(preload == true)
    {
        $("allTracksSpace").style.display = "block"
        $("preloader").style.display = "none"
        preload = false
    }

    // var slider = document.createElement("div")
    // slider.className = "peppermint peppermint-inactive"
    // slider.id = "peppermint"

    var figure = document.createElement("figure")
                                  //ля-ля создаем объект элемента

    var div1 = document.createElement("div")                              //ля-ля создаем объект элемента
    div1.className = "trackCardsDiv"                                             //даем прописанный класс
    div1.id = "trackCardsDiv" + number                                             //даем прописанный id
    // div1.addEventListener("click", function(){play(number)}, false)             //ставим на event функцию и параметром номера трека
    div1.addEventListener("click", function(){setTimeout(function(){playNotAuto(number)}, 200)}, false)             //ставим на event функцию и параметром номера трека
    // div.addEventListener("mousedown", function(){tap(number)}, false)             //ставим на event функцию и параметром номера трека
    // div.addEventListener("mouseup", function(){up(number)}, false)             //ставим на event функцию и параметром номера трека

    var divIn = document.createElement("div")                              //ля-ля создаем объект элемента
    divIn.id = "innerCardDiv" + number
    divIn.style.width = "66vw"
    divIn.style.height = "92vw"
    divIn.style.marginLeft = "7vw"
    divIn.style.marginTop = "0"
    divIn.style.backgroundColor = "transparent"

    var firstT = document.createElement("div")
    firstT.style.height = "28vw"
    firstT.style.backgroundColor = "transparent"

    var bigText = document.createElement("div")
    bigText.className = "bigTextCard"
    bigText.id = "bigTextCard" + number

    var smallText = document.createElement("div")
    smallText.className = "smallTextCard"
    smallText.id = "smallTextCard" + number
    
    bigText.innerHTML = name

    if(author == "-null")
        smallText.innerHTML = "Неизвестный автор"
    else
        smallText.innerHTML = author

    var playImg = document.createElement("div")
    playImg.className = "playCard"
    playImg.id = "playCard" + number

    var secondT = document.createElement("div")
    secondT.style.height = "12vw"    
    secondT.style.backgroundColor = "transparent"    

    var button = document.createElement("button")                              //ля-ля создаем объект элемента
    button.className = "moreCard"                                             //даем прописанный класс
    button.id = "moreCard" + number                                             //даем прописанный id
    button.addEventListener("click", function(){more(number)}, false)             //ставим на event функцию и параметром номера трека

    try
    {
        $("peppermint").appendChild(figure)                                           //добавьте элемент в DOM и вы прекрасны!
        figure.appendChild(div1)
        div1.appendChild(divIn)
        divIn.appendChild(firstT)
        divIn.appendChild(bigText)
        divIn.appendChild(smallText)
        divIn.appendChild(playImg)
        divIn.appendChild(secondT)
        divIn.appendChild(button)

        //alert($("peppermint").innerHTML)
    }
    catch(err)
    {
        alert(err)
    }
}

var tapSt = false               //эти две функции (tap, up) реализуют долгое нажатие

function tap(num)
{
    //tapSt = true


    // setTimeout(function()
    // {
    //     if(tapSt)
    //     {
    //         alert(num)
    //         alert("Name: " + trackBase[2][num])
    //         //alert("Album: " + trackBase[5][num] + "\n" + "Number in album: " + trackBase[6][num])
    //     }
    // }, 500)
}

function up(num)
{
    //tapSt = false
}




function play(number)   //нажатие кнопочки play
{
    // alert("Play: " + number)

    if(!playPanelOpen)
    {
        //$('bottom').style.display = 'block'
        $('mainPanels').style.height = '88vh'
        $('cards').style.height = '78vh'
        $('allTracks').style.height = '71vh'
        playPanelOpen = true
    }


    try
    {
        $('deleteMe').parentNode.removeChild($('deleteMe'));
        //alert("Delete: " + greenPlayCount)
    }
    catch(err)
    {
        //alert(err)
    }

    // alert("number: " + number + "\n" + "nowNumber: " + nowNumber)

    if((nowNumber != -1)&&(nowNumber != number))
    {
        playing = true

        try
        {
            $("playCard" + nowNumber).style.backgroundImage = "url(css/img/play.png)"      // ставим значок проигрыания в предыдущем треке на паузу
            $("playCard" + number).style.backgroundImage = "url(css/img/pause.png)"
        }
        catch(e){}

        music.stop()                                                            //сначала стопорим предыдущий
        music.release()                                                         //удаляем предыдущий объект
        music = new Media(trackBase[0][number].replace("file:",""), function(){nextTrack()})     //создаем новый объект

        // alert(number)

        $("trackButton" + nowNumber).style.paddingLeft = "0vw"
        $("trackButton" + number).style.paddingLeft = "13vw"

        var div = document.createElement("div")                                        //ля-ля создаем объект элемента
        div.className = "playButtonInTrack"                                             //даем прописанный класс
        div.id = "deleteMe"                                                              //даем прописанный id
        $("trackButton" + number).insertBefore(div, $("bigButtonText" + number))                                        //добавьте элемент в DOM и вы прекрасны!

        // alert(number)
    }
    else
    if((nowNumber == -1)&&(nowNumber != number))
    {
        notAuto = false          //снимаем бит, отвечающий за "трек переключил пользователь, а не автовоспроизведение (по окончании трека)"
        // alert("(0)notAuto: " + notAuto)

        playing = true

        music = new Media(trackBase[0][number].replace("file:",""), function(){nextTrack()})     //создаем новый объект

        $("trackButton" + number).style.paddingLeft = "13vw"

        var div = document.createElement("div")                                        //ля-ля создаем объект элемента
        div.className = "playButtonInTrack"                                             //даем прописанный класс
        div.id = "deleteMe"
        $("trackButton" + number).insertBefore(div, $("bigButtonText" + number))                                        //добавьте элемент в DOM и вы прекрасны!
    }
    else
    if((nowNumber == number)&&(playing))
    {
        playing = false

        var div = document.createElement("div")                                        //ля-ля создаем объект элемента
        div.className = "pauseButtonInTrack"                                             //даем прописанный класс
        div.id = "deleteMe"
        $("trackButton" + nowNumber).insertBefore(div, $("bigButtonText" + nowNumber))                                        //добавьте элемент в DOM и вы прекрасны!        
    }
    else
    if((nowNumber == number)&&(!playing))
    {
        playing = true

        var div = document.createElement("div")                                        //ля-ля создаем объект элемента
        div.className = "playButtonInTrack"                                             //даем прописанный класс
        div.id = "deleteMe"
        $("trackButton" + nowNumber).insertBefore(div, $("bigButtonText" + nowNumber))                                        //добавьте элемент в DOM и вы прекрасны!
    }

    if(!playing)
    {
        $("playButton").style.backgroundImage = "url(css/img/play.png)"

        try
        {
            $("playCard" + number).style.backgroundImage = "url(css/img/play.png)"
        }
        catch(e)
        {
            // alert(e)
        }

        music.pause()
    }
    else
    {
        $("playButton").style.backgroundImage = "url(css/img/pause.png)"

        try
        {
            $("playCard" + number).style.backgroundImage = "url(css/img/pause.png)"
        }
        catch(e)
        {
            // alert(e)
        }

        music.play()
    }

    $('bigButtonTextPanel').innerHTML = trackBase[2][number]

    if(trackBase[3][number] == "-null")
        $('smallButtonTextPanel').innerHTML = "Неизвестный автор"
    else
        $('smallButtonTextPanel').innerHTML = trackBase[3][number]

    // setTimeout(function()
    // {
        nowNumber = number

        countTracks = -1

        for(var i = 0; i < $("allTracks").children.length; i++)                 // этот алгоритм записывает в nowNumberInList номер текущего трека в AllTracks
        {
            if($("allTracks").children[i].id.indexOf("trackButton") != -1)      //если элемент в списке AllTracks в id имеет trackButton, то это кнопка
                countTracks++

            if(nowNumber == parseInt($("allTracks").children[i].id.replace("trackButton", "") ) )   // если номер трека совпадает с тем, что сейчас играет, 
                nowNumberInList = countTracks;                                                         // запоминаем его порядковый номер в списке чтобы потом
        }                                                                                           // на него слайд переключить

        // alert(nowNumberInList)

        showDuration();
    // }, 110)
}


function showDuration()         //асинхронная ф-ия для отображения времени воспроизведения
{
    if(!showDurationForOne)
    {
        showDurationForOne = true

        setTimeout(
        function show()
        {
            music.getCurrentPosition(function(time)
            {
                try
                {
                    var dur = music.getDuration()       /////////////тут отрисовываем длительность трека

                    var durSec = parseInt(dur % 60)

                    if(durSec < 10)
                        durSec = "0" + parseInt(dur % 60)

                    $("timeTo").innerHTML = parseInt(dur/60) + ":" + durSec     ////////////////////////



                    var nowSec = parseInt(time % 60)           /////////////тут текущее время трека

                    if(nowSec < 10)
                        nowSec = "0" + parseInt(time % 60)

                    $("timeFrom").innerHTML = parseInt(time/60) + ":" + nowSec      ///////////////



                    //alert(Math.round((100*time)/dur))
                    $("duration").value = Math.round((1000*time)/dur)       //отрисовываем тонкую полоску длительности 

                    if(!durMouseDowned)
                        $("durationCard").value = Math.round((1000*time)/dur)   //отрисовываем толстую полоску длительности 

                }
                catch(err){}
            })

            setTimeout(show, 100)
        }, 100)
    }
}



function nextTrack()
{
    if(!notAuto)
    {
        // alert("Next")
        var nowInPlaylist = allPlaylists.indexOf(nowNumber)
        // alert("Array: " + allPlaylists + "\n\n" + "Element: " + nowNumber + "\n\n" + "Index: " + nowInPlaylist)

        try
        {
            if(!upPlaying)
            {
                play(allPlaylists[nowInPlaylist + 1])
                slider.slideTo(nowInPlaylist + 1)
            }
            else
            {
                play(allPlaylists[nowInPlaylist - 1])
                slider.slideTo(nowInPlaylist - 1)
            }
        }
        catch(e){}
    }
    else
    {
        notAuto = false
        // alert("(0)notAuto: " + notAuto)
    }
}




function sliderInput()      //эта срабатывает когда пользователь перетаскивает ползунок
{
    // tapSt = true
    var dur = music.getDuration()

    var sec = parseInt(($("durationCard").value * dur) / 1000)

    var min = parseInt(sec / 60)

    if(sec % 60 < 10)
        sec = "0" + String(parseInt(sec % 60))
    else
        sec = parseInt(sec % 60)


    $("timeFrom").innerHTML = min + ":" + sec
}


function durMouseDown()      ///////кароче тут подряд обработка нескольких откликов на разные события при касании к полоске в надежде что кто-то из них сработает
{
    try
    {
        var dur = music.getDuration()

        music.getCurrentPosition(
            function(position) 
            {
                if (position > -1) 
                {
                    //alert(($("durationCard").value * dur)/1000)
                    music.seekTo(Math.round( ($("durationCard").value * dur) ) ) 
                }
            },
            function (e) 
            {
                alert("2: Error getting pos=" + e);
            }
        );
    }
    catch(err)
    {
        alert("1: " + err)
    }
}

function durClick()
{
    try
    {
        var dur = music.getDuration()

        music.getCurrentPosition(
            function(position) 
            {
                if (position > -1) 
                {
                    //alert(($("durationCard").value * dur)/1000)
                    music.seekTo(Math.round( ($("durationCard").value * dur) ) ) 
                }
            },
            function (e) 
            {
                alert("2: Error getting pos=" + e);
            }
        );
    }
    catch(err)
    {
        alert("1: " + err)
    }
}

function durDown()
{
    try
    {
        var dur = music.getDuration()

        music.getCurrentPosition(
            function(position) 
            {
                if (position > -1) 
                {
                    //alert(($("durationCard").value * dur)/1000)
                    music.seekTo(Math.round( ($("durationCard").value * dur) ) ) 
                }
            },
            function (e) 
            {
                alert("2: Error getting pos=" + e);
            }
        );
    }
    catch(err)
    {
        alert("1: " + err)
    }
}


function durChange()
{
    try
    {
        var dur = music.getDuration()

        music.getCurrentPosition(
            function(position) 
            {
                if (position > -1) 
                {
                    //alert(($("durationCard").value * dur)/1000)
                    music.seekTo(Math.round( ($("durationCard").value * dur) ) ) 
                }
            },
            function (e) 
            {
                alert("2: Error getting pos=" + e);
            }
        );
    }
    catch(err)
    {
        alert("1: " + err)
    }
}               ///////////////////////////////////////////////////////////////////////////



function playPause()
{
    play(nowNumber)
}


function playNotAuto(num)
{
    if(!itIsMore)
    {
        notAuto = true
        play(num)
    }
    else
    {
        itIsMore = false

        try
        {
            $("trackCardsDiv" + nowNumber).style.animation = " cardRotate_go 300ms ease-in-out forwards"
            // document.getElementById('left').style.animation = " left_down_vert 300ms ease-in-out forwards"
        }
        catch(e)
        {
            alert(e)
        }
    }
}























function backButton()               //обработка кнопки назад
{
    switch(place)
    {
        case "mainPage":
            if (typeof cordova !== 'undefined') 
            {
                if (navigator.app) 
                {
                    navigator.app.exitApp();
                }
                else if (navigator.device) 
                {
                    navigator.device.exitApp();
                }
            } 
            else 
            {
                window.close();
                $timeout(function () {
                    self.showCloseMessage = true;  //since the browser can't be closed (otherwise this line would never run), ask the user to close the window
                });
            }
            break;

        case "allTracks":
            place = "mainPage";
            $('cards').style.display = "block"
            $('statusPanel').style.boxShadow =  "0 0 3vh -0.5vh black"
            $('dopStatusPanel').style.display = "none"
            $('allTracks').style.display = "none"
        break;

        case "card":
            place = "allTracks";
            // $('cardsLayer').style.display = "none"
            $("cardsLayer").style.marginTop = "100vh"
            $('bottomCard').style.display = "none"
            $("bottom").style.display = "block"
        break;
    }
}




function delay(f, ms) 
{
    return function() 
    {
        var savedThis = this
        var savedArgs = arguments

        setTimeout(function() 
        {
            f.apply(savedThis, savedArgs)
        }, ms)
    }
}


function $(id)
{
    return document.getElementById(id)
}