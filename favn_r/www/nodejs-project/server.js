const cordova = require('cordova-bridge')		//мост между cordova и node слоями
var fs = require('fs')							//file system
var jsmediatags = require("jsmediatags");

cordova.channel.on('message', transcript_massage)		//event на случай получения сообщения с cordova-слоя (вызываем transcript)


function transcript_massage(msg)			//ф-ия на случай получения сообщения с cordova-слоя
{
	cordova.channel.send("m" + msg);

	switch(msg[0])					//проверяем префиксный байт
	{
		case "t":
			//cordova.channel.send(msg.substr(1).replace("file:",""));
			//cordova.channel.send("I don't see you, but I hear your fingers trembling...");

			///// к нам приходит строка: t + "номер трека в базе trackBase (не tB[10])" + ^ + путь к треку + *	   +	 так же остальные

			var tracks = msg.substr(1, msg.length - 2)

			var tracksArray = tracks.split('*')

			var num

			var path

			var i = 0

			//cordova.channel.send("m" + tracksArray)

			//for(var i = 0; i < tracksArray.length; i++)
			//{
			check()

			function check()
			{
				if (i < tracksArray.length)
				{
					num = tracksArray[i].split("^")[0]

					//cordova.channel.send("m" + num)

					path = tracksArray[i].split("^")[1]

					jsmediatags.read(path.replace("file:",""), {

					  onSuccess: function(tag)
					  {
					  	var tags = tag.tags

					  	//cordova.channel.send("m" + num + "^" + tags.album + "^" + tags.track)

						cordova.channel.send("t" + num + "^" + tags.album + "^" + tags.track)

						i++
						check()

					  	//cordova.channel.send("m" + ansverTags)

					    //cordova.channel.send("i" + num + "^" + tags.album + "*%" + tags.track)
					    //cordova.channel.send("Album: " + tags.album + "\n" + "Artist: " + tags.artist + "\n" + "Track: " + tags.track)
					  },
					  onError: function(error) 
					  {
					  	//cordova.channel.send("m" + num + "^" + "nt" + "^" + "nt")

						cordova.channel.send("t" + num + "^" + "nt" + "^" + "nt")

						i++
						check()
					    // cordova.channel.send("nt")
					    // cordova.channel.send("i" + num + "^" + "nt")
					  }
					});
				}
			}
		break

		case "i":
			goServer(msg.substr(1))			//значит прифел ip и нужно поднять сервер, поднимаем вызовом goServer
		break

		case "n":
			trackNumber = msg.substr(1)		//пришел номер, запоминаем
		break

		case "u":
			trackURL = msg.substr(1)		//пришел url
		break

		case "x":
			trackTime = parseFloat(msg.substr(1))*1000		//пришло время воспроизведения
		break

		case "l":
			localTime = msg.substr(1)		//пришло локальное время
			//cordova.channel.send("l"+msg.substr(1))
		break

		case "g":
			state = 1						//воспроизведение начато
		break

		case "s":
			state = 0						//воспроизведение остановлено
		break

		default:
			cordova.channel.send("m" + msg)
		break
	}
}