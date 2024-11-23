import { Application } from "@api/application";

Application.createApplication()
  .then(() => {
    console.log("Service ACCESS CONTROL start SUCCESS!!!");
  })
  .catch((err) => {
    console.error("Service ACCESS CONTROL start FAILD: ", err.message);
  });
