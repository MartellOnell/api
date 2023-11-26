import { Product } from "../database/models"

// {offset category subcategory tip color coast}
export const getProductsByOffset = async (req, res) => {
    const data = req.body

    // make sort on coast
    const {count, rows : products} = Product.findAndCountAll({
        where: {
            subcategory: { [Op.like]: `%${data.subcategory}%`, },
            category: { [Op.like]: `%${data.category}%`, },
            tip: { [Op.like]: `%${data.tip}%`, },
            color: { [Op.like]: `%${data.color}%`, }
        },
        limit: 10,
        //order: {}, re write column coast to nums
        offset: data.offset
    })

    return res.json({
        msg: "succesfully get data",
        data: products,
        counter: count,
    })
}