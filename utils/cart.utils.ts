export function addItemToCartSession(item) {
    const cart = getCartItemsSession();
    cart.push(item);
    if (typeof window !== "undefined") {
        window.sessionStorage.setItem('ccrt', JSON.stringify(cart));
    }
}

export function getCartItemsSession(): any[] {
    if (typeof window !== "undefined") {
        const _cartString = window.sessionStorage.getItem('ccrt');
        if (_cartString) {
            return JSON.parse(window.sessionStorage.getItem('ccrt'));
        } else {
            return [];
        }
    } else {
        return [];
    }
}

export function removeCartItem(id) {
    const cart = getCartItemsSession();
    const _newCart = cart.filter(it => it.id !== id);
    if (typeof window !== "undefined") {
        window.sessionStorage.setItem('ccrt', JSON.stringify(_newCart));
    }
    return _newCart;
}

export function getCartItemsAmount(): number {
    const cart = getCartItemsSession();
    let total = 0;
    cart.forEach(item => {
        total += Number(item.quantity) * Number(item.unitPrice);
    });
    return total;
}

export function resetCart() {
    if (typeof window !== "undefined") {
        window.sessionStorage.setItem('ccrt', JSON.stringify([]));
    }
}
