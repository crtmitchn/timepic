const regedit = require('regedit').promisified;

exports.changeWp = async (path) => {
    // Ищем всех пользователей в реестре
    const users = (await regedit.list("HKU"))["HKU"]["keys"];
    
    // Проходимся по ним
    for (const user of users) {
        // Обозначаем путь в реестре
        const rpath = `HKU\\${user}\\Control Panel\\Desktop`;
        
        // Берём папку Desktop у всех юзеров
        const desktop = await regedit.list(rpath);
        
        // Если нет папки, сразу переходим к следующему
        if (!desktop[rpath].exists) continue;
        
        console.log(`Изменяю обои для ${user}...`);
        
        // Создаём объект для реестра
        const newWp = {};
        newWp[`${rpath}`] = {
            WallPaper: {
                value: path,
                type: "REG_SZ"
            }
        };
        
        // И, наконец, меняем
        await regedit.putValue(newWp);
        
        // Применяем настройки без релогина
        require("child_process").execSync("RUNDLL32.EXE USER32.DLL,UpdatePerUserSystemParameters 1, True");
    }
}