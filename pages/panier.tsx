import React, {useState} from 'react';
import SeoTags from "../components/seo";
import Toolbar from "../components/toolbar";
import {loadMenuPlaceholder} from "../utils/const";
import {formatCurrency} from "../utils/format-currency.util";
import {DeleteOutlined} from "@ant-design/icons/lib";
import {Button, Form, Input, message, Modal, notification} from "antd";
import Footer from "../components/footer";
import {ordersCollection} from "../firebase/db";
import Link from "next/link";
import {DataContext} from "../context/data-context";


function Cart() {
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();


    function saveOrder(ctx) {
        const {name, phone, address, specification} = form.getFieldsValue();
        if (!name) {
            message.warn("Veuillez entrez votre nom");
            return;
        }
        if (!phone) {
            message.warn("Veuillez entrez votre numéro de téléphone");
            return;
        }
        if (!address) {
            message.warn("Veuillez entrez votre adresse");
            return;
        }
        // else build payload
        const payload = {
            inv: `INV ${Date.now().toString().slice(0,7)}`,
            items: ctx.cart,
            status: 'NOT_CONFIRMED',
            amount: ctx.getCartItemsAmount() + 1000,
            date: Date.now(),
            address: address ? address :  '',
            specification: specification ? specification: '',
            customer: {name, phone}
        };
        // add to db
        setIsLoading(true);
        ordersCollection.add(payload)
            .then(() => {
                notification.success({
                    message: "Votre commande a été envoyée",
                    description: "Vous serez contacté sous peu pour confirmer votre commande",
                    placement: "topRight"
                });
                // close modal and reset form
                setShowForm(false);
                // empty cart
                ctx.emptyCart();
            })
            .catch(() => {
                notification.error({
                    message: "Votre commande n'a pas pu être envoyée",
                    description: "Veuillez vous assurer que vous disposez d'une connexion Internet fonctionnelle. Si le problème persiste, contactez les responsables du site",
                    placement: "topRight"
                });
                setShowForm(false);
            })
            .finally(() => {
                setIsLoading(false);
            })

    }

    return(
        <DataContext.Consumer>{(context) => {
            const {cart} = context;
            return(
                <>
                    <SeoTags title={"Mon panier"} />
                    <Toolbar transparent={false} />
                    <main className="pt-8 px-6 md:pt-8 md:px-16">
                        <h1 className="title font-bold text-2xl">Mon panier</h1>
                        <div className="list mt-6" style={{minHeight: '150px'}}>
                            {
                                cart.map((item, index) => {
                                    return (
                                        <div className="list-item flex justify-between border-b pb-3 mt-4">
                                            <div className="flex">`
                                                <img src={item.coverImageURL} style={{height: '65px', width: '65px', objectFit: 'cover'}} onError={loadMenuPlaceholder}/>
                                                <div key={`fd-card-${index}`} className="ml-3 food-card">
                                                    <h4 key={`nm-${index}`} className="title">{item?.name}</h4>
                                                    <p key={`nm-${index}`} className="my-2">{item?.restaurants[0]}</p>
                                                    <h1 key={`price-${index}`} className="price text-theme-primary">{formatCurrency(item?.unitPrice * item.quantity)}</h1>
                                                </div>
                                            </div>
                                            <div className="action">
                                                <Button type="link" onClick={() => context.removeItem(item.id)}><span className="text-xl"><DeleteOutlined /></span></Button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                cart.length == 0 ?
                                    <section className="h-full flex align-item-center justify-center flex-col">
                                        <img src="/images/Delivery-cuate.svg" alt="" className="h-40"/>
                                        <h1 className="mt-3 text-xl font-bold mb-6">Votre panier est vide</h1>
                                        <Link href={"/"}>
                                            <Button type="primary">Retour aux articles</Button>
                                        </Link>
                                    </section> : null
                            }
                        </div>
                        <div className="meta py-4">
                            <div className="text-lg">total: <span>{formatCurrency(context.getCartItemsAmount())}</span></div>
                            <div className="text-lg"><span>Frais de livraison: </span><span>{formatCurrency(1000)}</span></div>
                            <h1 className="text-xl"><span>Nouveau total: </span> <span>{formatCurrency(context.getCartItemsAmount() + 1000)}</span></h1>
                        </div>
                        <div className="action pt-8 pb-4 flex justify-end">
                            {
                                cart.length > 0 ? <Button type="primary" onClick={() => setShowForm(true)}>Passer la commande</Button> : null
                            }
                        </div>
                    </main>
                    <Footer/>
                    <Modal
                        title={"Entrez vos informations"}
                        visible={showForm}
                        style={{top: '10px'}}
                        onCancel={() => setShowForm(false)}
                        onOk={() => saveOrder(context)}
                        closable={true}
                        confirmLoading={isLoading}
                        okText={"Commander"}
                    >
                        <div className="header flex justify-center mb-6">
                            <img src="/images/Delivery-cuate.svg" alt="" className="h-24"/>
                        </div>
                        <Form form={form} layout="vertical">
                            <Form.Item label={"Nom"} name="name" required>
                                <Input placeholder="Nom" />
                            </Form.Item>

                            <Form.Item label={"Numéro de téléphone"} name="phone" required>
                                <Input prefix="+237" placeholder="Numéro de téléphone" />
                            </Form.Item>

                            <Form.Item label={"Lieu de livraison"} name="address" required>
                                <Input placeholder="Lieu de livraison" />
                            </Form.Item>

                            <Form.Item label={"spécifications"} name="specification">
                                <Input.TextArea placeholder="Avez-vous des spécifications?" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )
        }}</DataContext.Consumer>
    )

}

export default Cart;
