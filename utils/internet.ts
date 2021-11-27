import {notification} from "antd";

export function showNoInternetMsg(condition = true) {
    setTimeout(() => {
        if (condition) {
            notification.warn({message: "Probleme de connexion", duration: 5500, description: `L'opération prend plus de temps que d'habitude. Cela indique généralement que votre appareil ne dispose pas d'une connexion Internet saine pour le moment.`});
        }
    }, 10500);
}
