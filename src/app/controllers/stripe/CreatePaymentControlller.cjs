const Yup = require("yup");
const stripe = require("stripe")(
  "sk_test_51QhdRY2LiG2ifgwZNFQdpA8v7x6cniSnFQfMikatYZzOXM1vM86qyvGlOgfkxgIvGrwNNVoFV2K2sOwHNxxXRPmQ0063coH4kR"
);

const calculateOrderAmout = (products) => {
  const total = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return total; // Multiplica por 100 e arredonda para evitar erros de precisão
};

class CreatePaymentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            price: Yup.number().required(),
          })
        ),
    });

    const { products } = req.body;

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmout(products),
      currency: "brl",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      dpmCheckerLink: `http://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  }
}

module.exports = new CreatePaymentController();
