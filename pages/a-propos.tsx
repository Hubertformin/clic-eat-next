import React from 'react';
import Toolbar from "../components/toolbar";
import SeoTags from "../components/seo";
import Footer from "../components/footer";
import {itemsCollection} from "../firebase/db";

function AboutView() {

    async function changeImageEndpoints() {
        try {
            const items = await itemsCollection.get()
                .then((payload) => {
                    return payload.docs.map(doc => {
                        const data = doc.data();
                        return {id: doc.id, ...data}
                    });
                });
            for (const item of items) {
                // @ts-ignore
                item.coverImageURL = item.coverImageURL.replace("https://firebasestorage.googleapis.com","https://ik.imagekit.io/srmdhcrwxnb");
                // @ts-ignore
                item.imageURLS = item.imageURLS.map(url => {
                    return url.replace("https://firebasestorage.googleapis.com","https://ik.imagekit.io/srmdhcrwxnb");
                });
                await itemsCollection.doc(item.id).update(item);
                // @ts-ignore
                console.log('done with ' + item.name);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <SeoTags title="À propos de Clic-Eat" />
            <Toolbar/>
            <main id="page-body" className="pt-8 px-6 md:pt-8 md:px-16 pb-16">
                <h1 className="text-center text-2xl">À propos de Clic-Eat</h1>
                <p>
                    Clic-Eat est un service de livraison opérant principalement dans la région du Cameroun, servant ses clients avec le meilleur service alimentaire de qualité qu'ils puissent trouver.

                    Clic-Eat a été lancé en 2020 par un brillant homme visionnaire du nom de Manga Eyembe William qui a pris sur lui d'apporter à la population une livraison de nourriture à domicile. Sa popularité a grandi surtout pendant les périodes de quarantaine, car les gens ne pouvaient compter que sur la livraison de nourriture pour obtenir leurs collations préférées.

                    Clic-Eat avec l'aide de sa communauté espère toucher d'autres horizons, y compris les services internationaux de livraison de nourriture à travers le continent africain. Rejoignez-nous aujourd'hui pour accomplir cette mission. Commencez à commander dès aujourd'hui!
                </p>
            </main>
            <Footer/>
        </>
    )
}

export default AboutView;
