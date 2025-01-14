import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.send([{ name: "product1" }, { name: "product2" }]);
});

router.get('/:id', (req, res) => {
    res.send({
        name: `product${req.params.id}`
    })
})


export { router as productrouter };
