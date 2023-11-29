import { Product } from "../database/models.js"
import { Op } from "sequelize";

// {offset category subcategory tip color coast}
export const getProductsByOffset = async (req, res) => {
    const data = req.body

    // make sort on coast
    const {count: counts, rows: products} = Product.findAndCountAll({
        where: {
            subcategory: { [Op.like]: `%${data.subcategory}%`, },
            category: { [Op.like]: `%${data.category}%`, },
            tip: { [Op.like]: `%${data.tip}%`, },
            color: { [Op.like]: `%${data.color}%`, },
            coast: {
                [Op.gte]: data.minCoast,
                [Op.lte]: data.maxCoast
            }
        },
        limit: 10,
        // order: {}, пока отключаем, я хз как это работает
        offset: data.offset
    })

    return res.json({
        msg: "succesfully get data",
        data: products,
        counter: counts,
    })
}