import { Application } from "@api/application";

Application.createApplication()
  .then(() => {
    console.log("Service PERMISSION start SUCCESS!!!");
  })
  .catch((err) => {
    console.error("Service PERMISSION start FAILD: ", err.message);
  });
