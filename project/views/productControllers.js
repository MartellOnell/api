import { Product } from "../database/models.js"
import { Op } from "sequelize";

const stringIterToLike = array => {
    let copy = []
    for (let i = 0; i < array.length; i++) {
        copy.push({[Op.like]: `%${array[i]}%`})
    }
    return copy
}

export const getProductsByOffset = async (req, res) => {
    const data = req.body

    let findOptions = {
        subcategory: {
            [Op.or]: stringIterToLike(data.subcategory),
        },
        category: {
            [Op.or]: stringIterToLike(data.category)
        },
        tip: {
            [Op.or]: stringIterToLike(data.tip)
        },
        color: {
            [Op.or]: stringIterToLike(data.color)
        }
    }

    if (!(data.minCoast === "" && data.maxCoast === "")) {
        findOptions.coast = {}
        if (data.minCoast !== "") {
             findOptions.coast = {
                 [Op.gte]: data.minCoast
             }
        }
        if (data.maxCoast !== "") {
            findOptions.coast = {
                ...findOptions.coast,
                [Op.lte]: data.maxCoast
            }
        }
    }

    // make sort on coast
    const productsData = await Product.findAndCountAll({
        where: {
            ...findOptions
        },
        limit: 20,
        // order: {}, пока отключаем, я хз как это работает
        offset: data.offset
    })

    return res.json({
        msg: "succesfully get data",
        data: productsData.rows,
        counter: productsData.count,
    })
}