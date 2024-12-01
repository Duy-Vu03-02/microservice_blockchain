import { Application } from '@api/application';

Application.createApplication()
    .then(() => {
        console.log('Service HOSPITAL start SUCCESS!!!');
    })
    .catch((err) => {
        console.error('Service HOSPITAL start FAILD: ', err.message);
    });
