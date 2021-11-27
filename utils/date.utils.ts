// momment locale
import moment from 'moment';
moment.locale('fr');

export function formatDate(date) {
    return moment(date).format('DD MMM YYYY,  H:mm');
}

export function timeAgo(date) {
    return moment(date).fromNow();
}
