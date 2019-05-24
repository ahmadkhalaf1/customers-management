import { Request, Response, NextFunction } from "express";
import { default as Customers, CustomerModel } from "../models/Customers";

/**
 * POST /api/v1/customers
 * Create a new customer.
 */
export let createCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    customerID,
    gender,
    birthday,
    firstName,
    lastName,
    customerLifetimeValue,
    lastContact
  } = req.body;

  const customer = new Customers({
    customerID: customerID,
    gender: gender,
    birthday: birthday,
    name: {
      first: firstName,
      last: lastName
    },
    customerLifetimeValue: customerLifetimeValue,
    lastContact: lastContact
  });

  Customers.findOne(
    { customerID: customerID, deleted: false },
    (err: any, existingUser: CustomerModel) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Customer with that customer Id already exists." });
      }
      customer.save((err: any) => {
        if (err) {
          return res.status(400).json({
            message: "Error while saving customer! please try again",
            err: err
          });
        }
        return res
          .status(200)
          .json({ message: "Customer saved successfully !" });
      });
    }
  );
};

/**
 * GET /api/v1/customers/{id}
 * Check if customer id exist.
 */
export let checkCustomerIdNotTaken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  Customers.findOne(
    { customerID: id, deleted: false },
    (err: any, existingUser: CustomerModel) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      if (existingUser) {
        return res
          .status(200)
          .json({ message: "Customer Id is taken", available: false });
      }
      return res
        .status(200)
        .json({ message: "Customer Id is available", available: true });
    }
  );
};

/**
 * PUT /api/v1/customers
 * Create a new customer.
 */
export let updateCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  const query = { customerID: data.customerID, deleted: false };
  // cast data to fit customer schema
  const update = {
    ...data,
    name: { first: data.firstName, last: data.lastName }
  };
  const options = {
    // Return the document after updates are applied
    new: true
  };

  Customers.update(query, update, options, (err: any, doc: CustomerModel) => {
    if (err) return res.status(500).json({message:err});

    const response = {
      message: "Customer successfully updated",
      id: req.params.id
    };
    return res.status(200).json(response);
  });
};

/**
 * GET /api/v1/customers
 * get customers list.
 */
export let getCustomers = (req: Request, res: Response, next: NextFunction) => {
  Customers.find({ deleted: false }, (err: any, customers: any) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (customers.length <= 0) {
      return res.status(404).json({ message: "No customers found!" });
    }

    // could also use .select("-createdAt , - _id" , etc..)
    // to avoid retuning them just wanted to show u i can use map ;)
    const customerList = customers
      .filter((item: CustomerModel) => item.customerID)
      .map((customer: CustomerModel) => {
        return {
          customerID: customer.customerID,
          gender: customer.gender,
          birthday: customer.birthday,
          name: customer.name,
          customerLifetimeValue: customer.customerLifetimeValue,
          lastContact: customer.lastContact
        };
      });
    return res.status(200).json({ customerList });
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
};

/**
 * DELETE /api/v1/customers/{id}
 * id is customer ID
 * delete customer by customer id.
 */
export let deleteCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = { customerID: req.params.id, deleted: false };
  const update = { deleted: true, updatedAt: new Date() };
  const options = {
    // Return the document after updates are applied
    new: true
  };

  Customers.findOneAndUpdate(query, update, options, (err, doc) => {
    if (err) return res.status(500).json({ message: err });
    if (doc) {
      const response = {
        message: "Customer successfully deleted",
        id: req.params.id
      };
      return res.status(200).json(response);
    }
    const response = {
      message: "Customer with this id does not exist",
      id: req.params.id
    };
    return res.status(400).json(response);
  });
};
