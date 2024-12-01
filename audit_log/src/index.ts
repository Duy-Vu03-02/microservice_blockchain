import { Application } from './consumers/application';

Application.createApplication()
    .then(() => {
        console.log('Service AUDIT LOG start SUCCESS!!!');
    })
    .catch((err) => {
        console.error('Service AUDIT LOG start FAILD: ', err.message);
    });
