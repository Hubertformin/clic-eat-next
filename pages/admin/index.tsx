import React from 'react';
import SeoTags from "../../components/seo";
import {Button, Form, Input, message} from "antd";
import "../../styles/AdminHome.module.less";
import {useRouter} from "next/router";


function AdminHome() {
    const [form] = Form.useForm();
    const router = useRouter();

    function login(e) {
        const {username, password} = form.getFieldsValue();
        if (username !== "admin" || password !== "cliceat237") {
            message.warn("Nom d'utilisateur ou mot de passe incorrect");
            return;
        }
        // redirect ot dashboard
        router.push('/admin/panneau');
    }

    return (
        <>
            <SeoTags title="Connectez-vous en tant qu'administrateur" />
            <section id="body">
                <section className="center px-6 py-8 rounded bg-white">
                    <img src="/images/logo.png"
                         className="mb-4"
                         style={{height: '50px', borderRadius: '100%', width: '50px', margin: 'auto'}}/>
                         <p className="text-xs font-bold text-center text-red-500 mb-6">clickeat Admin</p>
                    <div className="w-64 text-white">
                        <Form layout="vertical" form={form} onFinish={login}>
                            <Form.Item name="username" colon={false} label={"Nom d'utilisateur"}>
                                <Input placeholder="Nom d'utilisateur" />
                            </Form.Item>
                            <Form.Item
                                name={"password"} label={"Mot de passe"}
                            >
                                <Input.Password placeholder={"Mot de passe"} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">Login</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </section>
        </>
    )
}

export default AdminHome;