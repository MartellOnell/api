import { Product } from "../database/models"

export const CreateProduct = async (req, res) => {
    const data = req.body
    const productEqNomenclature = Product.findAll({where: {nomenclature: data.nomenclature}})
    
    if (productEqNomenclature.length == 0) {
        // some code here
    } else {
        return res.status(400).json({msg: "product already exists"})
    }
}

// {offset category subcategory tip color coast}
export const GetProductsByOffset = async (req, res) => {
    const data = req.body

    // coast must be strict point
    // 

    const {count, rows : products} = Product.findAndCountAll({
        where: {
            subcategory: { [Op.like]: `%${data.subcategory}%`, },
            category: { [Op.like]: `%${data.category}%`, },
            tip: { [Op.like]: `%${data.tip}%`, },
            color: { [Op.like]: `%${data.color}%`, }
        },
        limit: 10,
        offset: data.offset
    })

    return res.json({
        msg: "succesfully get data",
        data: products,
        counter: count,
    })
}