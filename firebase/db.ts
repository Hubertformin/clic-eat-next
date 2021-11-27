import firebase from './clientApp';

export const restaurantCollection = firebase.firestore().collection('restaurants');

export const categoryCollection = firebase.firestore().collection('categories');

export const itemsCollection = firebase.firestore().collection('menuItems');

export const ordersCollection = firebase.firestore().collection('orders');

export const reportsCollection = firebase.firestore().collection('reports');