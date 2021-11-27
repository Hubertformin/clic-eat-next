import React, {useEffect, useState} from 'react';
import Toolbar from "../../components/toolbar";
import {Button, message, Modal, Rate, Tabs} from "antd";
import {categoryCollection, itemsCollection, restaurantCollection} from "../../firebase/db";
import SeoTags from "../../components/seo";
import {loadMenuPlaceholder} from "../../utils/const";
import {formatCurrency} from "../../utils/format-currency.util";
import Footer from "../../components/footer";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {addItemToCartSession} from "../../utils/cart.utils";
import "../../styles/RestaurantProfile.module.less";
import {DataContext} from "../../context/data-context";

const {TabPane} = Tabs;

function CategoryProfile({category, items}) {
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartQty, setCartQty] = useState(1);

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

    function addToCart() {
        addItemToCartSession({...selectedItem, quantity: cartQty, amount: cartQty * selectedItem.unitPrice});
        setShowItemModal(false);
        message.success(`${selectedItem.name} a été ajouté au panier`);
    }


    return (
        <>
            <SeoTags title={`Trouvez ${category.name} sur Clic Eat`} />
            <Toolbar transparent={true}/>
            <div className="banner" style={{height: '40vh', display: 'block'}}>
                <div className="trail px-10 md:px-16">
                    <div className="text">
                        <h1 className="text-2xl text-white">{category.name}</h1>
                    </div>
                </div>
            </div>
            <section id="page-body" className="px-6 md:px-16 py-6">
                <Tabs defaultActiveKey="items-tab">
                    <TabPane tab="Éléments du menu" key="items-tab">
                        {
                            items.length > 0 ?
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
                                </div> :
                                <div className="py-4">
                                    <h1>Il n'y a pas d'article dans cette catégorie</h1>
                                </div>
                        }
                    </TabPane>
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

export default CategoryProfile;

export async function getServerSideProps(ctx) {
    const category = await categoryCollection.doc(ctx.query.id).get()
        .then(snap => {
            const data = snap.data();
            data.dateAdded = snap.get('dateAdded').toDate().getTime();
            return {id: snap.id, ...data}
        }).catch(err => err);

    const items = await itemsCollection.where('category', '==', category.name).get()
        .then(snapshot => {
            return snapshot.docs.map(snap => {
                const data = snap.data();
                return {id: snap.id, ...data}
            });
        }).catch(err => err);

    return {
        props: {
            items,
            category
        }
    }

}
