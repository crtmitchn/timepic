
const cw = require("./changewp");
const fs = require("fs");
const Jimp = require("jimp");
const format = require("date-format");
const { wpPath, desiredText, desiredDateToShowText } = require("./config.json");
const spawn = require("child_process").spawn;

const
source = "plain.png",   
saved = "redacted.jpg",   
text = desiredText, 
sX = 400, sY = 350;   

function drawer() {
    Jimp.read(source, (err, baseImage) => {
        console.log("Фотокарточка прочитана");
        if (err) throw err;
    
        let textImage = new Jimp(2560, 1440, "#ff0000", (err, textImage) => {  
            if (err) throw err;
        });
    
        Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(font => {
            console.log("Эйнштейн в ахуе");
            textImage.print(font, sX, sY, desiredText)
            textImage.color([{ apply: 'xor', params: ["#000000"] }]); 
            textImage.blit(textImage, 0, 0)
            textImage.write(saved);
        });
    });
}

async function checkDateAndSet() {
    const currentDay = format('dd MM yyyy hh:mm:ss.SSS', new Date()).toString();
    let date1 = Math.floor(new Date(format.parse(format.DATETIME_FORMAT, desiredDateToShowText)).getTime());
    let date2 = new Date().getTime();

    console.log(date1);
    console.log(date2);

    if (currentDay === desiredDateToShowText || date1 < date2) {
        console.log("Дата совпадает с данной в конфигурации...");
        drawer();
	console.log("Жду 5 секунд перед установкой обоев");
	await new Promise(r => setTimeout(r, 5000));
        await cw.changeWp(wpPath);
    } else {
        console.log("Дата не совпадает, выход...");
        return;
    }
}

checkDateAndSet();