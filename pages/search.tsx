import React, {useEffect, useState} from 'react';
import Toolbar from "../components/toolbar";
import {Button, Input, message, Modal, Rate, Tabs} from "antd";
import {loadMenuPlaceholder} from "../utils/const";
import {formatCurrency} from "../utils/format-currency.util";
import Footer from "../components/footer";
import {DataContext} from "../context/data-context";
import {LoadingOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons/lib";
import '../styles/SearchView.module.less';
import SeoTags from "../components/seo";


function SearchView({data, query}) {
    const [showItemModal, setShowItemModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartQty, setCartQty] = useState(1);
    const [items, setItems] = useState([]);

    function viewItem(item) {
        setSelectedItem(item);
        setShowItemModal(true);
    }

    function changeCartQty(op) {
        if (op < 0 && cartQty === 1) {
            return;
        }
        if (op < 0) {
            setCartQty(cartQty - 1);
        } else {
            setCartQty(cartQty + 1);
        }
    }

    useEffect(() => {
        console.log(data);
        setItems(data.hits);
    }, []);

    function onSearch(val) {
        setIsLoading(true);
        fetch('/api/search/query', {
            method: 'POST',
            body: JSON.stringify({query: val})
        })
            .then(response => response.json())
            .then(data => {
                setItems(data.hits)
            })
            .catch(err => {
                console.error(err);
            }).finally(() => {
                setIsLoading(false);
        })

    }

    return(
        <>
            <SeoTags title={`Résultats pour ${query}`} />
            <Toolbar transparent={true} noSearchBar={true}/>
            <div className="banner" style={{height: '40vh', display: 'block'}}>
                <div className="cover px-10 md:px-16">
                    <div className="search-container text-white">
                        <h1 className="text-white text-3xl">Recherche</h1>
                        <Input.Search size="large" defaultValue={query} onSearch={onSearch} />
                    </div>
                </div>
            </div>
            <section id="page-body" className="px-6 md:px-16 py-6">
                <Tabs defaultActiveKey="items-tab">
                    <Tabs.TabPane tab="Éléments du menu" key="items-tab">
                        {
                            isLoading ?
                                <section className="py-6 text-center">
                                    <LoadingOutlined style={{ fontSize: 64 }} spin />
                                    <h1>Chargement...</h1>
                                </section>
                                :
                                <div className="row">
                                    {
                                        items.map(item => {
                                            return(
                                                <div key={item.id} className="col-sm-3 cursor-pointer" onClick={() => viewItem(item)}>
                                                    <div className="food-card mb-16">
                                                        <div className="icon">
                                                            <img src={item.coverImageURL} onError={loadMenuPlaceholder}/>
                                                        </div>
                                                        <div className="details">
                                                            <h4 className="name">{item.name}</h4>
                                                            <h5 className="currency">{formatCurrency(item.unitPrice)}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                        }
                    </Tabs.TabPane>
                </Tabs>
            </section>
            <Footer />

            <DataContext.Consumer>{(context) => {
                return(
                    <Modal
                        visible={showItemModal}
                        title={selectedItem?.name}
                        closable={true}
                        onCancel={() => setShowItemModal(false)}
                        footer={
                            <div className="">
                                <Button onClick={() => {
                                    context.addToCart({...selectedItem, quantity: cartQty, amount: cartQty * selectedItem.unitPrice});
                                    setShowItemModal(false);
                                    message.success(`${selectedItem.name} a été ajouté au panier`);
                                }} type="primary">Ajouter au panier</Button>
                                <Button onClick={() => setShowItemModal(false)}>Annuler</Button>
                            </div>
                        }
                    >

                        <div className="modal">
                            <div className="row">
                                <div className="col-sm-4">
                                    <img src={selectedItem?.coverImageURL} onError={loadMenuPlaceholder} style={{width: '100%', maxHeight: '150px', objectFit: "cover"}}/>
                                </div>
                                <div className="col-sm-4">
                                    <h4 className="title">{selectedItem?.name}</h4>
                                    <h1 className="price text-theme-primary">{formatCurrency(selectedItem?.unitPrice * cartQty)}</h1>
                                    <div className="quantity-control">
                                        <button onClick={() => changeCartQty(-1)}><MinusOutlined /></button>
                                        <input type="number" placeholder={"qty"} value={cartQty} min={1} onChange={event =>  {
                                            if (Number(event.target.value) > 0) {
                                                setCartQty(Number(event.target.value))
                                            }
                                        }} />
                                        <button onClick={() => changeCartQty(1)}><PlusOutlined /></button>

                                    </div>
                                    <p className="mb-0 mt-5"><small><strong>Composition</strong></small></p>
                                    <p className="desc">{selectedItem?.composition}</p>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            }}</DataContext.Consumer>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const query = ctx.query.q;
    const hits = await fetch('http://cliceat.net/api/search/query', {
        method: 'POST',
        body: JSON.stringify({query})
    })
        .then(response => response.json())
        .catch(err => {
        console.error(err);
    });

    return {
        props: {data: hits, query}
    }

}

export default SearchView;
