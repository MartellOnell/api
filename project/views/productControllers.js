import { Product } from "../database/models"

export const CreateProduct = (req, res) => {
    const data = req.body
    const productEqNomenclature = Product.findAll({where: {nomenclature: data.nomenclature}})
    
    if (productEqNomenclature.length == 0) {
        // some code here
    } else {
        return res.status(400).json({msg: "product already exists"})
    }
}