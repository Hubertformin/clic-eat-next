import React, {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {message, Modal, Upload} from "antd";
import {UploadFile} from "antd/lib/upload/interface";
import firebase from "../firebase/clientApp";


export default function ImageUploadWall({max = 1, images = [], onUpload, clearAll = false,  onDelete = null}) {

    const uploadedImages: UploadFile[] = images.map((url, index) => {
        return {
            type: "image",
            uid: 'imp-firebase-image-' + index,
            name: "Image " + (index + 1),
            url: url,
            status: "done",
            size: 60
        }
    });

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([...uploadedImages]);

    useEffect(() => {
        if (clearAll) {
            setFileList([]);
        }
    }, [clearAll]);

    function handleCancel() {
        setPreviewVisible(false);
    }

    async function handlePreview(file) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewImage(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    }

    function beforeUpload(file) {
        // setFileList([...fileList, file]);
        handleUpload(file);
        return false;
    }

    function handleUpload(file) {
        if (file.size > 5000000) {
            message.warn('Veuillez télécharger un fichier inférieur à 5 Mo', 3500);
            return;
        }
        const storageRef = firebase.storage().ref(`images/${file.name}`);
        const uploadTask = storageRef.put(file);
        const wallFile: UploadFile = {
            type: file.type,
            uid: storageRef.fullPath,
            name: file.name,
            status: "uploading",
            percent: 0,
            size: 60
        };
        // if file size is greater that a 4MB CANCEL UPLOAD
        setFileList([...fileList, wallFile]);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // edit file status
            wallFile.percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFileList([...fileList, wallFile]);
        }, function(error) {
            console.error(error);
            wallFile.status = "error";
            setFileList([...fileList, wallFile]);
            // Handle unsuccessful uploads
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // console.log('File available at', downloadURL);
                wallFile.status = "done";
                wallFile.url = downloadURL;
                setFileList([...fileList, wallFile]);
                onUpload(downloadURL);
            });
        });

    }

    function onFileRemove(file) {
        // when files are removed from list
        // console.log(file);
        if (file.url) {
            firebase.storage().refFromURL(file.url)
                .delete()
                .catch(err => console.error(err));
            setFileList(fileList.filter(f => f.uid !== file.uid));
            // send callback
           if (!onDelete) {
               onDelete(file);
           }
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                key="upload-container"
                onRemove={onFileRemove}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
            >
                {fileList.length >= max ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );

}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
