import request from "supertest";
import app from "../src/app";

describe("GET /api/v1/customers", () => {
  it("should return 200 OK", () => {
    return request(app)
      .get("/api/v1/customers")
      .expect(200);
  });
});

describe("POST /api/v1/customers", () => {
  const customerID = Math.floor(Math.random() * 1000);
  it("should create customer then return 200 OK", done => {
    request(app)
      .post("/api/v1/customers")
      .send({
        customerID: customerID,
        gender: "m",
        birthday: "1991-02-21",
        firstName: "john",
        lastName: "kh",
        customerLifetimeValue: "550",
        lastContact: "2017-08-01 11:57:47.142Z"
      })
      .end((err, res: any) => {
        expect(res.body.message).toEqual("Customer saved successfully !");
        done();
      })
      .expect(200);
  });

  it("should delete customer then return 200 OK", done => {
    request(app)
      .delete(`/api/v1/customers/${customerID}`)
      .end((err, res: any) => {
        expect(res.body.message).toEqual("Customer successfully deleted");
        expect(res.body.id).toBe(customerID.toString());
        done();
      })
      .expect(200);
  });
});

describe("POST /api/v1/customers", () => {
  it("should return 400", done => {
    request(app)
      .post("/api/v1/customers")
      .send({
        customerID: "1",
        gender: "m",
        birthday: "1991-02-21",
        firstName: "john",
        lastName: "kh",
        customerLifetimeValue: "550",
        lastContact: "2017-08-01 11:57:47.142Z"
      })
      .end(function(err, res: any) {
        expect(res.body.message).toEqual(
          "Customer with that customer Id already exists."
        );
        done();
      })
      .expect(400);
  });
});
