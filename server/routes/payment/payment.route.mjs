import express from "express";
import paypal from "paypal-rest-sdk";
import Transactions from "../../models/transaction.model.mjs";
import User from "../../models/user.model.mjs";
import { ErrorHandler } from "../../utils/ErrorHandler.mjs";
import Conversation from "../../models/conversation.model.mjs";

export const paymentRouter = express.Router();

paymentRouter.post("/", async (req, res, next) => {
  const { operatorId, userId, amount } = req.body;

  try {
    let create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.APP_URL}/success`,
        cancel_url: `${process.env.APP_URL}/failed`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Minutes",
                sku: "item",
                price: amount.toFixed(2),
                currency: "EUR",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "EUR",
            total: amount.toFixed(2),
          },
          description:
            "This is the payment to buy minutes to chat with the operator",
        },
      ],
    };

    await paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.log(error);
        return next(new ErrorHandler("Something went wrong!", 400));
        throw error;
      } else {
        console.log(payment, "Payment Created");

        // Save transaction details to the database
        const newTransaction = new Transactions({
          recepient: operatorId,
          transaction_type: "credit",
          sender: userId,
          amount,
          paymentId: payment.id,
          status: "created",
        });
        await newTransaction.save();

        let data = payment;
        res.json(data);
      }
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message), 500);
  }
});

paymentRouter.get("/success", async (req, res, next) => {
  try {
    console.log("sdfd");
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    // Fetch the transaction details from the database using paymentId
    const transaction = await Transactions.findOne({ paymentId });

    if (!transaction) {
      console.log(error);
      return next(new ErrorHandler("Please provide the valid paymentID", 400));
    }
    console.log(transaction);
    const express_checkout_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "EUR",
            total: transaction.amount.toFixed(2),
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      express_checkout_json,
      async (error, payment) => {
        if (error) {
          console.log(error);
          await Transactions.findOneAndUpdate(
            { paymentId },
            { status: "failed" },
            { new: true }
          );
          res.status(400).send({ success: false, url: "/failed" });
        } else {
          // Update transaction status to 'completed'
          const updatedTransaction = await Transactions.findOneAndUpdate(
            { paymentId },
            { status: "completed" },
            { new: true }
          );

          if (updatedTransaction) {
            // Update user's wallet balance
            const user = await User.findById(updatedTransaction.sender);
            if (user) {
              user.userData.wallet += updatedTransaction.amount;
              await user.save();
            }
          }
          const conversations = await Conversation.findOne({
            members: {
              $all: [updatedTransaction.sender, updatedTransaction.recepient],
            },
          });
          console.log(conversations, "dfdkjsfkjds");
          if (conversations) {
            console.log(payment, "Payment Completed");
            res
              .status(200)
              .send({ success: true, url: "/chat?" + conversations?._id });
          } else {
            res.status(200).send({ success: true, url: "/all-operators" });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message), 500);
  }
});

paymentRouter.get("/failed", async (req, res) => {
  return res.redirect(`${process.env.APP_URL}/failed`);
});

paymentRouter.get("/transactions", async (req, res) => {
  try {
    const allTransactions = await Transactions.find().sort({createdAt:-1}).populate("sender");
    return res.status(200).send({ success: true, data: allTransactions });
  } catch (err) {
    return next(new ErrorHandler(err.message), 500);
  }
});
