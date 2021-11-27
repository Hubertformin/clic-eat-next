import React, {createContext, useState} from "react";

export const DataContext = createContext({cart: [], addToCart: null, emptyCart: null, removeItem: null, getCartItemsAmount: null});

function DataContextProvider({children}) {
    const [data, setData] = useState({cart: []});

    const addToCart = (_cart) => {
        const exist = !!data.cart.find(item => item.id === _cart.id);
        if (!exist) {
            const _newData = data.cart;
            _newData.push(_cart);
            setData({cart: _newData});
        }
    };

    const emptyCart = () => {
        setData({cart: []});
    };

    const removeItem = (id) => {
        const _newData = data.cart.filter(item => item.id !== id);
        setData({cart: _newData});
    };

    const getCartItemsAmount = () => {
        let total = 0;
        data.cart.forEach(item => {
            total += Number(item.quantity) * Number(item.unitPrice);
        });
        return total;
    };

    return(
        <DataContext.Provider value={{...data, addToCart, emptyCart, removeItem, getCartItemsAmount}}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider;

