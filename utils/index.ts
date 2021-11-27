import fire from "../firebase/clientApp";
import {notification} from "antd";


export function deleteFirebaseImages(url: string | string[]) {
    if (typeof url === "string") {
        const path = url.replace("https://ik.imagekit.io/biche", "https://firebasestorage.googleapis.com");
        fire.storage().refFromURL(path).delete();
    } else {
        url.forEach(link => {
            const path = link.replace("https://ik.imagekit.io/biche", "https://firebasestorage.googleapis.com");
            fire.storage().refFromURL(path).delete();
        })
    }
}

export function renderBlogImage(blob) {
    return URL.createObjectURL(blob);
}

export function slowConnectionChecker(status: boolean, duration = 5500) {
    setTimeout(() => {
        if (status) {
            notification.warn({
                message: 'Connection lente',
                description: "Cela prend plus de temps que d'habitude, assurez-vous d'avoir une connexion Internet fonctionnelle"
            });
        }
    }, duration);
}
